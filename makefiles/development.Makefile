install: ensure-container ## Install dependencies in container
	$(call install_base)

install-clean: ensure-container ## Clean install (removes node_modules first)
	$(call clean_install_base,Clean install)

install-reset: ## Complete reset and clean install
	@echo "$(COLOR_RED)🔥 Full reset...$(COLOR_RESET)"
	@$(MAKE) --no-print-directory _rebuild-service
	$(call clean_install_base,Reset)

install-local: ## Install dependencies locally (without Docker)
	@echo "$(COLOR_BLUE)📦 Installing locally...$(COLOR_RESET)"
	npm ci
	@echo "$(COLOR_GREEN)✓ Dependencies installed$(COLOR_RESET)"

dev: ensure-container ## Start dev server and follow logs
	@echo "$(COLOR_GREEN)🚀 Dev server running on http://localhost:$(PORT)$(COLOR_RESET)"
	@echo "$(COLOR_BLUE)📋 Following logs (Ctrl+C to exit)...$(COLOR_RESET)"
	@$(DOCKER_COMPOSE) logs -f --tail=100 $(SERVICE)

dev-watch: ## Start dev container with file watching (hot-reload)
	@echo "$(COLOR_BLUE)👀 Starting with watch mode...$(COLOR_RESET)"
	@COMPOSE_PROFILES=dev $(DOCKER_COMPOSE) up --watch

preview: ensure-container ## Preview production build in container
	$(call npm_with_install,preview)

build-prod: ensure-container install ## Build for production inside container
	@echo "$(COLOR_BLUE)🏗️  Building...$(COLOR_RESET)"
	$(call npm_simple,build)
	@echo "$(COLOR_GREEN)✓ Build complete → dist/$(COLOR_RESET)"

dev-rebuild: ## Rebuild container and reinstall dependencies
	@echo "$(COLOR_BLUE)🔨 Rebuilding project...$(COLOR_RESET)"
	@$(MAKE) --no-print-directory _rebuild-service
	$(call install_base)
