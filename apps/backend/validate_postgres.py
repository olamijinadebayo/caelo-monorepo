#!/usr/bin/env python3
"""
PostgreSQL Database Validation Script
"""

import os
from database import SessionLocal
from models_new import *
from sqlalchemy import text

# Set PostgreSQL connection
os.environ['DATABASE_URL'] = 'postgresql://caelo_user:caelo_password@localhost:5432/caelo'

print('🗄️ PostgreSQL Database Validation')
print('=' * 40)

db = SessionLocal()
try:
    # Check all tables exist
    tables_query = text("SELECT tablename FROM pg_tables WHERE schemaname = 'public' ORDER BY tablename;")
    tables = [row[0] for row in db.execute(tables_query).fetchall()]
    print(f'📊 Total Tables: {len(tables)}')
    for table in tables:
        print(f'  ✅ {table}')
    
    print(f'\n👥 Users: {db.query(User).count()}')
    print(f'📋 Applications: {db.query(LoanApplication).count()}')
    print(f'💰 Transactions: {db.query(Transaction).count()}')
    print(f'📝 Team Notes: {db.query(TeamNote).count()}')
    print(f'⚙️ System Settings: {db.query(SystemSettings).count()}')
    
    # Test complex query
    app = db.query(LoanApplication).first()
    if app:
        print(f'\n🔍 Sample Application:')
        print(f'  • {app.business_name}')
        print(f'  • Status: {app.status}')
        print(f'  • Amount: ${app.loan_amount:,.2f}')
        print(f'  • Risk Score: {app.risk_score}')
    
    # Test relationships
    user_count_by_role = {}
    for role in UserRole:
        count = db.query(User).filter(User.role == role).count()
        user_count_by_role[role.value] = count
    
    print(f'\n🧑‍💼 Users by Role:')
    for role, count in user_count_by_role.items():
        print(f'  • {role}: {count}')
    
    print('\n✅ PostgreSQL validation complete!')
    
except Exception as e:
    print(f'❌ Error: {e}')
    import traceback
    traceback.print_exc()
finally:
    db.close()
