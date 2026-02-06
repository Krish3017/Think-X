from __future__ import annotations

from src.pipeline.data_cleaning import normalize_text, tokenize


class TextProcessor:
    """Text processing utilities for resumes and job descriptions."""

    def normalize(self, text: str) -> str:
        """Normalize text."""
        return normalize_text(text)

    def tokens(self, text: str) -> list[str]:
        """Tokenize text."""
        return tokenize(text)
