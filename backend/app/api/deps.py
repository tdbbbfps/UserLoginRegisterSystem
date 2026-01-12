from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from sqlalchemy.orm import Session
from pydantic import ValidationError

from database.database import get_database
from crud import user as user_crud
from schemas import token as token_schema
from core import jwt as core_jwt
from models.user import User

# tokenUrl point to the login endpoint that provides the token.
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="api/auth/token") 

def get_current_user_temp(token : str = Depends(oauth2_scheme)):
    """Dependency to get the current user from the token."""
    return token

async def get_current_user(db : Session = Depends(get_database), token : str = Depends(oauth2_scheme)) -> User:
    """Dependency to get the current user from the token."""
    # 認證失敗錯誤
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detial="Could not validate credentials.",
        headers={"WWW-Authenticate" : "Bearer"}
        )
    try:
        payload = jwt.decode(token, core_jwt.SECRET_KEY, algorithms=[core_jwt.ALGORITHM])
        username = payload.get("sub")
        if not username:
            raise credentials_exception
        token_data = token_schema.TokenData(username=username)
    except (JWTError, ValidationError):
        raise credentials_exception

    user = user_crud.read_user_by_username(db=db, username=token_data.username)
    return user
