"""CAZZ SHIELD — Graph Intelligence Router"""
from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func
from app.dependencies import get_db, get_current_user
from app.models.user import User
from app.models.graph import GraphNode, GraphEdge

router = APIRouter(prefix="/graph", tags=["Graph Intelligence"])


@router.get("/data")
async def get_graph_data(
    limit: int = Query(100, ge=10, le=500),
    department: str = None,
    show_suspicious: bool = False,
    db: AsyncSession = Depends(get_db), user: User = Depends(get_current_user),
):
    node_query = select(GraphNode)
    if department:
        node_query = node_query.where(GraphNode.department == department)
    if show_suspicious:
        node_query = node_query.where(GraphNode.is_suspicious == True)
    node_query = node_query.limit(limit)
    
    nodes_result = await db.execute(node_query)
    nodes = nodes_result.scalars().all()
    node_ids = [n.node_id for n in nodes]
    
    edge_query = select(GraphEdge).where(
        GraphEdge.source_id.in_(node_ids) | GraphEdge.target_id.in_(node_ids)
    ).limit(limit * 3)
    edges_result = await db.execute(edge_query)
    edges = edges_result.scalars().all()
    
    # Build clusters
    clusters = {}
    for n in nodes:
        cid = n.cluster_id or "unclustered"
        if cid not in clusters:
            clusters[cid] = {"cluster_id": cid, "nodes": [], "risk_score": 0, "is_suspicious": False, "edge_density": 0}
        clusters[cid]["nodes"].append(n.node_id)
        clusters[cid]["risk_score"] = max(clusters[cid]["risk_score"], n.risk_score)
        if n.is_suspicious:
            clusters[cid]["is_suspicious"] = True
    
    suspicious_links = [{"source": e.source_id, "target": e.target_id, "type": e.edge_type.value if hasattr(e.edge_type, 'value') else e.edge_type, "weight": e.weight} for e in edges if e.is_suspicious]
    
    return {
        "nodes": [{
            "node_id": n.node_id, "node_type": n.node_type.value if hasattr(n.node_type, 'value') else n.node_type,
            "label": n.label, "properties": n.properties, "cluster_id": n.cluster_id,
            "risk_score": n.risk_score, "is_suspicious": n.is_suspicious,
            "degree_centrality": n.degree_centrality, "department": n.department,
        } for n in nodes],
        "edges": [{
            "source_id": e.source_id, "target_id": e.target_id,
            "edge_type": e.edge_type.value if hasattr(e.edge_type, 'value') else e.edge_type,
            "weight": e.weight, "is_suspicious": e.is_suspicious,
            "observed_at": e.observed_at.isoformat() if e.observed_at else None,
        } for e in edges],
        "clusters": list(clusters.values()),
        "suspicious_links": suspicious_links,
        "total_nodes": len(nodes),
        "total_edges": len(edges),
    }


@router.get("/clusters")
async def get_clusters(db: AsyncSession = Depends(get_db), user: User = Depends(get_current_user)):
    result = await db.execute(
        select(GraphNode.cluster_id, func.count(GraphNode.id), func.avg(GraphNode.risk_score))
        .where(GraphNode.cluster_id.isnot(None))
        .group_by(GraphNode.cluster_id)
    )
    clusters = [{
        "cluster_id": row[0], "node_count": row[1], "avg_risk": round(float(row[2]), 3),
        "description": f"Cluster with {row[1]} nodes",
    } for row in result.all()]
    return {"clusters": clusters, "total": len(clusters)}


@router.get("/stats")
async def get_graph_stats(db: AsyncSession = Depends(get_db), user: User = Depends(get_current_user)):
    total_nodes = (await db.execute(select(func.count(GraphNode.id)))).scalar() or 0
    total_edges = (await db.execute(select(func.count(GraphEdge.id)))).scalar() or 0
    suspicious_nodes = (await db.execute(select(func.count(GraphNode.id)).where(GraphNode.is_suspicious == True))).scalar() or 0
    suspicious_edges = (await db.execute(select(func.count(GraphEdge.id)).where(GraphEdge.is_suspicious == True))).scalar() or 0
    
    return {
        "total_nodes": total_nodes, "total_edges": total_edges,
        "suspicious_nodes": suspicious_nodes, "suspicious_edges": suspicious_edges,
    }
