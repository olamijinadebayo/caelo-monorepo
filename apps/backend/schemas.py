from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime
from models import UserRole


class UserBase(BaseModel):
    email: EmailStr
    name: str
    organization: Optional[str] = None


class UserCreate(UserBase):
    password: str
    role: UserRole


class UserResponse(UserBase):
    id: int
    role: UserRole
    is_active: bool
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class Token(BaseModel):
    access_token: str
    token_type: str
    user: dict


class TokenData(BaseModel):
    email: Optional[str] = None
    role: Optional[str] = None
