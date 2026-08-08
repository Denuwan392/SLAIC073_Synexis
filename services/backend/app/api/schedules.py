from fastapi import APIRouter, Query, HTTPException
from typing import Optional, Dict, Any, List
from app.services.rag_service import retrieve_routes, generate_transport_answer

router = APIRouter()

@router.get("/schedules")
def get_schedules(query: str = Query(..., description="Query route or destination")):
    """Endpoint expected by Mobile client: GET /schedules?query=..."""
    try:
        passages = retrieve_routes(query, top_k=5)
        formatted_answer = generate_transport_answer(query, passages)
        return {
            "query": query,
            "passages": passages,
            "answer": formatted_answer,
            "results_count": len(passages)
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
