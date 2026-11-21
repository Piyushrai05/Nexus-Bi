from typing import Dict, List, Optional
from app.schemas.metrics import MetricCatalogItem

METRIC_CATALOG_REGISTRY: Dict[str, MetricCatalogItem] = {
    "net_revenue": MetricCatalogItem(
        id="net_revenue",
        name="Net Revenue",
        category="finance",
        definition="Total sales revenue minus returns, discounts, and cancellations.",
        formula="SUM(revenue)",
        unit="currency",
        polarity="up-is-good",
        required_fields=["revenue", "order_date"],
        sql_template="SELECT SUM(revenue) AS net_revenue FROM sales {where_clause};",
        limitations="Reflects accrued ledger orders; pending payment authorizations excluded."
    ),
    "gross_profit": MetricCatalogItem(
        id="gross_profit",
        name="Gross Profit",
        category="finance",
        definition="Net revenue minus total Cost of Goods Sold (COGS).",
        formula="SUM(profit) = SUM(revenue - cost)",
        unit="currency",
        polarity="up-is-good",
        required_fields=["revenue", "cost", "profit"],
        sql_template="SELECT SUM(profit) AS gross_profit FROM sales {where_clause};",
        limitations="Does not account for fixed warehouse overhead or corporate G&A expenses."
    ),
    "gross_margin": MetricCatalogItem(
        id="gross_margin",
        name="Gross Margin",
        category="finance",
        definition="Gross profit expressed as a percentage of total net revenue.",
        formula="(Gross Profit / Net Revenue) * 100",
        unit="percent",
        polarity="up-is-good",
        required_fields=["revenue", "profit"],
        sql_template="SELECT ROUND(SUM(profit) * 100.0 / NULLIF(SUM(revenue), 0), 2) AS gross_margin FROM sales {where_clause};",
        limitations="Undefined if net revenue is zero or negative."
    ),
    "order_volume": MetricCatalogItem(
        id="order_volume",
        name="Total Order Volume",
        category="business",
        definition="Count of distinct completed sales orders.",
        formula="COUNT(DISTINCT order_id)",
        unit="number",
        polarity="up-is-good",
        required_fields=["order_id"],
        sql_template="SELECT COUNT(DISTINCT order_id) AS order_volume FROM sales {where_clause};",
        limitations="Excludes unconfirmed checkout carts and draft quotes."
    ),
    "aov": MetricCatalogItem(
        id="aov",
        name="Average Order Value (AOV)",
        category="business",
        definition="Mean monetary value generated per completed transaction.",
        formula="Net Revenue / Total Completed Orders",
        unit="currency",
        polarity="up-is-good",
        required_fields=["revenue", "order_id"],
        sql_template="SELECT ROUND(SUM(revenue) / NULLIF(COUNT(DISTINCT order_id), 0), 2) AS aov FROM sales {where_clause};",
        limitations="Can be skewed by wholesale B2B outlier bulk purchases."
    ),
    "repeat_rate": MetricCatalogItem(
        id="repeat_rate",
        name="Repeat Purchase Rate",
        category="customer",
        definition="Percentage of customers with two or more lifetime purchases.",
        formula="(Customers with >= 2 orders / Total Customers) * 100",
        unit="percent",
        polarity="up-is-good",
        required_fields=["customer_id", "order_id"],
        sql_template="""WITH counts AS (
            SELECT customer_id, COUNT(DISTINCT order_id) AS cnt 
            FROM sales {where_clause} GROUP BY 1
        )
        SELECT ROUND(COUNT(CASE WHEN cnt > 1 THEN 1 END) * 100.0 / NULLIF(COUNT(*), 0), 1) AS repeat_rate 
        FROM counts;""",
        limitations="Requires historical customer ID tracking across transactions."
    ),
    "customer_churn": MetricCatalogItem(
        id="customer_churn",
        name="Customer Churn Rate",
        category="customer",
        definition="Percentage of customers who have not made a repeat purchase within 60 days.",
        formula="(Inactive Customers / Active Base) * 100",
        unit="percent",
        polarity="down-is-good", # POLARITY: down is good!
        required_fields=["customer_id", "last_purchase_date"],
        sql_template="""SELECT ROUND(COUNT(CASE WHEN last_purchase_date < '2026-10-01' THEN 1 END) * 100.0 / NULLIF(COUNT(*), 0), 2) AS customer_churn 
        FROM customers;""",
        limitations="Applies rolling 60-day inactivity threshold for e-commerce."
    ),
    "engagement_rate": MetricCatalogItem(
        id="engagement_rate",
        name="Social Engagement Rate",
        category="social",
        definition="Total audience interactions (likes, comments, shares) divided by gross impressions.",
        formula="(Total Engagements / Total Impressions) * 100",
        unit="percent",
        polarity="up-is-good",
        required_fields=["likes", "comments", "shares", "impressions"],
        sql_template="SELECT ROUND(SUM(likes + comments + shares) * 100.0 / NULLIF(SUM(impressions), 0), 2) AS engagement_rate FROM social_posts {where_clause};",
        limitations="Denominated by impressions (views), not unique reach."
    ),
    "blended_roas": MetricCatalogItem(
        id="blended_roas",
        name="Blended ROAS (MER)",
        category="marketing",
        definition="Total net revenue divided by total cross-channel ad spend.",
        formula="Total Net Revenue / Total Ad Spend",
        unit="ratio",
        polarity="up-is-good",
        required_fields=["revenue", "spend"],
        sql_template="""WITH rev AS (SELECT SUM(revenue) AS total_rev FROM sales {where_clause}),
        spd AS (SELECT SUM(spend) AS total_spend FROM campaigns)
        SELECT ROUND(total_rev / NULLIF(total_spend, 0), 2) AS blended_roas 
        FROM rev, spd;""",
        limitations="Blended aggregate ratio; does not distinguish individual ad creative incrementality."
    ),
}

class SemanticEngine:
    @staticmethod
    def get_catalog() -> List[MetricCatalogItem]:
        return list(METRIC_CATALOG_REGISTRY.values())

    @staticmethod
    def get_metric(metric_id: str) -> Optional[MetricCatalogItem]:
        return METRIC_CATALOG_REGISTRY.get(metric_id)

semantic_engine = SemanticEngine()
