from __future__ import annotations

import traceback


def main() -> None:
    try:
        from src.config.settings import get_settings
        from src.services.analysis_service import AnalysisService, AnalysisInput

        settings = get_settings()
        svc = AnalysisService(settings)

        # Minimal test payload
        resume_text = "Experienced software engineer with 5 years experience in Python, AWS, Docker."
        job_description = (
            "Looking for a Python engineer with AWS and Docker experience."
        )
        job_skills = ["python", "aws", "docker"]

        result = svc.analyze(
            AnalysisInput(
                resume_text=resume_text,
                job_description=job_description,
                job_skills=job_skills,
            )
        )
        print("AnalysisResult:")
        print(result)
    except Exception:
        traceback.print_exc()


if __name__ == "__main__":
    main()
