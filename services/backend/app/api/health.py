from fastapi import APIRouter
from app.schemas.response import HealthResponse
from app.core.config import settings
from app.services.chroma_service import db

router = APIRouter()

@router.get("/health", response_model=HealthResponse)
def health_check():
    """Health check endpoint returning system status and vector DB metrics."""
    try:
        count = db.count()
    except Exception:
        count = 0
        
    return HealthResponse(
        status="healthy",
        version=settings.VERSION,
        chroma_count=count,
        gemini_configured=bool(settings.GOOGLE_API_KEY)
    )
