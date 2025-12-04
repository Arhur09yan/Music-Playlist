# Git Cleanup Guide - Remove Large Files from History

## Problem

Your repository has large files (`node_modules/`, `.next/`) in Git history that exceed GitHub's 100MB limit.

## Solution Options

### Option 1: Use git-filter-repo (Recommended)

1. **Install git-filter-repo** (if not installed):

   ```bash
   # macOS
   brew install git-filter-repo

   # Or via pip
   pip install git-filter-repo
   ```

2. **Remove node_modules and .next from entire history**:

   ```bash
   cd /Users/artur/Desktop/fast-api-next-js-scaffold

   # Remove node_modules from all commits
   git filter-repo --path node_modules --invert-paths

   # Remove .next from all commits
   git filter-repo --path .next --invert-paths
   ```

3. **Force push** (⚠️ WARNING: This rewrites history):
   ```bash
   git push origin main --force
   ```

### Option 2: Use BFG Repo-Cleaner (Easier)

1. **Download BFG**:

   ```bash
   # macOS
   brew install bfg
   ```

2. **Remove large files**:

   ```bash
   cd /Users/artur/Desktop/fast-api-next-js-scaffold

   # Remove node_modules
   bfg --delete-folders node_modules

   # Remove .next
   bfg --delete-folders .next

   # Clean up
   git reflog expire --expire=now --all
   git gc --prune=now --aggressive
   ```

3. **Force push**:
   ```bash
   git push origin main --force
   ```

### Option 3: Start Fresh (Simplest, but loses history)

If you don't care about preserving Git history:

1. **Create a new orphan branch**:

   ```bash
   git checkout --orphan clean-main
   git add .
   git commit -m "Initial commit - clean repository"
   ```

2. **Delete old main and rename**:

   ```bash
   git branch -D main
   git branch -m main
   ```

3. **Force push**:
   ```bash
   git push origin main --force
   ```

### Option 4: Manual Cleanup (If files are only in recent commits)

If the large files are only in the last few commits:

1. **Reset to before the problematic commits**:

   ```bash
   # Find the commit before the large files were added
   git log --oneline

   # Reset to that commit (replace COMMIT_HASH)
   git reset --soft COMMIT_HASH
   ```

2. **Re-commit without large files**:

   ```bash
   # Make sure .gitignore is correct
   git add .gitignore backend/.gitignore

   # Add all other files (node_modules/.next will be ignored)
   git add .
   git commit -m "Clean commit without node_modules and .next"
   ```

3. **Force push**:
   ```bash
   git push origin main --force
   ```

---

## Quick Fix (Recommended for your case)

Since you have 3 commits ahead, let's check if we can just reset:

```bash
# 1. Check what's in those commits
git log --oneline -5

# 2. If the large files are in those 3 commits, reset to origin/main
git reset --soft origin/main

# 3. Make sure .gitignore is correct
git add .gitignore backend/.gitignore

# 4. Add all files (node_modules/.next will be ignored)
git add .

# 5. Commit
git commit -m "Add project files (excluding node_modules and .next)"

# 6. Push
git push origin main
```

---

## Verify .gitignore is Working

After cleanup, verify:

```bash
# Check if node_modules is ignored
git status | grep node_modules

# Should return nothing if properly ignored

# Try to add node_modules (should be ignored)
git add node_modules
git status

# Should not show node_modules
```

---

## Prevention

To prevent this in the future:

1. ✅ `.gitignore` is already set up correctly
2. Always check `git status` before committing
3. Never commit `node_modules/` or `.next/`
4. Use `git add .` carefully, or add files individually

---

## ⚠️ Important Notes

- **Force push rewrites history** - coordinate with team if working together
- **Backup your repository** before doing force operations
- **Large file removal** may take time depending on repository size
