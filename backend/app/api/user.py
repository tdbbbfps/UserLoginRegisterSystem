from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from database.database import get_database
from models import user as user_model
from schemas import user as user_schema
from crud import user as user_crud
from api.deps import get_current_user
router = APIRouter()

@router.post('/', response_model=user_schema.User, status_code=status.HTTP_201_CREATED)
async def create_user(user : user_schema.UserCreate, db : Session = Depends(get_database)):
    """Create a new user."""
    try:
        db_user = user_crud.create_user(db=db, user_create=user)
        return db_user
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))

@router.get('/me', response_model=user_schema.User, status_code=status.HTTP_200_OK)
async def read_current_user(current_user : user_model.User = Depends(get_current_user)):
    """Read current user."""
    return current_user

@router.get('/{user_id}', response_model=user_schema.User, status_code=status.HTTP_200_OK)
async def read_user(user_id : int, db : Session = Depends(get_database)):
    """Read a user by ID."""
    db_user = user_crud.read_user_by_id(db=db, user_id=user_id)
    if not db_user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found.")
    return db_user

@router.patch('/{user_id}', response_model=user_schema.User, status_code=status.HTTP_200_OK)
async def update_user(user_id : int, user_update : user_schema.UserUpdate, db : Session = Depends(get_database)):
    """Update user data."""
    try:
        db_user = user_crud.update_user(db=db, user_id=user_id, user_update=user_update)
        if not db_user:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found.")
        return db_user
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))

@router.delete('/{user_id}', status_code=status.HTTP_204_NO_CONTENT) # 204 don't need to return anything.
async def delete_user(user_id : int, db : Session = Depends(get_database)):
    """Delete a user from database."""
    if not user_crud.delete_user(db=db, user_id=user_id):
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found.")
