from __future__ import annotations

import json
from dataclasses import dataclass
from datetime import datetime, timezone
from pathlib import Path
from typing import Literal

import joblib
import pandas as pd
from sklearn.compose import ColumnTransformer
from sklearn.ensemble import RandomForestClassifier
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler

from src.config.settings import AppSettings
from src.pipeline.feature_engineering import FeatureBuilder
from src.utils.validators import validate_columns


@dataclass(frozen=True)
class TrainingConfig:
    """Configuration for training the placement model."""

    algorithm: Literal["logreg", "rf"] = "logreg"
    random_state: int = 42
    max_features: int = 4000


def train_and_serialize(
    dataset_path: Path,
    settings: AppSettings,
    config: TrainingConfig,
) -> None:
    """
    Train a placement model from a CSV dataset and serialize it.

    Dataset columns required:
    - resume_text
    - job_description
    - job_skills (pipe-separated list)
    - label (0 or 1)
    """
    df = pd.read_csv(dataset_path)
    validate_columns(df, ["resume_text", "job_description", "job_skills", "label"])

    builder = FeatureBuilder(
        max_resume_chars=settings.max_resume_chars,
        max_job_chars=settings.max_job_chars,
    )

    feature_rows = []
    for _, row in df.iterrows():
        job_skills = str(row["job_skills"]).split("|")
        feature_rows.append(
            builder.build(
                resume_text=str(row["resume_text"]),
                job_description=str(row["job_description"]),
                extracted_skills=job_skills,
                job_skills=job_skills,
            )
        )

    features_df = builder.to_dataframe(feature_rows)

    numeric_features = ["years_experience", "skill_match_ratio", "resume_length", "job_length"]
    text_feature = "combined_text"

    preprocessor = ColumnTransformer(
        transformers=[
            ("text", TfidfVectorizer(max_features=config.max_features, ngram_range=(1, 2)), text_feature),
            ("num", StandardScaler(), numeric_features),
        ],
        remainder="drop",
    )

    if config.algorithm == "rf":
        model = RandomForestClassifier(
            n_estimators=300,
            random_state=config.random_state,
            class_weight="balanced",
        )
    else:
        model = LogisticRegression(
            max_iter=2000,
            class_weight="balanced",
            n_jobs=-1,
            random_state=config.random_state,
        )

    pipeline = Pipeline(
        steps=[
            ("preprocess", preprocessor),
            ("model", model),
        ]
    )

    pipeline.fit(features_df, df["label"].astype(int))

    settings.model_path.parent.mkdir(parents=True, exist_ok=True)
    joblib.dump(pipeline, settings.model_path)

    metadata = {
        "trained_at": datetime.now(timezone.utc).isoformat(),
        "algorithm": config.algorithm,
        "numeric_features": numeric_features,
        "text_feature": text_feature,
        "max_features": config.max_features,
    }
    settings.metadata_path.parent.mkdir(parents=True, exist_ok=True)
    settings.metadata_path.write_text(json.dumps(metadata, indent=2))
