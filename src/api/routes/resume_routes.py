from __future__ import annotations

from typing import List

from fastapi import APIRouter, File, Form, HTTPException, UploadFile
from pydantic import BaseModel, Field
from typing import Optional

from src.config.settings import get_settings
from src.models.resume_analyzer import AnalysisResult
from src.models.skill_extractor import SkillExtractor
from src.services.analysis_service import AnalysisInput, AnalysisService
from src.services.pdf_parser import PdfParser
from src.utils.file_handler import (
    file_extension,
    read_upload,
    split_skill_list,
    extract_project_count,
)
from src.utils.validators import validate_non_empty
from src.services.gemini_review import generate_resume_review


router = APIRouter(prefix="/resumes", tags=["resumes"])


class ResumeParseResponse(BaseModel):
    text: str
    extracted_skills: List[str]
    project_count: int
    ats_score: int
    ats_breakdown: dict
    target_role: Optional[str] = None
    role_ats_score: Optional[int] = None
    role_match: Optional[dict] = None
    base_ats_score: Optional[int] = None
    resume_review: Optional[str] = None


class ResumeAnalyzeResponse(BaseModel):
    placement_probability: float
    ats_score: float
    matched_skills: List[str]
    missing_skills: List[str]
    extracted_skills: List[str]
    recommendations: List[str]


# Role skill profiles — concrete, verifiable skills only (no abstract role labels)
ROLE_SKILL_MAP = {
    "frontend": [
        "react",
        "javascript",
        "typescript",
        "html",
        "css",
        "vue",
        "angular",
        "next",
        "tailwind",
        "redux",
    ],
    "backend": [
        "node",
        "express",
        "django",
        "fastapi",
        "flask",
        "spring",
        "sql",
        "rest api",
        "graphql",
        "postgresql",
    ],
    "fullstack": [
        "react",
        "node",
        "javascript",
        "typescript",
        "sql",
        "rest api",
        "express",
        "html",
        "css",
        "mongodb",
    ],
    "cloud": [
        "aws",
        "azure",
        "gcp",
        "docker",
        "kubernetes",
        "ci/cd",
        "terraform",
        "jenkins",
        "ansible",
        "linux",
    ],
    "ml": [
        "python",
        "pandas",
        "numpy",
        "tensorflow",
        "pytorch",
        "scikit-learn",
        "keras",
        "jupyter",
        "matplotlib",
        "scipy",
    ],
}


# Abstract domain terms that must never appear as missing skills
_ABSTRACT_TERMS = {
    "backend",
    "frontend",
    "fullstack",
    "cloud",
    "devops",
    "ml",
    "ai",
    "data",
    "machine learning",
    "web",
    "server",
    "model",
}


def calculate_role_match(extracted_skills: List[str], target_role: str) -> dict:
    """Calculate role-specific skill match."""
    if target_role not in ROLE_SKILL_MAP:
        return {"matched_skills": [], "missing_skills": [], "match_ratio": 0.0}

    # Filter out any abstract terms that may have leaked into the map
    role_skills = [
        s for s in ROLE_SKILL_MAP[target_role] if s.lower() not in _ABSTRACT_TERMS
    ]
    if not role_skills:
        return {"matched_skills": [], "missing_skills": [], "match_ratio": 0.0}

    extracted_lower = [s.lower() for s in extracted_skills]

    matched = []
    for role_skill in role_skills:
        if any(role_skill in skill for skill in extracted_lower):
            matched.append(role_skill)

    missing = [s for s in role_skills if s not in matched]
    match_ratio = len(matched) / len(role_skills) if role_skills else 0.0

    return {
        "matched_skills": matched[:10],  # Top 10
        "missing_skills": missing[:10],  # Top 10
        "match_ratio": match_ratio,
    }


def calculate_ats_score(
    text: str, skills: List[str], project_count: int
) -> tuple[int, dict]:
    """Calculate ATS score based on resume content."""
    text_lower = text.lower()

    # 1. Skill Match Quality (0-40)
    skills_score = min(len(skills) * 4, 40)

    # 2. Experience Strength (0-30)
    experience_score = 0
    if any(kw in text_lower for kw in ["internship", "intern"]):
        experience_score += 10
    if project_count > 0:
        experience_score += 10
    if project_count > 2:
        experience_score += 10

    # 3. Resume Structure (0-20)
    structure_score = 0
    sections = ["education", "skills", "projects", "experience"]
    for section in sections:
        if section in text_lower:
            structure_score += 5

    # 4. Keyword Coverage (0-10)
    keyword_score = 0
    if any(kw in text_lower for kw in ["git", "github"]):
        keyword_score += 2
    if any(
        kw in text_lower
        for kw in ["react", "angular", "vue", "django", "flask", "spring"]
    ):
        keyword_score += 2
    if any(kw in text_lower for kw in ["sql", "mongodb", "postgresql", "mysql"]):
        keyword_score += 2
    if any(kw in text_lower for kw in ["aws", "azure", "gcp", "docker", "kubernetes"]):
        keyword_score += 2
    if any(kw in text_lower for kw in ["leetcode", "hackerrank", "codeforces"]):
        keyword_score += 2

    total_score = min(
        skills_score + experience_score + structure_score + keyword_score, 100
    )

    breakdown = {
        "skills_score": skills_score,
        "experience_score": experience_score,
        "structure_score": structure_score,
        "keyword_score": keyword_score,
    }

    return total_score, breakdown


@router.post("/parse", response_model=ResumeParseResponse)
async def parse_resume(
    file: UploadFile = File(...), target_role: str = Form("general")
) -> ResumeParseResponse:
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
    project_count = extract_project_count(text)
    ats_score, ats_breakdown = calculate_ats_score(text, skills, project_count)

    # Role-based analysis
    role_ats_score = None
    role_match = None

    if target_role and target_role != "general":
        role_match_data = calculate_role_match(skills, target_role)
        role_match_ratio = role_match_data["match_ratio"]

        # Role relevance factor: 0.3 base + 0.7 weighted by match
        role_relevance_factor = 0.3 + (0.7 * role_match_ratio)

        # Role ATS = base ATS × relevance factor (ats_score is the base)
        role_ats_score = round(ats_score * role_relevance_factor)

        # ZERO MATCH RULE: Cap at 40 if no skills match
        if len(role_match_data["matched_skills"]) == 0:
            role_ats_score = min(role_ats_score, 40)

        role_match = {
            "matched_skills": role_match_data["matched_skills"],
            "missing_skills": role_match_data["missing_skills"],
        }

    # Generate AI resume review (non-blocking, read-only)
    resume_review = None
    try:
        resume_review = await generate_resume_review(text, skills)
    except Exception:
        resume_review = "AI resume review is temporarily unavailable."

    return ResumeParseResponse(
        text=text,
        extracted_skills=skills,
        project_count=project_count,
        ats_score=ats_score,
        ats_breakdown=ats_breakdown,
        target_role=target_role if target_role != "general" else None,
        role_ats_score=role_ats_score,
        role_match=role_match,
        base_ats_score=ats_score if target_role != "general" else None,
        resume_review=resume_review,
    )


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
