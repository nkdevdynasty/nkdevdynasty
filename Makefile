.PHONY: help setup-core setup-full up down build logs shell migrate push generate seed clean nuke force-reset restart

# --- Icons ---
E_HELP=📋
E_START=🚀
E_WAIT=⏳
E_CHECK=✅
E_STOP=🛑
E_CLEAN=🧹
E_DB=⚙️
E_UP=🆙
E_BUILD=🏗️
E_LOGS=📜
E_WEB=🌐
E_DOCS=📚
E_WARN=⚠️

help:
	@echo "$(E_HELP) Available commands:"
	@echo "  $(E_START) make setup-core - START PROJECT: Just services + schema (NO dummy data)"
	@echo "  $(E_START) make setup-full - FULL START: Services + schema + 25 dummy users"
	@echo "  $(E_UP) make up         - Start all services in the background"
	@echo "  $(E_STOP) make down       - CLEAN & STOP: Remove dummy data and stop services"
	@echo "  $(E_BUILD) make build      - Rebuild and start all services"
	@echo "  $(E_LOGS) make logs       - View real-time logs"
	@echo "  $(E_DB) make migrate    - Run Prisma migrations"
	@echo "  ⬆️  make push       - PUSH schema changes to database"
	@echo "  $(E_DB) make generate   - Generate Prisma client"
	@echo "  🌱 make seed       - Populate database with dummy data"
	@echo "  $(E_CLEAN) make clean      - REMOVE only dummy data (keeps real admin)"
	@echo "  $(E_WARN) make force-reset - FORCE clear all stuck containers"
	@echo "  ☢️  make nuke       - RESET the entire database (wipe all data)"
	@echo "  🔄 make restart    - Restart all services"

setup-core:
	@echo "$(E_START) Starting core project (No dummy data)..."
	docker-compose up -d
	@echo "$(E_WAIT) Waiting for services to initialize (10s)..."
	sleep 10
	@echo "$(E_DB) Generating Prisma Client..."
	docker-compose exec web pnpm --filter @repo/web run prisma:generate
	@echo "⬆️ Pushing database schema..."
	docker-compose exec web pnpm --filter @repo/web run prisma:push
	@echo "$(E_CHECK) Setup complete! (Database is clean)"
	@echo "$(E_WEB) Web App: http://localhost:3000"
	@echo "$(E_DOCS) Docs:    http://localhost:3000/docs"

setup-full:
	@echo "$(E_START) Starting full project with dummy data..."
	docker-compose up -d
	@echo "$(E_WAIT) Waiting for services to initialize (10s)..."
	sleep 10
	@echo "$(E_DB) Generating Prisma Client..."
	docker-compose exec web pnpm --filter @repo/web run prisma:generate
	@echo "⬆️ Pushing database schema..."
	docker-compose exec web pnpm --filter @repo/web run prisma:push
	@echo "🌱 Seeding 25+ dummy users..."
	docker-compose exec web pnpm --filter @repo/web run prisma:seed
	@echo "$(E_CHECK) Setup complete! (Database seeded)"
	@echo "$(E_WEB) Web App: http://localhost:3000"
	@echo "$(E_DOCS) Docs:    http://localhost:3000/docs"

up:
	@echo "$(E_UP) Starting services..."
	docker-compose up -d
	@echo "$(E_WEB) Web App: http://localhost:3000"
	@echo "$(E_DOCS) Docs:    http://localhost:3000/docs"

down:
	@echo "$(E_CLEAN) Ensuring web service is up for cleanup..."
	docker-compose up -d web
	@echo "$(E_DB) Syncing Prisma Client..."
	-docker-compose exec web pnpm --filter @repo/web run prisma:generate
	@echo "$(E_CLEAN) Cleaning dummy data..."
	-docker-compose exec web pnpm --filter @repo/web run prisma:cleanup
	@echo "$(E_STOP) Stopping all services..."
	docker-compose down
	@echo "$(E_CHECK) System offline."

force-reset:
	@echo "$(E_WARN) Forcefully clearing all containers..."
	docker-compose down --remove-orphans
	docker-compose rm -f
	@echo "$(E_CHECK) Environment cleared."

build:
	@echo "$(E_BUILD) Rebuilding services..."
	docker-compose up -d --build
	@echo "$(E_CHECK) Build finished."

logs:
	@echo "$(E_LOGS) Streaming logs..."
	docker-compose logs -f

shell:
	@echo "🐚 Entering web container..."
	docker-compose exec web sh

migrate:
	@echo "$(E_DB) Running migrations..."
	docker-compose exec web pnpm --filter @repo/web run migrate

push:
	@echo "⬆️ Pushing schema..."
	docker-compose exec web pnpm --filter @repo/web run prisma:push

generate:
	@echo "$(E_DB) Generating client..."
	docker-compose exec web pnpm --filter @repo/web run prisma:generate

seed:
	@echo "🌱 Seeding database..."
	docker-compose exec web pnpm --filter @repo/web run prisma:generate
	docker-compose exec web pnpm --filter @repo/web run prisma:seed
	@echo "$(E_CHECK) Seeding finished."

clean:
	@echo "$(E_CLEAN) Ensuring web service is up..."
	docker-compose up -d web
	@echo "$(E_DB) Syncing Prisma Client..."
	docker-compose exec web pnpm --filter @repo/web run prisma:generate
	@echo "$(E_CLEAN) Removing dummy data..."
	docker-compose exec web pnpm --filter @repo/web run prisma:cleanup
	@echo "$(E_CHECK) Cleanup finished."

nuke:
	@echo "☢️ Resetting database..."
	docker-compose exec web pnpm --filter @repo/web run prisma migrate reset --force
	@echo "$(E_CHECK) Database wiped."

restart:
	@echo "🔄 Restarting project..."
	docker-compose restart
	@echo "$(E_CHECK) Restarted."
