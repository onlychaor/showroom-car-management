<<<<<<< HEAD
=======
Showroom Car Management — scaffold

Tech: Next.js + TypeScript + Tailwind + MongoDB / Supabase (optional)

Quick start (local with MongoDB):
1. copy .env.local.example -> .env.local and set MONGODB_URI (or Supabase vars)
2. npm install
3. npm run seed:mongo   # optional, seeds sample data into MongoDB
4. npm run dev

Notes:
- This scaffold includes pages, a dashboard, admin UI, calendar, notifications, and API routes.
- For production we recommend a hosted DB (MongoDB Atlas or Supabase Postgres). Keep service keys out of the repo.
- Use `db/schema.sql` / `db/seed.sql` for Postgres (Supabase) migrations; use `scripts/seed-mongo.js` for MongoDB local/Atlas.

# showroom-car-management