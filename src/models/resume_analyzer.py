from __future__ import annotations

from dataclasses import dataclass
from typing import Iterable

import pandas as pd

from src.config.settings import AppSettings
from src.models.ats_scorer import AtsScorer, AtsScore
from src.models.keyword_matcher import KeywordMatcher, MatchResult
from src.models.placement_predictor import PlacementPredictor
from src.models.skill_extractor import SkillExtractor
from src.pipeline.feature_engineering import FeatureBuilder
from src.utils.model_loader import load_artifacts


@dataclass(frozen=True)
class AnalysisResult:
    """Aggregate analysis result for a resume."""

    placement_probability: float
    ats_score: AtsScore
    matched_skills: list[str]
    missing_skills: list[str]
    extracted_skills: list[str]


class ResumeAnalyzer:
    """Orchestrates resume analysis and placement prediction."""

    def __init__(self, settings: AppSettings) -> None:
        self._settings = settings
        self._artifacts = load_artifacts(settings.model_path, settings.metadata_path)
        self._predictor = PlacementPredictor(self._artifacts.pipeline)
        self._skills = SkillExtractor(settings.skill_taxonomy_path)
        self._matcher = KeywordMatcher()
        self._ats = AtsScorer()
        self._features = FeatureBuilder(settings.max_resume_chars, settings.max_job_chars)

    def analyze(
        self,
        resume_text: str,
        job_description: str,
        job_skills: Iterable[str],
    ) -> AnalysisResult:
        extracted_skills = self._skills.extract(resume_text)
        match = self._matcher.match(extracted_skills, job_skills)

        features = self._features.build(
            resume_text=resume_text,
            job_description=job_description,
            extracted_skills=extracted_skills,
            job_skills=job_skills,
        )
        features_df = pd.DataFrame([features.__dict__])
        placement_probability = self._predictor.predict_proba(features_df)

        ats_score = self._ats.score(match.match_ratio, features.years_experience)

        return AnalysisResult(
            placement_probability=round(placement_probability, 6),
            ats_score=ats_score,
            matched_skills=match.matched,
            missing_skills=match.missing,
            extracted_skills=extracted_skills,
        )
