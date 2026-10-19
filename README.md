# IDEIS Schedule Lab

Staging simulation laboratory and mock timetable platform mirroring the Uniwersytet DSW IDEIS academic schedule portal. Used by testing scrapers and bots (`ideis-calendar-sync-test`) to validate schedule parsing, diff generation, and event lifecycle updates safely.

- **Production Deployment (Vercel)**: `https://schedule-test-dsw.vercel.app/Plany/PlanyTokow/1406`
- **Admin Management Panel**: `https://schedule-test-dsw.vercel.app/admin`
- **Vercel Project**: `schedule-test` (linked to `/home/ubuntu/ideis-schedule-lab`)

## Architecture & Components

The application is built on Next.js 16 (React 19, TypeScript) and emulates the exact DOM hierarchy, query routing, and table styling of the legacy IDEIS schedule portal:

- **Timetable Views (`src/app/Plany/PlanyTokow/`)**:
  - `/Plany/PlanyTokow/1406`: Public schedule page replicating Tok 1406 (Zarządzanie z AI, Semester 3).
  - `/Plany/PlanyTokow/1203`: Backwards-compatible route for legacy Tok 1203.
  - `/Plany/PlanyTokow/[tok]`: Dynamic route generator supporting arbitrary tok identifiers.
- **Scraper Grid Endpoints (`src/app/Plany/PlanyTokowGrid/`)**:
  - `/Plany/PlanyTokowGrid` & `/Plany/PlanyTokowGrid/[tok]`: HTML grid endpoints used by automated scrapers after triggering searches with `dateFrom` and `dateTo`.
- **Admin Mutation Suite (`src/app/admin/`)**:
  - Password-protected web interface to edit class titles, dates, times, rooms, instructors, and distance learning flags for test verification.
- **Data Persistence Layer (`src/lib/db.ts`)**:
  - **Neon PostgreSQL**: When `DATABASE_URL` is set, reads and writes against the cloud Neon PostgreSQL database (`long-hat-41387042`).
  - **Local JSON Fallback**: When `DATABASE_URL` is absent, reads and writes locally to `.data/schedule.json`, automatically initialized from `data/seed.csv`.

## Prerequisites

- **Node.js**: v18.x, v20.x, or v22.x LTS (current environment: Node.js v22.x)
- **Database**: Optional Neon PostgreSQL connection string (falls back to local filesystem JSON)
- **Vercel CLI**: For deployment and secret synchronization

## Configuration & Environment Variables

Configured in `.env.local` for local development or in Vercel project environment settings:

| Variable | Description |
|---|---|
| `DATABASE_URL` | Neon PostgreSQL pooled connection string |
| `ADMIN_PASSWORD` | Strong password protecting the `/admin` editor |
| `ADMIN_SESSION_SECRET` | Secret token used to sign administrative session cookies |

*Note: Never commit `.env.local` to git or expose secrets in public channels.*

## Commands to Run & Test

```bash
# Install dependencies
npm install

# Run local development server (http://localhost:3000)
npm run dev

# Static analysis and ESLint verification
npm run lint

# Production Next.js Turbopack build
npm run build

# Deploy to Vercel production
vercel --prod
```

## Deployment & Operational Notes

- **Vercel Deployment**: Automatically linked via `.vercel/project.json` to Vercel project `schedule-test`.
- **Seed Data Accuracy**: Seed data in `data/seed.csv` contains 128 verified classes covering Semester 3 (`2026-09-15` through `2027-02-15`) with authentic groups (`WykS`, `CwS`, `Lekt/ANGS`), room numbers, and lecturers.
- **Integrity Constraint**: Do not fabricate instructor or room names. The source of truth is the real IDEIS DOM table. Do not use the IDEIS CSV export as source of truth, as it omits the instructor column.
