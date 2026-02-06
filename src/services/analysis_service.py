from __future__ import annotations

from dataclasses import dataclass
from typing import Iterable

from src.config.settings import AppSettings
from src.models.resume_analyzer import AnalysisResult, ResumeAnalyzer


@dataclass(frozen=True)
class AnalysisInput:
    """Input payload for resume analysis."""

    resume_text: str
    job_description: str
    job_skills: Iterable[str]


class AnalysisService:
    """Facade for running resume analysis."""

    def __init__(self, settings: AppSettings) -> None:
        self._analyzer = ResumeAnalyzer(settings)

    def analyze(self, payload: AnalysisInput) -> AnalysisResult:
        """Analyze the resume against a job description."""
        return self._analyzer.analyze(
            resume_text=payload.resume_text,
            job_description=payload.job_description,
            job_skills=payload.job_skills,
        )
