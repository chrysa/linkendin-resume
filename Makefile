.DEFAULT_GOAL := help

# ─── Variables ────────────────────────────────────────────────────────────────
IMAGE      := ghcr.io/chrysa/resume
PORT       := 3000

# ─── Dev ──────────────────────────────────────────────────────────────────────
.PHONY: install
install: ## Install dependencies
	npm ci

.PHONY: dev
dev: ## Start Vite dev server
	npm run dev

.PHONY: build
build: ## Build for production
	npm run build

.PHONY: preview
preview: ## Preview production build locally
	npm run preview

# ─── Quality ──────────────────────────────────────────────────────────────────
.PHONY: lint
lint: ## Run ESLint
	npm run lint

.PHONY: lint-fix
lint-fix: ## Run ESLint with auto-fix
	npm run lint:fix

.PHONY: type-check
type-check: ## Run TypeScript type check
	npm run type-check

.PHONY: test
test: ## Run unit tests
	npm run test

.PHONY: test-coverage
test-coverage: ## Run tests with coverage report
	npm run test:coverage

.PHONY: ci
ci: lint type-check test build ## Run all CI checks locally

# ─── Pre-commit ──────────────────────────────────────────────────────────────
.PHONY: pre-commit-install
pre-commit-install: ## Install pre-commit hooks
	pip install pre-commit
	pre-commit install

.PHONY: pre-commit-run
pre-commit-run: ## Run pre-commit on all files
	pre-commit run --all-files

.PHONY: pre-commit-update
pre-commit-update: ## Update pre-commit hooks to latest revisions
	pre-commit autoupdate --bleeding-edge

# ─── Docker ───────────────────────────────────────────────────────────────────
.PHONY: docker-dev
docker-dev: ## Start dev container with file watching (COMPOSE_PROFILES=dev)
	COMPOSE_PROFILES=dev docker compose up --watch

.PHONY: docker-build
docker-build: ## Build production Docker image
	docker build --target prod -t $(IMAGE):local -f docker/Dockerfile .

.PHONY: docker-run
docker-run: ## Run production Docker image locally
	docker run --rm -p $(PORT):3000 $(IMAGE):local

.PHONY: docker-prod
docker-prod: ## Start prod stack (COMPOSE_PROFILES=prod)
	COMPOSE_PROFILES=prod docker compose up -d

.PHONY: docker-down
docker-down: ## Stop and remove containers
	docker compose down

.PHONY: docker-clean
docker-clean: ## Remove containers, volumes and images
	docker compose down -v --rmi local

# ─── Help ─────────────────────────────────────────────────────────────────────
.PHONY: help
help: ## Show this help
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) \
		| awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-22s\033[0m %s\n", $$1, $$2}'
