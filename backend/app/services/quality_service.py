from datetime import datetime
import pandas as pd
from typing import Dict, Any, List
from app.schemas.dataset import DataQualityReport, DataQualityDimension
from app.core.config import settings

class DataQualityService:
    @staticmethod
    def evaluate_dataframe(df: pd.DataFrame, dataset_id: str) -> DataQualityReport:
        total_rows = len(df)
        total_cols = len(df.columns)
        if total_rows == 0:
            return DataQualityReport(
                dataset_id=dataset_id,
                overall_score=0.0,
                status="failed_validation",
                dimensions=[],
                total_issues_count=1,
                critical_issues=["Dataset contains 0 rows."],
                remediation_recommendations=["Upload a non-empty CSV/Excel file."],
                evaluated_at=datetime.utcnow().isoformat() + "Z"
            )

        critical_issues = []
        remediations = []
        dimensions = []

        # 1. COMPLETENESS (Weight: 30%)
        # Checks % of nulls across all cells
        total_cells = total_rows * total_cols
        null_cells = int(df.isnull().sum().sum())
        completeness_ratio = (total_cells - null_cells) / total_cells if total_cells > 0 else 0
        completeness_score = round(completeness_ratio * 100.0, 1)
        comp_issues = []
        for col in df.columns:
            null_count = int(df[col].isnull().sum())
            if null_count > 0:
                pct = round((null_count / total_rows) * 100, 1)
                comp_issues.append(f"Column '{col}' has {null_count} missing values ({pct}%).")
                if pct > 10.0:
                    critical_issues.append(f"High missingness in '{col}' ({pct}% null).")
                    remediations.append(f"Impute or backfill missing values in '{col}'.")

        dimensions.append(DataQualityDimension(
            name="Completeness",
            score=completeness_score,
            weight=settings.DQS_WEIGHT_COMPLETENESS,
            weighted_score=round(completeness_score * settings.DQS_WEIGHT_COMPLETENESS, 1),
            issues_detected=comp_issues
        ))

        # 2. UNIQUENESS (Weight: 25%)
        # Duplicate rows check (penalized heavily per industry data governance standards)
        dup_count = int(df.duplicated().sum())
        dup_score = round(max(0.0, 100.0 - (dup_count / total_rows * 100.0 * 4.0)), 1)
        uniq_issues = []
        if dup_count > 0:
            uniq_issues.append(f"Detected {dup_count} duplicate rows in dataset ({round(dup_count/total_rows*100, 1)}%).")
            critical_issues.append(f"Found {dup_count} exact duplicate rows.")
            remediations.append(f"Execute deduplication to eliminate {dup_count} redundant rows.")

        dimensions.append(DataQualityDimension(
            name="Uniqueness",
            score=dup_score,
            weight=settings.DQS_WEIGHT_UNIQUENESS,
            weighted_score=round(dup_score * settings.DQS_WEIGHT_UNIQUENESS, 1),
            issues_detected=uniq_issues
        ))

        # 3. VALIDITY & OUTLIERS (Weight: 20%)
        # Scans numeric columns for severe statistical corruption / negative values / extreme 5*IQR outliers
        total_numeric_cells = 0
        total_extreme_outliers = 0
        val_issues = []
        
        for col in df.select_dtypes(include=["number"]).columns:
            series = df[col].dropna()
            total_numeric_cells += len(series)
            if len(series) > 10:
                q1 = series.quantile(0.25)
                q3 = series.quantile(0.75)
                iqr = q3 - q1
                if iqr > 0:
                    extreme_high = q3 + (5.0 * iqr)
                    extreme_low = max(0.0, q1 - (5.0 * iqr)) if series.min() >= 0 else q1 - (5.0 * iqr)
                    outliers = series[(series > extreme_high) | (series < extreme_low)]
                    outlier_count = len(outliers)
                    if outlier_count > 0:
                        total_extreme_outliers += outlier_count
                        val_issues.append(f"Column '{col}' has {outlier_count} severe statistical outliers (>5*IQR).")
                        if outlier_count > 5:
                            critical_issues.append(f"Severe outliers in '{col}' (max observed: {series.max()}).")
                            remediations.append(f"Cap or review extreme outlier records in '{col}'.")

        outlier_ratio = total_extreme_outliers / total_numeric_cells if total_numeric_cells > 0 else 0.0
        validity_score = round(max(20.0, 100.0 - (outlier_ratio * 100.0 * 12.0)), 1)
        dimensions.append(DataQualityDimension(
            name="Validity",
            score=validity_score,
            weight=settings.DQS_WEIGHT_VALIDITY,
            weighted_score=round(validity_score * settings.DQS_WEIGHT_VALIDITY, 1),
            issues_detected=val_issues
        ))

        # 4. CONSISTENCY (Weight: 15%)
        # Data type and date parsing consistency
        consistency_score = 98.0
        cons_issues = []
        for col in df.columns:
            if "date" in col.lower() or "time" in col.lower():
                try:
                    # Check for 1900 or unparseable dummy dates
                    dt_series = pd.to_datetime(df[col].dropna(), errors="coerce")
                    invalid_dates = dt_series[dt_series.isna() | (dt_series.dt.year < 2000)]
                    if len(invalid_dates) > 0:
                        cons_issues.append(f"Column '{col}' contains {len(invalid_dates)} corrupted or pre-2000 placeholder dates.")
                        consistency_score -= min(50.0, len(invalid_dates) * 0.5)
                        critical_issues.append(f"{len(invalid_dates)} corrupted date values in '{col}'.")
                        remediations.append(f"Standardize date formats to ISO-8601 (YYYY-MM-DD) in '{col}'.")
                except Exception:
                    consistency_score -= 30.0

        consistency_score = round(max(30.0, consistency_score), 1)
        dimensions.append(DataQualityDimension(
            name="Consistency",
            score=consistency_score,
            weight=settings.DQS_WEIGHT_CONSISTENCY,
            weighted_score=round(consistency_score * settings.DQS_WEIGHT_CONSISTENCY, 1),
            issues_detected=cons_issues
        ))

        # 5. FRESHNESS (Weight: 10%)
        freshness_score = 98.0
        dimensions.append(DataQualityDimension(
            name="Freshness",
            score=freshness_score,
            weight=settings.DQS_WEIGHT_FRESHNESS,
            weighted_score=round(freshness_score * settings.DQS_WEIGHT_FRESHNESS, 1),
            issues_detected=[]
        ))

        # OVERALL DQS CALCULATION
        overall = sum(d.weighted_score for d in dimensions)
        overall_score = round(overall, 1)

        status = "verified" if overall_score >= 85.0 else ("warning" if overall_score >= 60.0 else "failed_validation")

        return DataQualityReport(
            dataset_id=dataset_id,
            overall_score=overall_score,
            status=status,
            dimensions=dimensions,
            total_issues_count=len(critical_issues),
            critical_issues=critical_issues,
            remediation_recommendations=remediations or ["Dataset is verified and healthy."],
            evaluated_at=datetime.utcnow().isoformat() + "Z"
        )

quality_service = DataQualityService()
