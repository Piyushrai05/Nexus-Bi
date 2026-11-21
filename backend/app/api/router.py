from fastapi import APIRouter
from app.api.routes import (
    health,
    datasets,
    data_quality,
    metrics,
    analytics,
    social,
    user
)

api_router = APIRouter()
api_router.include_router(health.router)
api_router.include_router(user.router)
api_router.include_router(datasets.router)
api_router.include_router(data_quality.router)
api_router.include_router(metrics.router)
api_router.include_router(analytics.router)
api_router.include_router(social.router)
