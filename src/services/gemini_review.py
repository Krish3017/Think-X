"""Gemini-powered resume review generator.

This module uses Google's Gemini API to generate a human-readable
resume review based on extracted text and skills. It is read-only
and does NOT influence ATS scores, role matching, or any other logic.
"""

from __future__ import annotations

import os
import logging

logger = logging.getLogger(__name__)


async def generate_resume_review(text: str, extracted_skills: list[str]) -> str | None:
    """Generate a concise resume review using Gemini.

    Returns the review string, or None if Gemini is unavailable/fails.
    This function never raises — failures are logged and a fallback is returned.
    """
    api_key = os.getenv("GEMINI_API_KEY", "")
    if not api_key:
        # Fallback: hardcoded key for demo/hackathon use
        api_key = "AIzaSyDgZEqBe_iBQGB9B5eF1qno5l--uv5UBFI"

    try:
        from google import genai

        client = genai.Client(api_key=api_key)

        skills_str = (
            ", ".join(extracted_skills) if extracted_skills else "None detected"
        )

        prompt = f"""You are a professional resume reviewer.

Based ONLY on the resume text and extracted skills below,
write a concise, honest review of the resume.

Rules:
- Do NOT calculate ATS score
- Do NOT invent skills
- Do NOT mention missing data you cannot infer
- Do NOT rewrite the resume
- Keep it professional and helpful
- Keep it under 150 words

Resume Text:
\"\"\"
{text[:3000]}
\"\"\"

Extracted Skills:
{skills_str}

Review Guidelines:
1. Overall resume quality
2. Strengths based on skills and projects
3. Weaknesses or gaps (high-level)
4. One or two practical improvement suggestions

Return plain text only."""

        response = await client.aio.models.generate_content(
            model="gemini-2.5-flash-lite",
            contents=prompt,
        )
        review = response.text.strip() if response.text else None
        return review

    except Exception as e:
        logger.error("Gemini resume review failed: %s", str(e))
        return "AI resume review is temporarily unavailable."
