from __future__ import annotations

import re
from typing import Iterable

_HTML_RE = re.compile(r"<[^>]+>")
_NON_WORD_RE = re.compile(r"[^a-z0-9+#.\s]+")
_WHITESPACE_RE = re.compile(r"\s+")


def strip_html(text: str) -> str:
    """Remove HTML tags from text."""
    return _HTML_RE.sub(" ", text)


def normalize_text(text: str) -> str:
    """Normalize text for downstream NLP and feature extraction."""
    cleaned = strip_html(text)
    cleaned = cleaned.lower()
    cleaned = _NON_WORD_RE.sub(" ", cleaned)
    cleaned = _WHITESPACE_RE.sub(" ", cleaned).strip()
    return cleaned


def clip_text(text: str, max_chars: int) -> str:
    """Clip text to a maximum character length."""
    if len(text) <= max_chars:
        return text
    return text[:max_chars]


def extract_years_of_experience(text: str) -> int:
    """Extract max years of experience mentioned in the text."""
    normalized = normalize_text(text)
    matches = re.findall(r"(\d{1,2})\s*\+?\s*years?", normalized)
    if not matches:
        return 0
    return max(int(m) for m in matches)


def tokenize(text: str) -> list[str]:
    """Tokenize text into words."""
    normalized = normalize_text(text)
    if not normalized:
        return []
    return normalized.split()


def unique_tokens(texts: Iterable[str]) -> set[str]:
    """Return a set of unique tokens from a collection of texts."""
    tokens: set[str] = set()
    for text in texts:
        tokens.update(tokenize(text))
    return tokens
