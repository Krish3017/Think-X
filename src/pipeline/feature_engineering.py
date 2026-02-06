from __future__ import annotations

from dataclasses import dataclass
from typing import Iterable

import pandas as pd

from src.pipeline.data_cleaning import clip_text, extract_years_of_experience, normalize_text
from src.utils.validators import validate_non_empty


@dataclass(frozen=True)
class FeatureRow:
    """Feature representation for a single resume-job pair."""

    combined_text: str
    years_experience: int
    skill_match_ratio: float
    resume_length: int
    job_length: int


class FeatureBuilder:
    """Build feature rows for training and inference."""

    def __init__(self, max_resume_chars: int, max_job_chars: int) -> None:
        self._max_resume_chars = max_resume_chars
        self._max_job_chars = max_job_chars

    def build(
        self,
        resume_text: str,
        job_description: str,
        extracted_skills: Iterable[str],
        job_skills: Iterable[str],
    ) -> FeatureRow:
        """Create a FeatureRow from raw inputs."""
        validate_non_empty(resume_text, "resume_text")
        validate_non_empty(job_description, "job_description")

        resume_text = clip_text(resume_text, self._max_resume_chars)
        job_description = clip_text(job_description, self._max_job_chars)

        resume_norm = normalize_text(resume_text)
        job_norm = normalize_text(job_description)

        extracted = {s.lower().strip() for s in extracted_skills if s}
        required = {s.lower().strip() for s in job_skills if s}

        skill_match_ratio = 0.0
        if required:
            skill_match_ratio = len(extracted & required) / len(required)

        combined_text = f"{resume_norm} {job_norm}".strip()

        return FeatureRow(
            combined_text=combined_text,
            years_experience=extract_years_of_experience(resume_text),
            skill_match_ratio=skill_match_ratio,
            resume_length=len(resume_norm),
            job_length=len(job_norm),
        )

    @staticmethod
    def to_dataframe(rows: list[FeatureRow]) -> pd.DataFrame:
        """Convert a list of FeatureRow objects to a DataFrame."""
        return pd.DataFrame([row.__dict__ for row in rows])
