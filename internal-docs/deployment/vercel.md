# Vercel Deployment Notes

## Project Details

- **Project name:** svm-alumni
- **Project ID:** prj_tUmCdhzmYVk2DHZdrosQAtEl723e
- **Team:** bsccohorts-projects (team_ytAojRB6XQ6KxV5T2X6Rycj3)
- **Production URL:** https://svm-alumni.vercel.app
- **GitHub repo:** nkdevdynasty/nkdevdynasty (auto-deploys on push to main)
- **Root directory:** apps/web
- **Framework:** Next.js

## Vercel Project Settings

Set via API (not in vercel.json):

- **Install command:** `cd ../.. && pnpm install --no-frozen-lockfile`
- **Build command:** `cd ../.. && pnpm --filter @repo/web run prisma:generate && pnpm turbo build --filter=@repo/web`
- **Root directory:** `apps/web`

## Environment Variables (set in Vercel dashboard)

| Variable | Description |
|---|---|
| DATABASE_URL | PostgreSQL connection string (Coolify, 89.167.10.11) |
| AUTH_SECRET | NextAuth JWT secret (openssl rand -base64 32) |
| NEXTAUTH_URL | https://svm-alumni.vercel.app |
| AUTH_URL | https://svm-alumni.vercel.app |
| AUTH_TRUST_HOST | true |
| AUTHENTIK_URL | Authentik base URL |
| AUTHENTIK_ISSUER_URL | OIDC issuer URL |
| AUTHENTIK_CLIENT_ID | OAuth2 client ID (40 chars) |
| AUTHENTIK_CLIENT_SECRET | OAuth2 client secret |
| AUTHENTIK_API_TOKEN | Server-side API token |

## Deploy from Terminal

Push to main auto-deploys. For manual deploy via API:

```bash
VT="<vercel token from deployment/.env>"

curl -X POST "https://api.vercel.com/v13/deployments" \
  -H "Authorization: Bearer $VT" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "svm-alumni",
    "project": "prj_tUmCdhzmYVk2DHZdrosQAtEl723e",
    "target": "production",
    "gitSource": {
      "type": "github",
      "org": "nkdevdynasty",
      "repo": "nkdevdynasty",
      "ref": "main"
    }
  }'
```

Note: CLI deploy (`vercel deploy`) fails on Hobby plan due to git-author restriction. Use the API instead.

## Other Useful Commands

```bash
# Check deploy status
curl -s "https://api.vercel.com/v13/deployments/<DEPLOY_ID>" -H "Authorization: Bearer $VT"

# List env vars
vercel env ls --token "$VT"

# Add env var
printf '%s' 'value' | vercel env add KEY production --token "$VT"

# Remove env var
vercel env rm KEY production --yes --token "$VT"
```

## Code Changes Made for Vercel

### Vercel-specific (not needed on self-hosted)

1. **Middleware cookie fix** (`apps/web/middleware.ts`): `getToken()` needs explicit `cookieName: "__Secure-authjs.session-token"` on Vercel because Edge Runtime handles `__Secure-` prefix cookies differently. Falls back to `authjs.session-token` for local dev.

2. **turbo.json env vars**: Added `DATABASE_URL`, `AUTH_SECRET`, `AUTHENTIK_*` to the build task `env` array so Turbo includes them in cache keys on Vercel.

3. **pnpm.onlyBuiltDependencies** (root `package.json`): Whitelists `prisma`, `sharp`, `esbuild`, `@prisma/engines`, `unrs-resolver` for build scripts — pnpm 10 strict mode blocks them otherwise on Vercel.

4. **`.npmrc`**: `side-effects-cache=false`

5. **Debug endpoint** (`apps/web/app/api/debug/route.ts`): Shows env var status and OIDC connectivity. Can be removed later.

### Generic fixes (needed on any platform behind a proxy)

1. **`trustHost: true`** in `apps/web/auth.ts`: Required when running behind any reverse proxy (nginx, Cloudflare, Vercel).

2. **`Suspense` wrapper** in `apps/web/app/(auth)/signin/page.tsx`: `useSearchParams()` requires Suspense boundary in Next.js production builds.

3. **Auth error page** (`apps/web/app/auth/error/page.tsx`): Was missing, errors were silently redirecting to signin.

4. **Removed `prompt: "login"`** from signIn call: Was forcing re-authentication every time, interfering with the PKCE flow.

### Authentik changes for Vercel

1. Switched authorization flow from **explicit consent** to **implicit consent** (skips consent screen, prevents PKCE cookie expiry during extra redirects).

2. Added redirect URIs:
   - `https://svm-alumni.vercel.app/api/auth/callback/authentik`
   - `https://svm-alumni.vercel.app/signin`
