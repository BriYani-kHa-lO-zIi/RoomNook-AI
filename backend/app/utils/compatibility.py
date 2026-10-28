import math
from typing import Dict, Any, List

WEIGHTS = {
    'lifestyle': 0.3,
    'food': 0.2,
    'cleanliness': 0.2,
    'budget': 0.15,
    'location': 0.15
}

def get_attr(obj: Any, key: str, default: Any = None):
    """Safely get attribute whether obj is a dict or SQLAlchemy model"""
    if isinstance(obj, dict):
        return obj.get(key, default)
    return getattr(obj, key, default)

def calculate_cleanliness_score(level_a: str, level_b: str) -> float:
    levels = {'very_clean': 3, 'moderate': 2, 'casual': 1}
    score_a = levels.get(level_a, 2)
    score_b = levels.get(level_b, 2)
    diff = abs(score_a - score_b)
    return max(0, 100 - (diff * 30))

def calculate_lifestyle_score(lifestyle_a: str, lifestyle_b: str) -> float:
    if lifestyle_a == 'flexible' or lifestyle_b == 'flexible':
        return 80.0
    if lifestyle_a == lifestyle_b:
        return 100.0
    return 40.0  # Early bird vs night owl

def calculate_budget_score(student_a: Any, student_b: Any) -> float:
    min_a = get_attr(student_a, 'budget_min') or 3000
    max_a = get_attr(student_a, 'budget_max') or 10000
    min_b = get_attr(student_b, 'budget_min') or 3000
    max_b = get_attr(student_b, 'budget_max') or 10000

    avg_budget_a = (min_a + max_a) / 2
    avg_budget_b = (min_b + max_b) / 2

    diff = abs(avg_budget_a - avg_budget_b)
    avg_budget = (avg_budget_a + avg_budget_b) / 2

    if avg_budget == 0:
        return 50.0

    percentage_diff = (diff / avg_budget) * 100
    return max(0.0, 100.0 - percentage_diff)

def calculate_compatibility(student_a: Any, student_b: Any) -> int:
    score = 0.0

    food_a = get_attr(student_a, 'food_preference') or 'both'
    food_b = get_attr(student_b, 'food_preference') or 'both'

    if food_a == food_b or food_a == 'both' or food_b == 'both':
        score += 100 * WEIGHTS['food']
    else:
        score += 50 * WEIGHTS['food']

    clean_a = get_attr(student_a, 'cleanliness_level') or 'moderate'
    clean_b = get_attr(student_b, 'cleanliness_level') or 'moderate'
    if clean_a == clean_b:
        score += 100 * WEIGHTS['cleanliness']
    else:
        cleanliness_score = calculate_cleanliness_score(clean_a, clean_b)
        score += cleanliness_score * WEIGHTS['cleanliness']

    life_a = get_attr(student_a, 'lifestyle') or 'flexible'
    life_b = get_attr(student_b, 'lifestyle') or 'flexible'
    if life_a == life_b:
        score += 100 * WEIGHTS['lifestyle']
    else:
        lifestyle_score = calculate_lifestyle_score(life_a, life_b)
        score += lifestyle_score * WEIGHTS['lifestyle']

    budget_score = calculate_budget_score(student_a, student_b)
    score += budget_score * WEIGHTS['budget']

    loc_a = get_attr(student_a, 'preferred_location') or ''
    loc_b = get_attr(student_b, 'preferred_location') or ''
    if loc_a and loc_b and loc_a.lower() == loc_b.lower():
        score += 100 * WEIGHTS['location']
    else:
        score += 30 * WEIGHTS['location']

    return round(min(score, 100.0))

def perfect_match_score(pg_score: float, roommate_score: float, mess_score: float) -> int:
    return round((pg_score * 0.4) + (roommate_score * 0.4) + (mess_score * 0.2))

def calculate_pg_compatibility(student: Any, pg_listing: Any) -> int:
    score = 0.0

    b_min = get_attr(student, 'budget_min') or 3000
    b_max = get_attr(student, 'budget_max') or 10000
    rent = get_attr(pg_listing, 'rent_amount') or 5000

    if b_min <= rent <= b_max:
        score += 100 * 0.4
    else:
        budget_diff = abs(rent - ((b_min + b_max) / 2))
        max_budget = max(b_max, rent)
        score += max(0.0, 100.0 - (budget_diff / max_budget) * 100) * 0.4

    pref_loc = (get_attr(student, 'preferred_location') or '').lower()
    pg_loc = (get_attr(pg_listing, 'location') or get_attr(pg_listing, 'city') or '').lower()
    if pref_loc and (pref_loc in pg_loc or pg_loc in pref_loc):
        score += 100 * 0.3
    else:
        score += 50 * 0.3

    room_type = get_attr(pg_listing, 'room_type') or 'double'
    room_scores = {'single': 100, 'double': 80, 'triple': 60, 'shared': 50, 'quad': 40}
    score += room_scores.get(room_type, 60) * 0.2

    gender_pref = get_attr(pg_listing, 'gender_preference') or 'any'
    student_gender = get_attr(student, 'gender') or 'any'
    if gender_pref == 'any' or gender_pref == student_gender:
        score += 100 * 0.1
    else:
        score += 0.0

    return round(score)

def calculate_mess_compatibility(student: Any, mess_listing: Any) -> int:
    score = 0.0

    food_pref = get_attr(student, 'food_preference') or 'both'
    mess_food = get_attr(mess_listing, 'food_type') or get_attr(mess_listing, 'food_types') or 'both'

    if food_pref == mess_food or food_pref == 'both' or mess_food == 'both':
        score += 100 * 0.5
    else:
        score += 0.0

    b_min = get_attr(student, 'budget_min') or 3000
    b_max = get_attr(student, 'budget_max') or 10000
    cost = get_attr(mess_listing, 'monthly_cost') or 3000

    budget_score = max(0.0, 100.0 - abs(cost - ((b_min + b_max) / 2)) / 100.0)
    score += budget_score * 0.3

    pref_loc = (get_attr(student, 'preferred_location') or '').lower()
    mess_loc = (get_attr(mess_listing, 'location') or get_attr(mess_listing, 'city') or '').lower()
    if pref_loc and (pref_loc in mess_loc or mess_loc in pref_loc):
        score += 100 * 0.2
    else:
        score += 50 * 0.2

    return round(score)

def find_compatible_roommates(student: Any, all_students: List[Any], limit: int = 10) -> List[Dict[str, Any]]:
    compatible = []
    student_id = get_attr(student, 'id')

    for other in all_students:
        other_id = get_attr(other, 'id')
        if other_id == student_id:
            continue
        
        comp_score = calculate_compatibility(student, other)
        compatible.append({
            "student": other,
            "compatibilityScore": comp_score
        })

    compatible.sort(key=lambda x: x["compatibilityScore"], reverse=True)
    return compatible[:limit]
