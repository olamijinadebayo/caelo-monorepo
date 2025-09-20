"""
CRUD Operations for Caelo Backend.

Comprehensive Create, Read, Update, Delete operations for all entities
with proper error handling, validation, and security checks.
"""

from typing import List, Optional, Dict, Any, Tuple
from sqlalchemy.orm import Session, joinedload
from sqlalchemy import func, and_, or_, desc, asc
from fastapi import HTTPException, status
import uuid
from datetime import datetime, timezone

from models_new import (
    User, LoanApplication, BusinessMetrics, Transaction, TeamNote,
    Message, Document, ApplicationStatusHistory, SystemSettings,
    UserRole, ApplicationStatus, ApplicationPriority, TransactionType
)
from schemas_new import (
    LoanApplicationCreate, LoanApplicationUpdate, TransactionCreate,
    TeamNoteCreate, MessageCreate, PaginationParams, ApplicationFilters,
    DashboardStats
)
from auth_enhanced import check_application_access


# ===== USER CRUD OPERATIONS =====

def get_user(db: Session, user_id: uuid.UUID) -> Optional[User]:
    """Get a user by ID."""
    return db.query(User).filter(User.id == user_id).first()


def get_users(
    db: Session, 
    skip: int = 0, 
    limit: int = 100,
    role: Optional[UserRole] = None,
    active_only: bool = True
) -> List[User]:
    """Get users with filtering and pagination."""
    query = db.query(User)
    
    if active_only:
        query = query.filter(User.is_active == True)
    
    if role:
        query = query.filter(User.role == role)
    
    return query.offset(skip).limit(limit).all()


def update_user(
    db: Session, 
    user_id: uuid.UUID, 
    update_data: Dict[str, Any]
) -> Optional[User]:
    """Update a user."""
    user = get_user(db, user_id)
    if not user:
        return None
    
    for field, value in update_data.items():
        if hasattr(user, field):
            setattr(user, field, value)
    
    user.updated_at = datetime.now(timezone.utc)
    db.commit()
    db.refresh(user)
    return user


def deactivate_user(db: Session, user_id: uuid.UUID) -> Optional[User]:
    """Deactivate a user (soft delete)."""
    user = get_user(db, user_id)
    if not user:
        return None
    
    user.is_active = False
    user.updated_at = datetime.now(timezone.utc)
    db.commit()
    db.refresh(user)
    return user


# ===== LOAN APPLICATION CRUD OPERATIONS =====

def create_loan_application(
    db: Session,
    application_data: LoanApplicationCreate,
    borrower_id: uuid.UUID
) -> LoanApplication:
    """Create a new loan application."""
    application = LoanApplication(
        id=uuid.uuid4(),
        business_name=application_data.business_name,
        business_type=application_data.business_type,
        loan_amount=application_data.loan_amount,
        loan_purpose=application_data.loan_purpose,
        status=ApplicationStatus.pending,
        priority=ApplicationPriority.medium,
        borrower_id=borrower_id,
        application_date=datetime.now(timezone.utc)
    )
    
    db.add(application)
    db.commit()
    db.refresh(application)
    
    # Create status history entry
    create_status_history(
        db=db,
        application_id=application.id,
        user_id=borrower_id,
        old_status=None,
        new_status=ApplicationStatus.pending,
        reason="Application submitted"
    )
    
    return application


def get_loan_application(
    db: Session, 
    application_id: uuid.UUID,
    current_user: User,
    load_relationships: bool = True
) -> Optional[LoanApplication]:
    """Get a loan application by ID with access control."""
    query = db.query(LoanApplication)
    
    if load_relationships:
        query = query.options(
            joinedload(LoanApplication.borrower),
            joinedload(LoanApplication.loan_officer),
            joinedload(LoanApplication.underwriter),
            joinedload(LoanApplication.business_metrics),
            joinedload(LoanApplication.transactions),
            joinedload(LoanApplication.team_notes).joinedload(TeamNote.author),
            joinedload(LoanApplication.messages).joinedload(Message.sender),
            joinedload(LoanApplication.documents)
        )
    
    application = query.filter(LoanApplication.id == application_id).first()
    
    if not application:
        return None
    
    # Check access permissions
    if not check_application_access(current_user, application.borrower_id):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied to this application"
        )
    
    return application


def get_loan_applications(
    db: Session,
    current_user: User,
    filters: Optional[ApplicationFilters] = None,
    pagination: Optional[PaginationParams] = None
) -> Tuple[List[LoanApplication], int]:
    """Get loan applications with filtering, pagination, and access control."""
    query = db.query(LoanApplication).options(
        joinedload(LoanApplication.borrower),
        joinedload(LoanApplication.loan_officer),
        joinedload(LoanApplication.underwriter)
    )
    
    # Apply access control filters
    access_filter = get_user_accessible_applications_filter(current_user)
    if access_filter is not None:
        query = query.filter(access_filter)
    elif access_filter is False:
        # No access - return empty result
        return [], 0
    
    # Apply user filters
    if filters:
        if filters.status:
            query = query.filter(LoanApplication.status == filters.status)
        if filters.priority:
            query = query.filter(LoanApplication.priority == filters.priority)
        if filters.borrower_id:
            query = query.filter(LoanApplication.borrower_id == filters.borrower_id)
        if filters.loan_officer_id:
            query = query.filter(LoanApplication.loan_officer_id == filters.loan_officer_id)
        if filters.underwriter_id:
            query = query.filter(LoanApplication.underwriter_id == filters.underwriter_id)
        if filters.date_from:
            query = query.filter(LoanApplication.application_date >= filters.date_from)
        if filters.date_to:
            query = query.filter(LoanApplication.application_date <= filters.date_to)
        if filters.min_amount:
            query = query.filter(LoanApplication.loan_amount >= filters.min_amount)
        if filters.max_amount:
            query = query.filter(LoanApplication.loan_amount <= filters.max_amount)
    
    # Get total count
    total = query.count()
    
    # Apply pagination
    if pagination:
        query = query.offset((pagination.page - 1) * pagination.size).limit(pagination.size)
    
    # Order by application date (newest first)
    query = query.order_by(desc(LoanApplication.application_date))
    
    applications = query.all()
    return applications, total


def update_loan_application(
    db: Session,
    application_id: uuid.UUID,
    update_data: LoanApplicationUpdate,
    current_user: User
) -> Optional[LoanApplication]:
    """Update a loan application."""
    application = get_loan_application(db, application_id, current_user, load_relationships=False)
    if not application:
        return None
    
    # Track status changes for history
    old_status = application.status
    
    # Apply updates
    update_dict = update_data.dict(exclude_unset=True)
    for field, value in update_dict.items():
        if hasattr(application, field):
            setattr(application, field, value)
    
    application.updated_at = datetime.now(timezone.utc)
    
    # Set decision date if status changed to final status
    if update_data.status and update_data.status in [
        ApplicationStatus.approved, ApplicationStatus.rejected
    ]:
        application.decision_date = datetime.now(timezone.utc)
    
    db.commit()
    db.refresh(application)
    
    # Create status history if status changed
    if update_data.status and update_data.status != old_status:
        create_status_history(
            db=db,
            application_id=application.id,
            user_id=current_user.id,
            old_status=old_status,
            new_status=update_data.status,
            reason=f"Status updated by {current_user.name}"
        )
    
    return application


def delete_loan_application(
    db: Session,
    application_id: uuid.UUID,
    current_user: User
) -> bool:
    """Delete a loan application (admin only)."""
    if current_user.role != UserRole.admin:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only administrators can delete applications"
        )
    
    application = get_loan_application(db, application_id, current_user, load_relationships=False)
    if not application:
        return False
    
    db.delete(application)
    db.commit()
    return True


# ===== TRANSACTION CRUD OPERATIONS =====

def create_transaction(
    db: Session,
    transaction_data: TransactionCreate,
    current_user: User
) -> Transaction:
    """Create a new transaction."""
    # Verify access to application
    application = get_loan_application(db, transaction_data.application_id, current_user, load_relationships=False)
    if not application:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Loan application not found"
        )
    
    transaction = Transaction(
        id=uuid.uuid4(),
        application_id=transaction_data.application_id,
        transaction_date=transaction_data.transaction_date,
        type=transaction_data.type,
        category=transaction_data.category,
        description=transaction_data.description,
        amount=transaction_data.amount,
        source_account=transaction_data.source_account,
        reference_number=transaction_data.reference_number
    )
    
    # Simple anomaly detection (can be enhanced)
    if abs(float(transaction.amount)) > 10000:  # Large amounts
        transaction.anomaly_score = 0.8
        transaction.is_anomaly = True
        transaction.anomaly_explanation = "Large transaction amount flagged for review"
    
    db.add(transaction)
    db.commit()
    db.refresh(transaction)
    return transaction


def get_application_transactions(
    db: Session,
    application_id: uuid.UUID,
    current_user: User
) -> List[Transaction]:
    """Get all transactions for an application."""
    # Verify access
    application = get_loan_application(db, application_id, current_user, load_relationships=False)
    if not application:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Loan application not found"
        )
    
    return db.query(Transaction).filter(
        Transaction.application_id == application_id
    ).order_by(desc(Transaction.transaction_date)).all()


# ===== TEAM NOTES CRUD OPERATIONS =====

def create_team_note(
    db: Session,
    note_data: TeamNoteCreate,
    author_id: uuid.UUID
) -> TeamNote:
    """Create a new team note."""
    note = TeamNote(
        id=uuid.uuid4(),
        application_id=note_data.application_id,
        author_id=author_id,
        content=note_data.content,
        is_private=note_data.is_private
    )
    
    db.add(note)
    db.commit()
    db.refresh(note)
    return note


def get_application_team_notes(
    db: Session,
    application_id: uuid.UUID,
    current_user: User
) -> List[TeamNote]:
    """Get team notes for an application."""
    # Verify access
    application = get_loan_application(db, application_id, current_user, load_relationships=False)
    if not application:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Loan application not found"
        )
    
    query = db.query(TeamNote).options(
        joinedload(TeamNote.author)
    ).filter(TeamNote.application_id == application_id)
    
    # Borrowers can't see private notes
    if current_user.role == UserRole.borrower:
        query = query.filter(TeamNote.is_private == False)
    
    return query.order_by(desc(TeamNote.created_at)).all()


# ===== MESSAGE CRUD OPERATIONS =====

def create_message(
    db: Session,
    message_data: MessageCreate,
    sender_id: uuid.UUID
) -> Message:
    """Create a new message."""
    message = Message(
        id=uuid.uuid4(),
        application_id=message_data.application_id,
        sender_id=sender_id,
        content=message_data.content,
        is_from_lender=message_data.is_from_lender
    )
    
    db.add(message)
    db.commit()
    db.refresh(message)
    return message


def get_application_messages(
    db: Session,
    application_id: uuid.UUID,
    current_user: User
) -> List[Message]:
    """Get messages for an application."""
    # Verify access
    application = get_loan_application(db, application_id, current_user, load_relationships=False)
    if not application:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Loan application not found"
        )
    
    return db.query(Message).options(
        joinedload(Message.sender)
    ).filter(
        Message.application_id == application_id
    ).order_by(asc(Message.created_at)).all()


def mark_message_as_read(
    db: Session,
    message_id: uuid.UUID,
    current_user: User
) -> Optional[Message]:
    """Mark a message as read."""
    message = db.query(Message).filter(Message.id == message_id).first()
    if not message:
        return None
    
    # Verify access to application
    application = get_loan_application(db, message.application_id, current_user, load_relationships=False)
    if not application:
        return None
    
    message.is_read = True
    message.read_at = datetime.now(timezone.utc)
    db.commit()
    db.refresh(message)
    return message


# ===== DASHBOARD & ANALYTICS =====

def get_dashboard_stats(db: Session, current_user: User) -> DashboardStats:
    """Get dashboard statistics for current user."""
    query = db.query(LoanApplication)
    
    # Apply access control
    access_filter = get_user_accessible_applications_filter(current_user)
    if access_filter is not None:
        query = query.filter(access_filter)
    elif access_filter is False:
        # No access
        return DashboardStats(
            total_applications=0,
            pending_applications=0,
            approved_applications=0,
            rejected_applications=0,
            under_review_applications=0,
            total_loan_amount=0
        )
    
    # Count by status
    total = query.count()
    pending = query.filter(LoanApplication.status == ApplicationStatus.pending).count()
    approved = query.filter(LoanApplication.status == ApplicationStatus.approved).count()
    rejected = query.filter(LoanApplication.status == ApplicationStatus.rejected).count()
    under_review = query.filter(LoanApplication.status == ApplicationStatus.under_review).count()
    
    # Sum loan amounts
    total_amount_result = query.with_entities(
        func.sum(LoanApplication.loan_amount)
    ).scalar()
    total_loan_amount = total_amount_result or 0
    
    # Calculate approval rate
    decided_applications = approved + rejected
    approval_rate = (approved / decided_applications * 100) if decided_applications > 0 else None
    
    return DashboardStats(
        total_applications=total,
        pending_applications=pending,
        approved_applications=approved,
        rejected_applications=rejected,
        under_review_applications=under_review,
        total_loan_amount=total_loan_amount,
        approval_rate=approval_rate
    )


# ===== UTILITY FUNCTIONS =====

def create_status_history(
    db: Session,
    application_id: uuid.UUID,
    user_id: uuid.UUID,
    old_status: Optional[ApplicationStatus],
    new_status: ApplicationStatus,
    reason: Optional[str] = None
):
    """Create an application status history record."""
    history = ApplicationStatusHistory(
        id=uuid.uuid4(),
        application_id=application_id,
        user_id=user_id,
        old_status=old_status,
        new_status=new_status,
        reason=reason
    )
    
    db.add(history)
    db.commit()


def get_user_accessible_applications_filter(current_user: User):
    """Get SQLAlchemy filter for applications accessible to user."""
    if current_user.role in [UserRole.admin, UserRole.analyst]:
        # Admin and analysts can see all applications
        return None
    
    elif current_user.role == UserRole.loan_officer:
        # Loan officers can see applications they're assigned to + all pending
        return or_(
            LoanApplication.loan_officer_id == current_user.id,
            LoanApplication.underwriter_id == current_user.id,
            LoanApplication.status == ApplicationStatus.pending
        )
    
    elif current_user.role == UserRole.borrower:
        # Borrowers can only see their own applications
        return LoanApplication.borrower_id == current_user.id
    
    # Default: no access
    return False


# ===== SYSTEM SETTINGS =====

def get_system_settings(db: Session) -> List[SystemSettings]:
    """Get all system settings."""
    return db.query(SystemSettings).all()


def get_system_setting(db: Session, key: str) -> Optional[SystemSettings]:
    """Get a specific system setting by key."""
    return db.query(SystemSettings).filter(SystemSettings.key == key).first()


def update_system_setting(
    db: Session,
    key: str,
    value: Dict[str, Any],
    description: Optional[str] = None
) -> SystemSettings:
    """Update or create a system setting."""
    setting = get_system_setting(db, key)
    
    if setting:
        setting.value = value
        if description:
            setting.description = description
        setting.updated_at = datetime.now(timezone.utc)
    else:
        setting = SystemSettings(
            key=key,
            value=value,
            description=description
        )
        db.add(setting)
    
    db.commit()
    db.refresh(setting)
    return setting
