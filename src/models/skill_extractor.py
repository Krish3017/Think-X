from __future__ import annotations

import json
from pathlib import Path
from typing import List, Dict, Set

from src.pipeline.data_cleaning import normalize_text


class SkillExtractor:
    """
    Extract skills using a curated taxonomy.

    Features:
    - Alias normalization (e.g. js -> javascript)
    - Word-boundary safe matching
    """

    _ALIASES: Dict[str, str] = {
        "js": "javascript",
        "nodejs": "node",
        "py": "python",
        "csharp": "c#",
        "postgres": "postgresql",
        "tf": "tensorflow",
        "sklearn": "scikit-learn",
    }

    def __init__(self, taxonomy_path: Path | None = None) -> None:
        self._skills: List[str] = self._load_taxonomy(taxonomy_path)

        self._normalized_to_canonical: Dict[str, str] = {}
        for skill in self._skills:
            normalized = normalize_text(skill)
            if normalized:
                self._normalized_to_canonical[normalized] = skill

        # Add aliases
        for alias, canonical in self._ALIASES.items():
            self._normalized_to_canonical[normalize_text(alias)] = canonical

    @staticmethod
    def _load_taxonomy(taxonomy_path: Path | None) -> List[str]:
        if taxonomy_path and taxonomy_path.exists():
            if taxonomy_path.suffix.lower() == ".json":
                return json.loads(taxonomy_path.read_text(encoding="utf-8"))
            return [
                line.strip()
                for line in taxonomy_path.read_text(encoding="utf-8").splitlines()
                if line.strip()
            ]

        # ===============================
        # DEFAULT SKILL TAXONOMY
        # ===============================
        return [
            # Programming Languages
            "python", "java", "c", "c++", "c#", "go", "rust",
            "javascript", "typescript", "php", "ruby", "kotlin",
            "swift", "scala", "r", "bash",

            # Frontend
            "html", "css", "sass", "tailwindcss", "bootstrap",
            "react", "nextjs", "vue", "nuxt", "angular",
            "redux", "vite", "webpack",

            # Backend
            "node", "express", "nestjs", "fastapi",
            "django", "flask", "spring", "spring boot",
            "hibernate", "laravel", "rails",

            # Databases
            "mysql", "postgresql", "sqlite", "oracle",
            "sql server", "mongodb", "redis",
            "cassandra", "dynamodb", "elasticsearch", "firebase",

            # Cloud
            "aws", "gcp", "azure", "cloudflare",

            # DevOps
            "docker", "kubernetes", "terraform", "ansible",
            "jenkins", "github actions", "gitlab ci",
            "nginx", "apache", "linux",

            # Data Engineering
            "pandas", "numpy", "spark", "hadoop",
            "airflow", "kafka", "dbt",
            "snowflake", "redshift", "bigquery",

            # ML & AI
            "scikit-learn", "tensorflow", "pytorch",
            "keras", "xgboost", "lightgbm",
            "nlp", "computer vision", "opencv",
            "huggingface", "mlops",

            # APIs & Architecture
            "rest", "graphql", "grpc",
            "microservices", "monolith",
            "event-driven architecture", "soa",

            # Testing
            "unit testing", "integration testing",
            "jest", "mocha", "pytest",
            "selenium", "cypress", "playwright",

            # Security
            "jwt", "oauth", "openid connect",
            "authentication", "authorization",
            "penetration testing", "owasp", "encryption",

            # Version Control & Tools
            "git", "github", "gitlab", "bitbucket",
            "jira", "confluence",

            # Fundamentals
            "data structures", "algorithms", "system design",
            "object-oriented programming", "design patterns",
            "clean architecture", "solid principles",
            "scalability", "performance optimization",

            # Misc
            "postman", "swagger", "openapi",
            "figma", "notion",
            "linux shell", "bash scripting",
        ]

    def extract(self, text: str) -> List[str]:
        """
        Extract skills from raw text.
        """
        normalized_text = f" {normalize_text(text)} "
        found: Set[str] = set()

        for norm, canonical in self._normalized_to_canonical.items():
            if f" {norm} " in normalized_text:
                found.add(canonical)

        return sorted(found)
