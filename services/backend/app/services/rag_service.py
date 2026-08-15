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
    """Perform Directional Hybrid RAG Search (exact route matches + ChromaDB vector search)."""
    from app.data.documents import documents
    
    query_clean = query.lower()
    passages = []
    
    # 1. Directional phrase search (e.g. "colombo to matara", "matara to colombo")
    phrase_matches = []
    for doc in documents:
        for line in doc.split("\n"):
            line_clean = line.strip()
            if not line_clean:
                continue
            if query_clean in line_clean.lower():
                phrase_matches.append(line_clean)
                if len(phrase_matches) >= top_k:
                    break
        if len(phrase_matches) >= top_k:
            break
            
    if phrase_matches:
        passages.extend(phrase_matches)

    # 2. Location-based matching if exact phrase returned fewer results
    if len(passages) < top_k:
        known_locations = [
            "colombo", "matara", "galle", "kandy", "jaffna", "trincomalee", 
            "badulla", "anuradhapura", "kegalle", "mahiyanganaya", "kurunegala",
            "negombo", "fort", "monaragala"
        ]
        found_locations = [loc for loc in known_locations if loc in query_clean]
        
        if found_locations:
            loc_matches = []
            for doc in documents:
                for line in doc.split("\n"):
                    line_clean = line.strip()
                    if not line_clean:
                        continue
                    line_lower = line_clean.lower()
                    if all(loc in line_lower for loc in found_locations):
                        if line_clean not in passages and line_clean not in loc_matches:
                            loc_matches.append(line_clean)
                            if len(passages) + len(loc_matches) >= top_k:
                                break
                if len(passages) + len(loc_matches) >= top_k:
                    break
            passages.extend(loc_matches)

    # 3. ChromaDB Vector Search Fallback
    if len(passages) < top_k:
        try:
            embedding_fn.document_mode = False
            query_embedding = embedding_fn([query])[0]
            results = db.query(
                query_embeddings=[query_embedding],
                n_results=top_k
            )
            if results and results.get("documents") and len(results["documents"]) > 0:
                for vec_doc in results["documents"][0]:
                    if vec_doc not in passages:
                        passages.append(vec_doc)
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

def generate_transport_answer(query: str, passages: List[str]) -> str:
    """Synthesize natural language answer for buses and trains using retrieved passages."""
    client = get_genai_client()
    if not client:
        if passages:
            return "Here are matching schedules:\n" + "\n".join([f"• {p}" for p in passages[:5]])
        return "Sorry, Google Gemini API key is not configured and vector DB returned no exact match."

    prompt = f"""
You are Synexis, a helpful Sri Lanka public transport assistant (buses and trains).
Use ONLY the passages below to answer the user question.

RULES:
- Answer questions about BOTH buses AND trains based on the provided passages.
- List ALL matching bus services (Express, Luxury, Normal, Intercity, etc.) and trains found in the passages.
- For trains: Show train name/number, departure, arrival, and stops if available.
- For buses: Show bus number, service type, departure, and arrival times.
- Format output clearly with headings, bullet points, and emojis (🚌, 🚆, ⏱️).
- Include travel time and service frequency if available in passages.

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
            formatted = "\n".join([f"• {p.strip()}" for p in passages[:6]])
            return f"🚌 **Sri Lanka Transit Schedule Information:**\n\n{formatted}"
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
