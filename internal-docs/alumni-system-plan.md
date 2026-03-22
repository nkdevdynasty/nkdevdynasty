# Alumni System Architecture Plan

## Context

**College:** Saraswati Degree Vidya Mandira, Berhampur (under Berhampur University, NAAC 'A')
**Program:** BSc Computer Science Honours — 3-year / 6-semester degree
**Goal:** Give every alumni batch their own profiles, browsable directory, admin overview dashboard, and bulk onboarding tools.

## Key Decisions

- **CGPA only** — store final CGPA + grade, not per-semester or per-paper marks
- **No new Prisma models** — batches = alumni grouped by `year` field, not a separate entity
- **No new Authentik groups** — single `alumni` group, batch year is profile data
- **Single program** — BSc CS Honours hardcoded for now
- **Seed from Excel** — import the ~22 students from the 2023-2026 project tracker
- **Full profile links** — LinkedIn, GitHub, Portfolio, Resume, project name/link, placement info

## Schema Additions (to existing User model)

```prisma
  // Contact & Social
  phone          String?
  linkedinUrl    String?
  githubUrl      String?
  portfolioUrl   String?
  resumeUrl      String?

  // Academic
  cgpa           Float?
  grade          String?    // "O", "A+", "A", etc.

  // Final Year Project
  projectName    String?
  projectUrl     String?

  // Placement
  placementInfo  String?    // free text
```

## New Pages

| Route | Purpose |
|---|---|
| `/dashboard/alumni/profile/edit` | Alumni edits own profile |
| `/alumni` | Public alumni directory (card grid, search, batch filter) |
| `/alumni/[id]` | Full alumni profile page |
| `/dashboard/alumni/directory` | Alumni-facing directory |
| `/dashboard/admin/alumni` | Admin alumni dashboard (batch stats) |
| `/dashboard/admin/alumni/batch/[year]` | View batch members |
| `/dashboard/admin/alumni/onboard` | Bulk create alumni (CSV or manual) |

## New API Endpoints

| Method | Route | Purpose |
|---|---|---|
| PATCH | `/api/alumni/profile` | Alumni self-service profile update |
| GET | `/api/alumni/directory` | Paginated, filtered alumni listing |
| GET | `/api/admin/alumni/stats` | Alumni statistics & batch breakdown |
| POST | `/api/admin/alumni/bulk-create` | Bulk create alumni accounts |

## Build Order

1. **Phase 1:** Schema migration → Profile edit API + page → Fix alumni dashboard stats
2. **Phase 2:** Directory API → Alumni directory + profile pages → Middleware + sidebar updates
3. **Phase 3:** Admin alumni stats API → Admin alumni dashboard + batch view pages
4. **Phase 4:** Bulk create API → Onboarding page (CSV + manual) → Excel seed script

## Authentik Integration

- All alumni belong to single `alumni` Authentik group (already exists)
- Batch year stored in Prisma `year` field — purely profile data
- Bulk create: for each user → create in Authentik → add to alumni group → create Prisma record
- Pattern: reuse existing `POST /api/admin/users` logic

## Data Source

The `artifacts/2023-2026 NK NAGAR C.S Final Year Project Status.xlsx` contains ~22 students with:
- Names, project names, deployed links
- GitHub profiles, LinkedIn, Portfolio URLs
- Placement info (TCS, Anthem, etc.)

This will be imported via a seed script (`prisma/seed-alumni.ts`).
