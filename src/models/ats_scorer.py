from __future__ import annotations

from dataclasses import dataclass


@dataclass(frozen=True)
class AtsScore:
    """ATS score and contributing signals."""

    score: float
    skill_match_ratio: float
    years_experience: int


class AtsScorer:
    """Compute ATS score based on skill match and experience."""

    def score(self, skill_match_ratio: float, years_experience: int) -> AtsScore:
        skill_component = min(skill_match_ratio * 100.0, 100.0)
        experience_component = min(years_experience * 5.0, 30.0)
        total = min(skill_component * 0.7 + experience_component * 0.3, 100.0)

        return AtsScore(
            score=round(total, 2),
            skill_match_ratio=round(skill_match_ratio, 4),
            years_experience=years_experience,
        )
