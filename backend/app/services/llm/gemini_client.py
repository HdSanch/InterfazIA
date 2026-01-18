from __future__ import annotations
from typing import List
from google import genai
from app.core.config import settings


class GeminiClient:
    def __init__(self) -> None:
        self.client = genai.Client(api_key=settings.GEMINI_API_KEY)

    def embed(self, texts: List[str], batch_size: int = 100) -> List[List[float]]:
        all_embeddings: List[List[float]] = []

        for i in range(0, len(texts), batch_size):
            batch = texts[i : i + batch_size]

            out = self.client.models.embed_content(
                model=settings.GEMINI_EMBED_MODEL,
                contents=batch,
            )

            all_embeddings.extend([e.values for e in out.embeddings])

        return all_embeddings



    def generate(self, prompt: str) -> str:
        resp = self.client.models.generate_content(
            model=settings.GEMINI_MODEL,
            contents=prompt,
        )
        return resp.text or ""
