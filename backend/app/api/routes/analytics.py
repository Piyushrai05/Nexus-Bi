from typing import List, Optional
from fastapi import APIRouter, Query
from app.schemas.common import StandardResponse, ResponseMeta
from app.schemas.analytics import (
    ExecutiveOverviewData,
    RevenueSeriesPoint,
    ProfitabilityByCategory,
    CustomerSegmentStats,
    ProductMatrixItem,
    RegionalBreakdownItem,
    RootCauseAnalysisResult,
    DashboardInsightItem,
    DashboardRecommendationItem,
    ForecastResult,
    AiChatRequest,
    AiChatResponse
)
from app.services.analytics_service import analytics_service
from app.services.root_cause_service import root_cause_service
from app.services.ai_assistant_service import ai_assistant_service

router = APIRouter(prefix="/analytics", tags=["Analytics"])

@router.get("/overview", response_model=StandardResponse[ExecutiveOverviewData])
def get_executive_overview(
    start_date: Optional[str] = Query(None, description="ISO start date YYYY-MM-DD"),
    end_date: Optional[str] = Query(None, description="ISO end date YYYY-MM-DD"),
    region: Optional[str] = Query(None, description="Filter region")
):
    s_date = start_date if isinstance(start_date, str) else None
    e_date = end_date if isinstance(end_date, str) else None
    reg = region if isinstance(region, str) else None
    data, meta = analytics_service.get_overview(start_date=s_date, end_date=e_date, region=reg)
    return StandardResponse(
        data=data,
        meta=ResponseMeta(
            method="duckdb",
            sql=meta.get("sql"),
            confidence="high",
            confidence_reason="Direct transactional ledger aggregation across clean sales records.",
            data_source="sales",
            row_count=meta.get("rows_scanned")
        )
    )

@router.get("/revenue", response_model=StandardResponse[List[RevenueSeriesPoint]])
def get_revenue_series(
    start_date: Optional[str] = Query(None),
    end_date: Optional[str] = Query(None),
    region: Optional[str] = Query(None)
):
    s_date = start_date if isinstance(start_date, str) else None
    e_date = end_date if isinstance(end_date, str) else None
    reg = region if isinstance(region, str) else None
    points, meta = analytics_service.get_revenue_series(start_date=s_date, end_date=e_date, region=reg)
    return StandardResponse(
        data=points,
        meta=ResponseMeta(
            method="duckdb",
            sql=meta.get("sql"),
            confidence="high",
            confidence_reason="Daily grouped sales revenue with 7-day rolling moving baseline.",
            data_source="sales",
            row_count=len(points)
        )
    )

@router.get("/profitability", response_model=StandardResponse[List[ProfitabilityByCategory]])
def get_profitability():
    data, meta = analytics_service.get_profitability_by_category()
    return StandardResponse(
        data=data,
        meta=ResponseMeta(
            method="duckdb",
            sql=meta.get("sql"),
            confidence="high",
            confidence_reason="Product category revenue joined with unit cost tables.",
            data_source="sales_joined_products",
            row_count=len(data)
        )
    )

@router.get("/customers", response_model=StandardResponse[List[CustomerSegmentStats]])
def get_customers_analysis():
    data, meta = analytics_service.get_customers_analysis()
    return StandardResponse(
        data=data,
        meta=ResponseMeta(
            method="duckdb",
            sql=meta.get("sql"),
            confidence="high",
            confidence_reason="Customer segment lifetime value with 60-day rolling churn threshold.",
            data_source="customers_joined_sales",
            row_count=len(data)
        )
    )

@router.get("/products", response_model=StandardResponse[List[ProductMatrixItem]])
def get_products_matrix():
    data, meta = analytics_service.get_products_matrix()
    return StandardResponse(
        data=data,
        meta=ResponseMeta(
            method="duckdb",
            sql=meta.get("sql"),
            confidence="high",
            confidence_reason="BCG Growth-Share matrix categorized by revenue vs margin thresholds.",
            data_source="products_matrix",
            row_count=len(data)
        )
    )

@router.get("/regions", response_model=StandardResponse[List[RegionalBreakdownItem]])
def get_regions_analysis():
    data, meta = analytics_service.get_regions_analysis()
    return StandardResponse(
        data=data,
        meta=ResponseMeta(
            method="duckdb",
            sql=meta.get("sql"),
            confidence="high",
            confidence_reason="Regional aggregation identifying the West region decline story.",
            data_source="sales",
            row_count=len(data)
        )
    )

@router.get("/root-cause/west-decline", response_model=StandardResponse[RootCauseAnalysisResult])
def get_west_decline_root_cause():
    data, meta = root_cause_service.analyze_west_electronics_decline()
    return StandardResponse(
        data=data,
        meta=ResponseMeta(
            method="statistical_decomposition",
            sql=meta.get("sql"),
            confidence="high",
            confidence_reason="Multi-dimensional period-over-period waterfall decomposition.",
            data_source="sales_inventory_logs",
            row_count=len(data.contributing_factors)
        )
    )

@router.get("/insights", response_model=StandardResponse[List[DashboardInsightItem]])
def get_dashboard_insights():
    data, meta = analytics_service.get_dashboard_insights()
    return StandardResponse(
        data=data,
        meta=ResponseMeta(
            method=meta.get("method", "analytical_synthesis"),
            sql=meta.get("sql"),
            confidence="high",
            confidence_reason="Evidence-backed anomaly and root-cause synthesis.",
            data_source="sales_campaigns_logs",
            row_count=len(data)
        )
    )

@router.get("/recommendations", response_model=StandardResponse[List[DashboardRecommendationItem]])
def get_dashboard_recommendations():
    data, meta = analytics_service.get_dashboard_recommendations()
    return StandardResponse(
        data=data,
        meta=ResponseMeta(
            method=meta.get("method", "decision_rules"),
            confidence="high",
            confidence_reason="Prioritized operational actions generated from verified findings.",
            data_source="decision_engine",
            row_count=len(data)
        )
    )

@router.get("/forecast", response_model=StandardResponse[ForecastResult])
def get_revenue_forecast(
    horizon_days: int = Query(30, ge=7, le=90, description="Forecast horizon in days"),
    scenario: str = Query("baseline", description="Scenario: baseline, stockout_resolved, marketing_boost, conservative")
):
    data, meta = analytics_service.get_forecast(horizon_days=horizon_days, scenario=scenario)
    return StandardResponse(
        data=data,
        meta=ResponseMeta(
            method=meta.get("method", "holt_winters"),
            sql=meta.get("sql"),
            confidence="high",
            confidence_reason="Trained on daily DuckDB transactional sales ledger with 7-day seasonality.",
            data_source="sales",
            row_count=meta.get("training_samples")
        )
    )

@router.post("/ai-chat", response_model=StandardResponse[AiChatResponse])
def chat_with_ai(request: AiChatRequest):
    result = ai_assistant_service.chat(messages=request.messages)
    return StandardResponse(
        data=AiChatResponse(**result),
        meta=ResponseMeta(
            method=f"llm_{result.get('provider', 'Groq').lower()}",
            confidence="high",
            confidence_reason="Grounded in real-time DuckDB transactional facts.",
            data_source="duckdb_ledger"
        )
    )
