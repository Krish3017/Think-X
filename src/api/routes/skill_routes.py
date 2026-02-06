from __future__ import annotations

from fastapi import APIRouter
from pydantic import BaseModel, Field
from typing import List

from src.models.skill_extractor import SkillExtractor
from src.config.settings import get_settings
from src.utils.validators import validate_non_empty


router = APIRouter(prefix="/ml", tags=["skills"])


class SkillExtractionRequest(BaseModel):
    text: str = Field(..., min_length=1, description="Resume text to extract skills from")


class SkillExtractionResponse(BaseModel):
    skills: List[str] = Field(..., description="List of extracted skills")


@router.post("/extract-skills", response_model=SkillExtractionResponse)
async def extract_skills(request: SkillExtractionRequest) -> SkillExtractionResponse:
    """Extract skills from resume text using ML SkillExtractor."""
    validate_non_empty(request.text, "text")
    
    settings = get_settings()
    extractor = SkillExtractor(settings.skill_taxonomy_path)
    skills = extractor.extract(request.text)
    
    return SkillExtractionResponse(skills=skills)