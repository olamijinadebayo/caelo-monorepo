# Branch Protection Rules

This document explains the branch protection rules configured for this repository to ensure code quality and prevent direct pushes to protected branches.

## Protected Branches

### Main Branch (`main`)
The main branch is protected with the following rules:

1. **Require a pull request before merging**
   - All changes must go through a pull request
   - Direct pushes to main are blocked

2. **Require branches to be up to date before merging**
   - Pull requests must be up to date with the latest changes from main
   - This prevents merge conflicts and ensures code is tested against the latest codebase

3. **Require status checks to pass before merging**
   - All CI/CD checks must pass:
     - Backend tests
     - Frontend tests
     - Code quality checks (linting, formatting)
     - Security scans

4. **Require conversation resolution before merging**
   - All review comments must be resolved
   - All requested changes must be addressed

5. **Require signed commits**
   - All commits must be signed with GPG or SSH
   - This ensures commit authenticity

6. **Require linear history**
   - Only squash and merge or rebase and merge are allowed
   - No merge commits are allowed on main

7. **Restrict pushes that create files larger than 100MB**
   - Prevents large files from being accidentally committed

## How to Set Up Branch Protection

### 1. Navigate to Repository Settings
1. Go to your GitHub repository
2. Click on "Settings" tab
3. Click on "Branches" in the left sidebar

### 2. Add Branch Protection Rule
1. Click "Add rule" or "Add branch protection rule"
2. In "Branch name pattern", enter: `main`
3. Configure the following settings:

#### General Settings
- ✅ **Require a pull request before merging**
- ✅ **Require branches to be up to date before merging**
- ✅ **Require conversation resolution before merging**
- ✅ **Require signed commits**
- ✅ **Require linear history**
- ✅ **Restrict pushes that create files larger than 100MB**

#### Status Checks
- ✅ **Require status checks to pass before merging**
- Select the following status checks:
  - `backend-tests`
  - `frontend-tests`
  - `linting`
  - `security`

#### Pull Request Reviews
- ✅ **Require a review from code owners**
- ✅ **Dismiss stale PR approvals when new commits are pushed**
- ✅ **Require review from code owners**

### 3. Save the Rule
Click "Create" or "Save changes" to apply the branch protection rule.

## Code Owners

Create a `.github/CODEOWNERS` file to automatically request reviews from specific team members:

```
# Global code owners
* @olamijinadebayo

# Backend specific
apps/backend/ @olamijinadebayo

# Frontend specific  
apps/frontend/ @olamijinadebayo

# CI/CD and infrastructure
.github/ @olamijinadebayo
docker-compose.yml @olamijinadebayo
dev.sh @olamijinadebayo
```

## Workflow for Contributors

### Creating a Pull Request
1. Create a feature branch from main: `git checkout -b feature/your-feature-name`
2. Make your changes and commit them
3. Push your branch: `git push origin feature/your-feature-name`
4. Create a pull request on GitHub
5. Ensure all CI checks pass
6. Address any review comments
7. Keep your branch up to date with main (GitHub will show a button to update if needed)
8. Once approved and up to date, merge using "Squash and merge"

### Keeping Your Branch Up to Date
If your branch falls behind main:
1. Click "Update branch" button in the pull request
2. Or manually rebase: `git rebase main`
3. Push the updated branch: `git push --force-with-lease`

## Benefits

- **Code Quality**: All changes are reviewed and tested
- **Conflict Prevention**: Branches must be up to date before merging
- **Security**: Signed commits ensure authenticity
- **Clean History**: Linear history makes the git log easier to follow
- **Automated Checks**: CI/CD ensures code quality and security

## Troubleshooting

### "Branch is out of date" Error
If you see this error when trying to merge:
1. Click "Update branch" in the pull request
2. Or manually rebase your branch with main
3. Push the updated branch

### Failed Status Checks
If CI checks fail:
1. Review the error logs in the Actions tab
2. Fix the issues in your code
3. Push the fixes to your branch
4. The checks will run automatically on the new commits

### Permission Denied
If you can't push to main:
- This is expected behavior - all changes must go through pull requests
- Create a feature branch and submit a pull request instead 