from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from api.user import router as user_router
from api.auth import router as auth_router
import uvicorn
from database.database import Base, engine
from models.user import User


@asynccontextmanager
async def lifespan(app : FastAPI):
    """Lifespan context manager to create database tables on server startup."""
    Base.metadata.create_all(bind=engine)
    yield
    # Run code on shutdown.

app = FastAPI(
    title="User Login/Register System API",
    description="API for user login and registration system.",
    version="1.0.0",
    lifespan=lifespan
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PATCH", "DELETE"],
    allow_headers=["*"],
)
app.include_router(user_router, prefix="/api/user", tags=["user"])
app.include_router(auth_router, prefix="/api/auth", tags=["auth"])

@app.get('/')
async def root():
    return {"message" : "Here's root of the API."}

if __name__ == "__main__":
    uvicorn.run("app.main:app", host="127.0.0.1", port=8000, reload=True)
    