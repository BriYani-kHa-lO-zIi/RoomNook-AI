from datetime import datetime
from sqlalchemy import (
    Column, Integer, String, Text, Boolean, Float,
    ForeignKey, DateTime, Date, JSON
)
from sqlalchemy.orm import relationship
from app.database import Base

class Student(Base):
    __tablename__ = 'students'

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    name = Column(String(100), nullable=False)
    email = Column(String(100), unique=True, nullable=False, index=True)
    password = Column(String(255), nullable=False)
    phone = Column(String(15), nullable=True)
    university = Column(String(100), nullable=True)
    course = Column(String(100), nullable=True)
    year_of_study = Column(Integer, nullable=True)
    budget_min = Column(Integer, default=3000)
    budget_max = Column(Integer, default=10000)
    preferred_location = Column(String(100), nullable=True)
    food_preference = Column(String(20), default='both')  # 'veg', 'non-veg', 'both'
    cleanliness_level = Column(String(20), default='moderate')  # 'very_clean', 'moderate', 'casual'
    lifestyle = Column(String(20), default='flexible')  # 'early_bird', 'night_owl', 'flexible'
    smoking_preference = Column(String(20), default='non_smoker')  # 'non_smoker', 'smoker', 'okay_with_smoking'
    is_blocked = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    roommate_profile = relationship("RoommateProfile", back_populates="student", uselist=False, cascade="all, delete-orphan")
    reviews = relationship("Review", back_populates="student", cascade="all, delete-orphan")
    bookmarks = relationship("Bookmark", back_populates="student", cascade="all, delete-orphan")
    applications = relationship("PgApplication", back_populates="student", cascade="all, delete-orphan")

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "email": self.email,
            "phone": self.phone,
            "university": self.university,
            "course": self.course,
            "year_of_study": self.year_of_study,
            "budget_min": self.budget_min,
            "budget_max": self.budget_max,
            "preferred_location": self.preferred_location,
            "food_preference": self.food_preference,
            "cleanliness_level": self.cleanliness_level,
            "lifestyle": self.lifestyle,
            "smoking_preference": self.smoking_preference,
            "role": "student",
            "isBlocked": self.is_blocked,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None,
        }

class PgOwner(Base):
    __tablename__ = 'pg_owners'

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    name = Column(String(100), nullable=False)
    email = Column(String(100), unique=True, nullable=False, index=True)
    password = Column(String(255), nullable=False)
    phone = Column(String(15), nullable=True)
    address = Column(Text, nullable=True)
    verification_status = Column(String(20), default='pending')  # 'pending', 'verified', 'rejected'
    is_blocked = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    pg_listings = relationship("PgListing", back_populates="owner", cascade="all, delete-orphan")

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "email": self.email,
            "phone": self.phone,
            "address": self.address,
            "verification_status": self.verification_status,
            "role": "owner",
            "isBlocked": self.is_blocked,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None,
        }

class Admin(Base):
    __tablename__ = 'admins'

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    name = Column(String(100), nullable=False)
    email = Column(String(100), unique=True, nullable=False, index=True)
    password = Column(String(255), nullable=False)
    role = Column(String(20), default='admin')  # 'super_admin', 'admin'
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    def to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "email": self.email,
            "role": self.role or "admin",
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None,
        }

class PgListing(Base):
    __tablename__ = 'pg_listings'

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    owner_id = Column(Integer, ForeignKey('pg_owners.id', ondelete='CASCADE'), nullable=False)
    title = Column(String(200), nullable=False)
    description = Column(Text, nullable=True)
    address = Column(Text, nullable=False)
    city = Column(String(50), nullable=True, default="Dehradun")
    location = Column(String(100), nullable=True, default="Clement Town")
    state = Column(String(50), nullable=True, default="Uttarakhand")
    pincode = Column(String(10), nullable=True, default="248002")
    rent_amount = Column(Integer, nullable=False)
    deposit_amount = Column(Integer, default=0)
    room_type = Column(String(20), nullable=False)  # 'single', 'double', 'triple', 'shared', 'quad'
    gender_preference = Column(String(20), default='any')  # 'male', 'female', 'any'
    available_from = Column(Date, nullable=True)
    images = Column(JSON, nullable=True, default=list)
    amenities = Column(JSON, nullable=True, default=list)
    rules = Column(Text, nullable=True)
    contact_phone = Column(String(15), nullable=True)
    contact_email = Column(String(100), nullable=True)
    latitude = Column(Float, nullable=True)
    longitude = Column(Float, nullable=True)
    status = Column(String(20), default='active')  # 'active', 'inactive', 'booked'
    verification_status = Column(String(20), default='pending')  # 'pending', 'verified', 'rejected'
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    owner = relationship("PgOwner", back_populates="pg_listings")
    reviews = relationship("Review", back_populates="pg_listing", cascade="all, delete-orphan")
    bookmarks = relationship("Bookmark", back_populates="pg_listing", cascade="all, delete-orphan")
    applications = relationship("PgApplication", back_populates="pg_listing", cascade="all, delete-orphan")

    def to_dict(self):
        loc = self.location or self.city or "Dehradun"
        return {
            "id": self.id,
            "owner_id": self.owner_id,
            "title": self.title,
            "description": self.description,
            "address": self.address,
            "city": self.city or loc,
            "location": loc,
            "state": self.state,
            "pincode": self.pincode,
            "rent_amount": self.rent_amount,
            "deposit_amount": self.deposit_amount,
            "room_type": self.room_type,
            "gender_preference": self.gender_preference or "any",
            "available_from": str(self.available_from) if self.available_from else None,
            "images": self.images or [],
            "amenities": self.amenities or [],
            "rules": self.rules,
            "contact_phone": self.contact_phone,
            "contact_email": self.contact_email,
            "latitude": self.latitude,
            "longitude": self.longitude,
            "status": self.status,
            "verification_status": self.verification_status,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None,
            "owner": {
                "name": self.owner.name if self.owner else "Owner",
                "phone": self.owner.phone if self.owner else None,
                "email": self.owner.email if self.owner else None,
                "verification_status": self.owner.verification_status if self.owner else "pending"
            } if self.owner else None
        }

class RoommateProfile(Base):
    __tablename__ = 'roommate_profile'

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    student_id = Column(Integer, ForeignKey('students.id', ondelete='CASCADE'), nullable=False)
    bio = Column(Text, nullable=True)
    interests = Column(JSON, nullable=True, default=list)
    study_schedule = Column(String(100), nullable=True)
    social_level = Column(String(20), default='ambivert')  # 'introvert', 'extrovert', 'ambivert'
    party_frequency = Column(String(20), default='sometimes')  # 'never', 'rarely', 'sometimes', 'often'
    guest_policy = Column(String(20), default='moderate')  # 'strict', 'moderate', 'flexible'
    is_looking_for_roommate = Column(Boolean, default=True)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    student = relationship("Student", back_populates="roommate_profile")

    def to_dict(self):
        return {
            "id": self.id,
            "student_id": self.student_id,
            "bio": self.bio,
            "interests": self.interests or [],
            "study_schedule": self.study_schedule,
            "social_level": self.social_level,
            "party_frequency": self.party_frequency,
            "guest_policy": self.guest_policy,
            "is_looking_for_roommate": self.is_looking_for_roommate,
            "is_active": self.is_active,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None,
            "student": {
                "id": self.student.id,
                "name": self.student.name,
                "email": self.student.email,
                "university": self.student.university,
                "course": self.student.course,
                "year_of_study": self.student.year_of_study
            } if self.student else None
        }

class MessListing(Base):
    __tablename__ = 'mess_listings'

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    name = Column(String(200), nullable=False)
    description = Column(Text, nullable=True)
    address = Column(Text, nullable=False)
    city = Column(String(50), nullable=True, default="Dehradun")
    location = Column(String(100), nullable=True, default="Clement Town")
    state = Column(String(50), nullable=True, default="Uttarakhand")
    pincode = Column(String(10), nullable=True, default="248002")
    monthly_cost = Column(Integer, nullable=True, default=3000)
    food_type = Column(String(20), nullable=True, default='both')  # 'veg', 'non-veg', 'both'
    food_types = Column(String(20), nullable=True, default='both')
    meal_timing = Column(String(100), nullable=True, default="Breakfast: 8-10 AM, Lunch: 1-3 PM, Dinner: 8-10 PM")
    contact_phone = Column(String(15), nullable=True)
    contact_email = Column(String(100), nullable=True)
    meal_plans = Column(JSON, nullable=True, default=list)
    pricing = Column(JSON, nullable=True, default=dict)
    service_hours = Column(JSON, nullable=True, default=dict)
    delivery_available = Column(Boolean, default=False)
    rating = Column(Float, default=4.0)
    total_reviews = Column(Integer, default=0)
    images = Column(JSON, nullable=True, default=list)
    status = Column(String(20), default='active')  # 'active', 'inactive'
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    reviews = relationship("Review", back_populates="mess_listing", cascade="all, delete-orphan")
    bookmarks = relationship("Bookmark", back_populates="mess_listing", cascade="all, delete-orphan")

    def to_dict(self):
        loc = self.location or self.city or "Dehradun"
        ft = self.food_type or self.food_types or "both"
        return {
            "id": self.id,
            "name": self.name,
            "description": self.description,
            "address": self.address,
            "city": self.city or loc,
            "location": loc,
            "state": self.state,
            "pincode": self.pincode,
            "monthly_cost": self.monthly_cost or 3000,
            "food_type": ft,
            "food_types": ft,
            "meal_timing": self.meal_timing,
            "contact_phone": self.contact_phone,
            "contact_email": self.contact_email,
            "meal_plans": self.meal_plans or ["Breakfast", "Lunch", "Dinner"],
            "pricing": self.pricing or {"monthly": self.monthly_cost or 3000},
            "service_hours": self.service_hours or {},
            "delivery_available": self.delivery_available,
            "rating": round(float(self.rating or 4.0), 1),
            "total_reviews": self.total_reviews or 0,
            "images": self.images or [],
            "status": self.status or "active",
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None
        }

class Review(Base):
    __tablename__ = 'reviews'

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    student_id = Column(Integer, ForeignKey('students.id', ondelete='CASCADE'), nullable=False)
    pg_listing_id = Column(Integer, ForeignKey('pg_listings.id', ondelete='CASCADE'), nullable=True)
    mess_listing_id = Column(Integer, ForeignKey('mess_listings.id', ondelete='CASCADE'), nullable=True)
    rating = Column(Integer, nullable=False)
    comment = Column(Text, nullable=True)
    review_type = Column(String(10), nullable=False)  # 'pg', 'mess'
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    student = relationship("Student", back_populates="reviews")
    pg_listing = relationship("PgListing", back_populates="reviews")
    mess_listing = relationship("MessListing", back_populates="reviews")

    def to_dict(self):
        return {
            "id": self.id,
            "student_id": self.student_id,
            "pg_listing_id": self.pg_listing_id,
            "mess_listing_id": self.mess_listing_id,
            "rating": self.rating,
            "comment": self.comment,
            "review_type": self.review_type,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None,
            "student": {
                "id": self.student.id,
                "name": self.student.name,
                "email": self.student.email
            } if self.student else None,
            "pgListing": {
                "id": self.pg_listing.id,
                "title": self.pg_listing.title,
                "location": self.pg_listing.location or self.pg_listing.city
            } if self.pg_listing else None,
            "messListing": {
                "id": self.mess_listing.id,
                "name": self.mess_listing.name,
                "location": self.mess_listing.location or self.mess_listing.city
            } if self.mess_listing else None
        }

class Bookmark(Base):
    __tablename__ = 'bookmarks'

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    student_id = Column(Integer, ForeignKey('students.id', ondelete='CASCADE'), nullable=False)
    pg_listing_id = Column(Integer, ForeignKey('pg_listings.id', ondelete='CASCADE'), nullable=True)
    mess_listing_id = Column(Integer, ForeignKey('mess_listings.id', ondelete='CASCADE'), nullable=True)
    bookmark_type = Column(String(10), nullable=False)  # 'pg', 'mess'
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    student = relationship("Student", back_populates="bookmarks")
    pg_listing = relationship("PgListing", back_populates="bookmarks")
    mess_listing = relationship("MessListing", back_populates="bookmarks")

    def to_dict(self):
        return {
            "id": self.id,
            "student_id": self.student_id,
            "pg_listing_id": self.pg_listing_id,
            "mess_listing_id": self.mess_listing_id,
            "bookmark_type": self.bookmark_type,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None,
            "pgListing": self.pg_listing.to_dict() if self.pg_listing else None,
            "messListing": self.mess_listing.to_dict() if self.mess_listing else None
        }

class PgApplication(Base):
    __tablename__ = 'pg_applications'

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    student_id = Column(Integer, ForeignKey('students.id', ondelete='CASCADE'), nullable=False)
    pg_listing_id = Column(Integer, ForeignKey('pg_listings.id', ondelete='CASCADE'), nullable=False)
    status = Column(String(20), default='pending')  # 'pending', 'accepted', 'rejected', 'withdrawn'
    application_date = Column(DateTime, default=datetime.utcnow)
    message = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    student = relationship("Student", back_populates="applications")
    pg_listing = relationship("PgListing", back_populates="applications")

    def to_dict(self):
        return {
            "id": self.id,
            "student_id": self.student_id,
            "pg_listing_id": self.pg_listing_id,
            "status": self.status,
            "application_date": self.application_date.isoformat() if self.application_date else None,
            "message": self.message,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None,
            "student": self.student.to_dict() if self.student else None,
            "pgListing": self.pg_listing.to_dict() if self.pg_listing else None
        }
