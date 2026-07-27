"""
CAZZ SHIELD — Database Configuration
SQLAlchemy async engine and session management
"""
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker
from sqlalchemy.orm import DeclarativeBase
from app.config import settings


engine_kwargs = {
    "echo": settings.DEBUG,
    "pool_pre_ping": True,
}

try:
    if "sqlite" in settings.DATABASE_URL:
        try:
            import aiosqlite
            engine_kwargs["connect_args"] = {"check_same_thread": False}
        except ImportError:
            # Fallback to standard memory sqlite if aiosqlite not installed
            settings.DATABASE_URL = "sqlite+aiosqlite:///:memory:"
            engine_kwargs["connect_args"] = {"check_same_thread": False}
    else:
        engine_kwargs["pool_size"] = 20
        engine_kwargs["max_overflow"] = 10

    engine = create_async_engine(
        settings.DATABASE_URL,
        **engine_kwargs
    )
except Exception as e:
    # Safe fallback engine
    engine = create_async_engine("sqlite+aiosqlite:///:memory:", connect_args={"check_same_thread": False})

async_session_factory = async_sessionmaker(
    engine,
    class_=AsyncSession,
    expire_on_commit=False,
)


class Base(DeclarativeBase):
    pass


async def get_db():
    """Dependency injection for database sessions."""
    async with async_session_factory() as session:
        try:
            yield session
            await session.commit()
        except Exception:
            await session.rollback()
            raise
        finally:
            await session.close()


async def init_db():
    """Create all tables."""
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)


async def close_db():
    """Dispose engine connections."""
    await engine.dispose()
