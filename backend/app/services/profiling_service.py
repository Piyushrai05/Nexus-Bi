import pandas as pd
from typing import List, Dict, Any
from app.schemas.dataset import ColumnProfile, DatasetProfile
from app.services.quality_service import quality_service

class ProfilingService:
    @staticmethod
    def profile_dataframe(df: pd.DataFrame, dataset_id: str) -> DatasetProfile:
        total_rows = len(df)
        total_cols = len(df.columns)
        columns_profile: List[ColumnProfile] = []

        for col_name in df.columns:
            series = df[col_name]
            inferred_type = str(series.dtype)
            null_count = int(series.isnull().sum())
            null_pct = round((null_count / total_rows) * 100, 2) if total_rows > 0 else 0.0
            unique_count = int(series.nunique(dropna=True))
            
            # Sample values (up to 5 non-null values)
            samples = series.dropna().unique()[:5].tolist()
            # Clean samples for JSON serialization
            samples_cleaned = [str(x) if isinstance(x, (pd.Timestamp, bytes)) else x for x in samples]

            min_val = None
            max_val = None
            has_outliers = False
            outlier_count = 0

            if pd.api.types.is_numeric_dtype(series) and not series.dropna().empty:
                min_val = float(series.min())
                max_val = float(series.max())
                
                # Tukey IQR Outlier detection
                q1 = series.quantile(0.25)
                q3 = series.quantile(0.75)
                iqr = q3 - q1
                if iqr > 0:
                    outliers = series[(series > q3 + 1.5 * iqr) | (series < q1 - 1.5 * iqr)]
                    outlier_count = len(outliers)
                    has_outliers = outlier_count > 0

            columns_profile.append(ColumnProfile(
                name=col_name,
                inferred_type=inferred_type,
                total_count=total_rows,
                null_count=null_count,
                null_percentage=null_pct,
                unique_count=unique_count,
                sample_values=samples_cleaned,
                min_value=min_val,
                max_value=max_val,
                has_outliers=has_outliers,
                outlier_count=outlier_count
            ))

        duplicate_rows_count = int(df.duplicated().sum())
        duplicate_rows_pct = round((duplicate_rows_count / total_rows) * 100, 2) if total_rows > 0 else 0.0
        
        # Calculate DQS
        dqs_report = quality_service.evaluate_dataframe(df, dataset_id)

        return DatasetProfile(
            dataset_id=dataset_id,
            row_count=total_rows,
            column_count=total_cols,
            columns=columns_profile,
            duplicate_rows_count=duplicate_rows_count,
            duplicate_rows_percentage=duplicate_rows_pct,
            data_quality_score=dqs_report.overall_score
        )

profiling_service = ProfilingService()
