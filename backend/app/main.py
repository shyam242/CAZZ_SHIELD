"""
CAZZ SHIELD — Main Application
Enterprise AI Governance Platform
Autonomous Governance & Self-Healing Control Plane for Financial AI Agents
"""
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.database import init_db, close_db
from app.routers import auth, dashboard, agents, trust, budget, policies, permissions, audit, incidents, graph, copilot, emergency, reports, settings as settings_router, approvals


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    print(f"Starting {settings.APP_NAME} v{settings.APP_VERSION}")
    await init_db()
    
    # Seed database on first run
    try:
        from app.seed.seed_database import run_seed
        await run_seed()
    except Exception as e:
        print(f"Seed skipped or failed: {e}")
    
    yield
    
    # Shutdown
    await close_db()
    print(f"{settings.APP_NAME} shutdown complete")


app = FastAPI(
    title=settings.APP_NAME,
    description=settings.APP_DESCRIPTION,
    version=settings.APP_VERSION,
    lifespan=lifespan,
    docs_url="/docs",
    redoc_url="/redoc",
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routers
app.include_router(auth.router, prefix="/api/v1")
app.include_router(dashboard.router, prefix="/api/v1")
app.include_router(agents.router, prefix="/api/v1")
app.include_router(trust.router, prefix="/api/v1")
app.include_router(budget.router, prefix="/api/v1")
app.include_router(policies.router, prefix="/api/v1")
app.include_router(permissions.router, prefix="/api/v1")
app.include_router(audit.router, prefix="/api/v1")
app.include_router(incidents.router, prefix="/api/v1")
app.include_router(graph.router, prefix="/api/v1")
app.include_router(copilot.router, prefix="/api/v1")
app.include_router(emergency.router, prefix="/api/v1")
app.include_router(reports.router, prefix="/api/v1")
app.include_router(settings_router.router, prefix="/api/v1")
app.include_router(approvals.router, prefix="/api/v1")


@app.get("/")
async def root():
    return {
        "name": settings.APP_NAME,
        "version": settings.APP_VERSION,
        "description": settings.APP_DESCRIPTION,
        "status": "operational",
        "docs": "/docs",
    }


@app.get("/health")
async def health():
    return {"status": "healthy", "version": settings.APP_VERSION}
