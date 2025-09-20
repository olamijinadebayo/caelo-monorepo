#!/usr/bin/env python3
"""
Simple test script to verify model imports work correctly.
"""

import os

# Force SQLite database for testing
os.environ['DATABASE_URL'] = 'sqlite:///./caelo_test.db'

print("🧪 Testing model imports...")
print(f"🗄️  DATABASE_URL set to: {os.environ['DATABASE_URL']}")

try:
    import models_new
    print("✅ Models imported successfully!")
    
    # Test basic model instantiation
    from models_new import User, UserRole
    import uuid
    
    # Create a test user instance (not saved to DB)
    test_user = User(
        id=uuid.uuid4(),
        email="test@example.com",
        password_hash="test_hash",
        role=UserRole.admin,
        name="Test User"
    )
    
    print(f"✅ Model instantiation works: {test_user.name}")
    print("✅ All model tests passed!")
    
except Exception as e:
    print(f"❌ Model test failed: {e}")
    import traceback
    traceback.print_exc()
