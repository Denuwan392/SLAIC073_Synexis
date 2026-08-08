# 🚌 Synexis — Smart Public Transit AI Platform for Sri Lanka

Synexis is an industry-standard, multi-modal artificial intelligence platform providing real-time bus and train schedule recommendations, route planning, and live tracking across Sri Lanka.

---

## 🌟 Architecture

```text
       Web UI
         │
         ▼
  FastAPI Backend
         │
   AI / RAG / LangGraph
         │
      ChromaDB
         │
    Transport Data
```

---

## 📦 Applications

* **Web (`apps/web`)** — **Included.** Fully functional responsive web application built with Tailwind CSS and Vanilla JavaScript.
* **Mobile** — **Planned.** The mobile application (Expo / React Native) is maintained separately by team member Dhananjaya Chamod and will be integrated into the monorepo in a future release.

---

## 🚀 Quick Start

### 1. Environment Setup

Copy `.env.example` to `.env` and insert your Google Gemini API key:

```bash
cp .env.example .env
```

### 2. Backend Local Setup (Python 3.12)

```bash
cd services/backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
python app/main.py
```

API server starts on `http://localhost:8000`. Access Swagger UI docs at `http://localhost:8000/docs`.

### 3. Web Application Setup

To run the web application locally:

```bash
cd apps/web
npm start
```

Or simply open `apps/web/index.html` in your browser. It automatically connects to `http://localhost:8000/ask`.

### 4. Running via Docker Compose

```bash
docker-compose up --build
```

---

## 🧪 Testing

Run the pytest suite for the backend:

```bash
cd services/backend
pytest
```

---

## 📲 Mobile Integration

The mobile application is maintained in a separate repository by developer Dhananjaya Chamod. The backend provides full REST API contracts (`/ask`, `/schedules`, `/train-tracking/{id}`) ready for seamless mobile client consumption upon final release integration.

---

## 👥 Development & Contributors

* **Denuwan Wijesinghe** — Lead AI Agent & RAG Pipeline Developer
* **Dhananjaya Chamod** — Mobile Application Developer (Separate Repository)

See [docs/development/contributors.md](docs/development/contributors.md) for details.
