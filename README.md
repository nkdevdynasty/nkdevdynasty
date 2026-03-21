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

## 🚀 Getting Started (Optimized Environment)

We recommend the **Optimized Local Mode** for daily development to save system memory.

### 1. Prerequisites

- **Node.js 22+** and **pnpm 10+**
- **Docker Desktop** (Required for database if not using remote Supabase)

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

### 3. Core Commands

| Command           | Description                                                          |
| :---------------- | :------------------------------------------------------------------- |
| `make dev`        | **Recommended**: Start project locally (Low Memory, High Speed).     |
| `make setup-core` | **Docker Fresh**: Services + Schema syncing (No dummy data).         |
| `make setup-full` | **Docker Full**: Services + Schema + 25+ rich dummy users.           |
| `make down`       | **Safe Stop**: Automatically cleans dummy data and stops containers. |

---

## 🛠️ Recent Updates (March 21, 2026)

### 💎 Full CRUD with RBAC

- **User Management**: Admins can now **Add, Edit, and Delete** users directly from the dashboard.
- **Bi-directional Sync**: Changes made in the dashboard are automatically synchronized between the **Prisma Database** and the **Authentik OIDC Server**.
- **Security**: Robust RBAC enforcement ensures only users with the `ADMIN` role can access management APIs.

### 🎨 UI/UX Modernization (Shadcn UI)

- **Component Migration**: All dashboard pages (Admin, Student, Alumni) have been refactored to use **Shadcn UI** components.
- **Enhanced Visuals**: Integrated `Table`, `Dialog`, `DropdownMenu`, `Select`, `Card`, and `Progress` components for a professional look.
- **Responsive Design**: Modals and layouts are now fully optimized for all screen sizes, including small laptop screens.
- **Global Notifications**: Integrated `react-hot-toast` for real-time feedback on all actions (loading, success, and error states).

### ⚙️ Performance & Stability

- **Optimized Workflow**: Added `make dev` to bypass Docker virtualization for Node.js, saving **~2GB of RAM** on Windows.
- **Turbopack Fixes**: Resolved module resolution issues with `@hookform/resolvers` and `zod` specifically for Next.js Turbopack.
- **Authentik API Robustness**: Improved group matching logic (case-insensitive) and added fallback mechanisms for restricted tokens.

---

## 🛡️ Architecture Highlights

### **Identity & RBAC**

- **NextAuth v5**: Handles session management and OIDC flow.
- **Authentik Integration**: Centralized auth. Roles (`ADMIN`, `STUDENT`, `ALUMNI`) are mapped from Authentik groups to the local Prisma database.
- **Custom Hook**: Use the `useRBAC()` hook for client-side permission checks.

### **Database (Prisma)**

- **Supabase Support**: Configured to work with Supabase Transaction Poolers while using `DIRECT_URL` for schema structural changes.
- **Standalone Client**: Prisma is marked as an external package in `next.config.ts` to ensure compatibility with **Turbopack**.

---

## 🧹 Dummy Data Management

- **Seeding**: `make setup-full` or `make seed` adds 25+ users with rich profiles.
- **Cleanup**: `make down` or `make clean` removes **only** generated dummy data.
- **Safety**: Real Admin accounts are protected from deletion scripts.
