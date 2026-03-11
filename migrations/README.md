Use supabase CLI or psql to apply migrations.

Example with supabase CLI:

1. Install: npm install -g supabase
2. Login: supabase login
3. Link project: supabase link --project-ref <project-ref>
4. Apply SQL: supabase db query < db/schema.sql
5. Seed: supabase db query < db/seed.sql

Alternatively use psql:
psql <connection-string> -f db/schema.sql
psql <connection-string> -f db/seed.sql

