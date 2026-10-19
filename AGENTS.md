# AGENTS.md

## Project

This is the fake IDEIS schedule lab for testing the calendar sync safely.

Work here:

```bash
/home/ubuntu/ideis-schedule-lab
```

Do not edit the production sync project from this folder.

## What It Does

- Public IDEIS-like pages: `/Plany/PlanyTokow/1406`, `/Plany/PlanyTokow/1203`, and dynamic `/[tok]`
- Grid endpoints for the sync parser: `/Plany/PlanyTokowGrid` and `/Plany/PlanyTokowGrid/[tok]`
- Admin page: `/admin`, protected by `ADMIN_PASSWORD`.
- Test schedule comes from the original IDEIS DOM table for the Semester 3 range `2026-09-15` to `2027-02-15` (128 classes, groups WykS, CwS, Lekt/ANGS).
- Current seed data has 128 rows.
- Storage: Neon Postgres through `DATABASE_URL`; if `DATABASE_URL` is missing, local dev falls back to `.data/schedule.json`.
- Admin auth: set `ADMIN_PASSWORD`; set `ADMIN_SESSION_SECRET` to a random long value when deploying.

## Key Directories

- `src/app`: Next.js App Router routes (`/Plany/PlanyTokow`, `/Plany/PlanyTokowGrid`, `/admin`, `/api/*`)
- `src/lib`: Data access layer (`db.ts` for Neon Postgres / `.data/schedule.json` fallback, `types.ts`, `auth.ts`)
- `src/components`: Schedule rendering components (timetable views, filters, admin controls)

## Commands

```bash
npm run dev     # Start Next.js development server
npm run build   # Run production Next.js Turbopack build
npm run lint    # Run ESLint checks
```

## Agent Development Guidelines & Safety

- Do not commit `.env` or `.env.local`.
- Do not put Neon connection strings in chat or README.
- Do not put `ADMIN_PASSWORD` or `ADMIN_SESSION_SECRET` in chat or README.
- This project is for test data only, not the real IDEIS source.
- Do not invent teacher names. The source of truth is the original IDEIS DOM table, including the `Prowadzący` column.
- Do not use IDEIS `Save as csv` as the source of truth. It can omit data and does not reliably include lecturer names.
