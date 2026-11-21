import os
from typing import Optional
from pathlib import Path
from pydantic import BaseModel

class Settings(BaseModel):
    APP_NAME: str = "NEXUS BI Analytical Engine"
    APP_VERSION: str = "1.0.0"
    API_V1_PREFIX: str = "/api"
    DEBUG: bool = True
    
    # Project paths
    BASE_DIR: Path = Path(__file__).resolve().parent.parent.parent
    DATA_DIR: Path = BASE_DIR / "data"
    DEMO_DATA_DIR: Path = BASE_DIR / "data" / "demo"
    UPLOAD_DIR: Path = BASE_DIR / "data" / "uploads"
    
    # Maximum upload size: 50MB
    MAX_UPLOAD_SIZE_BYTES: int = 50 * 1024 * 1024
    ALLOWED_EXTENSIONS: set = {".csv", ".xlsx", ".parquet"}
    
    # DuckDB In-Memory / File Database
    DUCKDB_PATH: str = ":memory:"
    
    # Data Quality Weights
    DQS_WEIGHT_COMPLETENESS: float = 0.30
    DQS_WEIGHT_UNIQUENESS: float = 0.25
    DQS_WEIGHT_VALIDITY: float = 0.20
    DQS_WEIGHT_CONSISTENCY: float = 0.15
    DQS_WEIGHT_FRESHNESS: float = 0.10

    # Groq AI Assistant Engine
    GROQ_API_KEY: str = os.getenv("GROQ_API_KEY", "")
    GROQ_MODEL: str = os.getenv("GROQ_MODEL", "openai/gpt-oss-120b")

    # Firebase Admin & Cloud Architecture
    FIREBASE_CREDENTIALS_PATH: Optional[str] = os.getenv("FIREBASE_CREDENTIALS_PATH", None)
    FIREBASE_SERVICE_ACCOUNT_JSON: Optional[str] = os.getenv("FIREBASE_SERVICE_ACCOUNT_JSON", None)
    FIREBASE_PROJECT_ID: str = os.getenv("FIREBASE_PROJECT_ID", "nexus-bi-production")
    FIREBASE_STORAGE_BUCKET: str = os.getenv("FIREBASE_STORAGE_BUCKET", "nexus-bi-production.appspot.com")

settings = Settings()

# Ensure directories exist
os.makedirs(settings.DATA_DIR, exist_ok=True)
os.makedirs(settings.DEMO_DATA_DIR, exist_ok=True)
os.makedirs(settings.UPLOAD_DIR, exist_ok=True)
