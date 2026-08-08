from pydantic import BaseModel
from typing import List, Dict, Any, Optional

class TravelLeg(BaseModel):
    mode: str
    route: str
    departure: str
    arrival: str
    details: Optional[Dict[str, Any]] = None

class AgentResponse(BaseModel):
    original_query: str
    detected_language: str = "en"
    travel_legs: List[TravelLeg] = []
    final_answer: str
    errors: List[str] = []

class HealthResponse(BaseModel):
    status: str
    version: str
    chroma_count: int
    gemini_configured: bool
