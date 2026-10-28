# 🚀 RoomNook AI - FastAPI Backend (Python)

This is the Python (FastAPI) backend for **RoomNook AI**, designed as a high-performance drop-in replacement for the original Node.js Express backend. It seamlessly integrates with the existing **React (Vite) frontend** and **MySQL database**.

---

## 🌟 Key Features

- **High-Performance Async REST API**: Built using **FastAPI** with auto-generated interactive OpenAPI / Swagger documentation (`/docs`).
- **SQLAlchemy 2.0 ORM & Database Layer**: Supports both **MySQL** (via `pymysql`) and zero-config local **SQLite fallback** if MySQL is offline.
- **Auto-Seeding**: Automatically seeds initial verified PG listings, mess services, student profiles, and admin accounts on first run.
- **Native Hugging Face Integration**: Uses official `huggingface_hub` InferenceClient with seamless fallback to rule-based recommendation logic.
- **Robust Authentication**: JWT Bearer token authentication matching the exact token payload structure and expiration expected by the React frontend.
- **Perfect Match Score™ Engine**: Compatibility scoring algorithms for roommates, PG listings, and mess services.

---

## 📁 Architecture & File Layout

```
backend_fastapi/
├── app/
│   ├── config.py              # Configuration & environment variables
│   ├── database.py            # SQLAlchemy engine, session generator & connection tester
│   ├── models.py              # Database models (Student, PgOwner, Admin, PgListing, etc.)
│   ├── schemas.py             # Pydantic validation models
│   ├── security.py            # bcrypt password hashing & JWT handling
│   ├── dependencies.py        # Authentication & role-based middleware
│   ├── seed_data.py           # Initial verified listings and dummy data seeder
│   ├── utils/
│   │   ├── compatibility.py   # Lifestyle, budget & preference compatibility algorithms
│   │   └── match_score.py     # Complete match scoring & AI recommendation logic
│   └── routers/
│       ├── auth.py            # /api/auth endpoints (register, login, profile)
│       ├── students.py        # /api/students endpoints (listings, bookmarks, reviews)
│       ├── owners.py          # /api/owners endpoints (listings, dashboard, profile)
│       ├── admin.py           # /api/admin endpoints (verification, users, dashboard)
│       └── ai.py              # /api/ai endpoints (chat assistant, recommendations)
├── .env                       # Environment configuration
├── main.py                    # FastAPI application entrypoint & middleware
├── requirements.txt           # Python dependencies
├── run.py                     # Python server launcher
└── test_backend.py            # End-to-end API test suite
```

---

## 🛠️ Quick Start

### 1. Run via NPM (from `RoomNook-AI/RoomNook-AI`)

```bash
# Start FastAPI backend + React frontend concurrently
npm run dev

# Or start only the FastAPI backend
npm run dev:fastapi

# Run test suite
npm run test:fastapi
```

### 2. Run Directly with Python

```bash
cd backend_fastapi
../venv/bin/python run.py
```

The server starts on:
- **API Base**: `http://localhost:5000/api`
- **Interactive Swagger Docs**: `http://localhost:5000/docs`
- **ReDoc Documentation**: `http://localhost:5000/redoc`
- **Health Check**: `http://localhost:5000/api/health`

---

## 🔐 Default Demo Accounts

All demo accounts use password: `password123`

| Role | Email | Password |
| :--- | :--- | :--- |
| **Student** | `rohan@email.com` | `password123` |
| **Student** | `priya@email.com` | `password123` |
| **PG Owner** | `rajesh@email.com` | `password123` |
| **Admin** | `admin@roomnook.com` | `password123` |

---

## ⚙️ MySQL Configuration

In `backend_fastapi/.env`:

```env
DB_HOST=localhost
DB_USER=root
DB_PASS=root
DB_NAME=roomnook_ai
DB_PORT=3306
```

If MySQL is running, FastAPI automatically connects and utilizes it. If MySQL is offline, it safely falls back to local SQLite (`roomnook_ai.db`) so development never breaks.
