define npm_with_install
	@$(MAKE) --no-print-directory install && $(NPM_EXEC) run $(1)
endef

define npm_simple
	@$(NPM_EXEC) run $(1)
endef

define clean_install_base
	@echo "$(COLOR_YELLOW)🧹 Cleaning $(1)...$(COLOR_RESET)"; \
	$(RUN) sh -c "rm -rf node_modules package-lock.json .npm"; \
	$(NPM) ci; \
	echo "$(COLOR_GREEN)✓ $(1) complete$(COLOR_RESET)"
endef

define install_base
	@echo "$(COLOR_BLUE)📦 Installing dependencies...$(COLOR_RESET)"; \
	$(NPM) ci; \
	echo "$(COLOR_GREEN)✓ Dependencies installed$(COLOR_RESET)"
endef

define ensure_service_running
	@if $(DOCKER_COMPOSE) ps --services --filter "status=running" | grep -q "^$(SERVICE)$$"; then \
		if $(DOCKER_COMPOSE) exec -T $(SERVICE) sh -c 'command -v npm >/dev/null 2>&1'; then \
			echo "$(COLOR_GREEN)✓ Service $(SERVICE) is running$(COLOR_RESET)" ; \
		else \
			echo "$(COLOR_YELLOW)⚠️  npm not found in container, rebuilding...$(COLOR_RESET)" ; \
			$(MAKE) --no-print-directory _rebuild-service; \
		fi; \
	elif $(DOCKER_COMPOSE) ps --services --all | grep -q "^$(SERVICE)$$"; then \
		echo "$(COLOR_YELLOW)⚠️  Service exists but stopped, starting...$(COLOR_RESET)" ; \
		$(_SERVICE_START); \
	else \
		echo "$(COLOR_BLUE)🐳 Creating service $(SERVICE)...$(COLOR_RESET)" ; \
		$(_SERVICE_START); \
	fi
endef
