# Deployment

This folder contains all deployment-related files for the NKDevDynasty platform.

## Contents

```
deployment/
├── README.md              # This file
├── vercel.md              # Vercel deployment notes and CLI commands
├── .env                   # Deployment tokens (gitignored, local only)
├── docker-compose.yml     # Production Docker stack (Postgres, Redis, Authentik, Strapi)
├── Dockerfile             # Multi-stage production build for the web app
├── .dockerignore          # Files excluded from Docker build context
└── init-databases.sql     # Creates databases on first Postgres startup
```

## Vercel (Web App)

The web app is deployed to Vercel at https://svm-alumni.vercel.app

- Auto-deploys on push to `main`
- See `vercel.md` for CLI commands, env vars, and troubleshooting

## College Server (Docker Stack)

For self-hosting the full stack on college infrastructure.

### Usage

From the **repo root**:

```bash
# Start the production stack
docker compose -f internal-docs/deployment/docker-compose.yml --env-file internal-docs/deployment/.env up -d

# Stop
docker compose -f internal-docs/deployment/docker-compose.yml down

# View logs
docker compose -f internal-docs/deployment/docker-compose.yml logs -f
```

### Services

| Service | Port | Description |
|---|---|---|
| PostgreSQL | 5432 (internal) | Shared database for all services |
| Redis | 6379 (internal) | Authentik cache and task queues |
| Authentik | 9000 | SSO / Identity Provider |
| Strapi | 1337 | Headless CMS (Question Bank) |
| Web App | 3000 | Next.js app (commented out — using Vercel for now) |

### Required .env

Create `internal-docs/deployment/.env` with:

```env
PG_USER=postgres
PG_PASSWORD=<strong password>
AUTHENTIK_SECRET_KEY=<openssl rand -base64 60>
```

### Building the Web App Docker Image

If deploying the web app via Docker instead of Vercel:

```bash
# From repo root
docker build -f internal-docs/deployment/Dockerfile -t nkdevdynasty-web .
```
