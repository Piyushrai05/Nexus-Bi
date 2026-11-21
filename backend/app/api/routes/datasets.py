from typing import List, Optional
from fastapi import APIRouter, UploadFile, File, HTTPException, Depends
from app.schemas.common import StandardResponse, ResponseMeta
from app.schemas.dataset import DatasetMetadata, DatasetPreview, DatasetProfile
from app.schemas.auth import UserContext, DatasetMetadataFirestore
from app.services.ingestion_service import ingestion_service
from app.services.profiling_service import profiling_service
from app.services.firestore_service import firestore_service
from app.api.deps import get_optional_user

router = APIRouter(prefix="/datasets", tags=["Datasets"])

@router.get("", response_model=StandardResponse[List[DatasetMetadata]])
def list_datasets(user: Optional[UserContext] = Depends(get_optional_user)):
    datasets = ingestion_service.list_datasets()
    return StandardResponse(
        data=datasets,
        meta=ResponseMeta(
            method="duckdb_catalog",
            confidence="high",
            confidence_reason="Catalog lists all verified in-memory, Firestore, and uploaded tables.",
            data_source="metadata_registry",
            row_count=len(datasets)
        )
    )

@router.post("/upload", response_model=StandardResponse[DatasetMetadata])
async def upload_dataset(
    file: UploadFile = File(...),
    user: Optional[UserContext] = Depends(get_optional_user)
):
    meta = await ingestion_service.ingest_file(file)
    
    # If user is authenticated with Firebase, register in Firestore
    if user:
        firestore_meta = DatasetMetadataFirestore(
            dataset_id=meta.dataset_id,
            name=meta.name,
            owner_uid=user.uid,
            workspace_id=user.workspace_id,
            storage_path=f"uploads/{user.uid}/{meta.dataset_id}.{meta.file_type}",
            file_type=meta.file_type,
            row_count=meta.row_count,
            column_count=meta.column_count,
            data_quality_score=meta.data_quality_score or 90.0,
            created_at=meta.created_at,
            is_demo=False
        )
        firestore_service.register_dataset(firestore_meta)

    return StandardResponse(
        data=meta,
        meta=ResponseMeta(
            method="file_ingestion",
            confidence="high",
            confidence_reason="File parsed and dynamically registered in DuckDB.",
            data_source="user_upload"
        )
    )

@router.get("/{dataset_id}", response_model=StandardResponse[DatasetMetadata])
def get_dataset_metadata(dataset_id: str):
    meta = ingestion_service.get_dataset(dataset_id)
    if not meta:
        raise HTTPException(status_code=404, detail=f"Dataset '{dataset_id}' not found.")
    return StandardResponse(
        data=meta,
        meta=ResponseMeta(
            method="metadata_lookup",
            confidence="high",
            confidence_reason="Verified metadata record found in registry.",
            data_source="metadata_registry"
        )
    )

@router.get("/{dataset_id}/preview", response_model=StandardResponse[DatasetPreview])
def get_dataset_preview(dataset_id: str, limit: int = 20):
    preview = ingestion_service.get_preview(dataset_id, limit=limit)
    return StandardResponse(
        data=preview,
        meta=ResponseMeta(
            method="duckdb",
            sql=f"SELECT * FROM {dataset_id} LIMIT {limit};",
            confidence="high",
            confidence_reason=f"Top {limit} records sampled directly from storage.",
            data_source=dataset_id,
            row_count=len(preview.rows)
        )
    )

@router.get("/{dataset_id}/profile", response_model=StandardResponse[DatasetProfile])
def get_dataset_profile(dataset_id: str):
    df = ingestion_service.get_dataframe(dataset_id)
    profile = profiling_service.profile_dataframe(df, dataset_id)
    return StandardResponse(
        data=profile,
        meta=ResponseMeta(
            method="statistical_profiler",
            confidence="high",
            confidence_reason="Full columnar scan with Tukey IQR outlier and duplicate detection.",
            data_source=dataset_id,
            row_count=profile.row_count
        )
    )
