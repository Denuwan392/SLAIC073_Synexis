import os
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from app.core.config import settings
from app.api import ask, schedules, train_tracking, health
from app.services.chroma_service import init_chroma_db

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Lifespan event handler for startup database initialization."""
    print("Starting Synexis Backend Service...")
    init_chroma_db()
    yield

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="Synexis AI Transport API for Sri Lanka buses & trains",
    lifespan=lifespan
)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API Routers
app.include_router(ask.router, tags=["Agent"])
app.include_router(schedules.router, tags=["Schedules"])
app.include_router(train_tracking.router, tags=["Train Tracking"])
app.include_router(health.router, tags=["System"])

# Mount Web Application static files if present
base_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))
web_dir = os.path.join(base_dir, "apps", "web")
if os.path.exists(web_dir) and os.path.exists(os.path.join(web_dir, "index.html")):
    app.mount("/", StaticFiles(directory=web_dir, html=True), name="web")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
