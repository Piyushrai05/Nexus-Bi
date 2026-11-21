from typing import List, Dict, Any, Optional
from pydantic import BaseModel, Field

class ColumnProfile(BaseModel):
    name: str
    inferred_type: str
    total_count: int
    null_count: int
    null_percentage: float
    unique_count: int
    sample_values: List[Any]
    min_value: Optional[Any] = None
    max_value: Optional[Any] = None
    has_outliers: bool = False
    outlier_count: int = 0

class DatasetMetadata(BaseModel):
    dataset_id: str
    name: str
    file_type: str
    row_count: int
    column_count: int
    size_bytes: int
    created_at: str
    data_quality_score: Optional[float] = None
    is_demo: bool = False

class DatasetPreview(BaseModel):
    dataset_id: str
    columns: List[str]
    rows: List[Dict[str, Any]]
    total_rows: int
    preview_limit: int

class DatasetProfile(BaseModel):
    dataset_id: str
    row_count: int
    column_count: int
    columns: List[ColumnProfile]
    duplicate_rows_count: int
    duplicate_rows_percentage: float
    data_quality_score: float

class DataQualityDimension(BaseModel):
    name: str
    score: float # 0 - 100
    weight: float
    weighted_score: float
    issues_detected: List[str]

class DataQualityReport(BaseModel):
    dataset_id: str
    overall_score: float # 0 - 100
    status: str # "verified", "warning", "failed_validation"
    dimensions: List[DataQualityDimension]
    total_issues_count: int
    critical_issues: List[str]
    remediation_recommendations: List[str]
    evaluated_at: str
