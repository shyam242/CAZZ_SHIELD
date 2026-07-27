"""
CAZZ SHIELD — Configuration
Enterprise AI Governance Platform
"""
from pydantic import field_validator
from pydantic_settings import BaseSettings
from typing import Optional
import os


class Settings(BaseSettings):
    # Application
    APP_NAME: str = "Cazz Shield"
    APP_VERSION: str = "2.0.0"
    APP_DESCRIPTION: str = "Enterprise AI Governance Platform — Autonomous Governance & Self-Healing Control Plane for Financial AI Agents"
    DEBUG: bool = True
    
    # Server
    HOST: str = "0.0.0.0"
    PORT: int = 8000
    
    # Database
    DATABASE_URL: str = "sqlite+aiosqlite:///./cazz_shield.db"
    DATABASE_SYNC_URL: str = "sqlite:///./cazz_shield.db"
    
    # Redis
    REDIS_URL: str = "redis://localhost:6379/0"
    
    # JWT
    JWT_SECRET_KEY: str = "cazz-shield-enterprise-secret-key-change-in-production-2026"
    JWT_ALGORITHM: str = "HS256"
    JWT_ACCESS_TOKEN_EXPIRE_MINUTES: int = 480
    JWT_REFRESH_TOKEN_EXPIRE_DAYS: int = 7
    
    # CORS
    CORS_ORIGINS: list[str] = ["http://localhost:5173", "http://localhost:3000", "http://localhost:80"]

    @field_validator("CORS_ORIGINS", mode="before")
    def parse_cors_origins(cls, value):
        if isinstance(value, str):
            return [origin.strip() for origin in value.split(",") if origin.strip()]
        return value
    
    # Trust Engine Parameters (from PRD)
    TRUST_ALPHA: float = 0.05    # Success weight
    TRUST_BETA: float = 0.03     # Human approval weight
    TRUST_GAMMA: float = 0.15    # Violation penalty weight
    TRUST_DELTA: float = 0.08    # Anomaly penalty weight
    TRUST_DECAY_RATE: float = 0.001  # Time-based decay per hour
    TRUST_MIN_OBSERVATIONS: int = 30  # N_min for confidence
    TRUST_DEFAULT: float = 0.50  # Initial trust score
    
    # Budget Engine Parameters (from PRD)
    BUDGET_FLOOR_MULTIPLIER: float = 0.05   # 5% of base
    BUDGET_CEILING_MULTIPLIER: float = 1.50  # 150% of base
    
    # Emergency
    EMERGENCY_MODE: bool = False
    
    # Pagination
    DEFAULT_PAGE_SIZE: int = 25
    MAX_PAGE_SIZE: int = 100
    
    class Config:
        env_file = ".env"
        case_sensitive = True


settings = Settings()
