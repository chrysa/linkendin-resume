build: ## Build dev docker image
	@echo "$(COLOR_BLUE)🔨 Building...$(COLOR_RESET)"
	@COMPOSE_PROFILES=dev $(DOCKER_COMPOSE) build $(SERVICE)
	@echo "$(COLOR_GREEN)✓ Build complete$(COLOR_RESET)"

build-no-cache: ## Build without cache
	@echo "$(COLOR_BLUE)🔨 Building (no cache)...$(COLOR_RESET)"
	@COMPOSE_PROFILES=dev $(DOCKER_COMPOSE) build --no-cache $(SERVICE)
	@echo "$(COLOR_GREEN)✓ Build complete$(COLOR_RESET)"

up: ## Start dev container
	@echo "$(COLOR_BLUE)🚀 Starting...$(COLOR_RESET)"
	@$(_SERVICE_START)
	@echo "$(COLOR_GREEN)✓ Started → http://localhost:$(PORT)$(COLOR_RESET)"

watch: ## Start dev container with file watching (hot-reload)
	@echo "$(COLOR_BLUE)👀 Starting with watch mode...$(COLOR_RESET)"
	@COMPOSE_PROFILES=dev $(DOCKER_COMPOSE) up --watch

down: ## Stop and remove all containers
	@echo "$(COLOR_YELLOW)🛑 Stopping...$(COLOR_RESET)"
	@$(DOCKER_COMPOSE) down -v --remove-orphans
	@echo "$(COLOR_GREEN)✓ Stopped$(COLOR_RESET)"

stop: ## Stop containers
	@$(_SERVICE_STOP)
	@$(_SERVICE_REMOVE)

restart: ## Restart containers
	@$(DOCKER_COMPOSE) restart $(SERVICE)

docker-rebuild: ## Rebuild and restart containers
	@$(MAKE) --no-print-directory _rebuild-service

ps: ## Show container status
	@$(DOCKER_COMPOSE) ps

logs: ## Show logs (last 50 lines)
	@$(_SERVICE_LOGS) --tail 50

logs-f: ## Follow logs
	@$(_SERVICE_LOGS_FOLLOW)

shell: ## Connect to running container
	@$(EXEC) sh

exec: ## Open shell in new container
	@$(RUN_IT) sh

ensure-container: ## Ensure dev container is running
	$(call ensure_service_running)

clean: ## Remove everything (containers + volumes + images)
	@echo "$(COLOR_RED)🧹 Cleaning...$(COLOR_RESET)"
	@$(_SERVICE_STOP)
	@$(_SERVICE_REMOVE)
	@$(DOCKER_COMPOSE) down -v --remove-orphans --rmi local 2>/dev/null || true
	@echo "$(COLOR_GREEN)✓ Cleaned$(COLOR_RESET)"

prod-up: ## Start prod stack (Traefik)
	@echo "$(COLOR_BLUE)🚀 Starting prod...$(COLOR_RESET)"
	@COMPOSE_PROFILES=prod $(DOCKER_COMPOSE) up -d resume-prod
	@echo "$(COLOR_GREEN)✓ Prod started$(COLOR_RESET)"

prod-down: ## Stop prod stack
	@echo "$(COLOR_YELLOW)🛑 Stopping prod...$(COLOR_RESET)"
	@COMPOSE_PROFILES=prod $(DOCKER_COMPOSE) down --remove-orphans
	@echo "$(COLOR_GREEN)✓ Prod stopped$(COLOR_RESET)"

prod-logs: ## Follow prod logs
	@COMPOSE_PROFILES=prod $(DOCKER_COMPOSE) logs -f resume-prod
