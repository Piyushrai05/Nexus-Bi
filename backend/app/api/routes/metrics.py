from typing import List
from fastapi import APIRouter
from app.schemas.common import StandardResponse, ResponseMeta
from app.schemas.metrics import MetricCatalogItem
from app.engine.semantic_engine import semantic_engine

router = APIRouter(prefix="/metrics", tags=["Metrics"])

@router.get("/catalog", response_model=StandardResponse[List[MetricCatalogItem]])
def get_metrics_catalog():
    catalog = semantic_engine.get_catalog()
    return StandardResponse(
        data=catalog,
        meta=ResponseMeta(
            method="semantic_catalog",
            confidence="high",
            confidence_reason="Catalog reflects governed formulas, units, and polarity rules.",
            data_source="semantic_layer",
            row_count=len(catalog)
        )
    )
