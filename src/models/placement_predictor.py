from __future__ import annotations

from typing import Any

import pandas as pd


class PlacementPredictor:
    """Predict placement probability using a trained sklearn pipeline."""

    def __init__(self, pipeline: Any) -> None:
        self._pipeline = pipeline

    def predict_proba(self, features_df: pd.DataFrame) -> float:
        """Return probability of positive placement outcome."""
        proba = self._pipeline.predict_proba(features_df)
        return float(proba[0][1])
