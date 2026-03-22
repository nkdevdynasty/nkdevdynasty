.PHONY: help setup dev generate push seed clean nuke up down logs ps

# =============================================================================
# NKDevDynasty — College Alumni & Question Bank Platform
# =============================================================================
# Dev:  make dev       (uses shared remote Postgres/Authentik/Strapi)
# Prod: make up        (full self-hosted stack via Docker)
# =============================================================================

help:
	@echo ""
	@echo "  Development (native — uses shared team infra)"
	@echo "  ─────────────────────────────────────────────"
	@echo "  make setup       First time: install, push schema, seed data"
	@echo "  make dev         Install deps, generate Prisma, start dev server"
	@echo "  make generate    Regenerate Prisma client"
	@echo "  make push        Push schema to database"
	@echo "  make seed        Seed alumni data (safe to run multiple times)"
	@echo "  make clean       Remove dummy data"
	@echo "  make nuke        Reset database completely"
	@echo ""
	@echo "  Production (self-hosted Docker stack)"
	@echo "  ─────────────────────────────────────────────"
	@echo "  make up          Start full stack (Postgres, Authentik, Strapi)"
	@echo "  make down        Stop all services"
	@echo "  make logs        Stream all logs"
	@echo "  make ps          Show running services"
	@echo ""

# --- Development (native) ----------------------------------------------------

setup:
	@echo "Installing dependencies..."
	pnpm install
	@echo "Generating Prisma client..."
	pnpm --filter @repo/web run prisma:generate
	@echo "Pushing schema to database..."
	pnpm --filter @repo/web run prisma:push
	@echo "Seeding alumni data..."
	pnpm --filter @repo/web run prisma:seed
	@echo ""
	@echo "Setup complete! Run 'make dev' to start."

dev:
	@echo "Installing dependencies..."
	pnpm install --silent
	pnpm --filter @repo/web run prisma:generate
	@echo "Starting dev server..."
	pnpm dev

generate:
	pnpm --filter @repo/web run prisma:generate

push:
	pnpm --filter @repo/web run prisma:push

seed:
	pnpm --filter @repo/web run prisma:generate
	pnpm --filter @repo/web run prisma:seed

clean:
	pnpm --filter @repo/web run prisma:generate
	pnpm --filter @repo/web run prisma:cleanup

nuke:
	pnpm --filter @repo/web run prisma migrate reset --force

# --- Production (Docker) -----------------------------------------------------

up:
	@echo "Starting production stack..."
	docker compose up -d
	@echo ""
	@echo "Services:"
	@echo "  Authentik:  http://localhost:$${AUTHENTIK_PORT_HTTP:-9000}"
	@echo "  Strapi:     http://localhost:$${STRAPI_PORT:-1337}"
	@echo "  PostgreSQL: localhost:5432 (internal only)"

down:
	docker compose down

logs:
	docker compose logs -f

ps:
	docker compose ps
