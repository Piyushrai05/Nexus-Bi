import unittest
import pandas as pd
from app.core.config import settings
from app.engine.duckdb_engine import duckdb_engine
from app.engine.semantic_engine import semantic_engine
from app.services.quality_service import quality_service
from app.services.profiling_service import profiling_service
from app.services.root_cause_service import root_cause_service
from app.services.analytics_service import analytics_service
from app.services.social_analytics_service import social_analytics_service
from app.services.ingestion_service import ingestion_service

# Direct route function imports
from app.api.routes.health import health_check
from app.api.routes.metrics import get_metrics_catalog
from app.api.routes.analytics import (
    get_executive_overview,
    get_west_decline_root_cause,
    get_revenue_series,
    get_dashboard_insights,
    get_dashboard_recommendations
)
from app.api.routes.social import get_campaigns, get_marketing_roi, get_social_overview
from app.api.routes.datasets import list_datasets, get_dataset_preview

class TestNexusBIBackend(unittest.TestCase):
    # 1. Health Endpoint Test
    def test_01_health_check(self):
        res = health_check()
        self.assertEqual(res.data["status"], "healthy")
        self.assertEqual(res.meta.method, "system_check")
        self.assertEqual(res.meta.confidence, "high")

    # 2. Demo Dataset Generation & Persistence Test
    def test_02_demo_files_exist(self):
        clean_dir = settings.DEMO_DATA_DIR / "clean"
        for table in ["sales", "customers", "products", "campaigns", "social_posts", "social_sentiment"]:
            self.assertTrue((clean_dir / f"{table}.parquet").exists(), f"Missing {table}.parquet")
            self.assertTrue((clean_dir / f"{table}.csv").exists(), f"Missing {table}.csv")

    # 3. Foreign Key Integrity Test
    def test_03_foreign_key_consistency(self):
        sales_df, _ = duckdb_engine.query("SELECT * FROM sales")
        cust_df, _ = duckdb_engine.query("SELECT customer_id FROM customers")
        prod_df, _ = duckdb_engine.query("SELECT product_id FROM products")
        camp_df, _ = duckdb_engine.query("SELECT campaign_id FROM campaigns")

        valid_cust_ids = set(cust_df["customer_id"])
        valid_prod_ids = set(prod_df["product_id"])
        valid_camp_ids = set(camp_df["campaign_id"]).union({None})

        # All customer_ids in sales must exist in customers
        for cid in sales_df["customer_id"]:
            self.assertIn(cid, valid_cust_ids)

        # All product_ids in sales must exist in products
        for pid in sales_df["product_id"]:
            self.assertIn(pid, valid_prod_ids)

        # All non-null campaign_ids in sales must exist in campaigns
        for camp in sales_df["campaign_id"].dropna():
            self.assertIn(camp, valid_camp_ids)

    # 4. Mathematical Reconciliation Test (Revenue, Cost, Profit)
    def test_04_revenue_profit_reconciliation(self):
        sales_df, _ = duckdb_engine.query("SELECT quantity, unit_price, discount, revenue, cost, profit FROM sales")
        for _, row in sales_df.iterrows():
            expected_rev = round(row["quantity"] * row["unit_price"] * (1.0 - row["discount"]), 2)
            self.assertAlmostEqual(row["revenue"], expected_rev, delta=0.02)
            expected_profit = round(row["revenue"] - row["cost"], 2)
            self.assertAlmostEqual(row["profit"], expected_profit, delta=0.02)

    # 5. Read-Only Query Security Guardrail Test
    def test_05_duckdb_security_guardrail(self):
        with self.assertRaises(ValueError):
            duckdb_engine.query("DROP TABLE sales;")
        with self.assertRaises(ValueError):
            duckdb_engine.query("DELETE FROM customers WHERE 1=1;")

    # 6. Data Profiling Test
    def test_06_data_profiling(self):
        sales_df, _ = duckdb_engine.query("SELECT * FROM sales")
        profile = profiling_service.profile_dataframe(sales_df, "sales")
        self.assertEqual(profile.row_count, 2500)
        self.assertEqual(profile.column_count, 13)
        self.assertGreater(profile.data_quality_score, 90.0)

    # 7. Data Quality Scoring Engine & Planted Story 3 Test
    def test_07_data_quality_clean_vs_imperfect(self):
        # Clean sales
        clean_sales, _ = duckdb_engine.query("SELECT * FROM sales")
        clean_report = quality_service.evaluate_dataframe(clean_sales, "sales")
        self.assertGreaterEqual(clean_report.overall_score, 90.0)
        self.assertEqual(clean_report.status, "verified")

        # Imperfect sales (Planted Story 3: duplicates, nulls, outliers)
        imp_sales, _ = duckdb_engine.query("SELECT * FROM imperfect_sales")
        imp_report = quality_service.evaluate_dataframe(imp_sales, "imperfect_sales")
        self.assertLess(imp_report.overall_score, 80.0)
        self.assertGreater(imp_report.total_issues_count, 0)
        # Check that duplicate issue was detected
        dup_dim = next(d for d in imp_report.dimensions if d.name == "Uniqueness")
        self.assertLess(dup_dim.score, 100.0)

    # 8. Semantic Metrics Catalog Test
    def test_08_semantic_catalog(self):
        res = get_metrics_catalog()
        catalog = res.data
        self.assertGreaterEqual(len(catalog), 7)
        metric_ids = [m.id for m in catalog]
        self.assertIn("net_revenue", metric_ids)
        self.assertIn("gross_profit", metric_ids)
        self.assertIn("customer_churn", metric_ids)
        # Verify polarity rule: customer_churn polarity must be 'down-is-good'
        churn_meta = next(m for m in catalog if m.id == "customer_churn")
        self.assertEqual(churn_meta.polarity, "down-is-good")

    # 9. Executive Overview API Test
    def test_09_executive_overview(self):
        res = get_executive_overview(start_date=None, end_date=None, region=None)
        kpis = res.data.kpis
        self.assertGreaterEqual(len(kpis), 4)
        rev_kpi = next(k for k in kpis if k.id == "net_revenue")
        self.assertGreater(rev_kpi.current_value, 100000.0)

    # 10. Planted Story 1 Root Cause Test (West Region Decline)
    def test_10_planted_story_1_west_decline(self):
        res = get_west_decline_root_cause()
        data = res.data
        self.assertIn("West Region", data.anomaly_title)
        self.assertLess(data.percentage_deviation, -10.0)
        factors = data.contributing_factors
        self.assertGreater(len(factors), 0)
        # Must identify Electronics as primary contributor
        self.assertTrue(any("Electronics" in f.factor or "Monitor" in f.factor for f in factors))

    # 11. Planted Story 2 Social Campaign Test (Instagram Apparel ROAS vs Vanity)
    def test_11_planted_story_2_social_campaigns(self):
        res = get_campaigns()
        campaigns = res.data
        ig_camp = next(c for c in campaigns if c.campaign_id == "CAMP-001")
        li_camp = next(c for c in campaigns if c.campaign_id == "CAMP-002")

        # Instagram has high impressions (>500k) but lower ROAS
        self.assertGreater(ig_camp.impressions, 500000)
        self.assertLess(ig_camp.roas, 2.0)
        self.assertIn("Vanity Trap", ig_camp.status)

        # LinkedIn has lower impressions (<200k) but higher ROAS (>3.5x)
        self.assertLess(li_camp.impressions, 200000)
        self.assertGreater(li_camp.roas, 3.5)

    # 12. Marketing ROI & Blended MER Test
    def test_12_marketing_roi(self):
        res = get_marketing_roi()
        rois = res.data
        self.assertGreater(len(rois), 0)
        for roi in rois:
            self.assertGreater(roi.ad_spend, 0)
            self.assertGreater(roi.revenue, 0)

    # 13. Datasets Ingestion & Preview Test
    def test_13_datasets_listing_and_preview(self):
        res = list_datasets()
        self.assertGreaterEqual(len(res.data), 6)
        preview_res = get_dataset_preview("sales", limit=5)
        self.assertEqual(len(preview_res.data.rows), 5)
        self.assertIn("order_id", preview_res.data.columns)

    # 14. Phase 5 Dashboard 7 KPIs & Date Filtering Test
    def test_14_dashboard_7_kpis_and_filters(self):
        res = get_executive_overview()
        kpis = {k.id: k for k in res.data.kpis}
        required_kpis = [
            "net_revenue",
            "gross_profit",
            "profit_margin",
            "order_volume",
            "aov",
            "repeat_rate",
            "marketing_roas"
        ]
        for r_kpi in required_kpis:
            self.assertIn(r_kpi, kpis, f"Missing required KPI: {r_kpi}")
            self.assertGreater(kpis[r_kpi].current_value, 0, f"KPI {r_kpi} must have positive value")

        # Verify polarity conventions
        self.assertEqual(kpis["net_revenue"].polarity, "up-is-good")
        self.assertEqual(kpis["profit_margin"].polarity, "up-is-good")
        self.assertEqual(kpis["marketing_roas"].polarity, "up-is-good")

        # Test date filter
        filtered_res = get_executive_overview(start_date="2026-11-01", end_date="2026-11-15")
        filtered_kpis = {k.id: k for k in filtered_res.data.kpis}
        self.assertLessEqual(filtered_kpis["net_revenue"].current_value, kpis["net_revenue"].current_value)

    # 15. Phase 5 Dashboard Insights & Recommendations Test
    def test_15_dashboard_insights_and_recommendations(self):
        ins_res = get_dashboard_insights()
        self.assertGreaterEqual(len(ins_res.data), 3)
        self.assertTrue(any("West Region" in i.title for i in ins_res.data))
        self.assertTrue(any("Instagram" in i.title for i in ins_res.data))
        self.assertTrue(any("Data Quality" in i.title for i in ins_res.data))

        recs_res = get_dashboard_recommendations()
        self.assertGreaterEqual(len(recs_res.data), 5)
        for rec in recs_res.data:
            self.assertTrue(rec.priority.startswith("P"))
            self.assertIn(rec.confidence_tier, ["high", "medium", "low"])
            self.assertIsNotNone(rec.suggested_owner)

if __name__ == "__main__":
    unittest.main()
