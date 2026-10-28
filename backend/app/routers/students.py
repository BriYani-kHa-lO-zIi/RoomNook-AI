import math
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from sqlalchemy import or_, desc

from app.database import get_db
from app.models import Student, PgListing, MessListing, Review, Bookmark, RoommateProfile, PgOwner
from app.schemas import RoommateProfileUpdate, BookmarkCreate, ReviewCreate
from app.dependencies import require_student, optional_auth

router = APIRouter(prefix="/students", tags=["Students"])

@router.get("/pg-listings")
def get_pg_listings(
    location: Optional[str] = None,
    minPrice: Optional[int] = None,
    maxPrice: Optional[int] = None,
    roomType: Optional[str] = None,
    genderPreference: Optional[str] = None,
    page: int = Query(1, ge=1),
    limit: int = Query(10, ge=1, le=100),
    auth=Depends(optional_auth),
    db: Session = Depends(get_db)
):
    query = db.query(PgListing).filter(PgListing.verification_status == 'verified')

    if location:
        loc_pattern = f"%{location}%"
        query = query.filter(
            or_(
                PgListing.city.ilike(loc_pattern),
                PgListing.location.ilike(loc_pattern),
                PgListing.address.ilike(loc_pattern)
            )
        )

    if minPrice is not None:
        query = query.filter(PgListing.rent_amount >= minPrice)
    if maxPrice is not None:
        query = query.filter(PgListing.rent_amount <= maxPrice)

    if roomType:
        query = query.filter(PgListing.room_type == roomType)

    if genderPreference and genderPreference.lower() != 'all':
        query = query.filter(
            or_(
                PgListing.gender_preference == genderPreference.lower(),
                PgListing.gender_preference == 'any'
            )
        )

    total_count = query.count()
    offset = (page - 1) * limit
    listings = query.order_by(desc(PgListing.created_at)).offset(offset).limit(limit).all()

    # Calculate average ratings and review counts for each listing
    result_listings = []
    for pg in listings:
        pg_dict = pg.to_dict()
        reviews = db.query(Review).filter(Review.pg_listing_id == pg.id).all()
        avg_rating = sum(r.rating for r in reviews) / len(reviews) if reviews else 0.0
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

@router.get("/pg-listings/{id}")
def get_pg_listing_by_id(
    id: int,
    auth=Depends(optional_auth),
    db: Session = Depends(get_db)
):
    pg = db.query(PgListing).filter(PgListing.id == id).first()
    if not pg:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail={"message": "PG listing not found"}
        )

    reviews = db.query(Review).filter(Review.pg_listing_id == id).all()
    avg_rating = sum(r.rating for r in reviews) / len(reviews) if reviews else 0.0

    pg_dict = pg.to_dict()
    pg_dict["avgRating"] = round(avg_rating, 1)
    pg_dict["reviewCount"] = len(reviews)
    pg_dict["reviews"] = [r.to_dict() for r in reviews]

    return pg_dict

@router.get("/mess-listings")
def get_mess_listings(
    location: Optional[str] = None,
    foodType: Optional[str] = None,
    maxPrice: Optional[int] = None,
    page: int = Query(1, ge=1),
    limit: int = Query(10, ge=1, le=100),
    auth=Depends(optional_auth),
    db: Session = Depends(get_db)
):
    query = db.query(MessListing).filter(MessListing.status == 'active')

    if location:
        loc_pattern = f"%{location}%"
        query = query.filter(
            or_(
                MessListing.city.ilike(loc_pattern),
                MessListing.location.ilike(loc_pattern),
                MessListing.address.ilike(loc_pattern)
            )
        )

    if foodType and foodType.lower() != 'all':
        query = query.filter(
            or_(
                MessListing.food_type == foodType.lower(),
                MessListing.food_types == foodType.lower(),
                MessListing.food_type == 'both',
                MessListing.food_types == 'both'
            )
        )

    if maxPrice is not None:
        query = query.filter(MessListing.monthly_cost <= maxPrice)

    total_count = query.count()
    offset = (page - 1) * limit
    listings = query.order_by(desc(MessListing.rating), desc(MessListing.created_at)).offset(offset).limit(limit).all()

    return {
        "messListings": [m.to_dict() for m in listings],
        "pagination": {
            "currentPage": page,
            "totalPages": math.ceil(total_count / limit) if total_count > 0 else 1,
            "totalItems": total_count,
            "itemsPerPage": limit
        }
    }

@router.get("/mess-listings/{id}")
def get_mess_listing_by_id(
    id: int,
    auth=Depends(optional_auth),
    db: Session = Depends(get_db)
):
    mess = db.query(MessListing).filter(MessListing.id == id).first()
    if not mess:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail={"message": "Mess listing not found"}
        )

    reviews = db.query(Review).filter(Review.mess_listing_id == id).all()
    mess_dict = mess.to_dict()
    mess_dict["reviews"] = [r.to_dict() for r in reviews]
    return mess_dict

@router.get("/roommate-profile")
def get_roommate_profile(
    auth=Depends(require_student),
    db: Session = Depends(get_db)
):
    student, _ = auth
    profile = db.query(RoommateProfile).filter(RoommateProfile.student_id == student.id).first()
    if not profile:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail={"message": "Roommate profile not found"}
        )
    return profile.to_dict()

@router.put("/roommate-profile")
def update_roommate_profile(
    payload: RoommateProfileUpdate,
    auth=Depends(require_student),
    db: Session = Depends(get_db)
):
    student, _ = auth
    profile = db.query(RoommateProfile).filter(RoommateProfile.student_id == student.id).first()

    update_dict = payload.model_dump(exclude_unset=True)

    if profile:
        for k, v in update_dict.items():
            setattr(profile, k, v)
    else:
        profile = RoommateProfile(
            student_id=student.id,
            **update_dict
        )
        db.add(profile)

    db.commit()
    db.refresh(profile)

    return {
        "message": "Roommate profile updated successfully",
        "profile": profile.to_dict()
    }

@router.post("/bookmarks", status_code=status.HTTP_201_CREATED)
def add_bookmark(
    payload: BookmarkCreate,
    auth=Depends(require_student),
    db: Session = Depends(get_db)
):
    student, _ = auth

    # Check duplicate
    existing = db.query(Bookmark).filter(
        Bookmark.student_id == student.id,
        Bookmark.pg_listing_id == payload.pg_listing_id,
        Bookmark.mess_listing_id == payload.mess_listing_id,
        Bookmark.bookmark_type == payload.bookmark_type
    ).first()

    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail={"message": "Already bookmarked"}
        )

    bookmark = Bookmark(
        student_id=student.id,
        pg_listing_id=payload.pg_listing_id,
        mess_listing_id=payload.mess_listing_id,
        bookmark_type=payload.bookmark_type
    )
    db.add(bookmark)
    db.commit()
    db.refresh(bookmark)

    return {
        "message": "Bookmarked successfully",
        "bookmark": bookmark.to_dict()
    }

@router.get("/bookmarks")
def get_bookmarks(
    type: Optional[str] = None,
    auth=Depends(require_student),
    db: Session = Depends(get_db)
):
    student, _ = auth
    query = db.query(Bookmark).filter(Bookmark.student_id == student.id)
    if type:
        query = query.filter(Bookmark.bookmark_type == type)

    bookmarks = query.order_by(desc(Bookmark.created_at)).all()
    return [b.to_dict() for b in bookmarks]

@router.delete("/bookmarks/{id}")
def remove_bookmark(
    id: int,
    auth=Depends(require_student),
    db: Session = Depends(get_db)
):
    student, _ = auth
    bookmark = db.query(Bookmark).filter(
        Bookmark.id == id,
        Bookmark.student_id == student.id
    ).first()

    if not bookmark:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail={"message": "Bookmark not found"}
        )

    db.delete(bookmark)
    db.commit()

    return {"message": "Bookmark removed successfully"}

@router.post("/reviews", status_code=status.HTTP_201_CREATED)
def add_review(
    payload: ReviewCreate,
    auth=Depends(require_student),
    db: Session = Depends(get_db)
):
    student, _ = auth

    existing = db.query(Review).filter(
        Review.student_id == student.id,
        Review.pg_listing_id == payload.pg_listing_id,
        Review.mess_listing_id == payload.mess_listing_id,
        Review.review_type == payload.review_type
    ).first()

    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail={"message": "Review already exists"}
        )

    review = Review(
        student_id=student.id,
        pg_listing_id=payload.pg_listing_id,
        mess_listing_id=payload.mess_listing_id,
        rating=payload.rating,
        comment=payload.comment,
        review_type=payload.review_type
    )
    db.add(review)
    db.commit()
    db.refresh(review)

    # Update Mess rating if review is for mess
    if payload.review_type == 'mess' and payload.mess_listing_id:
        mess = db.query(MessListing).filter(MessListing.id == payload.mess_listing_id).first()
        if mess:
            all_mess_reviews = db.query(Review).filter(Review.mess_listing_id == mess.id).all()
            mess.total_reviews = len(all_mess_reviews)
            mess.rating = sum(r.rating for r in all_mess_reviews) / len(all_mess_reviews)
            db.commit()

    return {
        "message": "Review added successfully",
        "review": review.to_dict()
    }
