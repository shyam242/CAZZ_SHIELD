"""
CAZZ SHIELD — Permission Model
Granular permissions: Allow, Deny, Conditional (time, spend, department, tool, API, geography, approval)
"""
import enum
import uuid
from datetime import datetime
from sqlalchemy import String, Float, Integer, Boolean, DateTime, Enum, Text, JSON
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy.dialects.postgresql import UUID
from app.database import Base


class PermissionType(str, enum.Enum):
    ALLOW = "allow"
    DENY = "deny"
    CONDITIONAL = "conditional"


class PermissionScope(str, enum.Enum):
    TOOL = "tool"
    API = "api"
    ACTION = "action"
    DATA = "data"
    TRANSACTION = "transaction"
    SYSTEM = "system"


class Permission(Base):
    __tablename__ = "permissions"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    permission_id: Mapped[str] = mapped_column(String(100), unique=True, nullable=False, index=True)
    name: Mapped[str] = mapped_column(String(255), nullable=False)
    description: Mapped[str] = mapped_column(Text, nullable=True)
    permission_type: Mapped[PermissionType] = mapped_column(Enum(PermissionType), nullable=False)
    scope: Mapped[str] = mapped_column(String(100), nullable=False)
    resource: Mapped[str] = mapped_column(String(255), nullable=False)
    
    # Targeting
    agent_id: Mapped[str | None] = mapped_column(String(100), nullable=True, index=True)
    department: Mapped[str | None] = mapped_column(String(100), nullable=True)
    agent_class: Mapped[str | None] = mapped_column(String(100), nullable=True)
    
    # Conditions (for CONDITIONAL type)
    conditions: Mapped[dict | None] = mapped_column(JSON, nullable=True)
    
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    priority: Mapped[int] = mapped_column(Integer, default=100)
    
    created_by: Mapped[str] = mapped_column(String(255), nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=datetime.utcnow, onupdate=datetime.utcnow)
    expires_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)


class PermissionCondition(Base):
    __tablename__ = "permission_conditions"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    permission_id: Mapped[str] = mapped_column(String(100), nullable=False, index=True)
    condition_type: Mapped[str] = mapped_column(String(50), nullable=False)  # time, spend, department, tool, api, geography, approval
    operator: Mapped[str] = mapped_column(String(20), nullable=False)  # eq, neq, gt, lt, gte, lte, in, not_in, between
    value: Mapped[str] = mapped_column(Text, nullable=False)
    value_type: Mapped[str] = mapped_column(String(50), default="string")
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=datetime.utcnow)
