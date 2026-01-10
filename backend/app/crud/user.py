from sqlalchemy.orm import Session
from models.user import User
from schemas import user
from core import security
# CRUD
def create_user(db : Session, user_create : user.UserCreate) -> User:
    """Create a new user."""
    db_user = User(
        username=user_create.username,
        name=user_create.name,
        password=security.hash_password(user_create.password),
        email=user_create.email,
        bio=user_create.bio if user_create.bio else None
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user