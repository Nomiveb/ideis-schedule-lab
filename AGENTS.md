# AGENTS.md

## Project

This is the fake IDEIS schedule lab for testing the calendar sync safely.

Work here:

```powershell
E:\Coding\AWS-SERVER\testing_calendar\ideis-schedule-lab
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

## Commands

```powershell
npm run dev
npm run build
```

## Safety

- Do not commit `.env`.
- Do not put Neon connection strings in chat or README.
- Do not put `ADMIN_PASSWORD` or `ADMIN_SESSION_SECRET` in chat or README.
- This project is for test data only, not the real IDEIS source.
- Do not invent teacher names. The source of truth is the original IDEIS DOM table, including the `Prowadzący` column.
- Do not use IDEIS `Save as csv` as the source of truth. It can omit data and does not reliably include lecturer names.
