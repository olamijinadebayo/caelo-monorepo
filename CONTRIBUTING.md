# Contributing to Caelo Community Bridge

Thank you for your interest in contributing to Caelo Community Bridge! This document provides guidelines and best practices for contributing to the project.

## 🚀 Getting Started

### Prerequisites

- Docker and Docker Compose
- Node.js 18+ (for frontend development)
- Python 3.11+ (for backend development)
- Git

### Development Setup

1. **Fork and clone the repository**
   ```bash
   git clone https://github.com/your-username/caelo-monorepo.git
   cd caelo-monorepo
   ```

2. **Start the development environment**
   ```bash
   chmod +x dev.sh
   ./dev.sh start
   ```

3. **Verify everything is working**
   - Frontend: http://localhost:8080
   - Backend: http://localhost:8000
   - API Docs: http://localhost:8000/docs

## 📝 Development Workflow

### 1. Create a Feature Branch

Always create a new branch for your changes:

```bash
git checkout -b feature/your-feature-name
# or
git checkout -b fix/your-bug-fix
# or
git checkout -b docs/your-documentation-update
```

### 2. Make Your Changes

Follow these guidelines when making changes:

#### Code Style

**Backend (Python)**
- Use Black for code formatting
- Follow PEP 8 style guidelines
- Use type hints for all functions
- Write docstrings for classes and functions
- Keep functions small and focused

**Frontend (TypeScript/React)**
- Use Prettier for code formatting
- Follow ESLint rules
- Use TypeScript strict mode
- Write meaningful component and function names
- Use proper React hooks patterns

#### Testing

**Backend Testing**
- Write unit tests for all business logic
- Write integration tests for API endpoints
- Maintain at least 80% code coverage
- Use descriptive test names
- Follow AAA pattern (Arrange, Act, Assert)

```bash
cd apps/backend
pytest tests/test_your_feature.py
pytest --cov=. --cov-report=html
```

**Frontend Testing**
- Write unit tests for components
- Write integration tests for user flows
- Test error states and edge cases
- Use React Testing Library best practices

```bash
cd apps/frontend
npm test
npm run test:coverage
```

### 3. Commit Your Changes

Use conventional commit messages:

```bash
git add .
git commit -m "feat: add user profile management"
git commit -m "fix: resolve authentication token issue"
git commit -m "docs: update API documentation"
git commit -m "test: add tests for user service"
```

**Commit Types:**
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

### 4. Push and Create Pull Request

```bash
git push origin feature/your-feature-name
```

Then create a pull request on GitHub with:

- Clear title describing the change
- Detailed description of what was changed and why
- Link to any related issues
- Screenshots for UI changes

### 5. Pull Request Requirements

**Important**: The main branch is protected with strict rules. Your pull request must meet these requirements:

1. **All CI checks must pass**:
   - Backend tests
   - Frontend tests
   - Code quality checks (linting, formatting)
   - Security scans

2. **Branch must be up to date**: Your branch must be up to date with the latest changes from main before merging

3. **Code review required**: At least one approval from a code owner is required

4. **Conversation resolution**: All review comments must be resolved

5. **Linear history**: Only squash and merge is allowed

**To keep your branch up to date**:
- If GitHub shows "This branch is out of date with the base branch", click "Update branch"
- Or manually rebase: `git rebase main && git push --force-with-lease`

**If CI checks fail**:
- Review the error logs in the Actions tab
- Fix the issues in your code
- Push the fixes to your branch
- The checks will run automatically on the new commits

## 🧪 Testing Guidelines

### Backend Testing

#### Unit Tests
- Test individual functions and methods
- Mock external dependencies
- Test both success and failure cases
- Use descriptive test names

```python
def test_create_user_success(db_session: Session):
    """Test successful user creation."""
    user_data = {
        "email": "test@example.com",
        "password": "testpassword",
        "role": UserRole.admin,
        "name": "Test User"
    }
    
    user = create_user(db_session, user_data)
    
    assert user.email == "test@example.com"
    assert user.role == UserRole.admin
    assert user.is_active is True
```

#### Integration Tests
- Test API endpoints
- Test database interactions
- Test authentication and authorization
- Use test fixtures for common setup

```python
def test_login_endpoint_success(client: TestClient, test_user: User):
    """Test successful login via API."""
    response = client.post(
        "/auth/login",
        data={"username": test_user.email, "password": "testpassword"}
    )
    
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["user"]["email"] == test_user.email
```

### Frontend Testing

#### Component Tests
- Test component rendering
- Test user interactions
- Test prop changes
- Test error states

```typescript
import { render, screen, fireEvent } from '@testing-library/react'
import { LoginForm } from './LoginForm'

describe('LoginForm', () => {
  it('should submit form with valid credentials', async () => {
    const mockOnSubmit = vi.fn()
    render(<LoginForm onSubmit={mockOnSubmit} />)
    
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'test@example.com' },
    })
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'password123' },
    })
    fireEvent.click(screen.getByRole('button', { name: /login/i }))
    
    expect(mockOnSubmit).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'password123',
    })
  })
})
```

#### Hook Tests
- Test custom hooks
- Test state changes
- Test side effects
- Mock external dependencies

```typescript
import { renderHook, act } from '@testing-library/react'
import { useAuth } from './useAuth'

describe('useAuth', () => {
  it('should login successfully', async () => {
    const { result } = renderHook(() => useAuth())
    
    await act(async () => {
      await result.current.login('test@example.com', 'password')
    })
    
    expect(result.current.user).toBeTruthy()
    expect(result.current.isLoading).toBe(false)
  })
})
```

## 🔍 Code Review Process

### Before Submitting

1. **Run all tests**
   ```bash
   # Backend
   cd apps/backend && pytest
   
   # Frontend
   cd apps/frontend && npm test
   ```

2. **Check code coverage**
   ```bash
   # Backend
   pytest --cov=. --cov-report=html
   
   # Frontend
   npm run test:coverage
   ```

3. **Lint your code**
   ```bash
   # Backend
   black .
   flake8 .
   
   # Frontend
   npm run lint
   ```

4. **Test manually**
   - Test your changes in the browser
   - Verify API endpoints work correctly
   - Check for any console errors

### Review Checklist

When reviewing code, check for:

- [ ] Code follows style guidelines
- [ ] Tests are included and passing
- [ ] Documentation is updated
- [ ] No security vulnerabilities
- [ ] Performance considerations
- [ ] Error handling is appropriate
- [ ] Code is readable and maintainable

## 🐛 Bug Reports

When reporting bugs, include:

1. **Clear description** of the issue
2. **Steps to reproduce** the problem
3. **Expected behavior** vs actual behavior
4. **Environment details** (browser, OS, etc.)
5. **Screenshots** if applicable
6. **Console logs** or error messages

## 💡 Feature Requests

When requesting features, include:

1. **Clear description** of the feature
2. **Use case** and benefits
3. **Implementation suggestions** if any
4. **Mockups** or wireframes if applicable

## 📚 Documentation

### Code Documentation

**Backend**
- Use docstrings for all functions and classes
- Include type hints
- Document complex business logic
- Add comments for non-obvious code

**Frontend**
- Use JSDoc comments for functions
- Document component props
- Add comments for complex logic
- Include usage examples

### API Documentation

- Update API documentation when adding new endpoints
- Include request/response examples
- Document error codes and messages
- Keep documentation in sync with code

## 🔒 Security Guidelines

- Never commit sensitive information (passwords, API keys, etc.)
- Use environment variables for configuration
- Validate all user inputs
- Follow OWASP security guidelines
- Report security issues privately

## 🚀 Deployment

### Testing Before Deployment

1. **Run full test suite**
2. **Check code coverage**
3. **Test in staging environment**
4. **Verify all features work**
5. **Check performance metrics**

### Deployment Checklist

- [ ] All tests passing
- [ ] Code review completed
- [ ] Documentation updated
- [ ] Environment variables configured
- [ ] Database migrations applied
- [ ] Monitoring and logging set up

## 🤝 Community Guidelines

- Be respectful and inclusive
- Help other contributors
- Provide constructive feedback
- Follow the project's code of conduct
- Celebrate contributions and achievements

## 📞 Getting Help

If you need help:

1. Check the [README.md](README.md)
2. Review existing issues and pull requests
3. Ask questions in discussions
4. Contact the maintainers

## 🎉 Recognition

Contributors will be recognized in:

- Project README
- Release notes
- Contributor hall of fame
- GitHub contributors page

Thank you for contributing to Caelo Community Bridge! 🚀 