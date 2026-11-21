from fastapi import APIRouter, HTTPException
from app.schemas.common import StandardResponse, ResponseMeta
from app.schemas.dataset import DataQualityReport
from app.services.ingestion_service import ingestion_service
from app.services.quality_service import quality_service

router = APIRouter(prefix="/data-quality", tags=["Data Quality"])

@router.get("/{dataset_id}", response_model=StandardResponse[DataQualityReport])
def get_data_quality_report(dataset_id: str):
    df = ingestion_service.get_dataframe(dataset_id)
    report = quality_service.evaluate_dataframe(df, dataset_id)
    return StandardResponse(
        data=report,
        meta=ResponseMeta(
            method="data_quality_engine",
            confidence="high",
            confidence_reason="Evaluated across Completeness (30%), Uniqueness (25%), Validity (20%), Consistency (15%), Freshness (10%).",
            data_source=dataset_id,
            row_count=len(df)
        )
    )
