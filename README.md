# Caelo Community Bridge

A modern community lending platform built with React, FastAPI, and PostgreSQL. This monorepo contains both the frontend and backend applications with a unified Docker development environment.

## 🚀 Quick Start

### Prerequisites

- Docker and Docker Compose
- Node.js 18+ (for local development)
- Python 3.11+ (for local development)

### Development Environment

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd caelo-monorepo
   ```

2. **Start the development environment**
   ```bash
   chmod +x dev.sh
   ./dev.sh start
   ```

3. **Access the applications**
   - Frontend: http://localhost:8080
   - Backend API: http://localhost:8000
   - API Documentation: http://localhost:8000/docs
   - Database: localhost:5432

### Demo Accounts

Use these accounts to test the application:

| Email | Password | Role | Organization |
|-------|----------|------|--------------|
| `sarah@withcaelo.ai` | `demo123` | Admin | Caelo Inc. |
| `mike@cdfi.example.org` | `demo123` | Analyst | Community Capital Partners |
| `jessica@smallbiz.com` | `demo123` | Borrower | Sunrise Bakery |

## 📁 Project Structure

```
caelo-monorepo/
├── apps/
│   ├── backend/           # FastAPI backend
│   │   ├── tests/         # Backend tests
│   │   ├── main.py        # FastAPI application
│   │   ├── auth.py        # Authentication logic
│   │   ├── models.py      # SQLAlchemy models
│   │   └── requirements.txt
│   └── frontend/          # React frontend
│       ├── src/
│       │   ├── test/      # Frontend tests
│       │   ├── components/
│       │   ├── hooks/
│       │   └── services/
│       └── package.json
├── docker-compose.yml     # Docker orchestration
├── dev.sh                 # Development script
└── README.md
```

## 🛠 Development

### Backend Development

The backend is built with FastAPI and includes:

- **Authentication**: JWT-based authentication with role-based access
- **Database**: PostgreSQL with SQLAlchemy ORM
- **API Documentation**: Auto-generated with FastAPI
- **Testing**: Pytest with coverage reporting

#### Running Backend Tests

```bash
cd apps/backend
pytest
pytest --cov=. --cov-report=html  # With coverage report
```

#### Backend API Endpoints

- `GET /health` - Health check
- `POST /auth/login` - User authentication
- `GET /auth/me` - Get current user (protected)
- `POST /auth/logout` - User logout

### Frontend Development

The frontend is built with React, TypeScript, and includes:

- **UI Framework**: Shadcn/ui components
- **State Management**: Zustand
- **Routing**: React Router
- **Testing**: Vitest with React Testing Library

#### Running Frontend Tests

```bash
cd apps/frontend
npm test
npm run test:coverage  # With coverage report
```

## 🐳 Docker Commands

### Development Environment

```bash
# Start all services
./dev.sh start

# Stop all services
./dev.sh stop

# Restart all services
./dev.sh restart

# View logs
./dev.sh logs

# Rebuild containers
./dev.sh rebuild
```

### Individual Services

```bash
# Backend only
docker-compose up backend

# Frontend only
docker-compose up frontend

# Database only
docker-compose up postgres
```

## 🧪 Testing

### Backend Testing

```bash
cd apps/backend

# Run all tests
pytest

# Run with coverage
pytest --cov=. --cov-report=html

# Run specific test file
pytest tests/test_auth.py

# Run tests with markers
pytest -m "unit"
pytest -m "integration"
```

### Frontend Testing

```bash
cd apps/frontend

# Run all tests
npm test

# Run with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:ui
```

## 📝 Contributing

### Creating a Pull Request

1. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes**
   - Follow the existing code style
   - Add tests for new functionality
   - Update documentation as needed

3. **Run tests**
   ```bash
   # Backend tests
   cd apps/backend && pytest
   
   # Frontend tests
   cd apps/frontend && npm test
   ```

4. **Commit your changes**
   ```bash
   git add .
   git commit -m "feat: add your feature description"
   ```

5. **Push and create PR**
   ```bash
   git push origin feature/your-feature-name
   ```

### Code Style Guidelines

#### Backend (Python)
- Use Black for code formatting
- Follow PEP 8 style guidelines
- Use type hints
- Write docstrings for functions and classes

#### Frontend (TypeScript/React)
- Use Prettier for code formatting
- Follow ESLint rules
- Use TypeScript strict mode
- Write meaningful component and function names

### Testing Guidelines

- Write unit tests for all business logic
- Write integration tests for API endpoints
- Maintain at least 80% code coverage
- Use descriptive test names
- Follow AAA pattern (Arrange, Act, Assert)

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the project root:

```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/caelo

# JWT
JWT_SECRET_KEY=your-secret-key
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# API
API_BASE_URL=http://localhost:8000
```

### Database Migrations

The database schema is automatically created on startup. For production, consider using Alembic for migrations.

## 🚀 Deployment

### Production Build

```bash
# Build frontend
cd apps/frontend
npm run build

# Build backend
cd apps/backend
pip install -r requirements.txt
```

### Docker Production

```bash
# Build production images
docker-compose -f docker-compose.prod.yml build

# Run production stack
docker-compose -f docker-compose.prod.yml up -d
```

## 📚 API Documentation

Once the backend is running, visit http://localhost:8000/docs for interactive API documentation.

### Authentication

The API uses JWT tokens for authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

### Example API Usage

```bash
# Login
curl -X POST http://localhost:8000/auth/login \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "username=sarah@withcaelo.ai&password=demo123"

# Get current user (with token)
curl -X GET http://localhost:8000/auth/me \
  -H "Authorization: Bearer <your-token>"
```

## 🤝 Support

For questions or issues:

1. Check the [API Documentation](http://localhost:8000/docs)
2. Review the test files for usage examples
3. Create an issue in the repository

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details. 