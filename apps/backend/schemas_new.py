"""
Pydantic schemas for Caelo Backend API.

This file contains all request/response schemas for the FastAPI endpoints.
Organized by domain: Auth, Users, Applications, etc.
"""

from pydantic import BaseModel, EmailStr, validator, Field
from typing import Optional, List, Dict, Any, Union
from datetime import datetime
from decimal import Decimal
from enum import Enum
import uuid

from models_new import (
    UserRole, ApplicationStatus, ApplicationPriority, RecommendationType,
    DocumentType, TransactionType, IndustryRisk
)


# ===== BASE SCHEMAS =====

class TimestampMixin(BaseModel):
    """Mixin for created_at/updated_at timestamps."""
    created_at: datetime
    updated_at: Optional[datetime] = None


# ===== AUTH SCHEMAS =====

class TokenData(BaseModel):
    """Token payload data."""
    email: Optional[str] = None
    role: Optional[UserRole] = None


class Token(BaseModel):
    """JWT token response."""
    access_token: str
    token_type: str = "bearer"
    expires_in: int  # seconds
    user: 'UserResponse'


class LoginRequest(BaseModel):
    """Login request schema."""
    email: EmailStr
    password: str

    class Config:
        json_schema_extra = {
            "example": {
                "email": "mike@cdfi.example.org",
                "password": "demo123"
            }
        }


class RegisterRequest(BaseModel):
    """User registration request schema."""
    email: EmailStr
    password: str = Field(..., min_length=6, max_length=100)
    name: str = Field(..., min_length=2, max_length=255)
    role: UserRole
    organization: Optional[str] = Field(None, max_length=255)

    @validator('password')
    def validate_password(cls, v):
        if len(v) < 6:
            raise ValueError('Password must be at least 6 characters long')
        return v


# ===== USER SCHEMAS =====

class UserBase(BaseModel):
    """Base user schema."""
    email: EmailStr
    name: str
    role: UserRole
    organization: Optional[str] = None
    is_active: bool = True


class UserCreate(UserBase):
    """User creation schema."""
    password: str = Field(..., min_length=6)


class UserUpdate(BaseModel):
    """User update schema."""
    name: Optional[str] = None
    organization: Optional[str] = None
    is_active: Optional[bool] = None


class UserResponse(UserBase, TimestampMixin):
    """User response schema."""
    id: uuid.UUID
    last_login: Optional[datetime] = None

    class Config:
        from_attributes = True


# ===== BUSINESS METRICS SCHEMAS =====

class BusinessMetricsBase(BaseModel):
    """Base business metrics schema."""
    annual_revenue: Optional[Decimal] = None
    monthly_revenue: Optional[Decimal] = None
    profit_margin: Optional[float] = None
    cash_flow: Optional[Decimal] = None
    debt_to_equity: Optional[float] = None
    credit_score: Optional[int] = Field(None, ge=300, le=850)
    business_age: Optional[int] = Field(None, ge=0)
    employee_count: Optional[int] = Field(None, ge=0)
    industry_risk: Optional[IndustryRisk] = None
    
    # Financial ratios
    debt_to_income_ratio: Optional[float] = None
    debt_service_coverage_ratio: Optional[float] = None
    current_ratio: Optional[float] = None
    global_debt_service: Optional[float] = None
    return_on_equity: Optional[float] = None
    return_on_assets: Optional[float] = None
    gross_margin: Optional[float] = None
    net_income_margin: Optional[float] = None
    
    # Cash flow metrics
    avg_daily_inflow: Optional[Decimal] = None
    avg_daily_outflow: Optional[Decimal] = None
    total_inflow: Optional[Decimal] = None
    total_outflow: Optional[Decimal] = None


class BusinessMetricsResponse(BusinessMetricsBase, TimestampMixin):
    """Business metrics response schema."""
    id: uuid.UUID
    application_id: uuid.UUID

    class Config:
        from_attributes = True


# ===== TRANSACTION SCHEMAS =====

class TransactionBase(BaseModel):
    """Base transaction schema."""
    transaction_date: datetime
    type: TransactionType
    category: str = Field(..., max_length=255)
    description: str
    amount: Decimal
    source_account: Optional[str] = Field(None, max_length=255)
    reference_number: Optional[str] = Field(None, max_length=255)


class TransactionCreate(TransactionBase):
    """Transaction creation schema."""
    application_id: uuid.UUID


class TransactionResponse(TransactionBase, TimestampMixin):
    """Transaction response schema."""
    id: uuid.UUID
    application_id: uuid.UUID
    anomaly_score: Optional[float] = None
    is_anomaly: bool = False
    anomaly_explanation: Optional[str] = None

    class Config:
        from_attributes = True


# ===== TEAM NOTES SCHEMAS =====

class TeamNoteBase(BaseModel):
    """Base team note schema."""
    content: str
    is_private: bool = True


class TeamNoteCreate(TeamNoteBase):
    """Team note creation schema."""
    application_id: uuid.UUID


class TeamNoteResponse(TeamNoteBase, TimestampMixin):
    """Team note response schema."""
    id: uuid.UUID
    application_id: uuid.UUID
    author_id: uuid.UUID
    author: UserResponse

    class Config:
        from_attributes = True


# ===== MESSAGE SCHEMAS =====

class MessageBase(BaseModel):
    """Base message schema."""
    content: str
    is_from_lender: bool


class MessageCreate(MessageBase):
    """Message creation schema."""
    application_id: uuid.UUID


class MessageResponse(MessageBase, TimestampMixin):
    """Message response schema."""
    id: uuid.UUID
    application_id: uuid.UUID
    sender_id: uuid.UUID
    sender: UserResponse
    is_read: bool = False
    read_at: Optional[datetime] = None

    class Config:
        from_attributes = True


# ===== DOCUMENT SCHEMAS =====

class DocumentBase(BaseModel):
    """Base document schema."""
    name: str = Field(..., max_length=255)
    type: DocumentType
    file_size: Optional[int] = None
    mime_type: Optional[str] = Field(None, max_length=100)


class DocumentCreate(DocumentBase):
    """Document creation schema."""
    application_id: uuid.UUID
    file_path: str = Field(..., max_length=512)


class DocumentResponse(DocumentBase):
    """Document response schema."""
    id: uuid.UUID
    application_id: uuid.UUID
    file_path: str
    is_analyzed: bool = False
    analysis_results: Optional[Dict[str, Any]] = None
    uploaded_at: datetime

    class Config:
        from_attributes = True


# ===== LOAN APPLICATION SCHEMAS =====

class LoanApplicationBase(BaseModel):
    """Base loan application schema."""
    business_name: str = Field(..., max_length=255)
    business_type: str = Field(..., max_length=255)
    loan_amount: Decimal = Field(..., gt=0)
    loan_purpose: str


class LoanApplicationCreate(LoanApplicationBase):
    """Loan application creation schema."""
    pass


class LoanApplicationUpdate(BaseModel):
    """Loan application update schema."""
    business_name: Optional[str] = Field(None, max_length=255)
    business_type: Optional[str] = Field(None, max_length=255)
    loan_amount: Optional[Decimal] = Field(None, gt=0)
    loan_purpose: Optional[str] = None
    status: Optional[ApplicationStatus] = None
    priority: Optional[ApplicationPriority] = None
    loan_officer_id: Optional[uuid.UUID] = None
    underwriter_id: Optional[uuid.UUID] = None
    risk_score: Optional[float] = Field(None, ge=0, le=100)
    recommendation: Optional[RecommendationType] = None
    recommendation_summary: Optional[str] = None
    analyst_notes: Optional[str] = None


class LoanApplicationResponse(LoanApplicationBase, TimestampMixin):
    """Loan application response schema."""
    id: uuid.UUID
    status: ApplicationStatus
    priority: ApplicationPriority
    borrower_id: uuid.UUID
    loan_officer_id: Optional[uuid.UUID] = None
    underwriter_id: Optional[uuid.UUID] = None
    risk_score: Optional[float] = None
    recommendation: Optional[RecommendationType] = None
    recommendation_summary: Optional[str] = None
    analyst_notes: Optional[str] = None
    application_date: datetime
    decision_date: Optional[datetime] = None
    
    # Relationships
    borrower: UserResponse
    loan_officer: Optional[UserResponse] = None
    underwriter: Optional[UserResponse] = None
    business_metrics: Optional[BusinessMetricsResponse] = None
    transactions: List[TransactionResponse] = []
    team_notes: List[TeamNoteResponse] = []
    messages: List[MessageResponse] = []
    documents: List[DocumentResponse] = []

    class Config:
        from_attributes = True


# ===== DASHBOARD & ANALYTICS SCHEMAS =====

class DashboardStats(BaseModel):
    """Dashboard statistics schema."""
    total_applications: int
    pending_applications: int
    approved_applications: int
    rejected_applications: int
    under_review_applications: int
    total_loan_amount: Decimal
    avg_processing_time_days: Optional[float] = None
    approval_rate: Optional[float] = None


class ApplicationFilters(BaseModel):
    """Application filtering schema."""
    status: Optional[ApplicationStatus] = None
    priority: Optional[ApplicationPriority] = None
    borrower_id: Optional[uuid.UUID] = None
    loan_officer_id: Optional[uuid.UUID] = None
    underwriter_id: Optional[uuid.UUID] = None
    date_from: Optional[datetime] = None
    date_to: Optional[datetime] = None
    min_amount: Optional[Decimal] = None
    max_amount: Optional[Decimal] = None


class PaginationParams(BaseModel):
    """Pagination parameters."""
    page: int = Field(1, ge=1)
    size: int = Field(20, ge=1, le=100)


class PaginatedResponse(BaseModel):
    """Paginated response wrapper."""
    items: List[Any]
    total: int
    page: int
    size: int
    pages: int


# ===== SYSTEM SCHEMAS =====

class SystemSettingResponse(BaseModel):
    """System setting response schema."""
    id: int
    key: str
    value: Dict[str, Any]
    description: Optional[str] = None
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class HealthCheck(BaseModel):
    """Health check response schema."""
    status: str = "healthy"
    timestamp: datetime
    database: str = "connected"
    version: str = "1.0.0"


# ===== ERROR SCHEMAS =====

class ErrorDetail(BaseModel):
    """Error detail schema."""
    field: Optional[str] = None
    message: str
    code: Optional[str] = None


class ErrorResponse(BaseModel):
    """Error response schema."""
    error: str
    details: Optional[List[ErrorDetail]] = None
    timestamp: datetime


# Update forward references
UserResponse.model_rebuild()
TeamNoteResponse.model_rebuild()
MessageResponse.model_rebuild()
LoanApplicationResponse.model_rebuild()
