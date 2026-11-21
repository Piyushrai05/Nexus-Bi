import time
import duckdb
import pandas as pd
from typing import Dict, Any, Tuple, Optional
from app.core.config import settings
from app.core.logging import logger

class DuckDBEngine:
    _instance: Optional["DuckDBEngine"] = None
    
    def __init__(self):
        self.conn = duckdb.connect(database=":memory:", read_only=False)
        self._register_demo_tables()
        logger.info("DuckDB in-memory analytical engine initialized and tables registered.")

    @classmethod
    def get_instance(cls) -> "DuckDBEngine":
        if cls._instance is None:
            cls._instance = DuckDBEngine()
        return cls._instance

    def _register_demo_tables(self):
        """Registers clean and imperfect demo parquet datasets as fast in-memory tables."""
        clean_dir = settings.DEMO_DATA_DIR / "clean"
        imperfect_dir = settings.DEMO_DATA_DIR / "imperfect"

        tables = ["sales", "customers", "products", "campaigns", "social_posts", "social_sentiment"]
        for tbl in tables:
            pq_path = clean_dir / f"{tbl}.parquet"
            if pq_path.exists():
                posix_path = str(pq_path).replace("\\", "/")
                self.conn.execute(f"CREATE OR REPLACE TABLE {tbl} AS SELECT * FROM read_parquet('{posix_path}')")
                logger.info(f"DuckDB registered table: {tbl}")

        # Register imperfect sales table for data quality testing
        imp_path = imperfect_dir / "imperfect_sales.parquet"
        if imp_path.exists():
            posix_imp = str(imp_path).replace("\\", "/")
            self.conn.execute(f"CREATE OR REPLACE TABLE imperfect_sales AS SELECT * FROM read_parquet('{posix_imp}')")
            logger.info("DuckDB registered table: imperfect_sales")

    def query(self, sql: str, params: Optional[list] = None) -> Tuple[pd.DataFrame, Dict[str, Any]]:
        """Executes a validated read-only SQL query and returns (df, execution_meta)."""
        clean_sql = sql.strip()
        # Security Guardrail: Read-only SELECT enforcement
        first_token = clean_sql.split()[0].upper() if clean_sql else ""
        if first_token not in ("SELECT", "WITH", "EXPLAIN", "DESCRIBE"):
            raise ValueError(f"Security Violation: Only read-only analytical queries are permitted. Blocked token: {first_token}")

        start_time = time.perf_counter()
        cursor = self.conn.cursor()
        try:
            if params:
                df = cursor.execute(clean_sql, params).df()
            else:
                df = cursor.execute(clean_sql).df()
        finally:
            cursor.close()
        elapsed_ms = round((time.perf_counter() - start_time) * 1000, 2)

        meta = {
            "sql": clean_sql,
            "execution_time_ms": elapsed_ms,
            "rows_scanned": len(df),
            "engine": "DuckDB v2.0 In-Memory Columnar",
        }
        return df, meta

    def register_dataframe(self, table_name: str, df: pd.DataFrame):
        """Registers an uploaded DataFrame dynamically as a queryable table."""
        self.conn.register(table_name, df)
        logger.info(f"Dynamically registered uploaded table: {table_name} ({len(df)} rows)")

duckdb_engine = DuckDBEngine.get_instance()
