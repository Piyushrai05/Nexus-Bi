from typing import List, Dict, Any, Optional
from pydantic import BaseModel
from .metrics import MetricValue

class ExecutiveOverviewData(BaseModel):
    kpis: List[MetricValue]
    daily_revenue_trend: List[Dict[str, Any]]
    top_regional_movers: List[Dict[str, Any]]
    active_anomalies_count: int
    pending_decisions_count: int

class RevenueSeriesPoint(BaseModel):
    date: str
    net_revenue: float
    gross_profit: float
    order_count: int
    aov: float
    baseline: Optional[float] = None
    is_anomaly: bool = False

class ProfitabilityByCategory(BaseModel):
    category: str
    revenue: float
    cogs: float
    gross_profit: float
    margin_percentage: float

class CustomerCohortItem(BaseModel):
    cohort_month: str
    total_customers: int
    retention_rates: Dict[str, float] # e.g. "m0": 100.0, "m1": 42.5, "m2": 31.0

class CustomerSegmentStats(BaseModel):
    segment: str
    customer_count: int
    total_revenue: float
    aov: float
    churn_rate: float

class ProductMatrixItem(BaseModel):
    product_id: str
    product_name: str
    category: str
    revenue: float
    units_sold: int
    gross_margin: float
    quadrant: str # "Stars", "Cash Cows", "Question Marks", "Underperformers"

class RegionalBreakdownItem(BaseModel):
    region: str
    revenue: float
    orders: int
    aov: float
    delta_percentage: float
    status: str

class RootCauseFactor(BaseModel):
    dimension: str
    factor: str
    impact_amount: float
    contribution_percentage: float
    direction: str # "negative", "positive"
    evidence_detail: str

class RootCauseAnalysisResult(BaseModel):
    anomaly_title: str
    affected_metric: str
    observed_value: float
    baseline_value: float
    net_change: float
    percentage_deviation: float
    timeframe: str
    contributing_factors: List[RootCauseFactor]
    narrative_summary: str
    recommendation: str

class DashboardInsightItem(BaseModel):
    id: str
    title: str
    metric: str
    timeframe: str
    severity: str # "critical", "warning", "info"
    change_magnitude: str
    summary: str
    evidence_detail: str
    contributing_factors: List[str]
    confidence_tier: str # "high", "medium", "low"
    recommended_investigation: str
    is_synthetic_demo: bool = True

class DashboardRecommendationItem(BaseModel):
    id: str
    title: str
    business_problem: str
    evidence_summary: str
    expected_impact: Optional[str] = None
    confidence_tier: str # "high", "medium", "low"
    priority: str # "P1 - Critical", "P2 - High", "P3 - Medium"
    suggested_owner: str
    status: str = "Pending Review"
    is_synthetic_demo: bool = True

class ForecastPoint(BaseModel):
    date: str
    actual: Optional[float] = None
    forecast: Optional[float] = None
    lower_80: Optional[float] = None
    upper_80: Optional[float] = None
    lower_95: Optional[float] = None
    upper_95: Optional[float] = None

class ForecastResult(BaseModel):
    metric: str
    horizon_days: int
    model_name: str
    historical_mape: float
    projected_total: float
    growth_rate_pct: float
    trend_direction: str
    series: List[ForecastPoint]
    model_parameters: Dict[str, Any]
    scenarios: Dict[str, float]

class AiChatRequest(BaseModel):
    messages: List[Dict[str, str]]

class AiChatResponse(BaseModel):
    role: str
    content: str
    model: str
    provider: str
    evidence_trigger: Optional[Dict[str, Any]] = None
