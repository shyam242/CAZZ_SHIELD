"""
CAZZ SHIELD — Graph Model
Mock Neo4j layer: agent↔agent, agent↔API, agent↔vendor relationships
For graph intelligence and collusion detection
"""
import enum
import uuid
from datetime import datetime
from sqlalchemy import String, Float, Integer, Boolean, DateTime, Enum, Text, JSON
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy.dialects.postgresql import UUID
from app.database import Base


class GraphNodeType(str, enum.Enum):
    AGENT = "agent"
    API = "api"
    VENDOR = "vendor"
    TOOL = "tool"
    DATABASE = "database"
    SERVICE = "service"
    USER = "user"
    DEPARTMENT = "department"


class GraphEdgeType(str, enum.Enum):
    CALLS = "calls"
    ACCESSES = "accesses"
    SHARES_DATA = "shares_data"
    DELEGATES_TO = "delegates_to"
    REPORTS_TO = "reports_to"
    BELONGS_TO = "belongs_to"
    DEPENDS_ON = "depends_on"
    SUSPICIOUS = "suspicious"


class GraphNode(Base):
    __tablename__ = "graph_nodes"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    node_id: Mapped[str] = mapped_column(String(100), unique=True, nullable=False, index=True)
    node_type: Mapped[GraphNodeType] = mapped_column(Enum(GraphNodeType), nullable=False)
    label: Mapped[str] = mapped_column(String(255), nullable=False)
    properties: Mapped[dict | None] = mapped_column(JSON, nullable=True)
    cluster_id: Mapped[str | None] = mapped_column(String(100), nullable=True, index=True)
    risk_score: Mapped[float] = mapped_column(Float, default=0.0)
    is_suspicious: Mapped[bool] = mapped_column(Boolean, default=False)
    degree_centrality: Mapped[float] = mapped_column(Float, default=0.0)
    department: Mapped[str | None] = mapped_column(String(100), nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=datetime.utcnow)


class GraphEdge(Base):
    __tablename__ = "graph_edges"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    source_id: Mapped[str] = mapped_column(String(100), nullable=False, index=True)
    target_id: Mapped[str] = mapped_column(String(100), nullable=False, index=True)
    edge_type: Mapped[GraphEdgeType] = mapped_column(Enum(GraphEdgeType), nullable=False)
    weight: Mapped[float] = mapped_column(Float, default=1.0)
    label: Mapped[str | None] = mapped_column(String(255), nullable=True)
    properties: Mapped[dict | None] = mapped_column(JSON, nullable=True)
    is_suspicious: Mapped[bool] = mapped_column(Boolean, default=False)
    observed_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=datetime.utcnow)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=datetime.utcnow)
