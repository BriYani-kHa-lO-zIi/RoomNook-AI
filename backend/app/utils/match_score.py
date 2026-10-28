import re
from typing import Dict, Any, List, Optional
from app.utils.compatibility import (
    calculate_compatibility,
    calculate_pg_compatibility,
    calculate_mess_compatibility,
    perfect_match_score,
    find_compatible_roommates,
    get_attr
)

def calculate_complete_match_score(
    student: Any,
    pg_listing: Any,
    roommate: Optional[Any] = None,
    mess_listing: Optional[Any] = None
) -> Dict[str, Any]:
    pg_score = calculate_pg_compatibility(student, pg_listing)
    roommate_score = calculate_compatibility(student, roommate) if roommate else 0
    mess_score = calculate_mess_compatibility(student, mess_listing) if mess_listing else 0

    perfect_score = perfect_match_score(pg_score, roommate_score, mess_score)

    return {
        "perfectMatchScore": perfect_score,
        "pgScore": pg_score,
        "roommateScore": roommate_score,
        "messScore": mess_score,
        "breakdown": {
            "pg": {"score": pg_score, "weight": 0.4},
            "roommate": {"score": roommate_score, "weight": 0.4},
            "mess": {"score": mess_score, "weight": 0.2}
        }
    }

def generate_recommendations(
    student: Any,
    pg_listings: List[Any],
    students: List[Any],
    mess_listings: List[Any],
    limit: int = 5
) -> List[Dict[str, Any]]:
    recommendations = []

    # Active & verified PGs
    active_pgs = [
        pg for pg in pg_listings
        if get_attr(pg, 'verification_status') == 'verified' and get_attr(pg, 'status', 'active') == 'active'
    ]
    # Active mess listings
    active_mess = [
        mess for mess in mess_listings
        if get_attr(mess, 'status', 'active') == 'active'
    ]

    compatible_roommates = find_compatible_roommates(student, students, limit=10)

    # If no compatible roommates, still recommend PGs & Mess
    if not compatible_roommates and students:
        compatible_roommates = [{"student": s, "compatibilityScore": 50} for s in students if get_attr(s, 'id') != get_attr(student, 'id')][:5]

    for pg in active_pgs:
        rent = get_attr(pg, 'rent_amount') or 5000
        for r_entry in (compatible_roommates or [None]):
            roommate = r_entry["student"] if r_entry else None
            for mess in (active_mess or [None]):
                mess_cost = get_attr(mess, 'monthly_cost') or 3000 if mess else 0
                match_analysis = calculate_complete_match_score(student, pg, roommate, mess)

                recommendations.append({
                    "pg": {
                        "id": get_attr(pg, 'id'),
                        "title": get_attr(pg, 'title'),
                        "location": get_attr(pg, 'location') or get_attr(pg, 'city'),
                        "rent_amount": rent,
                        "room_type": get_attr(pg, 'room_type'),
                        "amenities": get_attr(pg, 'amenities') or []
                    },
                    "roommate": {
                        "id": get_attr(roommate, 'id') if roommate else 0,
                        "name": get_attr(roommate, 'name') if roommate else "Any Roommate",
                        "university": get_attr(roommate, 'university') if roommate else "",
                        "course": get_attr(roommate, 'course') if roommate else "",
                        "bio": get_attr(roommate, 'bio', 'No bio available')
                    } if roommate else None,
                    "mess": {
                        "id": get_attr(mess, 'id') if mess else 0,
                        "name": get_attr(mess, 'name') if mess else "Standard Mess",
                        "location": get_attr(mess, 'location') or get_attr(mess, 'city') if mess else "",
                        "monthly_cost": mess_cost,
                        "food_type": get_attr(mess, 'food_type') or get_attr(mess, 'food_types') if mess else "both",
                        "rating": float(get_attr(mess, 'rating') or 4.0)
                    } if mess else None,
                    "perfectMatchScore": match_analysis["perfectMatchScore"],
                    "breakdown": match_analysis["breakdown"],
                    "totalMonthlyCost": rent + mess_cost
                })

    recommendations.sort(key=lambda x: x["perfectMatchScore"], reverse=True)
    return recommendations[:limit]

def generate_ai_response(
    query: str,
    student: Any,
    recommendations: List[Dict[str, Any]]
) -> Dict[str, Any]:
    # Extract potential budget and location keywords
    budget_match = re.search(r'\d+', query)
    budget = int(budget_match.group(0)) if budget_match else (get_attr(student, 'budget_max') or 10000)

    loc_match = re.search(r'near\s+([A-Za-z\s]+)', query, re.IGNORECASE)
    location = loc_match.group(1).strip() if loc_match else (get_attr(student, 'preferred_location') or 'Dehradun')

    filtered = [
        rec for rec in recommendations
        if rec["totalMonthlyCost"] <= budget * 1.3 or location.lower() in str(rec["pg"].get("location", "")).lower()
    ]
    if not filtered:
        filtered = recommendations

    top = filtered[:3]

    return {
        "message": f"Here are the top student accommodation options near {location} under ₹{budget} with AI Perfect Match Scores™:",
        "recommendations": [
            {
                "pg": rec["pg"]["title"],
                "roommate": rec["roommate"]["name"] if rec.get("roommate") else "Compatible Match",
                "mess": rec["mess"]["name"] if rec.get("mess") else "Local Mess",
                "score": rec["perfectMatchScore"],
                "totalCost": rec["totalMonthlyCost"],
                "breakdown": rec["breakdown"]
            } for rec in top
        ],
        "totalFound": len(filtered),
        "studentProfile": {
            "budget": f"₹{get_attr(student, 'budget_min', 3000)}-{get_attr(student, 'budget_max', 10000)}",
            "location": get_attr(student, 'preferred_location', 'Dehradun'),
            "foodPreference": get_attr(student, 'food_preference', 'both'),
            "lifestyle": get_attr(student, 'lifestyle', 'flexible')
        }
    }
