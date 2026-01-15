from sqlalchemy.orm import Session
from models.user import User
from schemas import user
from core import security
from sqlalchemy import update
# CRUD

def create_user(db : Session, user_create : user.UserCreate) -> User:
    """Create a new user."""
    # Check if username or email already exists and check is password strong enough.
    if read_user_by_username(db, user_create.username):
        raise ValueError("Username already registered.")
    if read_user_by_email(db, user_create.email):
        raise ValueError("Email already registered.")
    if not security.is_password_strong(user_create.password):
        raise ValueError("Password is not strong enough.")
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

def update_user(db : Session, user_id : int, user_update : user.UserUpdate) -> User:
    """Update user data."""
    # Convert user schema to dict(ignore unset fields).
    data_to_update = user_update.model_dump(exclude_unset=True)
    if not data_to_update:
        return read_user_by_id(db, user_id)    
    if "username" in data_to_update:
        existing_user = read_user_by_username(db, data_to_update["username"])
        if existing_user and existing_user.id != user_id:
            raise ValueError("Username already registered.")
    if "email" in data_to_update:
        existing_user = read_user_by_email(db, data_to_update["email"])
        if existing_user and existing_user.id != user_id:
            raise ValueError("Email already registered.")
    if "password" in data_to_update:
        data_to_update["password"] = security.hash_password(data_to_update["password"])
    db.query(User).filter(User.id == user_id).update(data_to_update)
    db.commit()
    return read_user_by_id(db, user_id)

def delete_user(db : Session, user_id : int) -> bool:
    """Delete a user from database."""
    db_user = db.query(User).filter(User.id == user_id).first()
    if not db_user:
        return False
    db.delete(db_user)
    db.commit()
    return True

def update_user_password(db : Session, user_id : int, old_password : str, new_password : str) -> bool:
    """Update user password."""
    db_user = db.query(User).filter(User.id == user_id).first()
    if not db_user:
        raise ValueError("User not found.")
    # Verify old password.
    if not security.verify_password(old_password, db_user.password):
        raise ValueError("Old password is incorrect.")
    # Check new password strength.
    if not security.is_password_strong(new_password):
        raise ValueError("New password is not strong enough.")
    db_user.password = security.hash_password(new_password)
    db.commit()
    return True