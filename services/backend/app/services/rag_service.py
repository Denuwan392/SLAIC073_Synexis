import json
import re
from typing import List, Dict, Any
from google import genai
from app.core.config import settings
from app.services.chroma_service import db, embedding_fn

# Initialize GenAI client if key exists
def get_genai_client():
    if settings.GOOGLE_API_KEY:
        return genai.Client(api_key=settings.GOOGLE_API_KEY)
    return None

def retrieve_routes(query: str, top_k: int = 10) -> List[str]:
    """Perform Directional Hybrid RAG Search with strict transit mode isolation (train vs bus)."""
    from app.data.documents import documents
    
    query_clean = query.lower()
    is_train_query = "train" in query_clean
    is_bus_query = "bus" in query_clean or "buses" in query_clean
    
    passages = []
    
    known_locations = [
        "colombo", "matara", "galle", "kandy", "jaffna", "trincomalee", 
        "badulla", "anuradhapura", "kegalle", "mahiyanganaya", "kurunegala",
        "negombo", "fort", "monaragala"
    ]
    found_locations = [loc for loc in known_locations if loc in query_clean]
    
    # 1. Mode-filtered location search (e.g. Kandy + Bus)
    if found_locations:
        loc_matches = []
        for doc in documents:
            for line in doc.split("\n"):
                line_clean = line.strip()
                if not line_clean:
                    continue
                line_lower = line_clean.lower()
                
                # Strict Mode Isolation
                if is_train_query and "train" not in line_lower:
                    continue
                if is_bus_query and "bus" not in line_lower:
                    continue
                    
                if all(loc in line_lower for loc in found_locations):
                    if line_clean not in loc_matches:
                        loc_matches.append(line_clean)
                        if len(loc_matches) >= top_k:
                            break
            if len(loc_matches) >= top_k:
                break
        passages.extend(loc_matches)

    # 2. Vector Search Fallback (with mode filtering)
    if len(passages) < top_k:
        try:
            embedding_fn.document_mode = False
            query_embedding = embedding_fn([query])[0]
            results = db.query(
                query_embeddings=[query_embedding],
                n_results=top_k * 2
            )
            if results and results.get("documents") and len(results["documents"]) > 0:
                for vec_doc in results["documents"][0]:
                    vec_lower = vec_doc.lower()
                    if is_train_query and "train" not in vec_lower:
                        continue
                    if is_bus_query and "bus" not in vec_lower:
                        continue
                    if vec_doc not in passages:
                        passages.append(vec_doc)
                        if len(passages) >= top_k:
                            break
        except Exception as e:
            print(f"Error querying ChromaDB: {e}")

    return passages[:top_k]

def classify_query(query: str) -> Dict[str, Any]:
    """Classify language and transit intent using Gemini."""
    client = get_genai_client()
    if not client:
        return {
            "is_transport_query": True,
            "detected_language": "en",
            "needs_realtime": "train" in query.lower(),
            "route_mentioned": None
        }

    prompt = f"""
Analyze the transport query and return strict JSON format only.

QUERY: {query}

JSON Output Format:
{{
    "is_transport_query": true/false,
    "detected_language": "en"/"si"/"ta",
    "needs_realtime": true/false,
    "route_mentioned": "Colombo to Kandy" (or null)
}}
"""
    try:
        response = client.models.generate_content(
            model=settings.GEMINI_MODEL,
            contents=prompt
        )
        raw = response.text.strip()
        clean = re.sub(r"^```(json)?|```$", "", raw, flags=re.MULTILINE).strip()
        return json.loads(clean)
    except Exception as e:
        print(f"Query classification error: {e}")
        return {
            "is_transport_query": True,
            "detected_language": "en",
            "needs_realtime": "train" in query.lower(),
            "route_mentioned": None
        }

def format_passage_clean(p: str) -> str:
    """Format raw dataset passage into clean structured schedule block."""
    p_clean = p.strip()
    # Replace dots between fields with newlines and clean arrows
    parts = [part.strip() for part in p_clean.split(".") if part.strip()]
    
    title = ""
    route = ""
    dep = ""
    arr = ""
    stops = ""
    service = ""
    
    for part in parts:
        part_lower = part.lower()
        if part_lower.startswith("train:") or part_lower.startswith("bus:"):
            title = part.split(":", 1)[1].strip()
        elif part_lower.startswith("route:"):
            route = part.split(":", 1)[1].strip().replace(" to ", " ➔ ")
        elif part_lower.startswith("departs:"):
            dep = part.split(":", 1)[1].strip()
        elif part_lower.startswith("arrives:"):
            arr = part.split(":", 1)[1].strip()
        elif part_lower.startswith("stops:"):
            stops = part.split(":", 1)[1].strip()
        elif part_lower.startswith("service:"):
            service = part.split(":", 1)[1].strip()

    lines = []
    if title:
        lines.append(f"📌 {title}")
    if route:
        lines.append(f"   Route: {route}")
    if dep or arr:
        time_str = f"   Departs: {dep}" if dep else ""
        if arr:
            time_str += f" | Arrives: {arr}" if dep else f"   Arrives: {arr}"
        lines.append(time_str)
    if service:
        lines.append(f"   Service: {service}")
    if stops:
        lines.append(f"   Stops: {stops}")

    if not lines:
        return f"• {p_clean}"
    return "\n".join(lines)

def generate_transport_answer(query: str, passages: List[str]) -> str:
    """Synthesize natural language answer for buses and trains using retrieved passages."""
    query_clean = query.lower()
    is_bus = "bus" in query_clean or "buses" in query_clean
    is_train = "train" in query_clean or "trains" in query_clean

    # Filter passages strictly to requested mode
    if is_bus:
        passages = [p for p in passages if "bus" in p.lower()]
    elif is_train:
        passages = [p for p in passages if "train" in p.lower()]

    client = get_genai_client()
    if not client:
        if passages:
            blocks = [format_passage_clean(p) for p in passages[:5]]
            header = "🚆 Sri Lanka Railway Schedules" if is_train else "🚌 Sri Lanka Transit Bus Schedules"
            return f"{header}\n\n" + "\n\n".join(blocks)
        return "Sorry, Google Gemini API key is not configured and vector DB returned no exact match."

    prompt = f"""
You are Synexis, a helpful Sri Lanka public transport assistant (buses and trains).
Use ONLY the passages below to answer the user question.

RULES & FORMATTING:
- If user asks for "buses" → list ONLY bus options. Do NOT list trains.
- If user asks for "trains" → list ONLY train options. Do NOT list buses.
- Output each schedule item in a clean structured format:
  📌 [Train Name / Bus Number]
  • Route: [Origin] ➔ [Destination]
  • Departs: [Departure Time] | Arrives: [Arrival Time]
  • Stops: [Key Stops]
- Do NOT produce long unbroken paragraphs of text.
- Leave double line breaks between separate schedule entries.

QUESTION: {query}
"""
    for i, passage in enumerate(passages, 1):
        passage_oneline = passage.replace("\n", " ")
        prompt += f"\nPASSAGE {i}: {passage_oneline}"

    try:
        response = client.models.generate_content(
            model=settings.GEMINI_MODEL,
            contents=prompt
        )
        return response.text
    except Exception as e:
        print(f"Answer generation error: {e}")
        if passages:
            blocks = [format_passage_clean(p) for p in passages[:5]]
            header = "🚆 **Sri Lanka Railway Schedules**" if is_train else "🚌 **Sri Lanka Transit Bus Schedules**"
            return f"{header}\n\n" + "\n\n".join(blocks)
        return "Sorry, transit service is temporarily busy. Please try again in a moment."

def translate_response(text: str, target_lang: str) -> str:
    """Translate answer to target language (si/ta)."""
    if target_lang not in ["si", "ta"]:
        return text
        
    client = get_genai_client()
    if not client:
        return text

    lang_name = "Sinhala" if target_lang == "si" else "Tamil"
    prompt = f"""
Translate the following Sri Lanka transport information accurately into {lang_name}.
Keep formatting, emojis, bus/train numbers, and schedule times EXACTLY as they are.

TEXT TO TRANSLATE:
{text}
"""
    try:
        response = client.models.generate_content(
            model=settings.GEMINI_MODEL,
            contents=prompt
        )
        return response.text.strip()
    except Exception as e:
        print(f"Translation error: {e}")
        return text
