from typing import List, Dict, Any, Optional
from pydantic import BaseModel

class SocialKpis(BaseModel):
    total_impressions: int
    total_reach: int
    total_engagements: int
    engagement_rate: float
    total_clicks: int
    attributed_revenue: float
    blended_roas: float

class CampaignPerformanceItem(BaseModel):
    campaign_id: str
    campaign_name: str
    platform: str
    spend: float
    impressions: int
    clicks: int
    ctr: float
    conversions: int
    conversion_rate: float
    attributed_revenue: float
    roas: float
    status: str # "High ROAS", "Vanity Trap", "Average", "Underperforming"

class ContentTypeStats(BaseModel):
    content_type: str
    post_count: int
    avg_impressions: float
    avg_engagement_rate: float
    avg_conversions: float
    roas_correlation: float

class SentimentDistribution(BaseModel):
    positive_percentage: float
    neutral_percentage: float
    negative_percentage: float
    net_sentiment_score: float # -100 to +100
    top_positive_topics: List[str]
    top_negative_topics: List[str]

class MarketingRoiItem(BaseModel):
    platform: str
    ad_spend: float
    clicks: int
    cpc: float
    conversions: int
    cpa: float
    revenue: float
    roas: float
    mer: float
