from __future__ import annotations

from pathlib import Path

from fastapi import UploadFile


def bytes_to_tempfile(content: bytes, suffix: str, directory: Path) -> Path:
    """Write bytes to a temporary file and return its path."""
    directory.mkdir(parents=True, exist_ok=True)
    temp_path = directory / f"upload{suffix}"
    temp_path.write_bytes(content)
    return temp_path


def file_extension(filename: str | None) -> str:
    """Return a lowercase file extension, including the leading dot."""
    if not filename:
        return ""
    return Path(filename).suffix.lower()


async def read_upload(upload: UploadFile, max_bytes: int) -> bytes:
    """Read an uploaded file, enforcing a max size."""
    content = await upload.read()
    if len(content) > max_bytes:
        raise ValueError(f"Upload exceeds {max_bytes} bytes")
    return content


def split_skill_list(raw: str | None) -> list[str]:
    """Split a delimited skill list into normalized tokens."""
    if not raw:
        return []
    separators = [",", "|", ";"]
    value = raw
    for sep in separators:
        value = value.replace(sep, " ")
    return [item.strip() for item in value.split() if item.strip()]
