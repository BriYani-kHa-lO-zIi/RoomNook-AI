import logging
from datetime import datetime
from contextlib import asynccontextmanager

from fastapi import FastAPI, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError

from app.config import settings
from app.database import init_db, SessionLocal, DB_ENGINE_TYPE
from app.seed_data import seed_database
from app.routers import auth, students, owners, admin, ai

# Setup logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s"
)
logger = logging.getLogger("roomnook_fastapi")

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: Initialize Database schema and seed data
    logger.info(" Initializing RoomNook AI database on %s...", DB_ENGINE_TYPE.upper())
    init_db()
    with SessionLocal() as db:
        seed_database(db)
    logger.info(" RoomNook AI FastAPI backend ready.")
    yield
    # Shutdown
    logger.info(" Shutting down RoomNook AI FastAPI backend.")

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description=settings.DESCRIPTION,
    lifespan=lifespan,
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins for local dev convenience
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Custom Validation Error Handler (Matches Express format for frontend)
@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    errors = exc.errors()
    first_msg = errors[0].get("msg") if errors else "Invalid request data"
    loc = ".".join(str(l) for l in errors[0].get("loc", [])) if errors else ""
    return JSONResponse(
        status_code=status.HTTP_400_BAD_REQUEST,
        content={
            "message": f"Validation error: {first_msg} ({loc})",
            "errors": errors
        }
    )

# Generic Exception Handler
@app.exception_handler(Exception)
async def generic_exception_handler(request: Request, exc: Exception):
    logger.error("Unhandled Exception: %s", exc, exc_info=True)
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={"message": "Internal server error"}
    )

# Mount all API routers under /api prefix
app.include_router(auth.router, prefix="/api")
app.include_router(students.router, prefix="/api")
app.include_router(owners.router, prefix="/api")
app.include_router(admin.router, prefix="/api")
app.include_router(ai.router, prefix="/api")

# Health check endpoint
@app.get("/api/health", tags=["Health"])
def health_check():
    return {
        "status": "OK",
        "message": "RoomNook AI Backend (FastAPI Python) is running!",
        "database": DB_ENGINE_TYPE,
        "timestamp": datetime.utcnow().isoformat()
    }

# Root welcome
@app.get("/", tags=["Health"])
def root():
    return {
        "project": "RoomNook AI FastAPI Backend",
        "version": settings.VERSION,
        "docs": "/docs",
        "health": "/api/health"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host=settings.HOST, port=settings.PORT, reload=True)
