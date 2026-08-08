import traceback
from fastapi import APIRouter, HTTPException
from app.schemas.request import QueryRequest
from app.schemas.response import AgentResponse
from app.agents.graph import transport_graph
from app.agents.nodes import TransportState

router = APIRouter()

@router.post("/ask", response_model=AgentResponse)
def ask_transport_agent(request: QueryRequest):
    """Primary endpoint for AI agent query resolution."""
    try:
        initial_state: TransportState = {
            "original_query": request.query,
            "detected_language": "en",
            "is_transport_query": True,
            "needs_realtime": False,
            "route_mentioned": None,
            "retrieved_passages": [],
            "final_answer": "",
            "is_handled": False,
        }

        try:
            result = transport_graph.invoke(initial_state)
        except Exception as graph_error:
            print(f"Graph execution error: {graph_error}")
            traceback.print_exc()
            return AgentResponse(
                original_query=request.query,
                detected_language="en",
                travel_legs=[],
                final_answer=f"Sorry, I encountered an error processing your query: {str(graph_error)}",
                errors=[str(graph_error)]
            )

        return AgentResponse(
            original_query=result.get("original_query", request.query),
            detected_language=result.get("detected_language", "en"),
            travel_legs=[],
            final_answer=result.get("final_answer", "No answer generated."),
            errors=[]
        )
    except Exception as e:
        print(f"Outer exception in ask_transport_agent: {e}")
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"Agent error: {str(e)}")
