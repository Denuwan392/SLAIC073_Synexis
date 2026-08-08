# Synexis API Contracts

The Synexis FastAPI Backend exposes the following canonical endpoints consumed by Web and Mobile applications:

---

## 1. Primary AI Agent Query

* **Endpoint:** `POST /ask`
* **Consumer:** Web UI (`apps/web`), Mobile UI (`apps/mobile/src/services/api.ts`)
* **Request Body:**
  ```json
  {
    "query": "What time is the bus from Colombo to Kandy?"
  }
  ```
* **Response Body:**
  ```json
  {
    "original_query": "What time is the bus from Colombo to Kandy?",
    "detected_language": "en",
    "travel_legs": [],
    "final_answer": "🚌 **Bus Schedules (Colombo to Kandy):**\n• 01-1 (Luxury) - Departs 05:00, Arrives 08:15...",
    "errors": []
  }
  ```

---

## 2. Schedule Search Endpoint

* **Endpoint:** `GET /schedules?query={query}`
* **Consumer:** Mobile UI (`apps/mobile/src/services/api.ts`)
* **Response Body:**
  ```json
  {
    "query": "Colombo",
    "passages": ["ROUTE: 01 - Colombo to Kandy | Departs: 05:00..."],
    "answer": "Formatted text response...",
    "results_count": 5
  }
  ```

---

## 3. Train Tracking Endpoint

* **Endpoint:** `GET /train-tracking/{train_id}`
* **Consumer:** Mobile UI (`apps/mobile/src/services/api.ts`)
* **Response Body:**
  ```json
  {
    "train_id": "T001",
    "train_name": "Udarata Menike",
    "status": "🚆 Live Status for T001: Running on time",
    "is_live": true
  }
  ```

---

## 4. System Health Endpoint

* **Endpoint:** `GET /health`
* **Response Body:**
  ```json
  {
    "status": "healthy",
    "version": "1.0.0",
    "chroma_count": 450,
    "gemini_configured": true
  }
  ```
