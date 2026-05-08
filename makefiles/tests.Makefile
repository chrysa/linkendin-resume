test: ensure-container ## Run unit tests
	@echo "$(COLOR_BLUE)🧪 Testing...$(COLOR_RESET)"
	$(call npm_simple,test)
	@echo "$(COLOR_GREEN)✓ Tests passed$(COLOR_RESET)"

test-watch: ensure-container ## Run tests in watch mode
	$(call npm_simple,test:watch)

test-coverage: ensure-container ## Run tests with coverage report
	@echo "$(COLOR_BLUE)📊 Running tests with coverage...$(COLOR_RESET)"
	$(call npm_simple,test:coverage)
	@echo "$(COLOR_GREEN)✓ Coverage report generated$(COLOR_RESET)"
	@echo "$(COLOR_BLUE)📄 Open coverage/index.html to view the report$(COLOR_RESET)"
