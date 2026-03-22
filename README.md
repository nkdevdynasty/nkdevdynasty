# NKDevDynasty

Alumni management platform for **Saraswati Degree Vidya Mandira, Berhampur** — built with Next.js, Prisma, and Authentik SSO.

**Live:** https://svm-alumni.vercel.app

## Project Structure

```
apps/
  web/          Next.js app (React 19, Tailwind v4, Prisma, NextAuth)
  docs/         Fumadocs documentation site (port 3001)
packages/
  ui/           Shared React components
  typescript-config/
  eslint-config/
internal-docs/  Artifacts, deployment docs, architecture plans
```

## Quick Start

### Prerequisites

- Node.js 22+
- pnpm 10+ (`npm install -g pnpm`)
- A PostgreSQL database (Supabase free tier works)
- Access to the shared Authentik instance (ask the team lead)

### Setup (first time)

```bash
# 1. Clone and install
git clone https://github.com/nkdevdynasty/nkdevdynasty.git
cd nkdevdynasty

# 2. Create your env file
cp apps/web/.env.example apps/web/.env
```

Edit `apps/web/.env` and fill in:

| Variable | Where to get it |
|---|---|
| `DATABASE_URL` | Your own Supabase or Postgres instance |
| `AUTH_SECRET` | Run `openssl rand -base64 32` |
| `AUTHENTIK_CLIENT_ID` | Ask team lead |
| `AUTHENTIK_CLIENT_SECRET` | Ask team lead |
| `AUTHENTIK_API_TOKEN` | Ask team lead |

The `AUTHENTIK_URL` and `AUTHENTIK_ISSUER_URL` are pre-filled in the example file.

```bash
# 3. Setup everything (install deps, push schema, seed data)
make setup

# 4. Start developing
make dev
```

The app runs at http://localhost:3000

### Daily development

```bash
make dev
```

That's it. Installs deps, generates Prisma client, starts the dev server.

## Commands

| Command | What it does |
|---|---|
| `make setup` | First time setup: install, push schema, seed 19 alumni |
| `make dev` | Start the dev server |
| `make seed` | Seed alumni data (safe to run multiple times) |
| `make push` | Push Prisma schema changes to database |
| `make generate` | Regenerate Prisma client after schema changes |
| `make nuke` | Reset database completely (destructive!) |

## Tech Stack

- **Framework:** Next.js 16 (App Router, Turbopack)
- **Auth:** NextAuth v5 + Authentik OIDC
- **Database:** Prisma 7 + PostgreSQL
- **UI:** Tailwind CSS v4, Shadcn/ui, Radix UI
- **Monorepo:** Turborepo + pnpm workspaces

## Architecture

- **Authentik** handles authentication (SSO). Users are assigned to groups (`admin`, `alumni`, `student`) which map to roles in the app.
- **Prisma** stores user profiles, alumni data, academic records. Each team member uses their own database.
- **Middleware** protects dashboard routes based on role. Admins see `/dashboard/admin`, alumni see `/dashboard/alumni`, students see `/dashboard/student`.
- **Seed data** contains 19 real alumni profiles from the 2020, 2023, and 2026 batches.

## Deployment

- **Vercel** hosts the web app (auto-deploys on push to main)
- **College server** will run Authentik, Strapi, and PostgreSQL via Docker
- See `internal-docs/deployment/vercel.md` for Vercel-specific details
