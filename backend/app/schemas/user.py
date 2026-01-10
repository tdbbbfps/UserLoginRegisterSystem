from pydantic import BaseModel, Field, EmailStr, ConfigDict
from typing import Optional

# Base schema for User. Includes common and public fields(email, username, bio).
class UserBase(BaseModel):
    email : EmailStr = Field(..., description="The email address of the user.")
    username : str = Field(..., min_length=3, max_length=50, description="The username of the user.")
    name : str = Field(..., min_length=1, max_length=100, description="The display name of the user.")
    bio : Optional[str] = Field(None, description="A brief self-introduction of the user.")

# Schema for creating a new user. Includes username, password, and email.
class UserCreate(UserBase):
    password : str = Field(..., min_length=8, description="The password for the user account.")

# Schema for updating user. All fields are optional.
class UserUpdate(BaseModel):
    email : Optional[EmailStr] = Field(None, description="The new email address of the user.")
    username : Optional[str] = Field(None, min_length=3, max_length=50, description="The new username of the user.")
    password : Optional[str] = Field(None, min_length=8, description="The new password for the user account.")
    name : Optional[str] = Field(None, min_length=1, max_length=100, description="The display name of the user.")
    bio : Optional[str] = Field(..., description="A brief self-introduction of the user.")

class User(UserBase):
    id : int = Field(..., description="The unique identifier of the user.")

    model_config = ConfigDict(from_attributes=True)