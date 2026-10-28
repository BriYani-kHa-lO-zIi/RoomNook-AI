import math
from typing import Optional
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from sqlalchemy import func, desc

from app.database import get_db
from app.models import PgListing, PgOwner, Review, PgApplication
from app.schemas import PgListingCreateUpdate, ProfileUpdate
from app.dependencies import require_owner

router = APIRouter(prefix="/owners", tags=["PG Owners"])

@router.post("/pg-listings", status_code=status.HTTP_201_CREATED)
def create_pg_listing(
    payload: PgListingCreateUpdate,
    auth=Depends(require_owner),
    db: Session = Depends(get_db)
):
    owner, _ = auth

    available_date = None
    if payload.available_from:
        try:
            available_date = datetime.strptime(payload.available_from, "%Y-%m-%d").date()
        except Exception:
            pass

    pg = PgListing(
        owner_id=owner.id,
        title=payload.title,
        description=payload.description,
        address=payload.address,
        location=payload.location or payload.city or "Dehradun",
        city=payload.city or payload.location or "Dehradun",
        rent_amount=payload.rent_amount,
        deposit_amount=payload.deposit_amount or 0,
        room_type=payload.room_type,
        gender_preference=payload.gender_preference or "any",
        available_from=available_date,
        amenities=payload.amenities or [],
        rules=payload.rules,
        images=payload.images or [],
        contact_phone=payload.contact_phone or owner.phone,
        contact_email=payload.contact_email or owner.email,
        verification_status='pending',
        status='active'
    )
    db.add(pg)
    db.commit()
    db.refresh(pg)

    return {
        "message": "PG listing created successfully",
        "pgListing": pg.to_dict()
    }

@router.get("/pg-listings")
def get_owner_pg_listings(
    status_filter: Optional[str] = Query(None, alias="status"),
    page: int = Query(1, ge=1),
    limit: int = Query(10, ge=1, le=100),
    auth=Depends(require_owner),
    db: Session = Depends(get_db)
):
    owner, _ = auth
    query = db.query(PgListing).filter(PgListing.owner_id == owner.id)

    if status_filter:
        query = query.filter(PgListing.status == status_filter)

    total_count = query.count()
    offset = (page - 1) * limit
    listings = query.order_by(desc(PgListing.created_at)).offset(offset).limit(limit).all()

    result_listings = []
    for pg in listings:
        reviews = db.query(Review).filter(Review.pg_listing_id == pg.id).all()
        avg_rating = sum(r.rating for r in reviews) / len(reviews) if reviews else 0.0
        pg_dict = pg.to_dict()
        pg_dict["avgRating"] = round(avg_rating, 1)
        pg_dict["reviewCount"] = len(reviews)
        result_listings.append(pg_dict)

    return {
        "pgListings": result_listings,
        "pagination": {
            "currentPage": page,
            "totalPages": math.ceil(total_count / limit) if total_count > 0 else 1,
            "totalItems": total_count,
            "itemsPerPage": limit
        }
    }

@router.put("/pg-listings/{id}")
def update_pg_listing(
    id: int,
    payload: PgListingCreateUpdate,
    auth=Depends(require_owner),
    db: Session = Depends(get_db)
):
    owner, _ = auth
    pg = db.query(PgListing).filter(PgListing.id == id, PgListing.owner_id == owner.id).first()

    if not pg:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail={"message": "PG listing not found"}
        )

    update_dict = payload.model_dump(exclude_unset=True)
    if "available_from" in update_dict and update_dict["available_from"]:
        try:
            update_dict["available_from"] = datetime.strptime(update_dict["available_from"], "%Y-%m-%d").date()
        except Exception:
            del update_dict["available_from"]

    for k, v in update_dict.items():
        setattr(pg, k, v)

    db.commit()
    db.refresh(pg)

    return {
        "message": "PG listing updated successfully",
        "pgListing": pg.to_dict()
    }

@router.delete("/pg-listings/{id}")
def delete_pg_listing(
    id: int,
    auth=Depends(require_owner),
    db: Session = Depends(get_db)
):
    owner, _ = auth
    pg = db.query(PgListing).filter(PgListing.id == id, PgListing.owner_id == owner.id).first()

    if not pg:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail={"message": "PG listing not found"}
        )

    db.delete(pg)
    db.commit()

    return {"message": "PG listing deleted successfully"}

@router.get("/dashboard")
def get_owner_dashboard(
    auth=Depends(require_owner),
    db: Session = Depends(get_db)
):
    owner, _ = auth

    total_listings = db.query(PgListing).filter(PgListing.owner_id == owner.id).count()
    active_listings = db.query(PgListing).filter(PgListing.owner_id == owner.id, PgListing.status == 'active').count()
    booked_listings = db.query(PgListing).filter(PgListing.owner_id == owner.id, PgListing.status == 'booked').count()

    # Reviews for this owner's listings
    owner_pg_ids = [pg.id for pg in db.query(PgListing.id).filter(PgListing.owner_id == owner.id).all()]
    
    total_reviews = 0
    avg_rating = 0.0
    total_applications = 0

    if owner_pg_ids:
        reviews = db.query(Review).filter(Review.pg_listing_id.in_(owner_pg_ids)).all()
        total_reviews = len(reviews)
        if reviews:
            avg_rating = round(sum(r.rating for r in reviews) / len(reviews), 1)

        total_applications = db.query(PgApplication).filter(PgApplication.pg_listing_id.in_(owner_pg_ids)).count()

    return {
        "stats": {
            "totalListings": total_listings,
            "activeListings": active_listings,
            "bookedListings": booked_listings,
            "totalReviews": total_reviews,
            "avgRating": avg_rating,
            "totalApplications": total_applications
        }
    }

@router.get("/profile")
def get_owner_profile(auth=Depends(require_owner)):
    owner, _ = auth
    return owner.to_dict()

@router.put("/profile")
def update_owner_profile(
    payload: ProfileUpdate,
    auth=Depends(require_owner),
    db: Session = Depends(get_db)
):
    owner, _ = auth
    update_dict = payload.model_dump(exclude_unset=True)

    for k, v in update_dict.items():
        if hasattr(owner, k):
            setattr(owner, k, v)

    db.commit()
    db.refresh(owner)

    return {
        "message": "Profile updated successfully",
        "owner": owner.to_dict()
    }
