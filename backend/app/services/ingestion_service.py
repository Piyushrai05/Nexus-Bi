import os
import uuid
import re
from datetime import datetime
from pathlib import Path
from typing import Dict, Any, List, Optional
import pandas as pd
from fastapi import UploadFile, HTTPException
from app.core.config import settings
from app.core.logging import logger
from app.schemas.dataset import DatasetMetadata, DatasetPreview
from app.engine.duckdb_engine import duckdb_engine
from app.services.quality_service import quality_service

class IngestionService:
    def __init__(self):
        self._registry: Dict[str, DatasetMetadata] = {}
        self._init_demo_metadata()

    def _init_demo_metadata(self):
        """Pre-loads metadata for the seeded NexusMart datasets."""
        clean_dir = settings.DEMO_DATA_DIR / "clean"
        imperfect_dir = settings.DEMO_DATA_DIR / "imperfect"

        demo_datasets = [
            ("sales", clean_dir / "sales.parquet", "NexusMart Core Sales Ledger", 96.5, True),
            ("customers", clean_dir / "customers.parquet", "NexusMart Customer Base", 98.2, True),
            ("products", clean_dir / "products.parquet", "NexusMart Product Catalog", 100.0, True),
            ("campaigns", clean_dir / "campaigns.parquet", "Cross-Platform Ad Campaigns", 97.0, True),
            ("social_posts", clean_dir / "social_posts.parquet", "Social Content Telemetry", 95.8, True),
            ("social_sentiment", clean_dir / "social_sentiment.parquet", "Aspect-Based Brand Mentions", 94.0, True),
            ("imperfect_sales", imperfect_dir / "imperfect_sales.parquet", "Uncleaned Sales Dump (Quality Demo)", 68.4, True),
        ]

        for ds_id, path, name, dqs, is_demo in demo_datasets:
            if path.exists():
                size = path.stat().st_size
                df = pd.read_parquet(path)
                meta = DatasetMetadata(
                    dataset_id=ds_id,
                    name=name,
                    file_type="parquet",
                    row_count=len(df),
                    column_count=len(df.columns),
                    size_bytes=size,
                    created_at=datetime.utcnow().isoformat() + "Z",
                    data_quality_score=dqs,
                    is_demo=is_demo
                )
                self._registry[ds_id] = meta

    def list_datasets(self) -> List[DatasetMetadata]:
        return list(self._registry.values())

    def get_dataset(self, dataset_id: str) -> Optional[DatasetMetadata]:
        return self._registry.get(dataset_id)

    def get_dataframe(self, dataset_id: str) -> pd.DataFrame:
        if dataset_id not in self._registry:
            raise HTTPException(status_code=404, detail=f"Dataset '{dataset_id}' not found.")
        
        # Load from DuckDB directly
        df, _ = duckdb_engine.query(f"SELECT * FROM {dataset_id}")
        return df

    def get_preview(self, dataset_id: str, limit: int = 20) -> DatasetPreview:
        df = self.get_dataframe(dataset_id)
        preview_df = df.head(limit)
        
        # Convert any timestamps or special objects to strings for clean JSON
        clean_rows = preview_df.to_dict(orient="records")
        for row in clean_rows:
            for k, v in row.items():
                if pd.isna(v):
                    row[k] = None
                elif isinstance(v, (pd.Timestamp, datetime)):
                    row[k] = v.isoformat()

        return DatasetPreview(
            dataset_id=dataset_id,
            columns=list(df.columns),
            rows=clean_rows,
            total_rows=len(df),
            preview_limit=limit
        )

    async def ingest_file(self, file: UploadFile) -> DatasetMetadata:
        """Safely saves and registers an uploaded CSV or XLSX file."""
        # 1. Filename sanitization against path traversal
        raw_name = Path(file.filename).name
        safe_name = re.sub(r"[^a-zA-Z0-9_\-\.]", "_", raw_name)
        ext = Path(safe_name).suffix.lower()

        if ext not in settings.ALLOWED_EXTENSIONS:
            raise HTTPException(status_code=400, detail=f"Unsupported format '{ext}'. Supported: {settings.ALLOWED_EXTENSIONS}")

        dataset_id = f"ds_{uuid.uuid4().hex[:8]}"
        save_path = settings.UPLOAD_DIR / f"{dataset_id}_{safe_name}"

        # 2. Stream read & size enforcement
        content = await file.read()
        if len(content) > settings.MAX_UPLOAD_SIZE_BYTES:
            raise HTTPException(status_code=413, detail=f"File exceeds maximum upload size of {settings.MAX_UPLOAD_SIZE_BYTES / (1024*1024)}MB.")

        with open(save_path, "wb") as f:
            f.write(content)

        # 3. Read DataFrame
        try:
            if ext == ".csv":
                df = pd.read_csv(save_path)
            elif ext in (".xlsx", ".xls"):
                df = pd.read_excel(save_path)
            elif ext == ".parquet":
                df = pd.read_parquet(save_path)
            else:
                raise ValueError("Unsupported extension")
        except Exception as e:
            if save_path.exists():
                os.remove(save_path)
            raise HTTPException(status_code=400, detail=f"Failed to parse tabular file: {str(e)}")

        # 4. Register into DuckDB
        clean_table_id = f"user_{dataset_id}"
        duckdb_engine.register_dataframe(clean_table_id, df)

        # 5. Compute transparent Data Quality Score
        dqs_report = quality_service.evaluate_dataframe(df, dataset_id)

        meta = DatasetMetadata(
            dataset_id=clean_table_id,
            name=safe_name,
            file_type=ext.replace(".", ""),
            row_count=len(df),
            column_count=len(df.columns),
            size_bytes=len(content),
            created_at=datetime.utcnow().isoformat() + "Z",
            data_quality_score=dqs_report.overall_score,
            is_demo=False
        )
        self._registry[clean_table_id] = meta
        logger.info(f"Ingested and registered user dataset: {clean_table_id} with DQS={meta.data_quality_score}")
        return meta

ingestion_service = IngestionService()
