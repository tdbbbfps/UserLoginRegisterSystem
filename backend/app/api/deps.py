from fastapi.security import OAuth2PasswordBearer
from fastapi import Depends

# tokenUrl point to the login endpoint that provides the token.
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="api/auth/token") 

def get_current_user(token : str = Depends(oauth2_scheme)):
    """Dependency to get the current user from the token."""
    return token