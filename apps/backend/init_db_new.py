#!/usr/bin/env python3
"""
Database initialization script for Caelo Backend.

This script:
1. Creates database tables from our models
2. Seeds initial data for development
3. Sets up Alembic for future migrations
"""

import sys
import os
from pathlib import Path

# Add current directory to Python path
sys.path.append(str(Path(__file__).parent))

from sqlalchemy.orm import Session
from database import engine, SessionLocal, init_database
from models_new import *
import bcrypt
from datetime import datetime, timezone
import uuid


def create_initial_users(db: Session):
    """Create initial users for development."""
    print("🧑‍💼 Creating initial users...")
    
    # Check if users already exist
    if db.query(User).first():
        print("ℹ️  Users already exist, skipping user creation")
        return
    
    # Hash password for demo users
    password_hash = bcrypt.hashpw("demo123".encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
    
    initial_users = [
        User(
            id=uuid.uuid4(),
            email="admin@withcaelo.ai",
            password_hash=password_hash,
            role=UserRole.admin,
            name="Admin User",
            organization="Caelo Inc.",
            is_active=True
        ),
        User(
            id=uuid.uuid4(),
            email="sarah@withcaelo.ai", 
            password_hash=password_hash,
            role=UserRole.admin,
            name="Sarah Chen",
            organization="Caelo Inc.",
            is_active=True
        ),
        User(
            id=uuid.uuid4(),
            email="mike@cdfi.example.org",
            password_hash=password_hash,
            role=UserRole.analyst,
            name="Mike Rodriguez", 
            organization="Community Capital Partners",
            is_active=True
        ),
        User(
            id=uuid.uuid4(),
            email="loan.officer@cdfi.example.org",
            password_hash=password_hash,
            role=UserRole.loan_officer,
            name="Caleb Mark",
            organization="Community Capital Partners", 
            is_active=True
        ),
        User(
            id=uuid.uuid4(),
            email="jessica@smallbiz.com",
            password_hash=password_hash,
            role=UserRole.borrower,
            name="Jessica Williams",
            organization="Sunrise Bakery",
            is_active=True
        )
    ]
    
    for user in initial_users:
        db.add(user)
        print(f"  ✅ Created user: {user.email} ({user.role})")
    
    db.commit()
    return initial_users


def create_sample_applications(db: Session, users: list):
    """Create sample loan applications."""
    print("📋 Creating sample loan applications...")
    
    # Get users by role
    borrower = next(u for u in users if u.role == UserRole.borrower)
    loan_officer = next(u for u in users if u.role == UserRole.loan_officer)
    analyst = next(u for u in users if u.role == UserRole.analyst)
    
    # Sample application
    app = LoanApplication(
        id=uuid.uuid4(),
        business_name="Sunrise Bakery",
        business_type="Food Services",
        loan_amount=20000.00,
        loan_purpose="Equipment Purchase and Working Capital",
        status=ApplicationStatus.under_review,
        priority=ApplicationPriority.medium,
        borrower_id=borrower.id,
        loan_officer_id=loan_officer.id,
        underwriter_id=analyst.id,
        risk_score=75.0,
        recommendation=RecommendationType.review_required,
        recommendation_summary="Recommend Reject",
        analyst_notes="NSF incidents are concerning but borrower's explanation seems reasonable. Strong business fundamentals otherwise.",
        application_date=datetime.now(timezone.utc)
    )
    
    db.add(app)
    db.commit()
    
    # Add business metrics
    metrics = BusinessMetrics(
        application_id=app.id,
        annual_revenue=600000.00,
        monthly_revenue=50000.00,
        profit_margin=0.14,
        cash_flow=42000.00,
        debt_to_equity=0.28,
        credit_score=720,
        business_age=8,
        employee_count=12,
        industry_risk=IndustryRisk.medium,
        debt_to_income_ratio=28.0,
        debt_service_coverage_ratio=1.8,
        current_ratio=2.1,
        global_debt_service=35.0,
        return_on_equity=15.0,
        return_on_assets=12.0,
        gross_margin=42.0,
        net_income_margin=7.0,
        avg_daily_inflow=2500.00,
        avg_daily_outflow=2200.00,
        total_inflow=50000.00,
        total_outflow=44000.00
    )
    
    db.add(metrics)
    
    # Add sample transactions
    sample_transactions = [
        Transaction(
            application_id=app.id,
            transaction_date=datetime(2024, 1, 15, 10, 30, tzinfo=timezone.utc),
            type=TransactionType.inflow,
            category="Sales",
            description="Daily bakery sales",
            amount=1250.50,
            anomaly_score=0.1,
            is_anomaly=False
        ),
        Transaction(
            application_id=app.id,
            transaction_date=datetime(2024, 1, 15, 14, 20, tzinfo=timezone.utc),
            type=TransactionType.outflow,
            category="Supplies",
            description="Flour and baking supplies",
            amount=450.25,
            anomaly_score=0.2,
            is_anomaly=False
        ),
        Transaction(
            application_id=app.id,
            transaction_date=datetime(2024, 1, 16, 9, 15, tzinfo=timezone.utc),
            type=TransactionType.outflow,
            category="Personal",
            description="NSF - Personal expense in business account",
            amount=124.56,
            anomaly_score=0.85,
            is_anomaly=True,
            anomaly_explanation="Personal expense detected in business account - concerning pattern"
        )
    ]
    
    for transaction in sample_transactions:
        db.add(transaction)
    
    # Add team notes
    sample_notes = [
        TeamNote(
            application_id=app.id,
            author_id=analyst.id,
            content="NSF incidents are concerning but borrower's explanation seems reasonable. Strong business fundamentals otherwise. Need to discuss with risk committee.",
            is_private=True
        ),
        TeamNote(
            application_id=app.id,
            author_id=loan_officer.id,
            content="Initial review completed. Credit score looks good at 720+. Debt-to-income ratio is within acceptable limits.",
            is_private=True
        )
    ]
    
    for note in sample_notes:
        db.add(note)
    
    db.commit()
    print(f"  ✅ Created sample application: {app.business_name} (ID: {app.id})")
    
    return app


def create_system_settings(db: Session):
    """Create initial system settings."""
    print("⚙️  Creating system settings...")
    
    settings = [
        SystemSettings(
            key="risk_scoring_enabled",
            value={"enabled": True, "threshold": 0.7},
            description="Enable automatic risk scoring"
        ),
        SystemSettings(
            key="anomaly_detection_enabled", 
            value={"enabled": True, "sensitivity": 0.8},
            description="Enable transaction anomaly detection"
        ),
        SystemSettings(
            key="default_loan_terms",
            value={
                "min_amount": 1000,
                "max_amount": 500000,
                "interest_rate": 8.5,
                "terms_months": [12, 24, 36, 48, 60]
            },
            description="Default loan terms and limits"
        )
    ]
    
    for setting in settings:
        db.add(setting)
        print(f"  ✅ Created setting: {setting.key}")
    
    db.commit()


def main():
    """Main initialization function."""
    print("🚀 Initializing Caelo Database...")
    print("=" * 50)
    
    try:
        # Initialize database tables
        success = init_database()
        if not success:
            print("❌ Failed to initialize database")
            sys.exit(1)
        
        # Create database session
        db = SessionLocal()
        
        try:
            # Create initial data
            users = create_initial_users(db)
            sample_app = create_sample_applications(db, users)
            create_system_settings(db)
            
            print("=" * 50)
            print("✅ Database initialization complete!")
            print()
            print("🧑‍💼 Demo Users Created:")
            print("  • admin@withcaelo.ai (admin) - password: demo123")
            print("  • sarah@withcaelo.ai (admin) - password: demo123")
            print("  • mike@cdfi.example.org (analyst) - password: demo123")
            print("  • loan.officer@cdfi.example.org (loan_officer) - password: demo123") 
            print("  • jessica@smallbiz.com (borrower) - password: demo123")
            print()
            print("📋 Sample Data:")
            print(f"  • 1 loan application created")
            print(f"  • Business metrics and transactions added")
            print(f"  • Team notes created")
            print()
            print("🗄️  Database ready for development!")
            
        finally:
            db.close()
            
    except Exception as e:
        print(f"❌ Database initialization failed: {e}")
        sys.exit(1)


if __name__ == "__main__":
    main()
