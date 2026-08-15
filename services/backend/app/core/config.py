import os
from typing import Any
from pydantic import field_validator
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "Synexis Transport AI"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"
    
    # AI Config
    GOOGLE_API_KEY: str = os.getenv("GOOGLE_API_KEY", "")
    GEMINI_MODEL: str = os.getenv("GEMINI_MODEL", "gemini-flash-latest")
    EMBEDDING_MODEL: str = os.getenv("EMBEDDING_MODEL", "gemini-embedding-001")
    
    # Vector DB Config
    CHROMA_PERSIST_DIR: str = os.getenv("CHROMA_PERSIST_DIR", "chroma_db")
    
    # External APIs
    TRAIN_API_URL: str = os.getenv("TRAIN_API_URL", "http://localhost:4000/api/v1/trains")
    
    # CORS
    ALLOWED_ORIGINS: list[str] = ["*"]

    @field_validator("ALLOWED_ORIGINS", mode="before")
    @classmethod
    def parse_allowed_origins(cls, v: Any) -> list[str]:
        if isinstance(v, str):
            if v.startswith("[") and v.endswith("]"):
                import json
                try:
                    return json.loads(v)
                except Exception:
                    pass
            return [origin.strip() for origin in v.split(",") if origin.strip()]
        return v

    class Config:
        case_sensitive = True
        env_file = ".env"
        extra = "ignore"

settings = Settings()
