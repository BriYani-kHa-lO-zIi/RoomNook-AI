from typing import Optional, Tuple, Any
from fastapi import Depends, HTTPException, status, Request
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import Student, PgOwner, Admin
from app.security import decode_access_token

security = HTTPBearer(auto_error=False)

def get_token_from_header(request: Request) -> Optional[str]:
    auth_header = request.headers.get("Authorization")
    if not auth_header:
        return None
    parts = auth_header.split(" ")
    if len(parts) == 2 and parts[0].lower() == "bearer":
        return parts[1]
    return None

def get_current_user_and_role(
    request: Request,
    db: Session = Depends(get_db)
) -> Tuple[Any, str]:
    token = get_token_from_header(request)
    if not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail={"message": "Access token required"}
        )

    payload = decode_access_token(token)
    if not payload:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail={"message": "Invalid or expired token"}
        )

    user_id = payload.get("id")
    role = payload.get("role")

    user = None
    if role == "student":
        user = db.query(Student).filter(Student.id == user_id).first()
    elif role == "owner":
        user = db.query(PgOwner).filter(PgOwner.id == user_id).first()
    elif role == "admin":
        user = db.query(Admin).filter(Admin.id == user_id).first()

    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail={"message": "User not found"}
        )

    return user, role

def require_student(auth: Tuple[Any, str] = Depends(get_current_user_and_role)) -> Tuple[Student, str]:
    user, role = auth
    if role != "student":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail={"message": "Insufficient permissions: Student access required"}
        )
    return user, role

def require_owner(auth: Tuple[Any, str] = Depends(get_current_user_and_role)) -> Tuple[PgOwner, str]:
    user, role = auth
    if role != "owner":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail={"message": "Insufficient permissions: PG Owner access required"}
        )
    return user, role

def require_admin(auth: Tuple[Any, str] = Depends(get_current_user_and_role)) -> Tuple[Admin, str]:
    user, role = auth
    if role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail={"message": "Insufficient permissions: Admin access required"}
        )
    return user, role

def optional_auth(
    request: Request,
    db: Session = Depends(get_db)
) -> Tuple[Optional[Any], Optional[str]]:
    token = get_token_from_header(request)
    if not token:
        return None, None
    
    payload = decode_access_token(token)
    if not payload:
        return None, None
    
    user_id = payload.get("id")
    role = payload.get("role")

    user = None
    if role == "student":
        user = db.query(Student).filter(Student.id == user_id).first()
    elif role == "owner":
        user = db.query(PgOwner).filter(PgOwner.id == user_id).first()
    elif role == "admin":
        user = db.query(Admin).filter(Admin.id == user_id).first()

    return user, role
