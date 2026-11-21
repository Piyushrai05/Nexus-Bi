from typing import List, Optional
from pydantic import BaseModel

class MetricCatalogItem(BaseModel):
    id: str
    name: str
    category: str # "business", "finance", "marketing", "customer", "social"
    definition: str
    formula: str
    unit: str # "currency", "percent", "number", "ratio"
    polarity: str # "up-is-good", "down-is-good", "neutral"
    required_fields: List[str]
    sql_template: str
    limitations: Optional[str] = None

class MetricValue(BaseModel):
    id: str
    name: str
    current_value: float
    formatted_value: str
    previous_value: Optional[float] = None
    delta_percentage: Optional[float] = None
    polarity: str
    sparkline: List[float] = []
    target_value: Optional[float] = None
