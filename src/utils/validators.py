from __future__ import annotations

from typing import Iterable

import pandas as pd


def validate_non_empty(value: str, field_name: str) -> None:
    """Validate that a string is not empty."""
    if not value or not value.strip():
        raise ValueError(f"{field_name} must not be empty")


def validate_columns(df: pd.DataFrame, columns: Iterable[str]) -> None:
    """Validate that required columns exist in a DataFrame."""
    missing = [col for col in columns if col not in df.columns]
    if missing:
        raise ValueError(f"Missing required columns: {', '.join(missing)}")
