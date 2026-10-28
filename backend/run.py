#!/usr/bin/env python3
import uvicorn
from app.config import settings

if __name__ == "__main__":
    print(f"🚀 Starting RoomNook AI FastAPI backend on http://localhost:{settings.PORT}")
    print(f"📖 Swagger interactive docs at http://localhost:{settings.PORT}/docs")
    uvicorn.run(
        "main:app",
        host=settings.HOST,
        port=settings.PORT,
        reload=True
    )
