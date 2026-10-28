import logging
from datetime import datetime
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session

from app.config import settings
from app.database import get_db
from app.models import Student, PgListing, MessListing
from app.schemas import AiChatRequest
from app.dependencies import require_student, optional_auth
from app.utils.compatibility import calculate_compatibility
from app.utils.match_score import (
    calculate_complete_match_score,
    generate_recommendations,
    generate_ai_response
)

logger = logging.getLogger("roomnook_ai")
router = APIRouter(prefix="/ai", tags=["AI & Recommendations"])

# Initialize Hugging Face client if token is provided
hf_client = None
if settings.HF_TOKEN and settings.HF_TOKEN != "your_huggingface_token_here":
    try:
        from huggingface_hub import InferenceClient
        hf_client = InferenceClient(token=settings.HF_TOKEN)
        logger.info(" Hugging Face InferenceClient initialized.")
    except Exception as e:
        logger.warning(" Could not initialize Hugging Face client: %s", e)

@router.post("/assistant")
def chat_with_ai(
    payload: AiChatRequest,
    auth=Depends(optional_auth),
    db: Session = Depends(get_db)
):
    user, role = auth
    student = user if (user and role == "student") else {
        "id": 0,
        "name": "Student",
        "budget_min": 3000,
        "budget_max": 8000,
        "preferred_location": "Clement Town",
        "food_preference": "both",
        "cleanliness_level": "moderate",
        "lifestyle": "flexible",
        "smoking_preference": "non_smoker"
    }

    # Fetch data for recommendations
    pg_listings = db.query(PgListing).filter(PgListing.verification_status == "verified").all()
    students = db.query(Student).all()
    mess_listings = db.query(MessListing).filter(MessListing.status == "active").all()

    recommendations = generate_recommendations(student, pg_listings, students, mess_listings, limit=10)

    ai_response = None

    # Attempt Hugging Face if configured
    if hf_client:
        try:
            budget_str = f"₹{getattr(student, 'budget_min', 3000)}-{getattr(student, 'budget_max', 8000)}"
            loc_str = getattr(student, 'preferred_location', 'Clement Town')
            food_str = getattr(student, 'food_preference', 'both')
            life_str = getattr(student, 'lifestyle', 'flexible')

            system_prompt = (
                f"You are RoomNook AI, an intelligent assistant helping university students find verified PG accommodations, "
                f"compatible roommates, and mess services in Dehradun, India.\n"
                f"Student Profile: Budget {budget_str}, Location: {loc_str}, Food: {food_str}, Lifestyle: {life_str}.\n"
                f"Available PGs: {len(pg_listings)}, Available Roommates: {len(students)}, Available Mess Services: {len(mess_listings)}.\n"
                f"Provide concise, encouraging, and specific advice based on the user's query."
            )

            completion = hf_client.chat_completion(
                model="mistralai/Mistral-7B-Instruct-v0.2",
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": payload.query}
                ],
                max_tokens=250,
                temperature=0.7
            )

            msg_content = completion.choices[0].message.content

            ai_response = {
                "message": msg_content,
                "recommendations": recommendations[:3],
                "totalFound": len(recommendations),
                "studentProfile": {
                    "budget": budget_str,
                    "location": loc_str,
                    "foodPreference": food_str,
                    "lifestyle": life_str
                }
            }
        except Exception as hf_err:
            logger.warning("Hugging Face API call failed (%s). Falling back to rule-based AI engine.", hf_err)

    if not ai_response:
        ai_response = generate_ai_response(payload.query, student, recommendations)

    return {
        "message": ai_response["message"],
        "recommendations": ai_response["recommendations"],
        "totalFound": ai_response["totalFound"],
        "studentProfile": ai_response["studentProfile"],
        "timestamp": datetime.utcnow().isoformat()
    }

@router.get("/recommendations")
def get_student_recommendations(
    limit: int = Query(5, ge=1, le=20),
    auth=Depends(require_student),
    db: Session = Depends(get_db)
):
    student, _ = auth

    pg_listings = db.query(PgListing).filter(
        PgListing.status == "active",
        PgListing.verification_status == "verified"
    ).all()
    students = db.query(Student).all()
    mess_listings = db.query(MessListing).filter(MessListing.status == "active").all()

    recommendations = generate_recommendations(student, pg_listings, students, mess_listings, limit=limit)

    return {
        "recommendations": recommendations,
        "studentProfile": {
            "budget": f"{student.budget_min}-{student.budget_max}",
            "location": student.preferred_location,
            "foodPreference": student.food_preference,
            "lifestyle": student.lifestyle
        }
    }

@router.get("/compatibility/{roommate_id}")
def get_compatibility_analysis(
    roommate_id: int,
    auth=Depends(require_student),
    db: Session = Depends(get_db)
):
    student, _ = auth

    roommate = db.query(Student).filter(Student.id == roommate_id).first()
    if not roommate:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail={"message": "Roommate not found"}
        )

    score = calculate_compatibility(student, roommate)

    return {
        "overallScore": score,
        "studentProfile": {
            "name": student.name,
            "foodPreference": student.food_preference,
            "cleanlinessLevel": student.cleanliness_level,
            "lifestyle": student.lifestyle,
            "smokingPreference": student.smoking_preference
        },
        "roommateProfile": {
            "name": roommate.name,
            "foodPreference": roommate.food_preference,
            "cleanlinessLevel": roommate.cleanliness_level,
            "lifestyle": roommate.lifestyle,
            "smokingPreference": roommate.smoking_preference
        },
        "compatibilityBreakdown": {
            "food": "Perfect Match" if student.food_preference == roommate.food_preference else "Different Preferences",
            "cleanliness": "Perfect Match" if student.cleanliness_level == roommate.cleanliness_level else "Different Levels",
            "lifestyle": "Perfect Match" if student.lifestyle == roommate.lifestyle else "Different Schedules",
            "smoking": "Compatible" if student.smoking_preference == roommate.smoking_preference else "May Need Discussion"
        }
    }

@router.get("/perfect-match-score")
def get_perfect_match_score_endpoint(
    pgId: int = Query(..., description="PG Listing ID"),
    roommateId: Optional[int] = Query(None, description="Roommate Student ID"),
    messId: Optional[int] = Query(None, description="Mess Listing ID"),
    auth=Depends(require_student),
    db: Session = Depends(get_db)
):
    student, _ = auth

    pg = db.query(PgListing).filter(PgListing.id == pgId).first()
    if not pg:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail={"message": "PG listing not found"}
        )

    roommate = None
    if roommateId:
        roommate = db.query(Student).filter(Student.id == roommateId).first()
        if not roommate:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail={"message": "Roommate not found"}
            )

    mess = None
    if messId:
        mess = db.query(MessListing).filter(MessListing.id == messId).first()
        if not mess:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail={"message": "Mess listing not found"}
            )

    analysis = calculate_complete_match_score(student, pg, roommate, mess)
    score = analysis["perfectMatchScore"]

    rec_label = (
        "Excellent Match!" if score >= 80 else
        "Good Match" if score >= 60 else
        "Fair Match" if score >= 40 else
        "Consider Other Options"
    )

    total_cost = pg.rent_amount + (mess.monthly_cost if mess else 0)

    return {
        "perfectMatchScore": score,
        "breakdown": analysis["breakdown"],
        "totalMonthlyCost": total_cost,
        "recommendations": rec_label
    }
