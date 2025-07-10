from database import SessionLocal, engine
from models import Base, User, UserRole
from auth import get_password_hash


def create_demo_users():
    """Create demo users for development"""
    db = SessionLocal()

    try:
        # Check if users already exist
        existing_users = db.query(User).count()
        if existing_users > 0:
            print("Demo users already exist, skipping seed...")
            return

        # Demo users with hashed password 'demo123'
        demo_users = [
            {
                "email": "sarah@withcaelo.ai",
                "password": "demo123",
                "role": UserRole.admin,
                "name": "Sarah Chen",
                "organization": "Caelo Inc.",
            },
            {
                "email": "mike@cdfi.example.org",
                "password": "demo123",
                "role": UserRole.analyst,
                "name": "Mike Rodriguez",
                "organization": "Community Capital Partners",
            },
            {
                "email": "jessica@smallbiz.com",
                "password": "demo123",
                "role": UserRole.borrower,
                "name": "Jessica Williams",
                "organization": "Sunrise Bakery",
            },
        ]

        for user_data in demo_users:
            hashed_password = get_password_hash(user_data["password"])
            user = User(
                email=user_data["email"],
                password_hash=hashed_password,
                role=user_data["role"],
                name=user_data["name"],
                organization=user_data["organization"],
                is_active=True,
            )
            db.add(user)

        db.commit()
        print("Demo users created successfully!")
        print("Demo accounts:")
        for user_data in demo_users:
            print(
                f"  - {user_data['email']} (Role: {user_data['role'].value})"
            )
        print("  Password for all accounts: demo123")

    except Exception as e:
        print(f"Error creating demo users: {e}")
        db.rollback()
    finally:
        db.close()


if __name__ == "__main__":
    # Create tables
    Base.metadata.create_all(bind=engine)
    # Seed demo users
    create_demo_users()
