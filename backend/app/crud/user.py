from sqlalchemy.orm import Session
from models.user import User
from schemas import user
from core import security

# CRUD

def create_user(db : Session, user_create : user.UserCreate) -> User:
    """Create a new user."""
    # Check if username or email already exists and check is password strong enough.
    if read_user_by_username(db, user_create.username):
        return
    if read_user_by_email(db, user_create.email):
        return
    if not security.is_password_strong(user_create.password):
        return
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

def read_user_by_id(db : Session, user_id : int) -> User:
    """Read a user by ID."""
    return db.query(User).filter(User.id == user_id).first()

def read_user_by_username(db : Session, username : str) -> User:
    """Read a user by username."""
    return db.query(User).filter(User.username == username).first()

def read_user_by_email(db : Session, email : str) -> User:
    """Read a user by email."""
    return db.query(User).filter(User.email == email).first()