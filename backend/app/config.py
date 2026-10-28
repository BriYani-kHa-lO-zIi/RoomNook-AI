import os
from pathlib import Path
from dotenv import load_dotenv

# Load .env file
env_path = Path(__file__).resolve().parent.parent / '.env'
load_dotenv(dotenv_path=env_path)

class Settings:
    PROJECT_NAME: str = "RoomNook AI"
    VERSION: str = "1.0.0"
    DESCRIPTION: str = "FastAPI Backend for RoomNook AI - Smart PG, Roommate & Mess Finder for Students"
    
    # Server
    HOST: str = os.getenv("HOST", "0.0.0.0")
    PORT: int = int(os.getenv("PORT", "5000"))
    ENVIRONMENT: str = os.getenv("ENVIRONMENT", "development")
    
    # JWT
    JWT_SECRET: str = os.getenv("JWT_SECRET", "supersecretkey123456789_roomnook_ai_fastapi_jwt_secret_key_32bytes")
    JWT_ALGORITHM: str = "HS256"
    JWT_EXPIRE_DAYS: int = int(os.getenv("JWT_EXPIRE_DAYS", "7"))
    
    # Database
    DB_HOST: str = os.getenv("DB_HOST", "localhost")
    DB_USER: str = os.getenv("DB_USER", "root")
    DB_PASS: str = os.getenv("DB_PASS", "root")
    DB_NAME: str = os.getenv("DB_NAME", "roomnook_ai")
    DB_PORT: int = int(os.getenv("DB_PORT", "3306"))
    
    # Hugging Face
    HF_TOKEN: str = os.getenv("HF_TOKEN", "")

    # CORS
    CORS_ORIGINS: list = [
        "http://localhost:3000",
        "http://localhost:3001",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:3001",
    ]

    @property
    def MYSQL_URL(self) -> str:
        custom_url = os.getenv("DATABASE_URL")
        if custom_url:
            return custom_url
        return f"mysql+pymysql://{self.DB_USER}:{self.DB_PASS}@{self.DB_HOST}:{self.DB_PORT}/{self.DB_NAME}?charset=utf8mb4"

    @property
    def SQLITE_FALLBACK_URL(self) -> str:
        db_file = Path(__file__).resolve().parent.parent / "roomnook_ai.db"
        return f"sqlite:///{db_file}"

settings = Settings()
