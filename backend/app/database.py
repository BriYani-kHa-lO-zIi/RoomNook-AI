import logging
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker

from app.config import settings

logger = logging.getLogger("roomnook_database")
logging.basicConfig(level=logging.INFO)

Base = declarative_base()

def get_engine():
    # Attempt MySQL first
    try:
        mysql_engine = create_engine(
            settings.MYSQL_URL,
            pool_pre_ping=True,
            pool_recycle=3600,
            echo=False
        )
        # Test connection
        with mysql_engine.connect() as conn:
            logger.info(" Connected successfully to MySQL database: %s", settings.DB_NAME)
        return mysql_engine, "mysql"
    except Exception as exc:
        logger.warning(
            " MySQL connection failed (%s). Falling back to local SQLite database: %s",
            exc,
            settings.SQLITE_FALLBACK_URL
        )
        sqlite_engine = create_engine(
            settings.SQLITE_FALLBACK_URL,
            connect_args={"check_same_thread": False},
            echo=False
        )
        return sqlite_engine, "sqlite"

engine, DB_ENGINE_TYPE = get_engine()
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def get_db():
    """FastAPI Dependency for database session management"""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def init_db():
    """Create all tables in the database if they don't exist"""
    from app import models  # noqa: F401
    Base.metadata.create_all(bind=engine)
    logger.info(" Database schema verified and synchronized.")
