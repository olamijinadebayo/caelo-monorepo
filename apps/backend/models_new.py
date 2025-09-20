from sqlalchemy import (
    Column, Integer, String, Boolean, DateTime, Enum, Text, 
    Numeric, ForeignKey, JSON, UUID, Float
)
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from sqlalchemy.dialects.postgresql import UUID as PostgresUUID
from database import Base
import enum
import uuid


# ===== ENUMS =====

class UserRole(str, enum.Enum):
    admin = "admin"
    analyst = "analyst" 
    loan_officer = "loan_officer"
    borrower = "borrower"


class ApplicationStatus(str, enum.Enum):
    pending = "pending"
    under_review = "under_review"
    approved = "approved"
    rejected = "rejected"
    disbursed = "disbursed"


class ApplicationPriority(str, enum.Enum):
    low = "low"
    medium = "medium"
    high = "high"
    urgent = "urgent"


class RecommendationType(str, enum.Enum):
    approve = "approve"
    reject = "reject"
    review_required = "review_required"


class DocumentType(str, enum.Enum):
    financial_statement = "financial_statement"
    tax_return = "tax_return"
    business_plan = "business_plan"
    bank_statement = "bank_statement"
    other = "other"


class TransactionType(str, enum.Enum):
    inflow = "inflow"
    outflow = "outflow"


class AnalysisStatus(str, enum.Enum):
    positive = "positive"
    warning = "warning"
    negative = "negative"


class IndustryRisk(str, enum.Enum):
    low = "low"
    medium = "medium"
    high = "high"


# ===== CORE MODELS =====

class User(Base):
    __tablename__ = "users"
    
    id = Column(PostgresUUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    email = Column(String(255), unique=True, index=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    role = Column(Enum(UserRole), nullable=False)
    name = Column(String(255), nullable=False)
    organization = Column(String(255), nullable=True)
    is_active = Column(Boolean, default=True)
    last_login = Column(DateTime(timezone=True), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    loan_applications_as_officer = relationship("LoanApplication", back_populates="loan_officer", foreign_keys="LoanApplication.loan_officer_id")
    loan_applications_as_underwriter = relationship("LoanApplication", back_populates="underwriter", foreign_keys="LoanApplication.underwriter_id")
    loan_applications_as_borrower = relationship("LoanApplication", back_populates="borrower", foreign_keys="LoanApplication.borrower_id")
    team_notes = relationship("TeamNote", back_populates="author")
    messages_sent = relationship("Message", back_populates="sender", foreign_keys="Message.sender_id")


class LoanApplication(Base):
    __tablename__ = "loan_applications"
    
    id = Column(PostgresUUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    
    # Basic Info
    business_name = Column(String(255), nullable=False)
    business_type = Column(String(255), nullable=False)
    loan_amount = Column(Numeric(12, 2), nullable=False)
    loan_purpose = Column(Text, nullable=False)
    
    # Status & Priority
    status = Column(Enum(ApplicationStatus), default=ApplicationStatus.pending, index=True)
    priority = Column(Enum(ApplicationPriority), default=ApplicationPriority.medium, index=True)
    
    # Assignment
    borrower_id = Column(PostgresUUID(as_uuid=True), ForeignKey("users.id"), nullable=False, index=True)
    loan_officer_id = Column(PostgresUUID(as_uuid=True), ForeignKey("users.id"), nullable=True, index=True)
    underwriter_id = Column(PostgresUUID(as_uuid=True), ForeignKey("users.id"), nullable=True, index=True)
    
    # Risk & Decision
    risk_score = Column(Float, nullable=True)
    recommendation = Column(Enum(RecommendationType), nullable=True)
    recommendation_summary = Column(Text, nullable=True)
    analyst_notes = Column(Text, nullable=True)
    
    # Timestamps
    application_date = Column(DateTime(timezone=True), server_default=func.now())
    decision_date = Column(DateTime(timezone=True), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    borrower = relationship("User", back_populates="loan_applications_as_borrower", foreign_keys=[borrower_id])
    loan_officer = relationship("User", back_populates="loan_applications_as_officer", foreign_keys=[loan_officer_id])
    underwriter = relationship("User", back_populates="loan_applications_as_underwriter", foreign_keys=[underwriter_id])
    business_metrics = relationship("BusinessMetrics", back_populates="application", uselist=False)
    documents = relationship("Document", back_populates="application")
    transactions = relationship("Transaction", back_populates="application")
    team_notes = relationship("TeamNote", back_populates="application")
    messages = relationship("Message", back_populates="application")
    financial_analyses = relationship("FinancialAnalysis", back_populates="application")


class BusinessMetrics(Base):
    __tablename__ = "business_metrics"
    
    id = Column(PostgresUUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    application_id = Column(PostgresUUID(as_uuid=True), ForeignKey("loan_applications.id"), nullable=False, unique=True)
    
    # Core Metrics
    annual_revenue = Column(Numeric(12, 2), nullable=True)
    monthly_revenue = Column(Numeric(12, 2), nullable=True)
    profit_margin = Column(Float, nullable=True)
    cash_flow = Column(Numeric(12, 2), nullable=True)
    debt_to_equity = Column(Float, nullable=True)
    credit_score = Column(Integer, nullable=True)
    business_age = Column(Integer, nullable=True)  # in years
    employee_count = Column(Integer, nullable=True)
    industry_risk = Column(Enum(IndustryRisk), nullable=True)
    
    # Financial Ratios (from Figma Financial Stability)
    debt_to_income_ratio = Column(Float, nullable=True)
    debt_service_coverage_ratio = Column(Float, nullable=True)
    current_ratio = Column(Float, nullable=True)
    global_debt_service = Column(Float, nullable=True)
    return_on_equity = Column(Float, nullable=True)
    return_on_assets = Column(Float, nullable=True)
    gross_margin = Column(Float, nullable=True)
    net_income_margin = Column(Float, nullable=True)
    
    # Cash Flow Metrics (from Figma Cash Flow tab)
    avg_daily_inflow = Column(Numeric(10, 2), nullable=True)
    avg_daily_outflow = Column(Numeric(10, 2), nullable=True)
    total_inflow = Column(Numeric(12, 2), nullable=True)
    total_outflow = Column(Numeric(12, 2), nullable=True)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    application = relationship("LoanApplication", back_populates="business_metrics")


class Transaction(Base):
    __tablename__ = "transactions"
    
    id = Column(PostgresUUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    application_id = Column(PostgresUUID(as_uuid=True), ForeignKey("loan_applications.id"), nullable=False, index=True)
    
    # Transaction Details
    transaction_date = Column(DateTime(timezone=True), nullable=False, index=True)
    type = Column(Enum(TransactionType), nullable=False)
    category = Column(String(255), nullable=False)
    description = Column(Text, nullable=False)
    amount = Column(Numeric(10, 2), nullable=False)
    
    # Analysis Results
    anomaly_score = Column(Float, nullable=True)  # 0.0 to 1.0
    is_anomaly = Column(Boolean, default=False, index=True)
    anomaly_explanation = Column(Text, nullable=True)
    
    # Metadata
    source_account = Column(String(255), nullable=True)
    reference_number = Column(String(255), nullable=True)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    application = relationship("LoanApplication", back_populates="transactions")


class Document(Base):
    __tablename__ = "documents"
    
    id = Column(PostgresUUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    application_id = Column(PostgresUUID(as_uuid=True), ForeignKey("loan_applications.id"), nullable=False, index=True)
    
    # Document Info
    name = Column(String(255), nullable=False)
    type = Column(Enum(DocumentType), nullable=False)
    file_path = Column(String(512), nullable=False)
    file_size = Column(Integer, nullable=True)  # in bytes
    mime_type = Column(String(100), nullable=True)
    
    # Analysis Results
    is_analyzed = Column(Boolean, default=False)
    analysis_results = Column(JSON, nullable=True)  # Store extracted data
    
    uploaded_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    application = relationship("LoanApplication", back_populates="documents")


class TeamNote(Base):
    __tablename__ = "team_notes"
    
    id = Column(PostgresUUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    application_id = Column(PostgresUUID(as_uuid=True), ForeignKey("loan_applications.id"), nullable=False, index=True)
    author_id = Column(PostgresUUID(as_uuid=True), ForeignKey("users.id"), nullable=False, index=True)
    
    # Note Content
    content = Column(Text, nullable=False)
    is_private = Column(Boolean, default=False)  # Internal team only vs shared
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    application = relationship("LoanApplication", back_populates="team_notes")
    author = relationship("User", back_populates="team_notes")


class Message(Base):
    __tablename__ = "messages"
    
    id = Column(PostgresUUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    application_id = Column(PostgresUUID(as_uuid=True), ForeignKey("loan_applications.id"), nullable=False, index=True)
    sender_id = Column(PostgresUUID(as_uuid=True), ForeignKey("users.id"), nullable=False, index=True)
    
    # Message Content
    content = Column(Text, nullable=False)
    is_from_lender = Column(Boolean, nullable=False)  # True if from lender team, False if from borrower
    is_read = Column(Boolean, default=False)
    read_at = Column(DateTime(timezone=True), nullable=True)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    # Relationships
    application = relationship("LoanApplication", back_populates="messages")
    sender = relationship("User", back_populates="messages_sent")


# ===== ANALYSIS MODELS =====

class FinancialAnalysis(Base):
    __tablename__ = "financial_analyses"
    
    id = Column(PostgresUUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    application_id = Column(PostgresUUID(as_uuid=True), ForeignKey("loan_applications.id"), nullable=False, index=True)
    analysis_type = Column(String(100), nullable=False)  # 'pos', 'personal', 'business', 'tax'
    
    # Analysis Results (JSON structure matching frontend expectations)
    analysis_data = Column(JSON, nullable=False)
    
    # Metadata
    confidence_score = Column(Float, nullable=True)  # 0.0 to 1.0
    analyst_id = Column(PostgresUUID(as_uuid=True), ForeignKey("users.id"), nullable=True)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    application = relationship("LoanApplication", back_populates="financial_analyses")


class RelationshipHistory(Base):
    __tablename__ = "relationship_history"
    
    id = Column(PostgresUUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    application_id = Column(PostgresUUID(as_uuid=True), ForeignKey("loan_applications.id"), nullable=False, unique=True)
    
    # Relationship Data (from Figma Relationship & Impact tab)
    cdfi_relationship_start = Column(DateTime(timezone=True), nullable=True)
    relationship_length_years = Column(Integer, nullable=True)
    previous_loans_count = Column(Integer, default=0)
    previous_loans_total_amount = Column(Numeric(12, 2), nullable=True)
    payment_history_percentage = Column(Float, nullable=True)  # % on-time payments
    technical_assistance_sessions = Column(Integer, default=0)
    referral_source = Column(String(255), nullable=True)
    
    # Community Impact
    jobs_created = Column(Integer, default=0)
    jobs_retained = Column(Integer, default=0)
    geographic_impact = Column(Text, nullable=True)
    borrower_testimonial = Column(Text, nullable=True)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())


# ===== AUDIT & TRACKING =====

class ApplicationStatusHistory(Base):
    __tablename__ = "application_status_history"
    
    id = Column(PostgresUUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    application_id = Column(PostgresUUID(as_uuid=True), ForeignKey("loan_applications.id"), nullable=False, index=True)
    user_id = Column(PostgresUUID(as_uuid=True), ForeignKey("users.id"), nullable=False)
    
    # Status Change
    old_status = Column(Enum(ApplicationStatus), nullable=True)
    new_status = Column(Enum(ApplicationStatus), nullable=False)
    reason = Column(Text, nullable=True)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class ApplicationMetrics(Base):
    __tablename__ = "application_metrics"
    
    id = Column(PostgresUUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    
    # Daily Metrics Snapshot
    date = Column(DateTime(timezone=True), nullable=False, index=True)
    total_applications = Column(Integer, default=0)
    pending_applications = Column(Integer, default=0)
    approved_applications = Column(Integer, default=0)
    rejected_applications = Column(Integer, default=0)
    under_review_applications = Column(Integer, default=0)
    
    # Processing Metrics
    avg_processing_time_days = Column(Float, nullable=True)
    approval_rate = Column(Float, nullable=True)
    total_loan_amount = Column(Numeric(15, 2), nullable=True)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())


# ===== SYSTEM TABLES =====

class SystemSettings(Base):
    __tablename__ = "system_settings"
    
    id = Column(Integer, primary_key=True, index=True)
    key = Column(String(255), unique=True, nullable=False, index=True)
    value = Column(JSON, nullable=False)
    description = Column(Text, nullable=True)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
