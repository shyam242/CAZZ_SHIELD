"""CAZZ SHIELD — Graph Schemas"""
from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class GraphNodeResponse(BaseModel):
    node_id: str
    node_type: str
    label: str
    properties: Optional[dict] = None
    cluster_id: Optional[str] = None
    risk_score: float
    is_suspicious: bool
    degree_centrality: float
    department: Optional[str] = None

    class Config:
        from_attributes = True


class GraphEdgeResponse(BaseModel):
    source_id: str
    target_id: str
    edge_type: str
    weight: float
    label: Optional[str] = None
    is_suspicious: bool
    observed_at: datetime

    class Config:
        from_attributes = True


class GraphDataResponse(BaseModel):
    nodes: list[GraphNodeResponse]
    edges: list[GraphEdgeResponse]
    clusters: list[dict]
    suspicious_links: list[dict]
    total_nodes: int
    total_edges: int


class GraphClusterResponse(BaseModel):
    cluster_id: str
    nodes: list[str]
    risk_score: float
    is_suspicious: bool
    description: str
    edge_density: float
