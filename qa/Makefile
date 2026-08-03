SEED ?= 1000
URL  := http://localhost:4173/index.html?seed=$(SEED)

.DEFAULT_GOAL := help
.PHONY: help start stop restart logs test test.open shell clean

help: ## Show this help
	@echo ""
	@echo "AceUp QA homework — Docker is the only prerequisite."
	@echo ""
	@grep -E '^[a-z.]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-12s\033[0m %s\n", $$1, $$2}'
	@echo ""
	@echo "Your seed: $(SEED)   (override with: make start SEED=1234)"
	@echo ""

start: ## Start the app at http://localhost:4173
	@docker compose up -d app
	@echo ""
	@echo "App is running:  $(URL)"
	@echo "Stop it with:    make stop"
	@echo ""

stop: ## Stop the app
	@docker compose down

restart: stop start ## Restart the app

logs: ## Tail the web server logs
	@docker compose logs -f app

test: ## Run the Cypress suite headlessly in Docker
	@SEED=$(SEED) docker compose run --rm cypress $(ARGS)

test.open: ## Run Cypress interactively (needs Node 20+ locally, one-time npm install)
	@echo "Docker cannot open a GUI, so this one runs natively."
	@cd homework/starter && npm install && SEED=$(SEED) npx cypress open

shell: ## Open a shell in the Cypress container
	@docker compose run --rm --entrypoint sh cypress

clean: ## Stop everything and remove Cypress artefacts
	@docker compose down -v --remove-orphans
	@rm -rf homework/starter/cypress/screenshots homework/starter/cypress/videos
