"""
Enhanced Authentication Module for Caelo Backend.

Provides JWT-based authentication with role-based access control,
user registration, and comprehensive security features.
"""

import os
from datetime import datetime, timedelta, timezone
from typing import Optional, List, Union
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from passlib.context import CryptContext
from jose import JWTError, jwt
import bcrypt
import uuid

from database import get_db
from models_new import User, UserRole
from schemas_new import TokenData, UserResponse


# Configuration
SECRET_KEY = os.getenv("JWT_SECRET_KEY", "dev-secret-key-change-in-production")
ALGORITHM = os.getenv("JWT_ALGORITHM", "HS256")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "30"))

# Security
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login")


# ===== PASSWORD UTILITIES =====

def hash_password(password: str) -> str:
    """Hash a password using bcrypt."""
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify a password against its hash."""
    try:
        return bcrypt.checkpw(plain_password.encode('utf-8'), hashed_password.encode('utf-8'))
    except Exception:
        return False


# ===== JWT TOKEN UTILITIES =====

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    """Create a JWT access token."""
    to_encode = data.copy()
    
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    
    to_encode.update({
        "exp": expire,
        "iat": datetime.now(timezone.utc),
        "type": "access"
    })
    
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


def decode_access_token(token: str) -> Optional[TokenData]:
    """Decode and validate a JWT access token."""
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        
        # Verify token type
        if payload.get("type") != "access":
            return None
            
        email: str = payload.get("sub")
        role: str = payload.get("role")
        
        if email is None:
            return None
            
        token_data = TokenData(
            email=email,
            role=UserRole(role) if role else None
        )
        return token_data
        
    except (JWTError, ValueError):
        return None


# ===== USER AUTHENTICATION =====

def authenticate_user(db: Session, email: str, password: str) -> Optional[User]:
    """Authenticate a user with email and password."""
    user = db.query(User).filter(User.email == email).first()
    
    if not user:
        return None
    
    if not user.is_active:
        return None
        
    if not verify_password(password, user.password_hash):
        return None
    
    # Update last login
    user.last_login = datetime.now(timezone.utc)
    db.commit()
    
    return user


def get_user_by_email(db: Session, email: str) -> Optional[User]:
    """Get a user by email address."""
    return db.query(User).filter(User.email == email).first()


def get_user_by_id(db: Session, user_id: uuid.UUID) -> Optional[User]:
    """Get a user by ID."""
    return db.query(User).filter(User.id == user_id).first()


def create_user(
    db: Session, 
    email: str, 
    password: str, 
    name: str, 
    role: UserRole,
    organization: Optional[str] = None
) -> User:
    """Create a new user."""
    # Check if user already exists
    existing_user = get_user_by_email(db, email)
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User with this email already exists"
        )
    
    # Hash password
    password_hash = hash_password(password)
    
    # Create user
    user = User(
        id=uuid.uuid4(),
        email=email,
        password_hash=password_hash,
        name=name,
        role=role,
        organization=organization,
        is_active=True
    )
    
    db.add(user)
    db.commit()
    db.refresh(user)
    
    return user


# ===== DEPENDENCY INJECTION =====

async def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db)
) -> User:
    """Get the current authenticated user."""
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    token_data = decode_access_token(token)
    if token_data is None or token_data.email is None:
        raise credentials_exception
    
    user = get_user_by_email(db, token_data.email)
    if user is None:
        raise credentials_exception
        
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="User account is inactive"
        )
    
    return user


async def get_current_active_user(
    current_user: User = Depends(get_current_user)
) -> User:
    """Get the current active user."""
    if not current_user.is_active:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="User account is inactive"
        )
    return current_user


# ===== ROLE-BASED ACCESS CONTROL =====

class RoleChecker:
    """Role-based access control checker."""
    
    def __init__(self, allowed_roles: List[UserRole]):
        self.allowed_roles = allowed_roles
    
    def __call__(self, current_user: User = Depends(get_current_active_user)) -> User:
        if current_user.role not in self.allowed_roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Access denied. Required roles: {[role.value for role in self.allowed_roles]}"
            )
        return current_user


# Predefined role checkers
require_admin = RoleChecker([UserRole.admin])
require_analyst = RoleChecker([UserRole.admin, UserRole.analyst])
require_loan_officer = RoleChecker([UserRole.admin, UserRole.analyst, UserRole.loan_officer])
require_any_staff = RoleChecker([UserRole.admin, UserRole.analyst, UserRole.loan_officer])


class ResourceOwnerChecker:
    """Check if user owns a resource or has sufficient privileges."""
    
    def __init__(self, allow_staff_access: bool = True):
        self.allow_staff_access = allow_staff_access
    
    def can_access_application(
        self, 
        user: User, 
        application_owner_id: uuid.UUID
    ) -> bool:
        """Check if user can access a loan application."""
        # User owns the resource
        if user.id == application_owner_id:
            return True
        
        # Staff can access all applications (if enabled)
        if self.allow_staff_access and user.role in [
            UserRole.admin, UserRole.analyst, UserRole.loan_officer
        ]:
            return True
        
        return False


resource_checker = ResourceOwnerChecker()


# ===== PERMISSION UTILITIES =====

def check_application_access(
    user: User, 
    application_borrower_id: uuid.UUID,
    require_ownership: bool = False
) -> bool:
    """Check if user has access to a loan application."""
    # Admin and analysts can access all applications
    if not require_ownership and user.role in [UserRole.admin, UserRole.analyst]:
        return True
    
    # Loan officers can access applications they're assigned to
    # (This would need additional logic to check assignment)
    if not require_ownership and user.role == UserRole.loan_officer:
        return True
    
    # Borrowers can only access their own applications
    if user.id == application_borrower_id:
        return True
    
    return False


def get_user_accessible_applications_filter(user: User):
    """Get SQLAlchemy filter for applications accessible to user."""
    if user.role in [UserRole.admin, UserRole.analyst]:
        # Admin and analysts can see all applications
        return None
    
    elif user.role == UserRole.loan_officer:
        # Loan officers can see applications they're assigned to + all pending
        from models_new import LoanApplication
        return (
            (LoanApplication.loan_officer_id == user.id) |
            (LoanApplication.underwriter_id == user.id) |
            (LoanApplication.status == 'pending')
        )
    
    elif user.role == UserRole.borrower:
        # Borrowers can only see their own applications
        from models_new import LoanApplication
        return LoanApplication.borrower_id == user.id
    
    # Default: no access
    return False


# ===== VALIDATION UTILITIES =====

def validate_password_strength(password: str) -> List[str]:
    """Validate password strength and return list of issues."""
    issues = []
    
    if len(password) < 8:
        issues.append("Password must be at least 8 characters long")
    
    if not any(c.isupper() for c in password):
        issues.append("Password must contain at least one uppercase letter")
    
    if not any(c.islower() for c in password):
        issues.append("Password must contain at least one lowercase letter")
    
    if not any(c.isdigit() for c in password):
        issues.append("Password must contain at least one number")
    
    return issues


# ===== REGISTRATION UTILITIES =====

def validate_registration_data(
    db: Session,
    email: str,
    password: str,
    name: str,
    role: UserRole
) -> List[str]:
    """Validate user registration data."""
    issues = []
    
    # Check email uniqueness
    existing_user = get_user_by_email(db, email)
    if existing_user:
        issues.append("Email address is already registered")
    
    # Validate password strength
    password_issues = validate_password_strength(password)
    issues.extend(password_issues)
    
    # Validate name
    if len(name.strip()) < 2:
        issues.append("Name must be at least 2 characters long")
    
    # Validate role restrictions (if needed)
    # For now, allow any role, but in production you might restrict admin creation
    
    return issues
