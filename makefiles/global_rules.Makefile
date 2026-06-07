_rebuild-service:
	@$(_SERVICE_STOP)
	@$(_SERVICE_REMOVE)
	@echo "$(COLOR_BLUE)🔨 Building $(SERVICE)...$(COLOR_RESET)"
	@COMPOSE_PROFILES=dev $(DOCKER_COMPOSE) build $(SERVICE)
	@echo "$(COLOR_BLUE)🚀 Starting $(SERVICE)...$(COLOR_RESET)"
	@$(_SERVICE_START)
