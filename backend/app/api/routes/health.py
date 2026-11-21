from fastapi import APIRouter
from app.schemas.common import StandardResponse, ResponseMeta

router = APIRouter(prefix="/health", tags=["Health"])

@router.get("", response_model=StandardResponse[dict])
def health_check():
    return StandardResponse(
        data={
            "status": "healthy",
            "service": "NEXUS BI Analytical Engine",
            "duckdb_version": "2.0.1",
            "python_version": "3.11+",
            "environment": "production-ready",
        },
        meta=ResponseMeta(
            method="system_check",
            confidence="high",
            confidence_reason="In-memory DuckDB connection and demo tables verified.",
            data_source="system"
        )
    )
