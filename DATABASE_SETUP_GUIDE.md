# 🏡 RoomNook AI - Database Setup Guide

RoomNook AI uses **SQLAlchemy 2.0** as its database engine, which supports both **MySQL** (recommended for production) and an **automatic SQLite fallback** (ideal for local testing and zero-setup development).

---

## ⚡ Instant Start (No Setup Required)

If MySQL is not installed or currently offline, the FastAPI backend **automatically creates and connects to a local SQLite database** (`backend/roomnook_ai.db`). 

It also **automatically seeds** the database on first run with:
- **Verified PG listings** in Clement Town, Rajpur Road, and Dharampur
- **Mess listings** with meal plans and pricing
- **Student profiles** and roommate compatibility data
- **PG Owners** and an **Admin account**

You can start developing and testing right away without installing any database server!

---

## 🐬 Option: Connecting to MySQL (Production / Full Setup)

If you prefer to use MySQL:

### 1. Ensure MySQL is Installed & Running

- **Ubuntu / Debian**:
  ```bash
  sudo apt update
  sudo apt install mysql-server
  sudo systemctl start mysql
  ```
- **macOS (Homebrew)**:
  ```bash
  brew install mysql
  brew services start mysql
  ```
- **Windows**: Install MySQL Server or XAMPP.

### 2. Create the Database

Log in to MySQL and create the `roomnook_ai` database:

```sql
CREATE DATABASE roomnook_ai CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 3. Load Schema and Seed Data (Optional)

From the project root:

```bash
mysql -u root -p roomnook_ai < database/schema.sql
mysql -u root -p roomnook_ai < database/seed.sql
```

*(Note: If you don't load the SQL files manually, FastAPI's SQLAlchemy models will automatically create and seed the tables on startup when connected!)*

### 4. Configure `backend/.env`

Open `backend/.env` and update your MySQL credentials:

```env
DB_HOST=localhost
DB_USER=root
DB_PASS=your_mysql_password
DB_NAME=roomnook_ai
DB_PORT=3306
```

Restart the backend (`npm run dev` or `python run.py`), and it will connect directly to MySQL!

---

## 🧪 Test Demo Accounts

All pre-seeded demo accounts use the password: `password123`

- **Student**: `rohan@email.com` / `password123`
- **Student**: `priya@email.com` / `password123`
- **PG Owner**: `rajesh@email.com` / `password123`
- **Admin**: `admin@roomnook.com` / `password123`

---

## 🔍 Checking Database Connection Status

Visit the health check endpoint in your browser or with curl:

```bash
curl http://localhost:5000/api/health
```

Output:
```json
{
  "status": "OK",
  "message": "RoomNook AI Backend (FastAPI Python) is running!",
  "database": "mysql",
  "timestamp": "2026-10-28T12:00:00.000000"
}
```
The `"database"` key tells you whether the server is actively connected to `"mysql"` or using the `"sqlite"` fallback.
