from __future__ import annotations

from typing import List, Optional

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, Field, field_validator

from src.config.settings import get_settings
from src.utils.model_loader import load_artifacts
from src.inference.batch_predict import BatchItem, batch_predict
from src.inference.predict import predict_placement
from src.models.resume_analyzer import AnalysisResult
from src.utils.validators import validate_non_empty


router = APIRouter(prefix="/predictions", tags=["predictions"])


class PredictionRequest(BaseModel):
    resume_text: str = Field(..., min_length=1)
    job_description: str = Field(..., min_length=1)
    job_skills: List[str] = Field(default_factory=list)
    candidate_id: Optional[str] = None
    job_id: Optional[str] = None

    @field_validator("resume_text", "job_description")
    @classmethod
    def _validate_text(cls, value: str) -> str:
        validate_non_empty(value, "text")
        return value


class PredictionResponse(BaseModel):
    placement_probability: float
    ats_score: float
    matched_skills: List[str]
    missing_skills: List[str]
    extracted_skills: List[str]
    recommendations: List[str]


class BatchPredictionRequest(BaseModel):
    items: List[PredictionRequest] = Field(..., min_length=1)


@router.get("/health")
def health_check() -> dict:
    settings = get_settings()
    status = {"status": "ok", "service": settings.service_name}
    try:
        artifacts = load_artifacts(settings.model_path, settings.metadata_path)
        status["model_loaded"] = True
        status["model_path"] = str(settings.model_path)
        status["metadata"] = artifacts.metadata
    except Exception:
        status["model_loaded"] = False
    return status


@router.post("/predict", response_model=PredictionResponse)
def predict(request: PredictionRequest) -> PredictionResponse:
    try:
        result = predict_placement(
            resume_text=request.resume_text,
            job_description=request.job_description,
            job_skills=request.job_skills,
        )
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc

    return _to_response(result)


@router.post("/batch", response_model=List[PredictionResponse])
def predict_batch(request: BatchPredictionRequest) -> List[PredictionResponse]:
    items = [
        BatchItem(
            resume_text=item.resume_text,
            job_description=item.job_description,
            job_skills=item.job_skills,
        )
        for item in request.items
    ]
    results = batch_predict(items)
    return [_to_response(res) for res in results]


def _to_response(result: AnalysisResult) -> PredictionResponse:
    settings = get_settings()
    recommendations = []
    if result.missing_skills:
        recommendations.extend(
            [
                f"Upskill: {skill}"
                for skill in result.missing_skills[: settings.top_k_recommendations]
            ]
        )
    if result.ats_score.score < 70:
        recommendations.append("Tailor your resume keywords to the job description.")

    return PredictionResponse(
        placement_probability=result.placement_probability,
        ats_score=result.ats_score.score,
        matched_skills=result.matched_skills,
        missing_skills=result.missing_skills,
        extracted_skills=result.extracted_skills,
        recommendations=recommendations,
    )
