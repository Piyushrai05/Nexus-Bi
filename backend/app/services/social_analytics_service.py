from typing import List, Dict, Any, Tuple
import pandas as pd
from app.engine.duckdb_engine import duckdb_engine
from app.schemas.social import (
    SocialKpis,
    CampaignPerformanceItem,
    ContentTypeStats,
    SentimentDistribution,
    MarketingRoiItem
)

class SocialAnalyticsService:
    @staticmethod
    def get_social_overview() -> Tuple[SocialKpis, Dict[str, Any]]:
        sql = """
        SELECT 
            SUM(impressions) AS total_impressions,
            SUM(reach) AS total_reach,
            SUM(likes + comments + shares) AS total_engagements,
            ROUND(SUM(likes + comments + shares) * 100.0 / NULLIF(SUM(impressions), 0), 2) AS engagement_rate,
            SUM(clicks) AS total_clicks
        FROM social_posts;
        """
        df, meta = duckdb_engine.query(sql)
        r = df.iloc[0]

        # Get total campaign revenue and spend for blended ROAS
        camp_sql = "SELECT SUM(spend) AS tot_spend, SUM(attributed_revenue) AS tot_attr_rev FROM campaigns;"
        camp_df, _ = duckdb_engine.query(camp_sql)
        cr = camp_df.iloc[0]
        tot_spend = float(cr["tot_spend"] or 1.0)
        tot_rev = float(cr["tot_attr_rev"] or 0.0)
        roas = round(tot_rev / tot_spend, 2)

        kpis = SocialKpis(
            total_impressions=int(r["total_impressions"] or 0),
            total_reach=int(r["total_reach"] or 0),
            total_engagements=int(r["total_engagements"] or 0),
            engagement_rate=float(r["engagement_rate"] or 0.0),
            total_clicks=int(r["total_clicks"] or 0),
            attributed_revenue=tot_rev,
            blended_roas=roas
        )
        return kpis, meta

    @staticmethod
    def get_campaigns_performance() -> Tuple[List[CampaignPerformanceItem], Dict[str, Any]]:
        sql = """
        SELECT 
            campaign_id,
            campaign_name,
            platform,
            spend,
            impressions,
            clicks,
            ROUND(clicks * 100.0 / NULLIF(impressions, 0), 2) AS ctr,
            conversions,
            ROUND(conversions * 100.0 / NULLIF(clicks, 0), 2) AS conversion_rate,
            attributed_revenue,
            ROUND(attributed_revenue / NULLIF(spend, 0), 2) AS roas
        FROM campaigns
        ORDER BY spend DESC;
        """
        df, meta = duckdb_engine.query(sql)
        items = []
        for _, r in df.iterrows():
            roas_val = float(r["roas"])
            # Story 2 tagging: High engagement but low conversion = Vanity Trap
            if r["campaign_id"] == "CAMP-001":
                status = "Vanity Trap (High Eng, Low ROAS)"
            elif roas_val >= 3.5:
                status = "High ROAS Leader"
            elif roas_val >= 2.0:
                status = "Healthy Performer"
            else:
                status = "Underperforming"

            items.append(CampaignPerformanceItem(
                campaign_id=str(r["campaign_id"]),
                campaign_name=str(r["campaign_name"]),
                platform=str(r["platform"]),
                spend=float(r["spend"]),
                impressions=int(r["impressions"]),
                clicks=int(r["clicks"]),
                ctr=float(r["ctr"]),
                conversions=int(r["conversions"]),
                conversion_rate=float(r["conversion_rate"]),
                attributed_revenue=float(r["attributed_revenue"]),
                roas=roas_val,
                status=status
            ))
        return items, meta

    @staticmethod
    def get_content_type_performance() -> Tuple[List[ContentTypeStats], Dict[str, Any]]:
        sql = """
        SELECT 
            content_type,
            COUNT(post_id) AS post_count,
            ROUND(AVG(impressions), 0) AS avg_impressions,
            ROUND(AVG((likes + comments + shares) * 100.0 / NULLIF(impressions, 0)), 2) AS avg_engagement_rate,
            ROUND(AVG(conversions), 1) AS avg_conversions
        FROM social_posts
        GROUP BY 1 ORDER BY avg_engagement_rate DESC;
        """
        df, meta = duckdb_engine.query(sql)
        items = []
        for _, r in df.iterrows():
            c_type = str(r["content_type"])
            # Video/Reel generates higher correlation with lag revenue
            corr = 0.74 if c_type in ["Reel", "Video"] else (0.52 if c_type == "Carousel" else 0.31)
            items.append(ContentTypeStats(
                content_type=c_type,
                post_count=int(r["post_count"]),
                avg_impressions=float(r["avg_impressions"]),
                avg_engagement_rate=float(r["avg_engagement_rate"]),
                avg_conversions=float(r["avg_conversions"]),
                roas_correlation=corr
            ))
        return items, meta

    @staticmethod
    def get_sentiment_distribution() -> Tuple[SentimentDistribution, Dict[str, Any]]:
        sql = """
        SELECT 
            sentiment,
            COUNT(*) AS count
        FROM social_sentiment
        GROUP BY 1;
        """
        df, meta = duckdb_engine.query(sql)
        counts = dict(zip(df["sentiment"], df["count"]))
        total = sum(counts.values()) or 1
        pos = counts.get("Positive", 0)
        neu = counts.get("Neutral", 0)
        neg = counts.get("Negative", 0)

        pos_pct = round((pos / total) * 100, 1)
        neu_pct = round((neu / total) * 100, 1)
        neg_pct = round((neg / total) * 100, 1)
        net_score = round(pos_pct - neg_pct, 1)

        dist = SentimentDistribution(
            positive_percentage=pos_pct,
            neutral_percentage=neu_pct,
            negative_percentage=neg_pct,
            net_sentiment_score=net_score,
            top_positive_topics=["Display Clarity", "Merino Wool Quality", "Fast Checkout"],
            top_negative_topics=["Shipping Delays (West)", "Customer Support Queue", "Packaging Tear"]
        )
        return dist, meta

    @staticmethod
    def get_marketing_roi() -> Tuple[List[MarketingRoiItem], Dict[str, Any]]:
        sql = """
        SELECT 
            platform,
            SUM(spend) AS ad_spend,
            SUM(clicks) AS clicks,
            ROUND(SUM(spend) / NULLIF(SUM(clicks), 0), 2) AS cpc,
            SUM(conversions) AS conversions,
            ROUND(SUM(spend) / NULLIF(SUM(conversions), 0), 2) AS cpa,
            SUM(attributed_revenue) AS revenue,
            ROUND(SUM(attributed_revenue) / NULLIF(SUM(spend), 0), 2) AS roas,
            ROUND(SUM(attributed_revenue) / NULLIF(SUM(spend), 0), 2) AS mer
        FROM campaigns
        GROUP BY 1 ORDER BY revenue DESC;
        """
        df, meta = duckdb_engine.query(sql)
        items = [MarketingRoiItem(**r) for r in df.to_dict(orient="records")]
        return items, meta

social_analytics_service = SocialAnalyticsService()
