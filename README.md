# 🚌 Synexis — Smart Public Transit AI Platform for Sri Lanka

Synexis is an industry-standard, multi-modal artificial intelligence platform providing real-time bus and train schedule recommendations, route planning, and live tracking across Sri Lanka.

---

## 🌟 Monorepo Architecture

```text
synexis/
├── apps/
│   ├── web/               # Single-page HTML/JS Web Application (Tailwind CSS)
│   └── mobile/            # Expo React Native & TypeScript Mobile Application
├── services/
│   └── backend/           # Modular FastAPI + LangGraph + ChromaDB + Google Gemini AI
├── docs/
│   ├── architecture/      # Architectural blueprints & sequence diagrams
│   ├── api/               # API specs & consumer contract definitions
│   └── development/       # Contributor acknowledgments & setup guides
├── infrastructure/        # Docker & deployment configurations
├── .env.example           # Environment template (NO hardcoded secrets)
├── docker-compose.yml     # Container orchestration
└── README.md
```

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

To run the web app locally:

```bash
cd apps/web
npm start
```

Or simply open `apps/web/index.html` in your browser. It automatically connects to `http://localhost:8000/ask`.

### 4. Mobile Application Setup (Expo / React Native)

```bash
cd apps/mobile
npm install
npm start
```

Use the Expo Go app on iOS/Android or press `a` for Android Emulator / `i` for iOS Simulator.

### 5. Running via Docker Compose

```bash
docker-compose up --build
```

---

## 🧪 Testing

Run pytest suite for the backend:

```bash
cd services/backend
pytest
```

---

## 👥 Contributors

* **Denuwan Wijesinghe** — Lead AI Agent & RAG Pipeline Developer
* **Dhananjaya Chamod** — Mobile Application (React Native / Expo) Developer

See [docs/development/contributors.md](docs/development/contributors.md) for full attribution.
