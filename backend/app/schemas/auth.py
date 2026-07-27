"""
CAZZ SHIELD — Auth Schemas
"""
from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime


class LoginRequest(BaseModel):
    email: str
    password: str


class LoginResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    expires_in: int
    user: "UserResponse"


class RefreshRequest(BaseModel):
    refresh_token: str


class UserResponse(BaseModel):
    id: str
    email: str
    full_name: str
    role: str
    department: Optional[str] = None
    title: Optional[str] = None
    avatar_url: Optional[str] = None
    is_active: bool
    mfa_enabled: bool
    last_login: Optional[datetime] = None
    created_at: datetime

    class Config:
        from_attributes = True


class UserCreate(BaseModel):
    email: str
    password: str
    full_name: str
    role: str = "operator"
    department: Optional[str] = None
    title: Optional[str] = None
