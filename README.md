# NKDevDynasty Monorepo

A high-performance, containerized monorepo built with **Turborepo**, **pnpm**, **Next.js 16**, and **Prisma**. This project integrates **Authentik** for identity management and **Fumadocs** for documentation.

---

## 🏗️ Project Structure

```text
├── apps/
│   ├── web/          # Main Next.js application (React 19, Tailwind v4)
│   └── docs/         # Fumadocs documentation site (Port 3001)
├── packages/
│   ├── ui/           # Shared React component library
│   ├── typescript-config/ # Shared TS configurations
│   └── eslint-config/     # Shared ESLint rules
├── turbo.json        # Turborepo build pipeline configuration
└── pnpm-workspace.yaml # pnpm workspace definition
```

---

## 🌐 Unified Access

The project is configured to run behind a single port for a seamless developer experience.

- **Web Application**: [http://localhost:3000](http://localhost:3000)
- **Documentation**: [http://localhost:3000/docs](http://localhost:3000/docs) (Proxied via Next.js rewrites)

---

## 🚀 Getting Started (Docker Environment)

We use **Docker** and a **Makefile** to ensure every developer has an identical, stable environment.

### 1. Prerequisites
- **Docker Desktop** (or Docker Engine with Compose)
- **Terminal**: [Windows Terminal](https://aka.ms/terminal) is highly recommended for proper emoji and color rendering.

### 2. Environment Configuration
Create an `.env` file in `apps/web/.env` with the following keys:
```env
# Database
DATABASE_URL="postgresql://..." # Supabase Pooler or Local DB
DIRECT_URL="postgresql://..."   # REQUIRED for migrations/push (Direct port 5432)

# NextAuth
NEXTAUTH_SECRET="your-secret"
NEXTAUTH_URL="http://localhost:3000"

# Authentik
AUTHENTIK_URL="https://..."
AUTHENTIK_API_TOKEN="..."
AUTHENTIK_ISSUER_URL="..."
AUTHENTIK_CLIENT_ID="..."
AUTHENTIK_CLIENT_SECRET="..."
```

### 3. Quick Start Commands

| Command | Description |
| :--- | :--- |
| `make setup-core` | **Start Fresh**: Services + Schema syncing. No dummy data. |
| `make setup-full` | **Full Experience**: Services + Schema + 25+ rich dummy users. |
| `make up` | Resume services in the background. |
| `make down` | **Safe Stop**: Automatically cleans dummy data and stops containers. |
| `make force-reset` | **Fix Issues**: Forcefully removes stuck containers/orphans. |

---

## 🛠️ Developer Workflow

### 🧹 Dummy Data Management
The project features a smart data lifecycle to keep your database clean.
- **Seeding**: `make setup-full` or `make seed` adds 25+ users (12 Students, 13 Alumni) with rich profiles (Major, Year, Company, Bio, Skills).
- **Cleanup**: `make down` or `make clean` removes **only** the generated dummy data.
- **Safety**: Your real Admin account (e.g., `sujit@binarysquad.org`) is protected and **never** deleted by cleanup scripts.

### ⚙️ Full Command List
| Command | Description |
| :--- | :--- |
| `make build` | Rebuild all Docker images from scratch. |
| `make logs` | View real-time output from all services. |
| `make push` | Force-push schema changes to the database (bypasses migration history). |
| `make migrate` | Run Prisma development migrations. |
| `make generate` | Regenerate the Prisma Client (run this if you see type errors). |
| `make nuke` | **Warning**: Wipes the entire database and restarts from scratch. |

---

## 🛡️ Architecture Highlights

### **Identity & RBAC**
- **NextAuth v5**: Handles session management and OIDC flow.
- **Authentik Integration**: Centralized auth. Roles (`ADMIN`, `STUDENT`, `ALUMNI`) are mapped from Authentik groups to the local Prisma database.
- **Custom Hook**: Use the `useRBAC()` hook for client-side permission checks.

### **Database (Prisma)**
- **Supabase Support**: Configured to work with Supabase Transaction Poolers while using `DIRECT_URL` for schema structural changes.
- **Standalone Client**: Prisma is marked as an external package in `next.config.ts` to ensure compatibility with **Turbopack**.

### **Documentation**
- Built with **Fumadocs** for a highly customizable, MDX-based documentation experience. Accessible at the `/docs` path of the main application.

---

## 🧪 Local Development (No Docker)

1.  **Install Dependencies**: `pnpm install`
2.  **Generate Client**: `pnpm --filter @repo/web prisma:generate`
3.  **Run Dev**: `pnpm dev`
4.  **Local Access**: Web at `:3000`, Docs at `:3001` (basePath: `/docs`).
