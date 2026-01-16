from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from database.database import get_database
from core import jwt, security
from crud import user as user_crud
from datetime import timedelta
router = APIRouter()

@router.post('/token', status_code=status.HTTP_200_OK)
async def login_for_access_token(form_data : OAuth2PasswordRequestForm = Depends(), db : Session = Depends(get_database)):
    """Authenticate user and return access token."""
    # The OAuth2PasswordRequestForm has two attributes: username and password.
    user = user_crud.read_user_by_username(db=db, username=form_data.username)
    if not user or not security.verify_password(plain_password=form_data.password, hashed_password=user.password):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Incorrect username or password.", headers={"WWW-Authenticate" : "Bearer"})
    # Toekn expiration time
    access_token_expires = timedelta(minutes=jwt.ACCESS_TOKEN_EXPIRE_MINUTES)
    # sub(subject) is a standard claim in JWT to identify the principal that is the subject of the JWT. (Usually username or ID)
    access_token = jwt.create_access_token(
        data={"sub" : user.username}, expires_delta=access_token_expires
    )
    return {"access_token" : access_token, "token_type" : "bearer"}