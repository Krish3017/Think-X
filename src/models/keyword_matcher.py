from __future__ import annotations

from dataclasses import dataclass
from typing import Iterable


@dataclass(frozen=True)
class MatchResult:
    """Result of skill matching."""

    matched: list[str]
    missing: list[str]
    match_ratio: float


class KeywordMatcher:
    """Match extracted skills against job requirements."""

    @staticmethod
    def match(extracted: Iterable[str], required: Iterable[str]) -> MatchResult:
        extracted_set = {s.lower().strip() for s in extracted if s}
        required_set = {s.lower().strip() for s in required if s}

        matched = sorted(extracted_set & required_set)
        missing = sorted(required_set - extracted_set)

        match_ratio = 0.0
        if required_set:
            match_ratio = len(matched) / len(required_set)

        return MatchResult(matched=matched, missing=missing, match_ratio=match_ratio)
