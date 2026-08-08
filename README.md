# 🚌 NEED TO GO — Smart Transit Companion

**Team:** SLAIC073_Synexis  
**Project:** NEED TO GO — AI-Driven Multi-Modal Mobility Assistant  

[![Python 3.12](https://img.shields.io/badge/Python-3.12-blue.svg)](https://www.python.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.110+-green.svg)](https://fastapi.tiangolo.com/)
[![LangGraph](https://img.shields.io/badge/LangGraph-Agent%20Framework-orange.svg)](https://github.com/langchain-ai/langgraph)
[![ChromaDB](https://img.shields.io/badge/ChromaDB-Vector%20Store-purple.svg)](https://www.trychroma.com/)
[![Gemini AI](https://img.shields.io/badge/Google%20Gemini-2.5%20Flash%20Lite-cyan.svg)](https://ai.google.dev/)

---

## 🌟 Overview

**NEED TO GO** is an AI-driven, multi-modal mobility assistant developed by **Team SLAIC073_Synexis**. The solution integrates Retrieval-Augmented Generation (RAG), vector similarity search, and LangGraph agent state-machines with a structured commercial business model to deliver intelligent, multi-lingual transit schedule recommendations, route planning, and live tracking across Sri Lanka.

---

## 🏗️ Architecture & Solution Flow

```text
       Web UI (apps/web)                Mobile Client (separate repo)
              │                                      │
              └──────────────────┬───────────────────┘
                                 │
                                 ▼
                          FastAPI Backend
                        (services/backend)
                                 │
                       AI / RAG / LangGraph
                                 │
                            ChromaDB
                                 │
                          Transport Data
```

---

## 👥 Team & Contributions

NEED TO GO is a team-developed solution bringing together technical engineering, AI system architecture, commercial strategy, financial modeling, and pitch execution:

### ⚙️ Denuwan Wijesinghe — AI / Backend / Systems Engineering
* System architecture design and technical implementation
* FastAPI backend architecture and modularization
* AI, RAG, and agentic system engineering (LangGraph & LangChain)
* ChromaDB vector pipeline & embedding integration
* Web application integration & REST API contract design
* Repository consolidation and engineering/deployment structure

### 📊 Vishmi Bulathsinhala — Business / Strategy / Pitching
* Pitching and presentation development
* Business and revenue model development
* Revenue strategy and commercial viability analysis
* Cost analysis, cost calculations, and financial modeling
* Cost optimization analysis

### 📈 Anjana Indrakeela — Business / Strategy / Pitching
* Pitching and presentation development
* Revenue model development
* Cost analysis and cost calculations
* Cost optimization strategy
* Contribution to the business and commercial strategy of the solution

### 📱 Dhananjaya Chamod — Mobile Engineering
* React Native / Expo mobile application development
* Mobile UI design and screen implementation
* Mobile application architecture
* Mobile-to-backend API client integration
* *(Maintained separately in `dhananjaya-hbc/transport-app`)*

For full details, see [docs/development/contributors.md](docs/development/contributors.md).

---

## 💡 Commercial Viability & Business Strategy

The NEED TO GO platform incorporates strategic commercial modeling:
* **Business & Revenue Model:** Multi-tiered monetization model covering consumer features and enterprise transit insights.
* **Cost Analysis & Optimization:** Detailed operational cost calculations balancing LLM token usage, vector database storage, and cloud container hosting.
* **Pitch Execution:** Strategic presentation aligning technical AI capabilities with market demands.

---

## 📱 Mobile Application Status

The mobile application is maintained separately by mobile development contributor Dhananjaya Chamod in [`dhananjaya-hbc/transport-app`](https://github.com/dhananjaya-hbc/transport-app). The backend provides full REST API contracts (`/ask`, `/schedules`, `/train-tracking/{id}`) ready for seamless mobile client integration upon final release.

---

## 🌟 Key Features

* **🚌 Bus & 🚆 Train Multi-Modal Search:** Island-wide bus routes (Express, Normal, Luxury) and Sri Lanka Railways train schedules.
* **🌐 Trilingual Natural Language Understanding:** Native query processing in **Sinhala**, **Tamil**, and **English**.
* **🤖 Agentic Routing:** LangGraph state machine routing between schedule search, language classification, response translation, and live tracking APIs.
* **⚡ Persistent Vector Store:** Fast semantic similarity search using ChromaDB without startup re-indexing overhead.
* **💻 Responsive Web App:** Single-page web interface (`apps/web`) with markdown rendering and dynamic API host resolution.

---

## 📦 Monorepo Structure

```text
synexis/
├── apps/
│   └── web/                   # Web Application (Tailwind CSS, Vanilla JS)
├── services/
│   └── backend/               # Modular FastAPI Backend
│       ├── app/
│       │   ├── api/           # Endpoints (/ask, /schedules, /train-tracking, /health)
│       │   ├── core/          # Pydantic Settings & Config
│       │   ├── agents/        # LangGraph State Machine Graph & Nodes
│       │   ├── services/      # RAG Pipeline, ChromaDB & Train API Service
│       │   ├── schemas/       # Request & Response Models
│       │   ├── data/          # Transport Dataset (documents.py)
│       │   └── main.py        # FastAPI Entry Point
│       ├── tests/             # Pytest Test Suite
│       ├── requirements.txt
│       └── Dockerfile
├── docs/
│   ├── architecture/          # Architecture Overview
│   ├── api/                   # REST API Specifications
│   └── development/           # Contributor Guidelines
├── infrastructure/            # Docker & Infrastructure Documentation
├── .env.example               # Environment Variables Template
├── docker-compose.yml         # Container Orchestration
└── README.md                  # Project Documentation
```

---

## 🚀 Quick Start

### 1. Environment Setup

Copy `.env.example` to `.env` and set your Gemini API key:

```bash
cp .env.example .env
```

### 2. Backend Setup (Python 3.12)

```bash
cd services/backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
python app/main.py
```

FastAPI server runs on `http://localhost:8000`. Access Swagger UI docs at `http://localhost:8000/docs`.

### 3. Web Application Setup

```bash
cd apps/web
npm start
```

Or open `apps/web/index.html` in your browser.

### 4. Running via Docker Compose

```bash
docker-compose up --build
```

---

## 🧪 Testing

Run pytest suite for the backend:

```bash
cd services/backend
source .venv/bin/activate
pytest
```
