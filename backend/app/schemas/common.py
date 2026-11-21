from datetime import datetime
from typing import Generic, TypeVar, Optional, List, Any
from pydantic import BaseModel, Field

T = TypeVar("T")

class ResponseMeta(BaseModel):
    method: str = Field(default="duckdb", description="Execution method (e.g. duckdb, statistical_decomposition)")
    sql: Optional[str] = Field(default=None, description="Deterministic SQL query executed")
    assumptions: List[str] = Field(default_factory=list, description="Explicit modeling assumptions")
    confidence: str = Field(default="high", description="Confidence tier: high, medium, low")
    confidence_reason: Optional[str] = Field(default=None, description="Audited explanation of confidence tier")
    computed_at: str = Field(default_factory=lambda: datetime.utcnow().isoformat() + "Z")
    data_source: str = Field(default="synthetic_demo", description="Source of data (synthetic_demo, upload, warehouse)")
    row_count: Optional[int] = Field(default=None, description="Rows scanned")

class StandardResponse(BaseModel, Generic[T]):
    data: T
    meta: ResponseMeta

class ErrorDetail(BaseModel):
    error_code: str
    message: str
    details: Optional[Any] = None
    request_id: Optional[str] = None
    timestamp: str = Field(default_factory=lambda: datetime.utcnow().isoformat() + "Z")
