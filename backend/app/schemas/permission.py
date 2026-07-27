"""CAZZ SHIELD — Permission Schemas"""
from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class PermissionResponse(BaseModel):
    id: str
    permission_id: str
    name: str
    description: Optional[str] = None
    permission_type: str
    scope: str
    resource: str
    agent_id: Optional[str] = None
    department: Optional[str] = None
    agent_class: Optional[str] = None
    conditions: Optional[dict] = None
    is_active: bool
    priority: int
    created_by: str
    created_at: datetime
    expires_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class PermissionListResponse(BaseModel):
    permissions: list[PermissionResponse]
    total: int
    page: int
    page_size: int


class PermissionCreate(BaseModel):
    name: str
    description: Optional[str] = None
    permission_type: str
    scope: str
    resource: str
    agent_id: Optional[str] = None
    department: Optional[str] = None
    agent_class: Optional[str] = None
    conditions: Optional[dict] = None
    priority: int = 100
    expires_at: Optional[datetime] = None


class PermissionUpdate(BaseModel):
    permission_type: Optional[str] = None
    conditions: Optional[dict] = None
    is_active: Optional[bool] = None
    priority: Optional[int] = None
