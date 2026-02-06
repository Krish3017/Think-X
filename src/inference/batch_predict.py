from __future__ import annotations

from dataclasses import dataclass
from typing import Iterable

from src.inference.predict import predict_placement
from src.models.resume_analyzer import AnalysisResult


@dataclass(frozen=True)
class BatchItem:
    """Input item for batch prediction."""

    resume_text: str
    job_description: str
    job_skills: Iterable[str]


def batch_predict(items: list[BatchItem]) -> list[AnalysisResult]:
    """Run placement predictions for a batch of inputs."""
    results: list[AnalysisResult] = []
    for item in items:
        results.append(
            predict_placement(
                resume_text=item.resume_text,
                job_description=item.job_description,
                job_skills=item.job_skills,
            )
        )
    return results
