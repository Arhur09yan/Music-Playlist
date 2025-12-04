# Makefile Commands Reference

This project includes a comprehensive Makefile for easy development workflow management.

## Quick Start

```bash
# See all available commands
make help

# Quick start everything
make quick-start

# Or step by step:
make setup          # Install dependencies
make backend-up     # Start PostgreSQL + FastAPI
make frontend-dev   # Start Next.js dev server
```

## PostgreSQL Database Commands

### Basic Operations

```bash
# Start PostgreSQL
make db-up

# Stop PostgreSQL
make db-down

# Check database status
make db-status

# View connection info
make db-info
```

### Database Management

```bash
# Connect to PostgreSQL using psql
make db-connect

# Backup database (saves to backups/ directory)
make db-backup

# Restore database from backup
make db-restore FILE=backups/backup_20231203_143000.sql

# Reset database (WARNING: deletes all data!)
make db-reset
```

### Connection Details

- **Host:** localhost
- **Port:** 5432
- **Database:** music_db
- **User:** music_user
- **Password:** music_password

**Connection String:**

```
postgresql://music_user:music_password@localhost:5432/music_db
```

## Backend Commands (Docker)

```bash
# Start backend services (PostgreSQL + FastAPI)
make backend-up

# Stop backend services
make backend-down

# Restart backend services
make backend-restart

# Rebuild and restart
make backend-rebuild

# View logs
make backend-logs

# View last 100 lines of logs
make backend-logs ARGS="--tail 100"

# Open shell in backend container
make backend-shell
```

## Frontend Commands

```bash
# Install dependencies
make frontend-install

# Start development server
make frontend-dev

# Build for production
make frontend-build

# Start production server
make frontend-start
```

## Combined Commands

```bash
# Start everything (backend + frontend)
make start

# Stop everything
make stop

# Restart everything
make restart

# Check status of all services
make status
```

## Utility Commands

```bash
# View all logs
make logs

# Clean up Docker volumes and containers
make clean

# Full cleanup (including node_modules)
make clean-all

# Run linter
make lint
```

## Common Workflows

### First Time Setup

```bash
# 1. Install all dependencies
make setup

# 2. Start backend (PostgreSQL + FastAPI)
make backend-up

# 3. Wait a few seconds for services to start, then start frontend
make frontend-dev
```

### Daily Development

```bash
# Start backend
make backend-up

# In another terminal, start frontend
make frontend-dev
```

### Database Management

```bash
# Connect to database
make db-connect

# Backup before making changes
make db-backup

# View database info
make db-info
```

### Troubleshooting

```bash
# Check service status
make status

# View backend logs
make backend-logs

# Rebuild backend if issues
make backend-rebuild

# Reset database if needed (WARNING: deletes data!)
make db-reset
```

## Environment Variables

Make sure you have:

- `backend/.env` - Backend configuration (database, Spotify API, JWT secrets)
- `.env.local` - Frontend configuration (API URLs)

See the `.env.example` files for reference.
