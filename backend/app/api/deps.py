from typing import Optional
from fastapi import Header, HTTPException, status
from app.core.firebase import verify_token
from app.schemas.auth import UserContext
from app.core.logging import logger

def get_current_user(
    authorization: Optional[str] = Header(None, description="Bearer <Firebase ID Token>")
) -> UserContext:
    """
    Enforces that the request has a valid verified Firebase ID token.
    Raises 401 Unauthorized if missing, expired, or invalid.
    """
    if not authorization:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Missing Authorization header. Sign in with Firebase to access this resource.",
            headers={"WWW-Authenticate": "Bearer"},
        )

    parts = authorization.split()
    if len(parts) != 2 or parts[0].lower() != "bearer":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid Authorization format. Expected 'Bearer <token>'.",
            headers={"WWW-Authenticate": "Bearer"},
        )

    id_token = parts[1]
    decoded = verify_token(id_token)
    if not decoded:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired Firebase ID token.",
            headers={"WWW-Authenticate": "Bearer"},
        )

    uid = decoded.get("uid") or decoded.get("user_id") or "unknown_user"
    email = decoded.get("email")
    name = decoded.get("name") or (email.split("@")[0] if email else "Executive Leader")
    role = decoded.get("role", "executive")
    is_demo = decoded.get("is_demo_session", False)

    return UserContext(
        uid=uid,
        email=email,
        name=name,
        role=role,
        workspace_id=f"ws_{uid[:8]}",
        is_demo_session=is_demo
    )

def get_optional_user(
    authorization: Optional[str] = Header(None)
) -> Optional[UserContext]:
    """
    Extracts authenticated user if token is present and valid.
    Returns None if missing or invalid, enabling guest demo access.
    """
    if not authorization:
        return None

    try:
        parts = authorization.split()
        if len(parts) == 2 and parts[0].lower() == "bearer":
            decoded = verify_token(parts[1])
            if decoded:
                uid = decoded.get("uid") or decoded.get("user_id") or "unknown_user"
                email = decoded.get("email")
                return UserContext(
                    uid=uid,
                    email=email,
                    name=decoded.get("name") or (email.split("@")[0] if email else "Guest Executive"),
                    role=decoded.get("role", "executive"),
                    workspace_id=f"ws_{uid[:8]}",
                    is_demo_session=decoded.get("is_demo_session", False)
                )
    except Exception as e:
        logger.debug(f"Optional user verification skipped: {e}")

    return None
