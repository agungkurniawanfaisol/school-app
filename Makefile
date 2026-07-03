.PHONY: up down build rebuild logs update prod migrate fresh shell-backend shell-frontend test-backend test-frontend test dev dev-frontend

COMPOSE := docker compose
COMPOSE_PROD := docker compose -f docker-compose.yml -f docker-compose.prod.yml

dev:
	$(COMPOSE) up -d mysql backend
	@echo ""
	@echo "Backend API: http://localhost:8000/api"
	@echo "Frontend:    cd frontend && npm run dev  →  http://localhost:5173"
	@echo ""

dev-frontend:
	cd frontend && npm run dev

up: dev

down:
	$(COMPOSE) down

build:
	$(COMPOSE) build

rebuild:
	$(COMPOSE) up -d --build

logs:
	$(COMPOSE) logs -f

logs-backend:
	$(COMPOSE) logs -f backend

logs-frontend:
	$(COMPOSE) logs -f frontend

# Rebuild images + refresh composer/npm when lockfiles changed
update:
	$(COMPOSE) build --no-cache backend frontend
	$(COMPOSE) up -d
	@echo "Dependencies refresh on container start via entrypoints."

migrate:
	$(COMPOSE) exec backend php artisan migrate

fresh:
	$(COMPOSE) exec backend php artisan migrate:fresh --seed

seed:
	$(COMPOSE) exec backend php artisan db:seed

shell-backend:
	$(COMPOSE) exec backend sh

shell-frontend:
	$(COMPOSE) exec frontend sh

artisan:
	$(COMPOSE) exec backend php artisan $(filter-out $@,$(MAKECMDGOALS))

npm:
	$(COMPOSE) exec frontend npm $(filter-out $@,$(MAKECMDGOALS))

test-backend:
	$(COMPOSE) exec backend php artisan test

test-frontend:
	$(COMPOSE) exec frontend npm test

test: test-backend test-frontend

workers:
	$(COMPOSE) --profile workers up -d queue_worker scheduler

# Build static frontend to ./frontend/dist then start prod stack (no Vite)
prod-build:
	$(COMPOSE) run --rm --no-deps --entrypoint "" frontend sh -c "npm ci && npm run build"

prod: prod-build
	$(COMPOSE) -f docker-compose.yml -f docker-compose.prod.yml up -d --build nginx backend mysql

%:
	@:
