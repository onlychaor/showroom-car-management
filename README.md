Showroom Car Management — scaffold

Tech: Next.js + TypeScript + Tailwind + Supabase

Quick start:
1. copy .env.local.example -> .env.local and fill Supabase keys
2. npm install
3. npm run dev
Notes:
- This scaffold includes pages, a simple layout, and API routes that proxy to Supabase.
- For production, keep service role key secure and do not expose it to the browser.
- To use a real Postgres DB we recommend Supabase. See `db/schema.sql` and `db/seed.sql` for schema and seed data.
- To apply migrations use the supabase CLI (see migrations/README.md).

# showroom-car-management