# NEXUS BI — Analytical Backend Engine & API Documentation

**Version:** 1.0.0-PROD  
**Stack:** Python 3.11+, FastAPI, Embedded DuckDB 2.0+, Pandas 2.1+, Pydantic v2, Uvicorn  

---

## 1. Overview & Architecture

NEXUS BI Backend is a deterministic, evidence-backed analytical engine designed to solve the critical "Data Trust" gap in business intelligence. Instead of relying on brittle external warehouses or hallucinated LLM queries, it uses an in-process columnar DuckDB database to execute sub-millisecond aggregations directly against clean Parquet files.

### Key Architecture Components
- **`app/generators/demo_data.py`**: Deterministic synthetic dataset generator producing 6 interconnected NexusMart datasets (Sales, Customers, Products, Campaigns, Social Posts, Social Sentiment) with 3 planted demo stories.
- **`app/engine/duckdb_engine.py`**: Embedded DuckDB engine with read-only query guardrails and dynamic DataFrame registration.
- **`app/engine/semantic_engine.py`**: Semantic metric registry guaranteeing 1:1 metric consistency with the frontend semantic layer.
- **`app/services/quality_service.py`**: Transparent 5-dimension Data Quality Scoring engine (Completeness 30%, Uniqueness 25%, Validity 20%, Consistency 15%, Freshness 10%).
- **`app/services/root_cause_service.py`**: Automated multi-factor waterfall decomposition for anomaly investigation.

---

## 2. API Response Specification (Standard Envelope)

Every API endpoint strictly conforms to the typed standard envelope:

```json
{
  "data": { ... },
  "meta": {
    "method": "duckdb",
    "sql": "SELECT ...",
    "assumptions": ["Excluded refunded transactions", "Normalized timestamps to UTC"],
    "confidence": "high",
    "confidence_reason": "Direct transactional ledger records with 99.8% schema completeness.",
    "computed_at": "2026-11-21T12:00:00Z",
    "data_source": "sales",
    "row_count": 2500
  }
}
```

---

## 3. Endpoints Catalog

### Health & Metadata
- `GET /api/health` — System status, DuckDB version, and connection state.
- `GET /api/metrics/catalog` — Governed metric definitions, formulas, units, and polarity rules.

### Datasets & Ingestion
- `GET /api/datasets` — List all registered demo and user tables with row counts and DQS.
- `POST /api/datasets/upload` — Upload CSV or Excel file (path-traversal protected, max 50MB).
- `GET /api/datasets/{id}` — Metadata for a specific dataset.
- `GET /api/datasets/{id}/preview?limit=20` — Sample rows formatted for JSON.
- `GET /api/datasets/{id}/profile` — Columnar profile (null %, uniqueness, sample values, Tukey IQR outliers).
- `GET /api/data-quality/{id}` — Transparent 5-dimension Data Quality Score and remediation recommendations.

### Business Analytics
- `GET /api/analytics/overview?start_date=&end_date=&region=` — Executive overview KPIs, sparklines, and daily trend.
- `GET /api/analytics/revenue` — Daily net revenue, gross profit, order count, and 7-day moving baseline.
- `GET /api/analytics/profitability` — Profitability and margin % grouped by category.
- `GET /api/analytics/customers` — Customer segment breakdown, AOV, and 60-day churn rate.
- `GET /api/analytics/products` — Product Matrix (Stars, Cash Cows, Question Marks, Underperformers).
- `GET /api/analytics/regions` — Regional performance breakdown.
- `GET /api/analytics/root-cause/west-decline` — Automated multi-factor decomposition for Story 1.

### Social Media & Marketing Intelligence
- `GET /api/social/overview` — Total impressions, reach, engagements, engagement rate, clicks, attributed revenue, blended ROAS.
- `GET /api/social/campaigns` — Cross-channel campaign spend, conversions, and status ("Vanity Trap" vs "High ROAS Leader").
- `GET /api/social/content-performance` — Performance by format (Reels, Carousels, Static Image, Video, Text).
- `GET /api/social/sentiment` — Aspect-based sentiment distribution (positive %, neutral %, negative %, net score).
- `GET /api/social/marketing-roi` — Blended Marketing Efficiency Ratio (MER), CPA, and CPC by platform.

---

## 4. The 3 Planted Demo Stories

1. **Story 1: West Region Electronics Revenue Dip (-18.5%)**
   - **Investigation Endpoint:** `GET /api/analytics/root-cause/west-decline`
   - **Finding:** Between Nov 09 and Nov 16, West Region sales fell from $45,000 to $36,700. Multi-dimensional decomposition confirms 82% of the decline was concentrated in UltraWide Monitor stockouts in the California warehouse, compounded by a 14% customer refund spike.
2. **Story 2: Instagram Spring Apparel Engagement Lift vs. Commercial Conversion**
   - **Investigation Endpoint:** `GET /api/social/campaigns`
   - **Finding:** Campaign `CAMP-001` ("Instagram Spring Apparel Wave") achieved 580k impressions and high engagement, but only 1.54x ROAS, qualifying it as a **Vanity Trap**. In contrast, LinkedIn B2B campaign `CAMP-002` drove 4.8x ROAS on lower volume.
3. **Story 3: Data Quality Anomalies (Clean vs. Imperfect)**
   - **Investigation Endpoint:** `GET /api/data-quality/imperfect_sales` vs `GET /api/data-quality/sales`
   - **Finding:** The clean sales ledger achieves a DQS of **96.5/100 (`verified`)**, while the imperfect dataset drops to **68.4/100 (`warning`)** with 250 duplicate rows, 400 null customer/product IDs, 50 severe $999k outliers, and 150 corrupted dates detected.

---

## 5. Local Setup & Execution Instructions

### Start the Backend API Service
```bash
cd backend
python -m app.generators.demo_data   # Generates demo datasets
python main.py                       # Starts Uvicorn server on http://127.0.0.1:8000
```
- Interactive Swagger UI: `http://127.0.0.1:8000/docs`
- Interactive ReDoc: `http://127.0.0.1:8000/redoc`

### Run Backend Automated Tests
```bash
cd backend
python -m unittest discover -s tests
```
*Expected output: `Ran 13 tests in 0.28s ... OK`*

### Start the Frontend Client
```bash
cd frontend
npm run dev                          # Starts Next.js on http://localhost:3000
```
The frontend automatically connects to `http://127.0.0.1:8000/api` via [`src/lib/api-client.ts`](file:///c:/Documents/Desktop/project/BI%20Hackathon/frontend/src/lib/api-client.ts), with a graceful offline fallback if the backend service is offline.
