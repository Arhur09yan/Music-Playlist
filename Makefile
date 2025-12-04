.PHONY: help install setup start stop restart logs status clean
.PHONY: backend-up backend-down backend-logs backend-restart backend-shell
.PHONY: db-up db-down db-connect db-reset db-backup db-restore
.PHONY: frontend-install frontend-dev frontend-build frontend-start
.PHONY: test lint format

# Variables
BACKEND_DIR = backend
FRONTEND_DIR = .
DOCKER_COMPOSE = docker compose
POSTGRES_USER = music_user
POSTGRES_PASSWORD = music_password
POSTGRES_DB = music_db
POSTGRES_HOST = localhost
POSTGRES_PORT = 5433

# Colors for output
GREEN = \033[0;32m
YELLOW = \033[1;33m
NC = \033[0m # No Color

help: ## Show this help message
	@echo "$(GREEN)Available commands:$(NC)"
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "  $(YELLOW)%-20s$(NC) %s\n", $$1, $$2}'

# ============================================================================
# Setup & Installation
# ============================================================================

setup: ## Initial setup: install dependencies for both frontend and backend
	@echo "$(GREEN)Setting up project...$(NC)"
	@make frontend-install
	@echo "$(GREEN)Setup complete!$(NC)"

install: setup ## Alias for setup

# ============================================================================
# Docker & PostgreSQL Commands
# ============================================================================

backend-up: ## Start backend services (PostgreSQL + FastAPI + pgAdmin) in Docker
	@echo "$(GREEN)Starting backend services...$(NC)"
	cd $(BACKEND_DIR) && $(DOCKER_COMPOSE) up -d --build
	@echo "$(GREEN)Backend services started!$(NC)"
	@echo "  - FastAPI: http://localhost:8000"
	@echo "  - API Docs: http://localhost:8000/docs"
	@echo "  - pgAdmin: http://localhost:5050"
	@echo "  - PostgreSQL: $(POSTGRES_HOST):$(POSTGRES_PORT)"
	@echo ""
	@echo "$(YELLOW)pgAdmin Login:$(NC)"
	@echo "  Email: admin@musicapp.com"
	@echo "  Password: admin"

backend-down: ## Stop backend services
	@echo "$(YELLOW)Stopping backend services...$(NC)"
	cd $(BACKEND_DIR) && $(DOCKER_COMPOSE) down
	@echo "$(GREEN)Backend services stopped!$(NC)"

backend-restart: ## Restart backend services
	@echo "$(YELLOW)Restarting backend services...$(NC)"
	cd $(BACKEND_DIR) && $(DOCKER_COMPOSE) restart
	@echo "$(GREEN)Backend services restarted!$(NC)"

backend-logs: ## View backend logs (use ARGS="--tail 100" for more lines)
	cd $(BACKEND_DIR) && $(DOCKER_COMPOSE) logs -f $(ARGS)

backend-shell: ## Open shell in backend container
	cd $(BACKEND_DIR) && $(DOCKER_COMPOSE) exec api sh

backend-rebuild: ## Rebuild and restart backend services
	@echo "$(YELLOW)Rebuilding backend services...$(NC)"
	cd $(BACKEND_DIR) && $(DOCKER_COMPOSE) up -d --build --force-recreate
	@echo "$(GREEN)Backend services rebuilt!$(NC)"

# ============================================================================
# PostgreSQL Database Commands
# ============================================================================

db-up: backend-up ## Start PostgreSQL database
	@echo "$(GREEN)PostgreSQL is running!$(NC)"

db-down: ## Stop PostgreSQL database
	@echo "$(YELLOW)Stopping PostgreSQL...$(NC)"
	cd $(BACKEND_DIR) && $(DOCKER_COMPOSE) stop db
	@echo "$(GREEN)PostgreSQL stopped!$(NC)"

db-connect: ## Connect to PostgreSQL database using psql
	@echo "$(GREEN)Connecting to PostgreSQL...$(NC)"
	@echo "Database: $(POSTGRES_DB), User: $(POSTGRES_USER)"
	cd $(BACKEND_DIR) && $(DOCKER_COMPOSE) exec db psql -U $(POSTGRES_USER) -d $(POSTGRES_DB)

pgadmin: ## Open pgAdmin in browser and show connection details
	@echo "$(GREEN)pgAdmin Connection Details:$(NC)"
	@echo ""
	@echo "$(YELLOW)1. Open pgAdmin:$(NC)"
	@echo "   http://localhost:5050"
	@echo ""
	@echo "$(YELLOW)2. Login Credentials:$(NC)"
	@echo "   Email: admin@musicapp.com"
	@echo "   Password: admin"
	@echo ""
	@echo "$(YELLOW)3. Add Server Connection:$(NC)"
	@echo "   - Right-click 'Servers' → 'Register' → 'Server'"
	@echo "   - General Tab:"
	@echo "     Name: Music App Database"
	@echo "   - Connection Tab:"
	@echo "     Host name/address: db"
	@echo "     Port: 5432"
	@echo "     Maintenance database: $(POSTGRES_DB)"
	@echo "     Username: $(POSTGRES_USER)"
	@echo "     Password: $(POSTGRES_PASSWORD)"
	@echo "   - Click 'Save'"
	@echo ""
	@if command -v open > /dev/null 2>&1; then \
		open http://localhost:5050; \
	elif command -v xdg-open > /dev/null 2>&1; then \
		xdg-open http://localhost:5050; \
	fi

db-reset: ## Reset PostgreSQL database (WARNING: deletes all data!)
	@echo "$(YELLOW)WARNING: This will delete all data in the database!$(NC)"
	@read -p "Are you sure? [y/N] " -n 1 -r; \
	echo; \
	if [[ $$REPLY =~ ^[Yy]$$ ]]; then \
		cd $(BACKEND_DIR) && $(DOCKER_COMPOSE) down -v; \
		cd $(BACKEND_DIR) && $(DOCKER_COMPOSE) up -d db; \
		sleep 3; \
		echo "$(GREEN)Database reset complete!$(NC)"; \
	fi

db-backup: ## Backup PostgreSQL database to file
	@echo "$(GREEN)Backing up database...$(NC)"
	@mkdir -p backups
	cd $(BACKEND_DIR) && $(DOCKER_COMPOSE) exec -T db pg_dump -U $(POSTGRES_USER) $(POSTGRES_DB) > ../backups/backup_$$(date +%Y%m%d_%H%M%S).sql
	@echo "$(GREEN)Backup created in backups/ directory!$(NC)"

db-restore: ## Restore PostgreSQL database from file (use FILE=backups/backup.sql)
	@if [ -z "$(FILE)" ]; then \
		echo "$(YELLOW)Error: Please specify FILE=backups/backup.sql$(NC)"; \
		exit 1; \
	fi
	@echo "$(YELLOW)WARNING: This will overwrite existing data!$(NC)"
	@read -p "Are you sure? [y/N] " -n 1 -r; \
	echo; \
	if [[ $$REPLY =~ ^[Yy]$$ ]]; then \
		cd $(BACKEND_DIR) && $(DOCKER_COMPOSE) exec -T db psql -U $(POSTGRES_USER) -d $(POSTGRES_DB) < ../$(FILE); \
		echo "$(GREEN)Database restored!$(NC)"; \
	fi

db-status: ## Check PostgreSQL connection status
	@echo "$(GREEN)Checking PostgreSQL status...$(NC)"
	@cd $(BACKEND_DIR) && $(DOCKER_COMPOSE) exec db pg_isready -U $(POSTGRES_USER) || echo "$(YELLOW)PostgreSQL is not ready$(NC)"

db-info: ## Show PostgreSQL connection info
	@echo "$(GREEN)PostgreSQL Connection Info:$(NC)"
	@echo "  Host: $(POSTGRES_HOST)"
	@echo "  Port: $(POSTGRES_PORT)"
	@echo "  Database: $(POSTGRES_DB)"
	@echo "  User: $(POSTGRES_USER)"
	@echo "  Password: $(POSTGRES_PASSWORD)"
	@echo ""
	@echo "$(YELLOW)Connection string:$(NC)"
	@echo "  postgresql://$(POSTGRES_USER):$(POSTGRES_PASSWORD)@$(POSTGRES_HOST):$(POSTGRES_PORT)/$(POSTGRES_DB)"

import-spotify: ## Import songs from Spotify (use QUERY="search term" LIMIT=20)
	@if [ -z "$(QUERY)" ]; then \
		echo "$(YELLOW)Usage: make import-spotify QUERY=\"rock music\" LIMIT=20$(NC)"; \
		echo "$(YELLOW)Example: make import-spotify QUERY=\"jazz classics\" LIMIT=30$(NC)"; \
		exit 1; \
	fi
	@echo "$(GREEN)Importing songs from Spotify...$(NC)"
	@cd $(BACKEND_DIR) && docker compose exec api python -c "from app.database import SessionLocal; from app.services.spotify_service import SpotifyService; db = SessionLocal(); songs = SpotifyService.import_songs_from_spotify(db, '$(QUERY)', $(LIMIT)); print(f'\n✅ Imported {len(songs)} songs'); db.close()"

# ============================================================================
# Frontend Commands
# ============================================================================

frontend-install: ## Install frontend dependencies
	@echo "$(GREEN)Installing frontend dependencies...$(NC)"
	@if [ -s "$$HOME/.nvm/nvm.sh" ]; then \
		export NVM_DIR="$$HOME/.nvm" && \
		[ -s "$$NVM_DIR/nvm.sh" ] && \. "$$NVM_DIR/nvm.sh" && \
		nvm use 20 > /dev/null 2>&1 || true; \
	fi
	@if command -v pnpm > /dev/null 2>&1; then \
		cd $(FRONTEND_DIR) && pnpm install; \
	elif command -v npm > /dev/null 2>&1; then \
		cd $(FRONTEND_DIR) && npm install; \
	elif command -v yarn > /dev/null 2>&1; then \
		cd $(FRONTEND_DIR) && yarn install; \
	else \
		echo "$(YELLOW)No package manager found. Installing pnpm...$(NC)"; \
		npm install -g pnpm && cd $(FRONTEND_DIR) && pnpm install; \
	fi
	@echo "$(GREEN)Frontend dependencies installed!$(NC)"

frontend-dev: ## Start frontend development server
	@echo "$(GREEN)Checking Node.js version...$(NC)"
	@if [ -s "$$HOME/.nvm/nvm.sh" ]; then \
		export NVM_DIR="$$HOME/.nvm" && \
		[ -s "$$NVM_DIR/nvm.sh" ] && \. "$$NVM_DIR/nvm.sh" && \
		nvm use 20 > /dev/null 2>&1 || true; \
	fi
	@NODE_VERSION=$$(node -v 2>/dev/null || echo "v0.0.0"); \
	NODE_MAJOR=$$(echo $$NODE_VERSION | sed 's/v//' | cut -d. -f1); \
	if [ -z "$$NODE_MAJOR" ] || [ $$NODE_MAJOR -lt 20 ]; then \
		echo "$(YELLOW)Warning: Node.js >= 20.9.0 required. Current: $$NODE_VERSION$(NC)"; \
		echo "$(YELLOW)Trying to load nvm and switch to Node 20...$(NC)"; \
		if [ -s "$$HOME/.nvm/nvm.sh" ]; then \
			export NVM_DIR="$$HOME/.nvm" && \
			[ -s "$$NVM_DIR/nvm.sh" ] && \. "$$NVM_DIR/nvm.sh" && \
			nvm use 20 && node -v; \
		else \
			echo "$(YELLOW)Please run: source ~/.nvm/nvm.sh && nvm use 20$(NC)"; \
			exit 1; \
		fi \
	fi
	@echo "$(GREEN)Starting frontend development server...$(NC)"
	@if [ -s "$$HOME/.nvm/nvm.sh" ]; then \
		export NVM_DIR="$$HOME/.nvm" && \
		[ -s "$$NVM_DIR/nvm.sh" ] && \. "$$NVM_DIR/nvm.sh" && \
		nvm use 20 > /dev/null 2>&1 || true; \
	fi
	@if command -v pnpm > /dev/null 2>&1; then \
		cd $(FRONTEND_DIR) && pnpm dev; \
	elif command -v npm > /dev/null 2>&1; then \
		cd $(FRONTEND_DIR) && npm run dev; \
	elif command -v yarn > /dev/null 2>&1; then \
		cd $(FRONTEND_DIR) && yarn dev; \
	else \
		echo "$(YELLOW)No package manager found. Installing pnpm...$(NC)"; \
		npm install -g pnpm && cd $(FRONTEND_DIR) && pnpm dev; \
	fi

frontend-build: ## Build frontend for production
	@echo "$(GREEN)Building frontend...$(NC)"
	cd $(FRONTEND_DIR) && pnpm build || npm run build || yarn build
	@echo "$(GREEN)Frontend build complete!$(NC)"

frontend-start: ## Start frontend production server
	@echo "$(GREEN)Starting frontend production server...$(NC)"
	cd $(FRONTEND_DIR) && pnpm start || npm start || yarn start

# ============================================================================
# Combined Commands
# ============================================================================

start: backend-up frontend-dev ## Start both backend and frontend
	@echo "$(GREEN)All services started!$(NC)"

start-all: start ## Alias for start

stop: backend-down ## Stop all services
	@echo "$(GREEN)All services stopped!$(NC)"

stop-all: stop ## Alias for stop

restart: backend-restart ## Restart all services
	@echo "$(GREEN)All services restarted!$(NC)"

# ============================================================================
# Utility Commands
# ============================================================================

status: ## Show status of all services
	@echo "$(GREEN)Service Status:$(NC)"
	@echo ""
	@echo "$(YELLOW)Backend Services:$(NC)"
	@cd $(BACKEND_DIR) && $(DOCKER_COMPOSE) ps
	@echo ""
	@echo "$(YELLOW)Frontend:$(NC)"
	@pgrep -f "next dev" > /dev/null && echo "  ✓ Frontend dev server is running" || echo "  ✗ Frontend dev server is not running"

logs: backend-logs ## View all logs (alias for backend-logs)

clean: ## Clean up Docker volumes and containers
	@echo "$(YELLOW)Cleaning up...$(NC)"
	cd $(BACKEND_DIR) && $(DOCKER_COMPOSE) down -v
	@echo "$(GREEN)Cleanup complete!$(NC)"

clean-all: clean ## Clean everything including node_modules
	@echo "$(YELLOW)Removing node_modules...$(NC)"
	rm -rf $(FRONTEND_DIR)/node_modules
	@echo "$(GREEN)Full cleanup complete!$(NC)"

# ============================================================================
# Development Commands
# ============================================================================

check-node: ## Check Node.js version compatibility
	@echo "$(GREEN)Checking Node.js version...$(NC)"
	@if [ -s "$$HOME/.nvm/nvm.sh" ]; then \
		export NVM_DIR="$$HOME/.nvm" && \
		[ -s "$$NVM_DIR/nvm.sh" ] && \. "$$NVM_DIR/nvm.sh" && \
		nvm use 20 > /dev/null 2>&1 || true; \
	fi
	@NODE_VERSION=$$(node -v 2>/dev/null || echo "v0.0.0"); \
	NODE_MAJOR=$$(echo $$NODE_VERSION | sed 's/v//' | cut -d. -f1); \
	if [ -z "$$NODE_MAJOR" ]; then \
		echo "$(YELLOW)✗ Node.js not found$(NC)"; \
		echo "$(YELLOW)Run: source ~/.nvm/nvm.sh && nvm install 20 && nvm use 20$(NC)"; \
		exit 1; \
	elif [ $$NODE_MAJOR -ge 20 ]; then \
		echo "$(GREEN)✓ Node.js $$NODE_VERSION is compatible (>= 20.9.0 required)$(NC)"; \
	else \
		echo "$(YELLOW)✗ Node.js $$NODE_VERSION is too old. Next.js requires >= 20.9.0$(NC)"; \
		if [ -s "$$HOME/.nvm/nvm.sh" ]; then \
			echo "$(GREEN)Trying to switch to Node 20...$(NC)"; \
			export NVM_DIR="$$HOME/.nvm" && \
			[ -s "$$NVM_DIR/nvm.sh" ] && \. "$$NVM_DIR/nvm.sh" && \
			nvm use 20 && node -v; \
		else \
			echo "$(YELLOW)Run: source ~/.nvm/nvm.sh && nvm use 20$(NC)"; \
			exit 1; \
		fi \
	fi

test: ## Run tests (placeholder - add your test commands)
	@echo "$(YELLOW)Tests not configured yet$(NC)"

lint: ## Run linter
	@echo "$(GREEN)Running linter...$(NC)"
	cd $(FRONTEND_DIR) && pnpm lint || npm run lint || yarn lint

format: ## Format code (placeholder - add your formatter)
	@echo "$(YELLOW)Formatter not configured yet$(NC)"

# ============================================================================
# Quick Start
# ============================================================================

quick-start: ## Quick start: setup and start everything
	@echo "$(GREEN)Quick starting project...$(NC)"
	@make setup
	@make backend-up
	@sleep 5
	@echo "$(GREEN)Backend is ready! Starting frontend...$(NC)"
	@make frontend-dev

# Default target
.DEFAULT_GOAL := help

