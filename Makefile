.PHONY: up down build rebuild logs update prod migrate fresh shell-backend shell-frontend test-backend test-frontend test dev dev-full dev-frontend sync-frontend harness

COMPOSE := docker compose
COMPOSE_PROD := docker compose -f docker-compose.yml -f docker-compose.prod.yml

dev:
	$(COMPOSE) up -d mysql backend
	@$(COMPOSE) exec backend sh -c '\
		USER_COUNT=$$(php artisan tinker --execute="echo \\App\\Models\\User::count();" 2>/dev/null | tail -n 1 | tr -d "\r"); \
		if [ "$${USER_COUNT:-0}" = "0" ]; then \
			echo "[make dev] Database kosong — menjalankan db:seed..."; \
			php artisan db:seed --force --no-interaction; \
		fi'
	@echo ""
	@echo "Backend API: http://localhost:8000/api"
	@echo "Admin login: http://localhost:5173/admin/login"
	@echo "  Email: admin@nurulhikmah.sch.id  |  Password: password"
	@echo "Frontend (host):  cd frontend && npm run dev  →  http://localhost:5173"
	@echo "Frontend (Docker): make dev-full  →  http://localhost:8080 (nginx) / :5173 (Vite)"
	@echo ""

dev-full:
	$(COMPOSE) --profile full up -d --build
	@$(COMPOSE) exec backend sh -c '\
		USER_COUNT=$$(php artisan tinker --execute="echo \\App\\Models\\User::count();" 2>/dev/null | tail -n 1 | tr -d "\r"); \
		if [ "$${USER_COUNT:-0}" = "0" ]; then \
			echo "[make dev-full] Database kosong — menjalankan db:seed..."; \
			php artisan db:seed --force --no-interaction; \
		fi'
	@echo ""
	@echo "Full stack: http://localhost:8080"
	@echo "Vite HMR:   http://localhost:5173"
	@echo "Backend:    http://localhost:8000/api"
	@echo "Admin login: http://localhost:5173/admin/login"
	@echo "  Email: admin@nurulhikmah.sch.id  |  Password: password"
	@echo ""

# Refresh frontend node_modules volume after package.json / package-lock.json changes (Docker full profile)
sync-frontend:
	$(COMPOSE) --profile full run --rm --no-deps --entrypoint "" frontend sh -c "npm ci && sha256sum package.json package-lock.json | sha256sum | awk '{print \$$1}' > node_modules/.deps_sha256"
	@echo "Frontend Docker volume synced. Restart: docker compose --profile full restart frontend"

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
	@$(COMPOSE) exec backend sh -c '\
		USER_COUNT=$$(php artisan tinker --execute="echo \\App\\Models\\User::count();" 2>/dev/null | tail -n 1 | tr -d "\r"); \
		if [ "$${USER_COUNT:-0}" = "0" ]; then \
			echo "Database kosong — menjalankan db:seed..."; \
			php artisan db:seed --force --no-interaction; \
		fi'

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

# Verify project harness (docs, rules, optional --test via script)
harness:
	@./scripts/harness.sh

harness-test:
	@./scripts/harness.sh --test

workers:
	$(COMPOSE) --profile workers up -d queue_worker scheduler

# Build static frontend to ./frontend/dist then start prod stack (no Vite)
prod-build:
	$(COMPOSE) run --rm --no-deps --entrypoint "" frontend sh -c "npm ci && npm run build"

prod: prod-build
	$(COMPOSE) -f docker-compose.yml -f docker-compose.prod.yml up -d --build nginx backend mysql

%:
	@:
