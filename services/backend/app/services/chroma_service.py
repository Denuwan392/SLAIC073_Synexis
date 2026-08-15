import os
import re
import time
from typing import List, Dict, Any
import chromadb
from chromadb.api.types import EmbeddingFunction, Documents, Embeddings
from google import genai
from google.genai import types

from app.core.config import settings
from app.data.documents import documents

class GeminiEmbeddingFunction(EmbeddingFunction):
    """Custom ChromaDB Embedding Function using Google GenAI SDK with batching."""
    def __init__(self, api_key: str = None):
        super().__init__()
        self.api_key = api_key or settings.GOOGLE_API_KEY
        self.client = genai.Client(api_key=self.api_key) if self.api_key else None
        self.document_mode = True

    def __call__(self, input: Documents) -> Embeddings:
        dim = 3072
        if not self.client:
            return [[0.0] * dim for _ in input]
            
        batch_size = 50
        all_embeddings = []

        for i in range(0, len(input), batch_size):
            batch = input[i:i + batch_size]
            task = "retrieval_document" if self.document_mode else "retrieval_query"
            success = False
            
            for attempt in range(3):
                try:
                    response = self.client.models.embed_content(
                        model=settings.EMBEDDING_MODEL,
                        contents=batch,
                        config=types.EmbedContentConfig(task_type=task),
                    )
                    batch_embeddings = [e.values for e in response.embeddings]
                    all_embeddings.extend(batch_embeddings)
                    success = True
                    break
                except Exception as e:
                    if "429" in str(e) or "RESOURCE_EXHAUSTED" in str(e):
                        time.sleep(2 * (attempt + 1))
                    else:
                        print(f"Error embedding batch {i} to {i + len(batch)}: {e}")
                        break
            
            if not success:
                for _ in batch:
                    all_embeddings.append([0.0] * dim)

        return all_embeddings

def parse_route_document(doc_text: str) -> List[Dict[str, Any]]:
    """Parse raw route documents into structured chunks with metadata."""
    chunks = []
    lines = doc_text.split("\n")
    route_no, start_dest, via = "", "", ""

    for line in lines:
        line_clean = line.strip()
        if not line_clean:
            continue
            
        line_upper = line_clean.upper()
        if line_upper.startswith("ROUTE:") and " - " in line_clean:
            parts = line_clean.split(" - ")
            route_no = parts[0].split(":", 1)[1].strip()
            if len(parts) > 1:
                start_dest = parts[1].strip()
        elif line_upper.startswith("VIA:"):
            via = line_clean.split(":", 1)[1].strip()
        elif "DEPARTS:" in line_upper or "ROUTE:" in line_upper or "BUS:" in line_upper or "TRAIN:" in line_upper:
            meta = {
                "route_no": route_no,
                "start_dest": start_dest,
                "via": via,
                "full_text": line_clean,
            }
            prefix = f"{route_no} {start_dest} via {via} | ".strip() if route_no else ""
            chunks.append({"text": f"{prefix}{line_clean}", "metadata": meta})
    return chunks

# Initialize persistent ChromaDB client
chroma_client = chromadb.PersistentClient(path=settings.CHROMA_PERSIST_DIR)
embedding_fn = GeminiEmbeddingFunction()

db = chroma_client.get_or_create_collection(
    name="sri_lanka_transport",
    embedding_function=embedding_fn
)

def init_chroma_db():
    """Build or load ChromaDB. Skips re-indexing if vector DB is already populated."""
    global db
    try:
        try:
            current_count = db.count()
        except Exception:
            chroma_client.delete_collection("sri_lanka_transport")
            db = chroma_client.get_or_create_collection(
                name="sri_lanka_transport",
                embedding_function=embedding_fn
            )
            current_count = 0

        print(f"Chroma DB status: {current_count} documents indexed.")
        if current_count == 0:
            print("Building Chroma DB from documents.py...")
            all_chunks = []
            for doc in documents:
                chunks = parse_route_document(doc)
                all_chunks.extend(chunks)

            if all_chunks:
                batch_size = 50
                ids = [f"chunk_{i}" for i in range(len(all_chunks))]
                texts = [c["text"] for c in all_chunks]
                metadatas = [c["metadata"] for c in all_chunks]

                for i in range(0, len(all_chunks), batch_size):
                    end_idx = min(i + batch_size, len(all_chunks))
                    db.add(
                        documents=texts[i:end_idx],
                        metadatas=metadatas[i:end_idx],
                        ids=ids[i:end_idx]
                    )
                print(f"Successfully built Chroma DB with {len(all_chunks)} chunks.")
            else:
                print("No document chunks parsed.")
        else:
            print("Existing Chroma DB loaded cleanly.")
    except Exception as e:
        print(f"Warning during Chroma DB initialization: {e}")
