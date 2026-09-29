# IDEIS Schedule Lab

Test IDEIS-like schedule site for the calendar sync project.

## Pages

- `/Plany/PlanyTokow/1406` - public schedule page that mimics the original IDEIS route (Tok 1406).
- `/Plany/PlanyTokow/1203` - backwards-compatible schedule page (Tok 1203).
- `/Plany/PlanyTokow/[tok]` - dynamic route supporting any tok identifier.
- `/Plany/PlanyTokowGrid` and `/Plany/PlanyTokowGrid/[tok]` - HTML grid endpoints used after `Search`; supports `dateFrom` and `dateTo`.
- `/admin` - password-protected editor for manual test changes.

## Data

The seed data in `data/seed.csv` comes from the original DOM table at:

```text
https://harmonogramy.ideis.pl/Plany/PlanyTokow/1406
```

It covers the Semester 3 range `2026-09-15` to `2027-02-15` (128 classes, groups WykS, CwS, Lekt/ANGS).
Teacher names, rooms, forms, `ProwGr ID`, and notes come from the original table.

If `DATABASE_URL` is set, the app uses Neon Postgres and replaces old seeded rows with the current real seed. If `DATABASE_URL` is missing, local dev uses `.data/schedule.json` and refreshes seeded rows from `data/seed.csv`.

## Commands

```powershell
npm install
npm run dev
npm run lint
npm run build
```

Local URL:

```text
http://localhost:3000/Plany/PlanyTokow/1406
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
