from __future__ import annotations

from functools import lru_cache
from typing import Iterable

from src.config.settings import AppSettings, get_settings
from src.models.resume_analyzer import AnalysisResult, ResumeAnalyzer


@lru_cache(maxsize=1)
def _get_analyzer() -> ResumeAnalyzer:
    settings = get_settings()
    return ResumeAnalyzer(settings)


def predict_placement(
    resume_text: str,
    job_description: str,
    job_skills: Iterable[str],
    settings: AppSettings | None = None,
) -> AnalysisResult:
    """Predict placement probability and ATS score for a single resume."""
    analyzer = _get_analyzer() if settings is None else ResumeAnalyzer(settings)
    return analyzer.analyze(resume_text, job_description, job_skills)
