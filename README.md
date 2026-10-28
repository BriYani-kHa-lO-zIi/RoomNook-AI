# 🏡 RoomNook AI - Smart PG, Roommate & Mess Finder for Students

A comprehensive full-stack web application that helps university students find verified PGs, compatible roommates, and mess services using AI-powered compatibility matching.

---

## ✨ Features

- **Perfect Match Score™ System**: AI-powered compatibility scoring for PG, roommate, and mess combinations.
- **Role-based Dashboards**: Separate tailored interfaces for students, PG owners, and admins.
- **AI Assistant**: Conversational assistant powered by Hugging Face Inference API with rule-based fallback.
- **Verified Listings**: Quality assurance through an admin verification workflow.
- **Advanced Filtering**: Search by location, budget, room type, food preferences, and lifestyle habits.
- **Real-time Compatibility**: Algorithmic scoring evaluating budget overlap, sleep schedule, cleanliness, and dietary habits.
- **Secure Authentication**: JWT Bearer token authentication with role-based access control.
- **Auto-Seeding & Database Fallback**: Built-in SQLite fallback and automatic demo data seeding so the app works instantly out of the box even before MySQL is configured.

---

## 🛠️ Tech Stack

### Backend (Python FastAPI)
- **FastAPI**: Modern, high-performance async REST API framework.
- **SQLAlchemy 2.0 ORM**: Robust database abstraction supporting MySQL (`pymysql`) and local SQLite fallback.
- **Pydantic v2**: High-speed request validation and schema definition.
- **PyJWT & bcrypt**: Cryptographic password hashing and JSON Web Token security.
- **Hugging Face Hub**: Official Python InferenceClient for LLM integration.
- **Swagger / OpenAPI**: Auto-generated interactive documentation at `/docs`.

### Frontend (React SPA)
- **React 18** with **Vite**: Rapid, modern frontend build tool.
- **Redux Toolkit**: Centralized state management for auth, listings, and bookmarks.
- **Tailwind CSS**: Utility-first responsive design.
- **React Router v6**: Client-side page navigation.
- **Axios**: HTTP client configured with auth interceptors.
- **Lucide React**: Clean, modern UI icon set.

---

## 📁 Project Structure

```
RoomNook-AI/
├── backend/
│   ├── app/
│   │   ├── config.py              # Environment configuration & settings
│   │   ├── database.py            # SQLAlchemy engine, session maker & connection tester
│   │   ├── models.py              # Database models (Student, PgOwner, Admin, PgListing, etc.)
│   │   ├── schemas.py             # Pydantic validation schemas
│   │   ├── security.py            # bcrypt hashing & JWT token handling
│   │   ├── dependencies.py        # Role-based auth dependencies
│   │   ├── seed_data.py           # Initial demo listings & user accounts
│   │   ├── utils/
│   │   │   ├── compatibility.py   # Lifestyle, budget & preference compatibility algorithms
│   │   │   └── match_score.py     # Perfect Match Score™ & recommendation engine
│   │   └── routers/
│   │       ├── auth.py            # /api/auth endpoints (register, login, profile)
│   │       ├── students.py        # /api/students endpoints (listings, bookmarks, reviews)
│   │       ├── owners.py          # /api/owners endpoints (listings, dashboard, profile)
│   │       ├── admin.py           # /api/admin endpoints (verification, users, dashboard)
│   │       └── ai.py              # /api/ai endpoints (chat assistant, recommendations)
│   ├── main.py                    # FastAPI application entrypoint & middleware
│   ├── requirements.txt           # Python backend dependencies
│   ├── run.py                     # Python server launcher
│   └── test_backend.py            # Automated API verification test suite
│
├── frontend/
│   ├── src/
│   │   ├── components/            # Reusable UI components (Navbar, Footer, Slider, ChatBot)
│   │   ├── pages/                 # Route pages (Home, Listings, Dashboards, ChatAssistant)
│   │   ├── redux/                 # Redux Toolkit store and slices (auth, pg, mess)
│   │   ├── api/                   # Axios client instance
│   │   ├── App.jsx                # Main application component
│   │   └── main.jsx               # React DOM entry point
│   ├── package.json
│   └── vite.config.js
│
├── database/
│   ├── schema.sql                 # MySQL schema definitions
│   └── seed.sql                   # MySQL initial seed scripts
│
├── venv/                          # Python virtual environment
├── package.json                   # Root orchestrator scripts
└── README.md
```

---

## 🚀 Quick Start

### Prerequisites
- **Node.js** (v16 or higher)
- **Python** (3.10 or higher)
- **MySQL** (Optional — SQLite runs automatically as a zero-config fallback)

### 1. Install & Setup

```bash
# Install frontend dependencies
npm run setup

# Activate virtual environment and install backend requirements
./venv/bin/pip install -r backend/requirements.txt
```

### 2. Start Development Servers

Run both the FastAPI backend and React frontend concurrently:
```bash
npm run dev
```

Or run them individually:
```bash
# Terminal 1: Backend (FastAPI on http://localhost:5000)
npm run dev:backend

# Terminal 2: Frontend (Vite on http://localhost:3000)
npm run dev:frontend
```

### 3. Run Automated Tests

Verify that all backend endpoints, authentication flows, and AI algorithms work:
```bash
npm run test
```

---

## 🌐 Application URLs

| Service | URL | Description |
| :--- | :--- | :--- |
| **Frontend** | `http://localhost:3000` | Main Student & Owner Marketplace UI |
| **FastAPI Backend** | `http://localhost:5000/api` | REST API base URL |
| **Interactive Docs** | `http://localhost:5000/docs` | Swagger UI for testing API endpoints |
| **ReDoc Documentation** | `http://localhost:5000/redoc` | Clean technical API reference |
| **Health Check** | `http://localhost:5000/api/health` | Backend status & database engine info |

---

## 🔐 Default Demo Accounts

All pre-seeded demo accounts use password: `password123`

| Role | Email | Password | Access Level |
| :--- | :--- | :--- | :--- |
| **Student** | `rohan@email.com` | `password123` | Search PGs, AI chat, bookmarks, roommate profiles |
| **Student** | `priya@email.com` | `password123` | Student dashboard & roommate match |
| **PG Owner** | `rajesh@email.com` | `password123` | Create listings, manage applications, owner dashboard |
| **Admin** | `admin@roomnook.com` | `password123` | Verify listings, toggle user status, platform analytics |

---

## ⚙️ Configuration & Environment Variables

### Backend (`backend/.env`)

```env
# Database (MySQL configuration)
DB_HOST=localhost
DB_USER=root
DB_PASS=root
DB_NAME=roomnook_ai
DB_PORT=3306

# JWT Authentication
JWT_SECRET=supersecretkey123456789_roomnook_ai_fastapi_jwt_secret_key_32bytes
JWT_EXPIRE_DAYS=7

# Server Configuration
PORT=5000
HOST=0.0.0.0
ENVIRONMENT=development

# Frontend CORS
FRONTEND_URL=http://localhost:3000

# Optional Hugging Face Token (for AI Chat Assistant)
HF_TOKEN=your_huggingface_token_here
```

> **Note on Database**: If your MySQL server is running, FastAPI will connect to MySQL. If MySQL is not running or credentials differ, the backend automatically uses `backend/roomnook_ai.db` (SQLite) with pre-seeded listings so you can develop and test immediately without barriers.

---

## 📊 API Endpoints Overview

### Authentication (`/api/auth`)
- `POST /api/auth/register/student` - Register student profile
- `POST /api/auth/login/student` - Student login
- `POST /api/auth/register/owner` - Register PG owner
- `POST /api/auth/login/owner` - PG owner login
- `POST /api/auth/login/admin` - Admin login
- `GET /api/auth/profile` - Get current user profile (Protected)
- `PUT /api/auth/profile` - Update user profile (Protected)

### Student Marketplace (`/api/students`)
- `GET /api/students/pg-listings` - Filter PG listings by budget, room type, location
- `GET /api/students/pg-listings/{id}` - Detailed PG listing info with reviews
- `GET /api/students/mess-listings` - Filter mess services
- `GET /api/students/mess-listings/{id}` - Detailed mess listing info
- `GET /api/students/roommate-profile` - Student's roommate profile
- `PUT /api/students/roommate-profile` - Create / update roommate profile
- `POST /api/students/bookmarks` - Bookmark a PG or mess
- `GET /api/students/bookmarks` - View saved bookmarks
- `DELETE /api/students/bookmarks/{id}` - Remove bookmark
- `POST /api/students/reviews` - Submit review for PG or mess

### PG Owner Operations (`/api/owners`)
- `POST /api/owners/pg-listings` - Create new PG listing
- `GET /api/owners/pg-listings` - View owner's PG listings & ratings
- `PUT /api/owners/pg-listings/{id}` - Update listing
- `DELETE /api/owners/pg-listings/{id}` - Delete listing
- `GET /api/owners/dashboard` - Owner statistics (listings, reviews, applications)
- `GET /api/owners/profile` - View owner profile
- `PUT /api/owners/profile` - Update owner profile

### Administration (`/api/admin`)
- `GET /api/admin/dashboard` - Platform statistics & recent activity
- `GET /api/admin/students` - View & search registered students
- `GET /api/admin/owners` - View & search registered owners
- `PUT /api/admin/owners/{id}/verify` - Verify or reject owner
- `PUT /api/admin/users/{id}/status` - Block / unblock user
- `GET /api/admin/pg-listings` - All listings for administrative audit
- `PUT /api/admin/pg-listings/{id}/verify` - Approve or reject PG listing
- `GET /api/admin/reviews` - View all reviews across platform

### AI & Compatibility Matching (`/api/ai`)
- `POST /api/ai/assistant` - Intelligent natural language accommodation assistant
- `GET /api/ai/recommendations` - Top personalized PG + Roommate + Mess packages
- `GET /api/ai/compatibility/{roommate_id}` - Detailed compatibility breakdown
- `GET /api/ai/perfect-match-score` - Compute Perfect Match Score™ for any combination
