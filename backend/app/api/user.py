from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from database.database import get_database
from models import user as user_model
from schemas import user as user_schema
from crud import user as user_crud

router = APIRouter()

@router.get('/')
async def root() -> dict:
    return {"message" : "Here's User API endpoint."}

@router.post('/create', response_model=user_schema.User, status_code=status.HTTP_201_CREATED)
async def create_user(user : user_schema.UserCreate, db : Session = Depends(get_database)):
    try:
        db_user = user_crud.create_user(db, user)
        if not db_user:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Failed creating user.")
        return db_user
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))