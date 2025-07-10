import pytest
from unittest.mock import Mock, patch
from fastapi import HTTPException
from sqlalchemy.orm import Session

from auth import (
    verify_password,
    get_password_hash,
    authenticate_user,
    create_access_token,
    get_current_user,
    get_current_active_user,
)
from models import User, UserRole


class TestPasswordHashing:
    """Test password hashing and verification functions."""

    def test_get_password_hash(self):
        """Test that password hashing works correctly."""
        password = "testpassword"
        hashed = get_password_hash(password)

        assert hashed != password
        assert hashed.startswith("$2b$")
        assert len(hashed) > 20

    def test_verify_password_correct(self):
        """Test password verification with correct password."""
        password = "testpassword"
        hashed = get_password_hash(password)

        assert verify_password(password, hashed) is True

    def test_verify_password_incorrect(self):
        """Test password verification with incorrect password."""
        password = "testpassword"
        wrong_password = "wrongpassword"
        hashed = get_password_hash(password)

        assert verify_password(wrong_password, hashed) is False


class TestAuthenticateUser:
    """Test user authentication function."""

    def test_authenticate_user_success(self, db_session: Session):
        """Test successful user authentication."""
        # Create a test user
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

        # Test authentication
        authenticated_user = authenticate_user(
            db_session, "test@example.com", "testpassword"
        )

        assert authenticated_user is not None
        assert authenticated_user.email == "test@example.com"
        assert authenticated_user.name == "Test User"

    def test_authenticate_user_wrong_password(self, db_session: Session):
        """Test authentication with wrong password."""
        # Create a test user
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

        # Test authentication with wrong password
        authenticated_user = authenticate_user(
            db_session, "test@example.com", "wrongpassword"
        )

        assert authenticated_user is None

    def test_authenticate_user_nonexistent(self, db_session: Session):
        """Test authentication with nonexistent user."""
        authenticated_user = authenticate_user(
            db_session, "nonexistent@example.com", "testpassword"
        )

        assert authenticated_user is None


class TestCreateAccessToken:
    """Test JWT token creation."""

    def test_create_access_token(self):
        """Test that access token is created correctly."""
        data = {"sub": "test@example.com", "role": "admin"}
        token = create_access_token(data)

        assert isinstance(token, str)
        assert len(token) > 50  # JWT tokens are typically long

    def test_create_access_token_with_expiry(self):
        """Test access token creation with custom expiry."""
        from datetime import timedelta

        data = {"sub": "test@example.com", "role": "admin"}
        expires_delta = timedelta(minutes=30)
        token = create_access_token(data, expires_delta)

        assert isinstance(token, str)
        assert len(token) > 50


class TestGetCurrentUser:
    """Test current user retrieval from JWT token."""

    @patch("auth.jwt.decode")
    def test_get_current_user_success(self, mock_jwt_decode, db_session: Session):
        """Test successful current user retrieval."""
        # Mock JWT decode
        mock_jwt_decode.return_value = {"sub": "test@example.com"}

        # Create a test user
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

        # Test current user retrieval
        current_user = get_current_user("fake_token", db_session)

        assert current_user is not None
        assert current_user.email == "test@example.com"

    @patch("auth.jwt.decode")
    def test_get_current_user_invalid_token(self, mock_jwt_decode):
        """Test current user retrieval with invalid token."""
        # Mock JWT decode to raise exception
        mock_jwt_decode.side_effect = Exception("Invalid token")

        with pytest.raises(HTTPException) as exc_info:
            get_current_user("invalid_token", Mock())

        assert exc_info.value.status_code == 401

    @patch("auth.jwt.decode")
    def test_get_current_user_nonexistent_user(
        self, mock_jwt_decode, db_session: Session
    ):
        """Test current user retrieval with nonexistent user."""
        # Mock JWT decode
        mock_jwt_decode.return_value = {"sub": "nonexistent@example.com"}

        with pytest.raises(HTTPException) as exc_info:
            get_current_user("fake_token", db_session)

        assert exc_info.value.status_code == 401


class TestGetCurrentActiveUser:
    """Test current active user retrieval."""

    def test_get_current_active_user_success(self, db_session: Session):
        """Test successful active user retrieval."""
        # Create an active test user
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

        # Mock get_current_user to return our test user
        with patch("auth.get_current_user", return_value=user):
            active_user = get_current_active_user(user)

        assert active_user is not None
        assert active_user.is_active is True

    def test_get_current_active_user_inactive(self, db_session: Session):
        """Test active user retrieval with inactive user."""
        # Create an inactive test user
        user = User(
            email="test@example.com",
            password_hash=get_password_hash("testpassword"),
            role=UserRole.admin,
            name="Test User",
            organization="Test Org",
            is_active=False,
        )
        db_session.add(user)
        db_session.commit()

        # Mock get_current_user to return our test user
        with patch("auth.get_current_user", return_value=user):
            with pytest.raises(HTTPException) as exc_info:
                get_current_active_user(user)

        assert exc_info.value.status_code == 400
        assert "Inactive user" in str(exc_info.value.detail)
