"""
CAZZ SHIELD — Auth Router
POST /auth/login, /auth/refresh, GET /auth/me
"""
from datetime import datetime, timezone
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.dependencies import get_db, get_current_user
from app.models.user import User
from app.schemas.auth import LoginRequest, LoginResponse, UserResponse, RefreshRequest
from app.utils.security import verify_password, create_access_token, create_refresh_token, decode_token
from app.config import settings

router = APIRouter(prefix="/auth", tags=["Authentication"])


@router.post("/login", response_model=LoginResponse)
async def login(request: LoginRequest, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(User).where(User.email == request.email))
    user = result.scalar_one_or_none()
    
    if not user or not verify_password(request.password, user.hashed_password):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid email or password")
    
    if not user.is_active:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Account deactivated")
    
    user.last_login = datetime.now(timezone.utc)
    user.failed_login_attempts = 0
    
    access_token = create_access_token({"sub": user.email, "role": user.role.value, "name": user.full_name})
    refresh_token = create_refresh_token({"sub": user.email})
    
    return LoginResponse(
        access_token=access_token,
        refresh_token=refresh_token,
        expires_in=settings.JWT_ACCESS_TOKEN_EXPIRE_MINUTES * 60,
        user=UserResponse(
            id=str(user.id),
            email=user.email,
            full_name=user.full_name,
            role=user.role.value,
            department=user.department,
            title=user.title,
            avatar_url=user.avatar_url,
            is_active=user.is_active,
            mfa_enabled=user.mfa_enabled,
            last_login=user.last_login,
            created_at=user.created_at,
        ),
    )


@router.post("/refresh")
async def refresh_token(request: RefreshRequest, db: AsyncSession = Depends(get_db)):
    payload = decode_token(request.refresh_token)
    if not payload or payload.get("type") != "refresh":
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid refresh token")
    
    result = await db.execute(select(User).where(User.email == payload["sub"]))
    user = result.scalar_one_or_none()
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User not found")
    
    access_token = create_access_token({"sub": user.email, "role": user.role.value, "name": user.full_name})
    return {"access_token": access_token, "token_type": "bearer", "expires_in": settings.JWT_ACCESS_TOKEN_EXPIRE_MINUTES * 60}


@router.get("/me", response_model=UserResponse)
async def get_me(current_user: User = Depends(get_current_user)):
    return UserResponse(
        id=str(current_user.id),
        email=current_user.email,
        full_name=current_user.full_name,
        role=current_user.role.value,
        department=current_user.department,
        title=current_user.title,
        avatar_url=current_user.avatar_url,
        is_active=current_user.is_active,
        mfa_enabled=current_user.mfa_enabled,
        last_login=current_user.last_login,
        created_at=current_user.created_at,
    )
