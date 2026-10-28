"""Comprehensive test suite for RoomNook AI FastAPI backend"""
import sys
from pathlib import Path

# Add project root to sys.path
sys.path.insert(0, str(Path(__file__).resolve().parent))

from fastapi.testclient import TestClient
from main import app

def run_tests():
    with TestClient(app) as client:
        # 1. Health check
        res = client.get("/api/health")
        assert res.status_code == 200, res.text
        data = res.json()
        assert data["status"] == "OK"
        print("✅ Health check passed:", data)

        # 2. Student login
        res = client.post("/api/auth/login/student", json={
            "email": "rohan@email.com",
            "password": "password123"
        })
        assert res.status_code == 200, res.text
        data = res.json()
        assert "token" in data
        assert data["user"]["role"] == "student"
        student_token = data["token"]
        print("✅ Student login passed. Token obtained.")

        # 3. Owner login
        res = client.post("/api/auth/login/owner", json={
            "email": "rajesh@email.com",
            "password": "password123"
        })
        assert res.status_code == 200, res.text
        data = res.json()
        assert "token" in data
        assert data["user"]["role"] == "owner"
        print("✅ Owner login passed.")

        # 4. Admin login
        res = client.post("/api/auth/login/admin", json={
            "email": "admin@roomnook.com",
            "password": "password123"
        })
        assert res.status_code == 200, res.text
        data = res.json()
        assert "token" in data
        assert data["user"]["role"] in ["admin", "super_admin"]
        print("✅ Admin login passed.")

        # 5. PG Listings
        res = client.get("/api/students/pg-listings")
        assert res.status_code == 200, res.text
        data = res.json()
        assert "pgListings" in data
        assert "pagination" in data
        print(f"✅ PG listings returned {len(data['pgListings'])} listings.")

        # 6. Mess Listings
        res = client.get("/api/students/mess-listings")
        assert res.status_code == 200, res.text
        data = res.json()
        assert "messListings" in data
        print(f"✅ Mess listings returned {len(data['messListings'])} listings.")

        # 7. AI Assistant
        res = client.post("/api/ai/assistant", json={
            "query": "Looking for a single room PG near Clement Town under 8000"
        })
        assert res.status_code == 200, res.text
        data = res.json()
        assert "message" in data
        assert "recommendations" in data
        print("✅ AI Assistant chat passed:", data["message"][:80], "...")

        # 8. Protected student endpoints
        headers = {"Authorization": f"Bearer {student_token}"}

        # Profile
        p_res = client.get("/api/auth/profile", headers=headers)
        assert p_res.status_code == 200, p_res.text

        # Roommate profile
        rp_res = client.get("/api/students/roommate-profile", headers=headers)
        assert rp_res.status_code == 200, rp_res.text
        print("✅ Student profile and roommate profile passed.")

        # Recommendations
        rec_res = client.get("/api/ai/recommendations", headers=headers)
        assert rec_res.status_code == 200, rec_res.text
        print("✅ AI Recommendations passed.")

        # Perfect Match Score
        pm_res = client.get("/api/ai/perfect-match-score?pgId=1&roommateId=2&messId=1", headers=headers)
        assert pm_res.status_code == 200, pm_res.text
        pm_data = pm_res.json()
        assert "perfectMatchScore" in pm_data
        print("✅ Perfect Match Score calculation passed:", pm_data["perfectMatchScore"], "%")

if __name__ == "__main__":
    print("🧪 Running RoomNook AI FastAPI backend tests...")
    run_tests()
    print("\n🎉 ALL BACKEND TESTS PASSED SUCCESSFULLY! 🚀")
