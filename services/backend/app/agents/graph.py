from langgraph.graph import StateGraph, END
from app.agents.nodes import TransportState, router_node, realtime_train_node, rag_node, translator_node

def route_decision(state: TransportState) -> str:
    if state.get("needs_realtime"):
        return "realtime_train"
    return "rag"

workflow = StateGraph(TransportState)

workflow.add_node("router", router_node)
workflow.add_node("realtime_train", realtime_train_node)
workflow.add_node("rag", rag_node)
workflow.add_node("translator", translator_node)

workflow.set_entry_point("router")

workflow.add_conditional_edges(
    "router",
    route_decision,
    {
        "realtime_train": "realtime_train",
        "rag": "rag"
    }
)

# If realtime train node decides it cannot handle live request, route to RAG
def realtime_check(state: TransportState) -> str:
    if state.get("is_handled"):
        return "translator"
    return "rag"

workflow.add_conditional_edges(
    "realtime_train",
    realtime_check,
    {
        "translator": "translator",
        "rag": "rag"
    }
)

workflow.add_edge("rag", "translator")
workflow.add_edge("translator", END)

transport_graph = workflow.compile()
