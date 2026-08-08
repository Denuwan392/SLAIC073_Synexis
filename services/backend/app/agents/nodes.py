from typing import TypedDict, List, Optional
from app.services.rag_service import classify_query, retrieve_routes, generate_transport_answer, translate_response
from app.services.train_service import get_realtime_train_status

class TransportState(TypedDict):
    original_query: str
    detected_language: str
    is_transport_query: bool
    needs_realtime: bool
    route_mentioned: Optional[str]
    retrieved_passages: List[str]
    final_answer: str
    is_handled: bool

def router_node(state: TransportState) -> TransportState:
    classification = classify_query(state["original_query"])
    return {
        **state,
        "is_transport_query": classification.get("is_transport_query", True),
        "detected_language": classification.get("detected_language", "en"),
        "needs_realtime": classification.get("needs_realtime", False),
        "route_mentioned": classification.get("route_mentioned"),
    }

def realtime_train_node(state: TransportState) -> TransportState:
    route = state.get("route_mentioned") or state["original_query"]
    status_msg = get_realtime_train_status(route)
    if "unavailable" in status_msg.lower() or "http" in status_msg.lower():
        # Fall back to RAG if live train API fails
        return {
            **state,
            "needs_realtime": False,
            "is_handled": False
        }
    return {
        **state,
        "final_answer": status_msg,
        "is_handled": True
    }

def rag_node(state: TransportState) -> TransportState:
    passages = retrieve_routes(state["original_query"], top_k=5)
    answer = generate_transport_answer(state["original_query"], passages)
    return {
        **state,
        "retrieved_passages": passages,
        "final_answer": answer,
        "is_handled": True
    }

def translator_node(state: TransportState) -> TransportState:
    lang = state.get("detected_language", "en")
    if lang in ["si", "ta"] and state.get("final_answer"):
        translated = translate_response(state["final_answer"], lang)
        return {**state, "final_answer": translated}
    return state
