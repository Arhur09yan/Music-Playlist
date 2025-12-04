# Quick Setup Guide

## Initial Setup

### 1. Load nvm in your terminal

If you're using a new terminal, you need to load nvm first:

```bash
source ~/.nvm/nvm.sh
nvm use 20
```

**To make this automatic**, add this to your `~/.zshrc` (or `~/.bashrc`):

```bash
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"
```

Then restart your terminal or run:

```bash
source ~/.zshrc
```

### 2. Verify Node.js version

```bash
node -v  # Should show v20.x.x
pnpm -v  # Should show version number
```

### 3. Start the project

```bash
# Start backend (PostgreSQL + FastAPI)
make backend-up

# In another terminal, start frontend
make frontend-dev
```

## Troubleshooting

### "nvm: command not found"

- Run: `source ~/.nvm/nvm.sh`
- Or add nvm to your shell config (see step 1 above)

### "pnpm: command not found"

- Run: `npm install -g pnpm`

### "Node.js version too old"

- Run: `source ~/.nvm/nvm.sh && nvm use 20`

### Makefile commands

```bash
make help           # See all commands
make check-node     # Check Node.js version
make backend-up     # Start backend
make frontend-dev   # Start frontend
```
