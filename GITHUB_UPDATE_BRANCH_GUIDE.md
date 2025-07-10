# GitHub Update Branch Button Guide

This guide shows you how to use GitHub's "Update branch" button to merge main into your feature branch directly from the GitHub interface.

## 🎯 What You'll See

When your feature branch is behind main, you'll see this in your pull request:

```
⚠️ This branch is out of date with the base branch
```

Followed by a button:

```
[Update branch] [Merge main into feature/your-branch-name]
```

## 📋 Step-by-Step Instructions

### Step 1: Navigate to Your Pull Request
1. Go to your GitHub repository
2. Click on the **"Pull requests"** tab
3. Find and click on your pull request

### Step 2: Look for the Update Banner
You'll see a yellow banner at the top of your pull request that says:
- "This branch is out of date with the base branch"
- "Update branch" button

### Step 3: Click "Update branch"
1. Click the **"Update branch"** button
2. GitHub will show you two options:
   - **Create a merge commit** (recommended)
   - **Rebase and update**

### Step 4: Choose Your Merge Strategy
- **Create a merge commit**: Creates a merge commit that combines your changes with main
- **Rebase and update**: Replays your commits on top of the latest main (cleaner history)

### Step 5: Confirm the Update
- Click **"Update branch"** to confirm
- GitHub will automatically merge main into your feature branch
- Your branch will now be up to date!

## 🔄 What Happens After Updating

1. **Your branch is updated**: Main's latest changes are now in your feature branch
2. **CI checks re-run**: All tests and linting will run again on the updated code
3. **Ready to merge**: Once CI passes, your PR can be merged

## 🚨 Important Notes

- **CI checks will re-run**: After updating, all automated tests will run again
- **Review comments remain**: Any existing review comments will still be there
- **No force push needed**: GitHub handles the update automatically
- **Safe operation**: This won't affect your local branch until you pull

## 🛠️ Alternative: Manual Update

If you prefer to update manually from your local machine:

```bash
# Switch to your feature branch
git checkout feature/your-feature-name

# Fetch latest changes
git fetch origin

# Merge main into your branch
git merge origin/main

# Push the updated branch
git push origin feature/your-feature-name
```

## ❓ Frequently Asked Questions

**Q: When does the "Update branch" button appear?**
A: When your feature branch is behind main and the branch protection rule "Require branches to be up to date before merging" is enabled.

**Q: Will this affect my local branch?**
A: No, this only updates the remote branch. You'll need to pull the changes locally.

**Q: What if I have conflicts?**
A: GitHub will show you the conflicts and allow you to resolve them in the web interface.

**Q: Can I undo the update?**
A: Yes, you can revert the merge commit if needed, but it's generally better to fix any issues and continue.

## 🎉 Benefits

- **No local setup required**: Works directly in GitHub
- **Automatic conflict resolution**: GitHub helps resolve conflicts
- **CI integration**: Tests run automatically after update
- **Safe and easy**: No risk of losing work
- **Team friendly**: Everyone can use the same process

This button makes it super easy to keep your feature branches up to date with main! 🚀 