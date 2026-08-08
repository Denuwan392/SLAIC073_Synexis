# 🚌 Synexis — Smart Public Transit AI Platform for Sri Lanka

[![Python 3.12](https://img.shields.io/badge/Python-3.12-blue.svg)](https://www.python.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.110+-green.svg)](https://fastapi.tiangolo.com/)
[![LangGraph](https://img.shields.io/badge/LangGraph-Agent Framework-orange.svg)](https://github.com/langchain-ai/langgraph)
[![ChromaDB](https://img.shields.io/badge/ChromaDB-Vector Store-purple.svg)](https://www.trychroma.com/)
[![Gemini AI](https://img.shields.io/badge/Google Gemini-2.5 Flash Lite-cyan.svg)](https://ai.google.dev/)

**Synexis** is an industry-standard, AI-powered public transportation assistant for Sri Lanka. It combines Retrieval-Augmented Generation (RAG), vector similarity search, and LangGraph agent orchestration to provide intelligent, multi-lingual bus and train schedule recommendations, route planning, and live tracking.

---

## 🌟 Key Features

* **🚌 Bus & 🚆 Train Multi-Modal Search:** Seamless coverage of island-wide bus routes (Express, Normal, Luxury) and Sri Lanka Railways train schedules.
* **🌐 Trilingual Natural Language Support:** Native query understanding and response synthesis in **Sinhala**, **Tamil**, and **English**.
* **🤖 LangGraph Agent State Machine:** Intelligent routing between static schedule RAG lookup, query language classification, response translation, and live tracking APIs.
* **⚡ Persistent ChromaDB Vector Store:** Fast semantic similarity search over curated Sri Lankan transit schedules without slow startup re-indexing.
* **💻 Web Frontend Application:** Modern, responsive single-page web interface (`apps/web`) with markdown rendering and dynamic API host resolution.
* **📲 Mobile API Readines:** Clean REST API endpoints ready for direct consumption by mobile clients (`apps/mobile`).

---

## 🏗️ Monorepo Architecture

```text
synexis/
├── apps/
│   └── web/                   # Web Application (Tailwind CSS, Vanilla JS, marked.js)
├── services/
│   └── backend/               # Modular FastAPI Backend
│       ├── app/
│       │   ├── api/           # Endpoint Routers (/ask, /schedules, /train-tracking, /health)
│       │   ├── core/          # Pydantic Settings & Configuration
│       │   ├── agents/        # LangGraph State Machine Graph & Reasoning Nodes
│       │   ├── services/      # RAG Pipeline, ChromaDB Vector Service & Train API Client
│       │   ├── schemas/       # Request & Response Data Models
│       │   ├── data/          # Transport Schedule Dataset (documents.py)
│       │   └── main.py        # FastAPI Application Entry Point
│       ├── tests/             # Pytest Test Suite
│       ├── requirements.txt   # Backend Dependencies
│       └── Dockerfile         # Container Image Build Specification
├── docs/
│   ├── architecture/          # Architectural Overview & System Blueprints
│   ├── api/                   # REST API Contract Specifications
│   └── development/           # Contributor Guidelines & Developer Notes
├── infrastructure/            # Docker & Infrastructure Configurations
├── .env.example               # Environment Variable Template (No Secrets Tracked)
├── docker-compose.yml         # Container Orchestration Specification
└── README.md                  # Project Documentation
```

---

## 🔌 API Endpoints Contract

The backend exposes 4 production endpoints:

| Method | Endpoint | Description | Sample Payload / Query |
| :--- | :--- | :--- | :--- |
| `POST` | `/ask` | Primary AI Agent Query Pipeline | `{"query": "What time is the bus from Colombo to Kandy?"}` |
| `GET` | `/schedules` | Vector RAG Schedule Search | `/schedules?query=Colombo+to+Galle` |
| `GET` | `/train-tracking/{train_id}` | Live Train Status or RAG Fallback | `/train-tracking/T001` |
| `GET` | `/health` | System Health & Vector Count | Returns status, version, and Chroma count |

Full interactive API documentation is served at `http://localhost:8000/docs` (Swagger UI).

---

## 🚀 Quick Start

### 1. Environment Setup

Copy `.env.example` to `.env` and insert your Google Gemini API key:

```bash
cp .env.example .env
```

Edit `.env`:
```env
GOOGLE_API_KEY=your_actual_gemini_api_key_here
GEMINI_MODEL=gemini-2.5-flash-lite
```

### 2. Backend Setup (Python 3.12)

```bash
cd services/backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
python app/main.py
```

The backend server starts at `http://localhost:8000`.

### 3. Web Application Setup

To run the web app static server:

```bash
cd apps/web
npm start
```

Alternatively, open `apps/web/index.html` directly in your web browser, or access `http://localhost:8000/` (mounted automatically by FastAPI).

### 4. Running with Docker Compose

```bash
docker-compose up --build
```

---

## 🧪 Running Automated Tests

Run the backend test suite:

```bash
cd services/backend
source .venv/bin/activate
pytest
```

---

## 📲 Mobile Integration Note

The mobile application (built with Expo & React Native) is maintained in a separate repository by developer Dhananjaya Chamod (`dhananjaya-hbc/transport-app`). The backend API contracts (`/ask`, `/schedules`, `/train-tracking/{train_id}`) are fully implemented and ready for mobile client integration in a future release.

---

## 👥 Contributors

* **Denuwan Wijesinghe** (`Denuwan392`) — Lead AI Agent & RAG Pipeline Developer
* **Dhananjaya Chamod** (`dhananjaya-hbc`) — Mobile Application Developer (Separate Repository)

See [docs/development/contributors.md](docs/development/contributors.md) for full project history and attribution.
