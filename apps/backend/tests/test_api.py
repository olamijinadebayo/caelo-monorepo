from fastapi.testclient import TestClient
import time

from models import User


class TestHealthEndpoint:
    """Test health check endpoint."""

    def test_health_check(self, client: TestClient):
        """Test that health endpoint returns healthy status."""
        response = client.get("/health")

        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "healthy"
        assert "timestamp" in data


class TestRootEndpoint:
    """Test root endpoint."""

    def test_root_endpoint(self, client: TestClient):
        """Test that root endpoint returns welcome message."""
        response = client.get("/")

        assert response.status_code == 200
        data = response.json()
        assert "Caelo API" in data["message"]


class TestAuthLogin:
    """Test authentication login endpoint."""

    def test_login_success(self, client: TestClient, test_user: User):
        """Test successful login."""
        response = client.post(
            "/auth/login",
            data={
                "username": test_user.email,
                "password": "testpassword",
            },
        )

        assert response.status_code == 200
        data = response.json()
        assert "access_token" in data
        assert data["token_type"] == "bearer"
        assert "user" in data
        assert data["user"]["email"] == test_user.email
        assert data["user"]["role"] == test_user.role.value

    def test_login_wrong_password(self, client: TestClient, test_user: User):
        """Test login with wrong password."""
        response = client.post(
            "/auth/login",
            data={
                "username": test_user.email,
                "password": "wrongpassword",
            },
        )

        assert response.status_code == 401
        data = response.json()
        assert "Incorrect email or password" in data["detail"]
        
    def test_login_rate_limit(self, client: TestClient, test_user: User):
        """Test rate limits on excessive login attempts"""
        # Range is 8 as previous tests to the same endpoint have been executed
        for _ in range(8):
           # Test unsuccessful login.
            self.test_login_wrong_password(client=client, test_user=test_user)
            
       # Test with valid credentials    
        response = client.post(
            "/auth/login",
            data={
                "username": test_user.email,
                "password": "testpassword",
            },
        )

    def test_login_rate_limit(self, client: TestClient, test_user: User):
        """Test rate limits on excessive login attempts"""
        # Range is 8 as previous tests to the same endpoint have been executed
        for _ in range(8):
            # Test unsuccessful login.
            self.test_login_wrong_password(client=client, test_user=test_user)

        # Test with valid credentials
        response = client.post(
            "/auth/login",
            data={
                "username": test_user.email,
                "password": "testpassword",
            },
        )

        assert response.status_code == 429
        # Sleep to allow other tests reach the same endpoint without limits
        time.sleep(61)

    def test_login_nonexistent_user(self, client: TestClient):
        """Test login with nonexistent user."""
        response = client.post(
            "/auth/login",
            data={
                "username": "nonexistent@example.com",
                "password": "testpassword",
            },
        )

        assert response.status_code == 401
        data = response.json()
        assert "Incorrect email or password" in data["detail"]

    def test_login_missing_username(self, client: TestClient):
        """Test login with missing username."""
        response = client.post(
            "/auth/login",
            data={"password": "testpassword"},
        )

        assert response.status_code == 422

    def test_login_missing_password(self, client: TestClient):
        """Test login with missing password."""
        response = client.post(
            "/auth/login",
            data={
                "username": "test@example.com",
            },
        )

        assert response.status_code == 422


class TestAuthMe:
    """Test current user endpoint."""

    def test_get_me_success(self, client: TestClient, test_user_token: str):
        """Test successful current user retrieval."""
        response = client.get(
            "/auth/me",
            headers={"Authorization": f"Bearer {test_user_token}"},
        )

        assert response.status_code == 200
        data = response.json()
        assert data["email"] == "test@example.com"
        assert data["role"] == "admin"
        assert data["is_active"] is True
        assert "created_at" in data

    def test_get_me_no_token(self, client: TestClient):
        """Test current user retrieval without token."""
        response = client.get("/auth/me")

        assert response.status_code == 401

    def test_get_me_invalid_token(self, client: TestClient):
        """Test current user retrieval with invalid token."""
        response = client.get(
            "/auth/me",
            headers={"Authorization": "Bearer invalid_token"},
        )

        assert response.status_code == 401

    def test_get_me_wrong_token_format(self, client: TestClient):
        """Test current user retrieval with wrong token format."""
        response = client.get(
            "/auth/me",
            headers={"Authorization": "InvalidFormat token"},
        )

        assert response.status_code == 401


class TestAuthLogout:
    """Test logout endpoint."""

    def test_logout_success(self, client: TestClient):
        """Test successful logout."""
        response = client.post("/auth/logout")

        assert response.status_code == 200
        data = response.json()
        assert data["message"] == "Successfully logged out"


class TestRoleBasedAccess:
    """Test role-based access to endpoints."""

    def test_admin_user_access(self, client: TestClient, admin_user: User):
        """Test that admin user can access their own data."""
        # Login as admin
        login_response = client.post(
            "/auth/login",
            data={
                "username": admin_user.email,
                "password": "admin123",
            },
        )
        token = login_response.json()["access_token"]

        # Access protected endpoint
        response = client.get(
            "/auth/me",
            headers={"Authorization": f"Bearer {token}"},
        )

        assert response.status_code == 200
        data = response.json()
        assert data["role"] == "admin"

    def test_analyst_user_access(self, client: TestClient, analyst_user: User):
        """Test that analyst user can access their own data."""
        # Login as analyst
        login_response = client.post(
            "/auth/login",
            data={"username": analyst_user.email, "password": "analyst123"},
        )
        token = login_response.json()["access_token"]

        # Access protected endpoint
        response = client.get(
            "/auth/me",
            headers={"Authorization": f"Bearer {token}"},
        )

        assert response.status_code == 200
        data = response.json()
        assert data["role"] == "analyst"

    def test_borrower_user_access(
        self,
        client: TestClient,
        borrower_user: User,
    ):
        """Test that borrower user can access their own data."""
        # Login as borrower
        login_response = client.post(
            "/auth/login",
            data={"username": borrower_user.email, "password": "borrower123"},
        )
        token = login_response.json()["access_token"]

        # Access protected endpoint
        response = client.get(
            "/auth/me",
            headers={"Authorization": f"Bearer {token}"},
        )

        assert response.status_code == 200
        data = response.json()
        assert data["role"] == "borrower"


class TestCORS:
    """Test CORS configuration."""

    def test_cors_preflight(self, client: TestClient):
        """Test CORS preflight request."""
        response = client.options(
            "/auth/login",
            headers={
                "Origin": "http://localhost:8080",
                "Access-Control-Request-Method": "POST",
                "Access-Control-Request-Headers": "Content-Type",
            },
        )

        # Should return 200 for preflight requests
        assert response.status_code == 200

    def test_cors_headers(self, client: TestClient, test_user: User):
        """Test that CORS headers are present in responses."""
        response = client.post(
            "/auth/login",
            data={
                "username": test_user.email,
                "password": "testpassword",
            },
            headers={"Origin": "http://localhost:8080"},
        )

        assert response.status_code == 200
        # CORS headers should be present
        assert "access-control-allow-origin" in response.headers
