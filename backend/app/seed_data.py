import logging
from datetime import datetime, date
from sqlalchemy.orm import Session
from app.models import Student, PgOwner, Admin, PgListing, RoommateProfile, MessListing, Review
from app.security import hash_password

logger = logging.getLogger("roomnook_seeder")

def seed_database(db: Session):
    """Seed initial data if database is empty"""
    try:
        # Check if already seeded
        if db.query(Admin).first():
            return

        logger.info(" Seeding database with initial students, owners, PGs, mess, and admin...")

        # 1. Admin
        admin = Admin(
            name="Admin User",
            email="admin@roomnook.com",
            password=hash_password("password123"),
            role="super_admin"
        )
        db.add(admin)

        # 2. PG Owners
        owner1 = PgOwner(
            name="Rajesh Gupta",
            email="rajesh@email.com",
            password=hash_password("password123"),
            phone="+91-9876543220",
            address="123 Clement Town, Dehradun",
            verification_status="verified"
        )
        owner2 = PgOwner(
            name="Sunita Devi",
            email="sunita@email.com",
            password=hash_password("password123"),
            phone="+91-9876543221",
            address="456 Rajpur Road, Dehradun",
            verification_status="verified"
        )
        db.add_all([owner1, owner2])
        db.flush()

        # 3. Students
        s1 = Student(
            name="Rohan Sharma",
            email="rohan@email.com",
            password=hash_password("password123"),
            phone="+91-9876543210",
            university="DIT University",
            course="Computer Science",
            year_of_study=3,
            budget_min=4000,
            budget_max=8000,
            preferred_location="Clement Town",
            food_preference="veg",
            cleanliness_level="very_clean",
            lifestyle="early_bird",
            smoking_preference="non_smoker"
        )
        s2 = Student(
            name="Priya Sharma",
            email="priya@email.com",
            password=hash_password("password123"),
            phone="+91-9876543211",
            university="Graphic Era University",
            course="Software Engineering",
            year_of_study=2,
            budget_min=5000,
            budget_max=10000,
            preferred_location="Clement Town",
            food_preference="veg",
            cleanliness_level="very_clean",
            lifestyle="early_bird",
            smoking_preference="non_smoker"
        )
        s3 = Student(
            name="Arjun Negi",
            email="arjun@email.com",
            password=hash_password("password123"),
            phone="+91-9876543212",
            university="UPES",
            course="Electronics",
            year_of_study=2,
            budget_min=5000,
            budget_max=10000,
            preferred_location="Rajpur Road",
            food_preference="non-veg",
            cleanliness_level="moderate",
            lifestyle="night_owl",
            smoking_preference="okay_with_smoking"
        )
        s4 = Student(
            name="Anjali Singh",
            email="anjali@email.com",
            password=hash_password("password123"),
            phone="+91-9876543213",
            university="DIT University",
            course="Management",
            year_of_study=1,
            budget_min=4000,
            budget_max=7000,
            preferred_location="Dharampur",
            food_preference="veg",
            cleanliness_level="moderate",
            lifestyle="flexible",
            smoking_preference="non_smoker"
        )
        db.add_all([s1, s2, s3, s4])
        db.flush()

        # 4. Roommate Profiles
        rp1 = RoommateProfile(
            student_id=s1.id,
            bio="CS student at DIT. Love coding, gaming, and quiet late evening reading. Looking for a clean roommate.",
            interests=["Coding", "Gaming", "Music", "Fitness"],
            study_schedule="Evening and Night",
            social_level="ambivert",
            party_frequency="sometimes",
            guest_policy="moderate",
            is_looking_for_roommate=True
        )
        rp2 = RoommateProfile(
            student_id=s2.id,
            bio="Organized and quiet software engineering student looking for a shared room in Clement Town.",
            interests=["Reading", "Writing", "Cooking", "Yoga"],
            study_schedule="Early morning",
            social_level="introvert",
            party_frequency="never",
            guest_policy="strict",
            is_looking_for_roommate=True
        )
        db.add_all([rp1, rp2])

        # 5. PG Listings
        pg1 = PgListing(
            owner_id=owner1.id,
            title="Modern Student PG Clement Town",
            description="Fully furnished PG for students near DIT and Graphic Era. High-speed WiFi, power backup, study desks, and home food.",
            address="Plot 42, Subhash Nagar, Clement Town",
            location="Clement Town, Dehradun",
            city="Dehradun",
            state="Uttarakhand",
            pincode="248002",
            rent_amount=5500,
            deposit_amount=10000,
            room_type="double",
            gender_preference="any",
            available_from=date(2024, 1, 15),
            amenities=["WiFi", "AC", "RO Water", "Parking", "Food", "Security", "Laundry"],
            images=["https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=600&h=400&fit=crop"],
            rules="No loud music after 10 PM. Visitors allowed in common area.",
            verification_status="verified",
            status="active"
        )
        pg2 = PgListing(
            owner_id=owner2.id,
            title="Comfort Zone PG Rajpur Road",
            description="Premium single & double rooms with attached washrooms, balcony view, and round-the-clock security.",
            address="88 Rajpur Road, Near Jakhan",
            location="Rajpur Road, Dehradun",
            city="Dehradun",
            state="Uttarakhand",
            pincode="248001",
            rent_amount=7500,
            deposit_amount=15000,
            room_type="single",
            gender_preference="any",
            available_from=date(2024, 2, 1),
            amenities=["WiFi", "AC", "RO Water", "Power Backup", "Security", "CCTV", "Balcony"],
            images=["https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600&h=400&fit=crop"],
            rules="No smoking inside rooms. Gate closes at 10:30 PM.",
            verification_status="verified",
            status="active"
        )
        pg3 = PgListing(
            owner_id=owner1.id,
            title="Student Hub Affordable PG",
            description="Economical triple sharing rooms designed for university students on a budget. Includes high-speed fiber internet.",
            address="15 Dharampur Chowk",
            location="Dharampur, Dehradun",
            city="Dehradun",
            state="Uttarakhand",
            pincode="248001",
            rent_amount=4000,
            deposit_amount=8000,
            room_type="triple",
            gender_preference="any",
            available_from=date(2024, 1, 20),
            amenities=["WiFi", "RO Water", "Geyser", "Study Table", "Security"],
            images=["https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=600&h=400&fit=crop"],
            rules="Keep common areas clean.",
            verification_status="verified",
            status="active"
        )
        db.add_all([pg1, pg2, pg3])

        # 6. Mess Listings
        m1 = MessListing(
            name="Annapurna Student Mess",
            description="Pure vegetarian home-style North and South Indian meals prepared with fresh ingredients and zero soda.",
            address="Near DIT Gate, Clement Town",
            location="Clement Town, Dehradun",
            city="Dehradun",
            state="Uttarakhand",
            pincode="248002",
            monthly_cost=3000,
            food_type="veg",
            food_types="veg",
            meal_timing="Breakfast: 7:30-9:30 AM, Lunch: 12:30-2:30 PM, Dinner: 7:30-9:30 PM",
            contact_phone="+91-9876543230",
            contact_email="annapurna@email.com",
            meal_plans=["Breakfast", "Lunch", "Dinner"],
            pricing={"monthly": 3000, "per_meal": 60},
            delivery_available=True,
            rating=4.5,
            total_reviews=28,
            images=["https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&h=400&fit=crop"],
            status="active"
        )
        m2 = MessListing(
            name="Pahadi Flavors & Multi-Cuisine Mess",
            description="Delicious North Indian and Garhwali meals with both veg and non-veg options on Wednesdays and Sundays.",
            address="Rajpur Road Near Silver City",
            location="Rajpur Road, Dehradun",
            city="Dehradun",
            state="Uttarakhand",
            pincode="248001",
            monthly_cost=3500,
            food_type="both",
            food_types="both",
            meal_timing="Breakfast: 8:00-10:00 AM, Lunch: 1:00-3:00 PM, Dinner: 8:00-10:00 PM",
            contact_phone="+91-9876543231",
            contact_email="pahadiflavors@email.com",
            meal_plans=["Breakfast", "Lunch", "Dinner"],
            pricing={"monthly": 3500, "per_meal": 80},
            delivery_available=True,
            rating=4.3,
            total_reviews=34,
            images=["https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&h=400&fit=crop"],
            status="active"
        )
        db.add_all([m1, m2])
        db.flush()

        # 7. Reviews
        r1 = Review(
            student_id=s1.id,
            pg_listing_id=pg1.id,
            rating=5,
            comment="Awesome PG! Owner is very supportive and WiFi is always fast.",
            review_type="pg"
        )
        r2 = Review(
            student_id=s2.id,
            mess_listing_id=m1.id,
            rating=4,
            comment="Healthy and hygienic home-style food. Highly recommended for students.",
            review_type="mess"
        )
        db.add_all([r1, r2])

        db.commit()
        logger.info(" Seed data successfully inserted.")
    except Exception as e:
        db.rollback()
        logger.error(" Seed data insertion error: %s", e)
