# IDEIS Schedule Lab

Test IDEIS-like schedule site for the calendar sync project.

## Pages

- `/Plany/PlanyTokow/1203` - public schedule page that mimics the original IDEIS route.
- `/Plany/PlanyTokowGrid` - HTML grid endpoint used after `Search`; supports `dateFrom` and `dateTo`.
- `/admin` - password-protected editor for manual test changes.

## Data

The seed data in `data/seed.csv` was scraped from the original DOM table at:

```text
https://harmonogramy.ideis.pl/Plany/PlanyTokow/1203
```

It covers the original "whole semester" range `2026-02-02` to `2026-09-30`.
The current seed contains 289 rows across 69 activity dates. Teacher names,
rooms, forms, `ProwGr ID`, and notes come from the original table, not from demo
mappings.

If `DATABASE_URL` is set, the app uses Neon Postgres and replaces old generated
`seed-*` / `semester-*` rows with the current real seed. If `DATABASE_URL` is
missing, local dev uses `.data/schedule.json` and refreshes seeded rows from
`data/seed.csv`.

## Commands

```powershell
npm install
npm run dev
npm run lint
npm run build
```

Local URL:

```text
http://localhost:3000/Plany/PlanyTokow/1203
```

## Vercel

On Vercel, add:

```env
DATABASE_URL=<Neon connection string>
ADMIN_PASSWORD=<strong admin password>
ADMIN_SESSION_SECRET=<random long string, optional but recommended>
```

Do not commit secrets or paste them into chat.

## Data Accuracy

Do not invent teacher names. If data needs to be refreshed, scrape/read the
actual original IDEIS table, including the `Prowadzący` column. Do not use the
CSV export as the source of truth, because it can omit data and does not carry
the lecturer column reliably.
