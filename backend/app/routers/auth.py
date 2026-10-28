from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import Student, PgOwner, Admin
from app.schemas import StudentRegister, OwnerRegister, LoginRequest, ProfileUpdate
from app.security import hash_password, verify_password, create_access_token
from app.dependencies import get_current_user_and_role

router = APIRouter(prefix="/auth", tags=["Authentication"])

@router.post("/register/student", status_code=status.HTTP_201_CREATED)
def register_student(payload: StudentRegister, db: Session = Depends(get_db)):
    # Check if student exists
    existing = db.query(Student).filter(Student.email == payload.email).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail={"message": "Student already exists with this email"}
        )

    # Convert potential str budget to int
    budget_min = int(payload.budget_min) if payload.budget_min not in (None, "") else 3000
    budget_max = int(payload.budget_max) if payload.budget_max not in (None, "") else 10000
    year_of_study = int(payload.year_of_study) if payload.year_of_study not in (None, "") else None

    student = Student(
        name=payload.name,
        email=payload.email,
        password=hash_password(payload.password),
        phone=payload.phone or None,
        university=payload.university or None,
        course=payload.course or None,
        year_of_study=year_of_study,
        budget_min=budget_min,
        budget_max=budget_max,
        preferred_location=payload.preferred_location or None,
        food_preference=payload.food_preference or "both",
        cleanliness_level=payload.cleanliness_level or "moderate",
        lifestyle=payload.lifestyle or "flexible",
        smoking_preference=payload.smoking_preference or "non_smoker"
    )
    db.add(student)
    db.commit()
    db.refresh(student)

    token = create_access_token(student.id, "student")

    return {
        "message": "Student registered successfully",
        "token": token,
        "user": {
            "id": student.id,
            "name": student.name,
            "email": student.email,
            "role": "student"
        }
    }

@router.post("/login/student")
def login_student(payload: LoginRequest, db: Session = Depends(get_db)):
    student = db.query(Student).filter(Student.email == payload.email).first()
    if not student or not verify_password(payload.password, student.password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail={"message": "Invalid credentials"}
        )

    if student.is_blocked:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail={"message": "Account has been suspended by administration"}
        )

    token = create_access_token(student.id, "student")

    return {
        "message": "Login successful",
        "token": token,
        "user": {
            "id": student.id,
            "name": student.name,
            "email": student.email,
            "role": "student"
        }
    }

@router.post("/register/owner", status_code=status.HTTP_201_CREATED)
def register_owner(payload: OwnerRegister, db: Session = Depends(get_db)):
    existing = db.query(PgOwner).filter(PgOwner.email == payload.email).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail={"message": "Owner already exists with this email"}
        )

    owner = PgOwner(
        name=payload.name,
        email=payload.email,
        password=hash_password(payload.password),
        phone=payload.phone or None,
        address=payload.address or None
    )
    db.add(owner)
    db.commit()
    db.refresh(owner)

    token = create_access_token(owner.id, "owner")

    return {
        "message": "Owner registered successfully",
        "token": token,
        "user": {
            "id": owner.id,
            "name": owner.name,
            "email": owner.email,
            "role": "owner"
        }
    }

@router.post("/login/owner")
def login_owner(payload: LoginRequest, db: Session = Depends(get_db)):
    owner = db.query(PgOwner).filter(PgOwner.email == payload.email).first()
    if not owner or not verify_password(payload.password, owner.password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail={"message": "Invalid credentials"}
        )

    if owner.is_blocked:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail={"message": "Account has been suspended by administration"}
        )

    token = create_access_token(owner.id, "owner")

    return {
        "message": "Login successful",
        "token": token,
        "user": {
            "id": owner.id,
            "name": owner.name,
            "email": owner.email,
            "role": "owner"
        }
    }

@router.post("/login/admin")
def login_admin(payload: LoginRequest, db: Session = Depends(get_db)):
    admin = db.query(Admin).filter(Admin.email == payload.email).first()
    if not admin or not verify_password(payload.password, admin.password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail={"message": "Invalid credentials"}
        )

    token = create_access_token(admin.id, "admin")

    return {
        "message": "Admin login successful",
        "token": token,
        "user": {
            "id": admin.id,
            "name": admin.name,
            "email": admin.email,
            "role": admin.role or "admin"
        }
    }

@router.get("/profile")
def get_profile(auth=Depends(get_current_user_and_role)):
    user, role = auth
    return {
        "user": user.to_dict(),
        "role": role
    }

@router.put("/profile")
def update_profile(
    payload: ProfileUpdate,
    auth=Depends(get_current_user_and_role),
    db: Session = Depends(get_db)
):
    user, role = auth
    update_data = payload.model_dump(exclude_unset=True)

    for field, value in update_data.items():
        if hasattr(user, field):
            setattr(user, field, value)

    db.commit()
    db.refresh(user)

    return {
        "message": "Profile updated successfully",
        "user": user.to_dict()
    }
