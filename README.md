# NKDevDynasty Monorepo

This project is a high-performance monorepo built with **Turborepo**, **pnpm**, and **Next.js**.

## Project Structure

```text
├── apps/
│   ├── web/          # Main Next.js application (Port 3000)
│   └── docs/         # Fumadocs documentation site (Port 3001)
├── packages/
│   ├── ui/           # Shared React components
│   ├── typescript-config/ # Shared TS configurations
│   └── eslint-config/     # Shared ESLint rules
├── turbo.json        # Turborepo configuration
└── pnpm-workspace.yaml # pnpm workspace definition
```

## Unified Single-Port Setup

We have configured the monorepo so that both the main application and the documentation can be accessed through a single port (**3000**) during development.

### How it works:
- **Web App (`apps/web`)**: Runs on `http://localhost:3000`.
- **Docs App (`apps/docs`)**: Runs on `http://localhost:3001` but is configured with `basePath: '/docs'`.
- **Proxying**: The Web App uses Next.js **Rewrites** to proxy any requests starting with `/docs` to the Docs App.

### Key Configuration Points:
- `apps/docs/next.config.mjs`: Sets `basePath: '/docs'`.
- `apps/web/next.config.ts`: Configures `rewrites` to point `/docs/:path*` to `http://localhost:3001/docs/:path*`.
- `apps/docs/lib/source.ts`: Sets `baseUrl: '/'` (Fumadocs handles the prefix automatically via `basePath`).

## Getting Started

### 1. Prerequisites
- **pnpm** (Recommended version: 10.x)
- **Node.js** (>= 22)

### 2. Install Dependencies
```bash
pnpm install
```

### 3. Run Development Mode
Start both applications simultaneously:
```bash
pnpm dev
```

Once running, you can access the entire project at:
- **Main Web Application**: [http://localhost:3000](http://localhost:3000)
- **Documentation**: [http://localhost:3000/docs](http://localhost:3000/docs)

*Note: The Docs app is also directly available at [http://localhost:3001/docs](http://localhost:3001/docs) if needed.*

### 4. Other Commands
- **Build**: `pnpm build` (Builds all apps and packages)
- **Lint**: `pnpm lint` (Checks for linting errors)
- **Typecheck**: `pnpm typecheck` (Checks TypeScript types)
- **Prisma**: `pnpm --filter @repo/web prisma:generate` (Generate Prisma client)

## Development Workflow
- **Adding Docs**: New documentation files should be added to `apps/docs/content/docs/`.
- **Shared Components**: Reusable UI components should be placed in `packages/ui` to be used by both `web` and `docs`.
- **Port Management**: Ports are explicitly set in the `package.json` scripts of each app (`-p 3000` and `-p 3001`) to prevent conflicts.
