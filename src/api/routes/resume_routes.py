from __future__ import annotations

from typing import List

from fastapi import APIRouter, File, Form, HTTPException, UploadFile
from pydantic import BaseModel, Field

from src.config.settings import get_settings
from src.models.resume_analyzer import AnalysisResult
from src.models.skill_extractor import SkillExtractor
from src.services.analysis_service import AnalysisInput, AnalysisService
from src.services.pdf_parser import PdfParser
from src.utils.file_handler import file_extension, read_upload, split_skill_list
from src.utils.validators import validate_non_empty


router = APIRouter(prefix="/resumes", tags=["resumes"])


class ResumeParseResponse(BaseModel):
    text: str
    extracted_skills: List[str]


class ResumeAnalyzeResponse(BaseModel):
    placement_probability: float
    ats_score: float
    matched_skills: List[str]
    missing_skills: List[str]
    extracted_skills: List[str]
    recommendations: List[str]


@router.post("/parse", response_model=ResumeParseResponse)
async def parse_resume(file: UploadFile = File(...)) -> ResumeParseResponse:
    settings = get_settings()
    max_bytes = settings.max_upload_mb * 1024 * 1024
    content = await read_upload(file, max_bytes)

    ext = file_extension(file.filename)
    if ext not in {".pdf", ".txt"}:
        raise HTTPException(
            status_code=400, detail="Only PDF or TXT files are supported"
        )

    if ext == ".pdf":
        text = PdfParser().extract_text(content)
    else:
        text = content.decode("utf-8", errors="ignore")

    validate_non_empty(text, "resume_text")
    skills = SkillExtractor(settings.skill_taxonomy_path).extract(text)
    return ResumeParseResponse(text=text, extracted_skills=skills)


@router.post("/analyze", response_model=ResumeAnalyzeResponse)
async def analyze_resume(
    file: UploadFile = File(...),
    job_description: str = Form(...),
    job_skills: str = Form(""),
) -> ResumeAnalyzeResponse:
    settings = get_settings()
    max_bytes = settings.max_upload_mb * 1024 * 1024
    content = await read_upload(file, max_bytes)

    ext = file_extension(file.filename)
    if ext not in {".pdf", ".txt"}:
        raise HTTPException(
            status_code=400, detail="Only PDF or TXT files are supported"
        )

    if ext == ".pdf":
        resume_text = PdfParser().extract_text(content)
    else:
        resume_text = content.decode("utf-8", errors="ignore")

    validate_non_empty(resume_text, "resume_text")
    validate_non_empty(job_description, "job_description")

    analysis_service = AnalysisService(settings)
    try:
        result = analysis_service.analyze(
            AnalysisInput(
                resume_text=resume_text,
                job_description=job_description,
                job_skills=split_skill_list(job_skills),
            )
        )
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc
    except Exception as exc:  # pragma: no cover - return clearer server error
        raise HTTPException(status_code=500, detail=f"Analysis failed: {exc}") from exc

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

    return ResumeAnalyzeResponse(
        placement_probability=result.placement_probability,
        ats_score=result.ats_score.score,
        matched_skills=result.matched_skills,
        missing_skills=result.missing_skills,
        extracted_skills=result.extracted_skills,
        recommendations=recommendations,
    )
