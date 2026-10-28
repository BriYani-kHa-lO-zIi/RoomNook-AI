from typing import Optional, List, Dict, Any, Union
from pydantic import BaseModel, EmailStr, Field

# Authentication & Registration
class StudentRegister(BaseModel):
    name: str = Field(..., min_length=1)
    email: EmailStr
    password: str = Field(..., min_length=6)
    phone: Optional[str] = None
    university: Optional[str] = None
    course: Optional[str] = None
    year_of_study: Optional[Union[int, str]] = None
    budget_min: Optional[Union[int, str]] = 3000
    budget_max: Optional[Union[int, str]] = 10000
    preferred_location: Optional[str] = None
    food_preference: Optional[str] = "both"
    cleanliness_level: Optional[str] = "moderate"
    lifestyle: Optional[str] = "flexible"
    smoking_preference: Optional[str] = "non_smoker"

class OwnerRegister(BaseModel):
    name: str = Field(..., min_length=1)
    email: EmailStr
    password: str = Field(..., min_length=6)
    phone: Optional[str] = None
    address: Optional[str] = None

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class ProfileUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[EmailStr] = None
    phone: Optional[str] = None
    university: Optional[str] = None
    course: Optional[str] = None
    year_of_study: Optional[int] = None
    budget_min: Optional[int] = None
    budget_max: Optional[int] = None
    preferred_location: Optional[str] = None
    food_preference: Optional[str] = None
    cleanliness_level: Optional[str] = None
    lifestyle: Optional[str] = None
    smoking_preference: Optional[str] = None
    address: Optional[str] = None

# Roommate Profile
class RoommateProfileUpdate(BaseModel):
    bio: Optional[str] = Field(None, max_length=500)
    interests: Optional[List[str]] = None
    study_schedule: Optional[str] = None
    social_level: Optional[str] = "ambivert"
    party_frequency: Optional[str] = "sometimes"
    guest_policy: Optional[str] = "moderate"
    is_looking_for_roommate: Optional[bool] = True

# Bookmarks & Reviews
class BookmarkCreate(BaseModel):
    pg_listing_id: Optional[int] = None
    mess_listing_id: Optional[int] = None
    bookmark_type: str = Field(..., pattern="^(pg|mess)$")

class ReviewCreate(BaseModel):
    pg_listing_id: Optional[int] = None
    mess_listing_id: Optional[int] = None
    rating: int = Field(..., ge=1, le=5)
    comment: Optional[str] = Field(None, max_length=1000)
    review_type: str = Field(..., pattern="^(pg|mess)$")

# PG Listings
class PgListingCreateUpdate(BaseModel):
    title: str = Field(..., min_length=1)
    description: Optional[str] = Field(None, max_length=2000)
    address: str = Field(..., min_length=1)
    location: Optional[str] = None
    city: Optional[str] = None
    rent_amount: int = Field(..., ge=1000)
    deposit_amount: Optional[int] = 0
    room_type: str = Field(..., pattern="^(single|double|triple|shared|quad)$")
    gender_preference: Optional[str] = "any"
    available_from: Optional[str] = None
    amenities: Optional[List[str]] = None
    rules: Optional[str] = Field(None, max_length=1000)
    images: Optional[List[str]] = None
    contact_phone: Optional[str] = None
    contact_email: Optional[str] = None

# Admin
class VerificationUpdate(BaseModel):
    verification_status: str = Field(..., pattern="^(verified|rejected|pending)$")

class UserStatusUpdate(BaseModel):
    userType: str = Field(..., pattern="^(student|owner)$")
    isBlocked: bool

# AI Assistant
class AiChatRequest(BaseModel):
    query: str = Field(..., min_length=1)
