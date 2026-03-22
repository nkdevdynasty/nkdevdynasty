.PHONY: help setup dev generate push seed clean nuke

# =============================================================================
# NKDevDynasty — College Alumni & Question Bank Platform
# =============================================================================
# First time:  make setup
# Daily dev:   make dev
# =============================================================================

help:
	@echo ""
	@echo "  make setup       First time: install, push schema, seed data"
	@echo "  make dev         Install deps, generate Prisma, start dev server"
	@echo "  make generate    Regenerate Prisma client"
	@echo "  make push        Push schema to database"
	@echo "  make seed        Seed alumni data (safe to run multiple times)"
	@echo "  make clean       Remove dummy data"
	@echo "  make nuke        Reset database completely"
	@echo ""

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
