from __future__ import annotations

from io import BytesIO

from pypdf import PdfReader


class PdfParser:
    """Parse resume content from PDF bytes."""

    def extract_text(self, content: bytes) -> str:
        """Extract text from a PDF payload."""
        reader = PdfReader(BytesIO(content))
        pages = []
        for page in reader.pages:
            text = page.extract_text() or ""
            pages.append(text)
        return "\n".join(pages).strip()
