from typing import Optional, List, Dict, Any
from pydantic import BaseModel, Field

class UserContext(BaseModel):
    uid: str
    email: Optional[str] = None
    name: Optional[str] = "Executive User"
    role: str = "executive"
    workspace_id: str = "default_workspace"
    is_demo_session: bool = False

class WorkspaceModel(BaseModel):
    workspace_id: str
    name: str = "NexusMart Omnichannel Group"
    owner_uid: str
    members: List[str] = []
    created_at: str
    settings: Dict[str, Any] = Field(default_factory=dict)

class UserPreferences(BaseModel):
    theme: str = "dark"
    default_date_range: str = "Last 30 Days"
    default_region: str = "All Regions"
    show_evidence_by_default: bool = False
    currency: str = "USD"

class DatasetMetadataFirestore(BaseModel):
    dataset_id: str
    name: str
    owner_uid: str
    workspace_id: str
    storage_path: str
    file_type: str
    row_count: int
    column_count: int
    data_quality_score: float
    created_at: str
    is_demo: bool = False
