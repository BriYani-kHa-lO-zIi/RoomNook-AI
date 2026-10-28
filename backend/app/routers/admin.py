import math
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from sqlalchemy import or_, desc

from app.database import get_db
from app.models import Student, PgOwner, PgListing, MessListing, Review
from app.schemas import VerificationUpdate, UserStatusUpdate
from app.dependencies import require_admin

router = APIRouter(prefix="/admin", tags=["Admin"])

@router.get("/dashboard")
def get_admin_dashboard(
    auth=Depends(require_admin),
    db: Session = Depends(get_db)
):
    total_students = db.query(Student).count()
    total_owners = db.query(PgOwner).count()
    total_pg_listings = db.query(PgListing).count()
    total_mess_listings = db.query(MessListing).count()
    pending_verifications = db.query(PgListing).filter(PgListing.verification_status == 'pending').count()

    recent_students = [
        {
            "id": s.id,
            "name": s.name,
            "email": s.email,
            "university": s.university,
            "created_at": s.created_at.isoformat() if s.created_at else None
        }
        for s in db.query(Student).order_by(desc(Student.created_at)).limit(5).all()
    ]

    recent_owners = [
        {
            "id": o.id,
            "name": o.name,
            "email": o.email,
            "verification_status": o.verification_status,
            "created_at": o.created_at.isoformat() if o.created_at else None
        }
        for o in db.query(PgOwner).order_by(desc(PgOwner.created_at)).limit(5).all()
    ]

    recent_listings = [
        {
            "id": p.id,
            "title": p.title,
            "location": p.location or p.city,
            "rent_amount": p.rent_amount,
            "verification_status": p.verification_status,
            "created_at": p.created_at.isoformat() if p.created_at else None,
            "owner": {"name": p.owner.name} if p.owner else None
        }
        for p in db.query(PgListing).order_by(desc(PgListing.created_at)).limit(5).all()
    ]

    return {
        "overview": {
            "totalStudents": total_students,
            "totalOwners": total_owners,
            "totalPgListings": total_pg_listings,
            "totalMessListings": total_mess_listings,
            "pendingVerifications": pending_verifications
        },
        "recent": {
            "students": recent_students,
            "owners": recent_owners,
            "listings": recent_listings
        }
    }

@router.get("/students")
def get_all_students(
    search: Optional[str] = None,
    university: Optional[str] = None,
    page: int = Query(1, ge=1),
    limit: int = Query(10, ge=1, le=100),
    auth=Depends(require_admin),
    db: Session = Depends(get_db)
):
    query = db.query(Student)

    if search:
        s_pattern = f"%{search}%"
        query = query.filter(
            or_(
                Student.name.ilike(s_pattern),
                Student.email.ilike(s_pattern)
            )
        )

    if university:
        query = query.filter(Student.university.ilike(f"%{university}%"))

    total_count = query.count()
    offset = (page - 1) * limit
    students = query.order_by(desc(Student.created_at)).offset(offset).limit(limit).all()

    return {
        "students": [s.to_dict() for s in students],
        "pagination": {
            "currentPage": page,
            "totalPages": math.ceil(total_count / limit) if total_count > 0 else 1,
            "totalItems": total_count,
            "itemsPerPage": limit
        }
    }

@router.get("/owners")
def get_all_owners(
    search: Optional[str] = None,
    verification_status: Optional[str] = None,
    page: int = Query(1, ge=1),
    limit: int = Query(10, ge=1, le=100),
    auth=Depends(require_admin),
    db: Session = Depends(get_db)
):
    query = db.query(PgOwner)

    if search:
        s_pattern = f"%{search}%"
        query = query.filter(
            or_(
                PgOwner.name.ilike(s_pattern),
                PgOwner.email.ilike(s_pattern)
            )
        )

    if verification_status:
        query = query.filter(PgOwner.verification_status == verification_status)

    total_count = query.count()
    offset = (page - 1) * limit
    owners = query.order_by(desc(PgOwner.created_at)).offset(offset).limit(limit).all()

    return {
        "owners": [o.to_dict() for o in owners],
        "pagination": {
            "currentPage": page,
            "totalPages": math.ceil(total_count / limit) if total_count > 0 else 1,
            "totalItems": total_count,
            "itemsPerPage": limit
        }
    }

@router.put("/owners/{id}/verify")
def verify_pg_owner(
    id: int,
    payload: VerificationUpdate,
    auth=Depends(require_admin),
    db: Session = Depends(get_db)
):
    owner = db.query(PgOwner).filter(PgOwner.id == id).first()
    if not owner:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail={"message": "PG owner not found"}
        )

    owner.verification_status = payload.verification_status
    db.commit()
    db.refresh(owner)

    return {
        "message": f"PG owner {payload.verification_status} successfully",
        "owner": owner.to_dict()
    }

@router.put("/users/{id}/status")
def toggle_user_status(
    id: int,
    payload: UserStatusUpdate,
    auth=Depends(require_admin),
    db: Session = Depends(get_db)
):
    if payload.userType == "student":
        user = db.query(Student).filter(Student.id == id).first()
    else:
        user = db.query(PgOwner).filter(PgOwner.id == id).first()

    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail={"message": "User not found"}
        )

    user.is_blocked = payload.isBlocked
    db.commit()
    db.refresh(user)

    return {
        "message": f"User {'blocked' if payload.isBlocked else 'unblocked'} successfully",
        "user": user.to_dict()
    }

@router.get("/pg-listings")
def get_all_pg_listings(
    search: Optional[str] = None,
    location: Optional[str] = None,
    verification_status: Optional[str] = None,
    status_filter: Optional[str] = Query(None, alias="status"),
    page: int = Query(1, ge=1),
    limit: int = Query(10, ge=1, le=100),
    auth=Depends(require_admin),
    db: Session = Depends(get_db)
):
    query = db.query(PgListing)

    if search:
        s_pattern = f"%{search}%"
        query = query.filter(
            or_(
                PgListing.title.ilike(s_pattern),
                PgListing.description.ilike(s_pattern)
            )
        )

    if location:
        loc_pattern = f"%{location}%"
        query = query.filter(
            or_(
                PgListing.location.ilike(loc_pattern),
                PgListing.city.ilike(loc_pattern)
            )
        )

    if verification_status:
        query = query.filter(PgListing.verification_status == verification_status)

    if status_filter:
        query = query.filter(PgListing.status == status_filter)

    total_count = query.count()
    offset = (page - 1) * limit
    listings = query.order_by(desc(PgListing.created_at)).offset(offset).limit(limit).all()

    return {
        "pgListings": [p.to_dict() for p in listings],
        "pagination": {
            "currentPage": page,
            "totalPages": math.ceil(total_count / limit) if total_count > 0 else 1,
            "totalItems": total_count,
            "itemsPerPage": limit
        }
    }

@router.put("/pg-listings/{id}/verify")
def verify_pg_listing(
    id: int,
    payload: VerificationUpdate,
    auth=Depends(require_admin),
    db: Session = Depends(get_db)
):
    pg = db.query(PgListing).filter(PgListing.id == id).first()
    if not pg:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail={"message": "PG listing not found"}
        )

    pg.verification_status = payload.verification_status
    db.commit()
    db.refresh(pg)

    return {
        "message": f"PG listing {payload.verification_status} successfully",
        "pgListing": pg.to_dict()
    }

@router.get("/reviews")
def get_all_reviews(
    review_type: Optional[str] = None,
    rating: Optional[int] = None,
    page: int = Query(1, ge=1),
    limit: int = Query(10, ge=1, le=100),
    auth=Depends(require_admin),
    db: Session = Depends(get_db)
):
    query = db.query(Review)

    if review_type:
        query = query.filter(Review.review_type == review_type)
    if rating:
        query = query.filter(Review.rating == rating)

    total_count = query.count()
    offset = (page - 1) * limit
    reviews = query.order_by(desc(Review.created_at)).offset(offset).limit(limit).all()

    return {
        "reviews": [r.to_dict() for r in reviews],
        "pagination": {
            "currentPage": page,
            "totalPages": math.ceil(total_count / limit) if total_count > 0 else 1,
            "totalItems": total_count,
            "itemsPerPage": limit
        }
    }
