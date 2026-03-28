format: ensure-container ## Format code with Prettier
	@echo "$(COLOR_BLUE)✨ Formatting...$(COLOR_RESET)"
	$(call npm_simple,lint:fix)
	@echo "$(COLOR_GREEN)✓ Formatted$(COLOR_RESET)"

lint: ensure-container ## Run ESLint
	@echo "$(COLOR_BLUE)🔍 Linting...$(COLOR_RESET)"
	$(call npm_simple,lint)

type-check: ensure-container ## Run TypeScript type check
	@echo "$(COLOR_BLUE)📝 Type checking...$(COLOR_RESET)"
	$(call npm_simple,type-check)
	@echo "$(COLOR_GREEN)✓ Passed$(COLOR_RESET)"

pre-commit: ## Run pre-commit on all files
	@echo "$(COLOR_BLUE)🔒 Running pre-commit...$(COLOR_RESET)"
	pre-commit run --all-files
	@echo "$(COLOR_GREEN)✓ pre-commit passed$(COLOR_RESET)"

ci: ensure-container ## Run all CI checks (type-check + lint + test + build)
	@echo "$(COLOR_BLUE)🔄 Running CI checks...$(COLOR_RESET)"
	@$(MAKE) --no-print-directory type-check
	@$(MAKE) --no-print-directory lint
	@$(MAKE) --no-print-directory test
	@$(MAKE) --no-print-directory build-prod
	@echo "$(COLOR_GREEN)✓ CI passed$(COLOR_RESET)"

deps-outdated: ensure-container ## Check outdated dependencies
	@$(NPM_EXEC) outdated || true

deps-audit: ensure-container ## Security audit
	@$(NPM_EXEC) audit

deps-audit-fix: ensure-container ## Fix vulnerabilities automatically
	@$(NPM_EXEC) audit fix
