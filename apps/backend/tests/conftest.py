import asyncio
import os
import sys
from typing import Generator

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import Session, sessionmaker
from sqlalchemy.pool import StaticPool

# Add the parent directory to Python path for imports
sys.path.insert(
    0, os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
)

# Import these lazily to avoid database connection issues during import
try:
    from auth import get_password_hash
    from database import Base, get_db
    from models import User, UserRole
except ImportError:
    # Fallback for when imports fail during testing setup
    pass


# Lazy import of app to avoid database connection during import
def get_app():
    from main import app

    return app


# Test database configuration
SQLALCHEMY_DATABASE_URL = "sqlite:///./test.db"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)
TestingSessionLocal = sessionmaker(
    autocommit=False, autoflush=False, bind=engine
)


@pytest.fixture(scope="session")
def event_loop():
    """Create an instance of the default event loop for the test session."""
    loop = asyncio.get_event_loop_policy().new_event_loop()
    yield loop
    loop.close()


@pytest.fixture(scope="function")
def db_session() -> Generator[Session, None, None]:
    """Create a fresh database session for each test."""
    Base.metadata.create_all(bind=engine)
    session = TestingSessionLocal()
    try:
        yield session
    finally:
        session.close()
        Base.metadata.drop_all(bind=engine)


@pytest.fixture(scope="function")
def client(db_session: Session) -> Generator[TestClient, None, None]:
    """Create a test client with a fresh database session."""

    def override_get_db():
        try:
            yield db_session
        finally:
            pass

    app = get_app()
    app.dependency_overrides[get_db] = override_get_db
    with TestClient(app) as test_client:
        yield test_client
    app.dependency_overrides.clear()


@pytest.fixture
def test_user(db_session: Session) -> User:
    """Create a test user in the database."""
    user = User(
        email="test@example.com",
        password_hash=get_password_hash("testpassword"),
        role=UserRole.admin,
        name="Test User",
        organization="Test Org",
        is_active=True,
    )
    db_session.add(user)
    db_session.commit()
    db_session.refresh(user)
    return user


@pytest.fixture
def test_user_token(client: TestClient, test_user: User) -> str:
    """Get an access token for the test user."""
    response = client.post(
        "/auth/login",
        data={"username": test_user.email, "password": "testpassword"},
    )
    return response.json()["access_token"]


@pytest.fixture
def admin_user(db_session: Session) -> User:
    """Create an admin user for testing."""
    user = User(
        email="admin@test.com",
        password_hash=get_password_hash("admin123"),
        role=UserRole.admin,
        name="Admin User",
        organization="Admin Org",
        is_active=True,
    )
    db_session.add(user)
    db_session.commit()
    db_session.refresh(user)
    return user


@pytest.fixture
def analyst_user(db_session: Session) -> User:
    """Create an analyst user for testing."""
    user = User(
        email="analyst@test.com",
        password_hash=get_password_hash("analyst123"),
        role=UserRole.analyst,
        name="Analyst User",
        organization="Analyst Org",
        is_active=True,
    )
    db_session.add(user)
    db_session.commit()
    db_session.refresh(user)
    return user


@pytest.fixture
def borrower_user(db_session: Session) -> User:
    """Create a borrower user for testing."""
    user = User(
        email="borrower@test.com",
        password_hash=get_password_hash("borrower123"),
        role=UserRole.borrower,
        name="Borrower User",
        organization="Borrower Org",
        is_active=True,
    )
    db_session.add(user)
    db_session.commit()
    db_session.refresh(user)
    return user
