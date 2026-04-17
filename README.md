# Naborly Launch Kit

1. Delete old repo files and upload these files to GitHub.
2. In Supabase SQL Editor, run:
   - supabase/schema.sql
   - supabase/storage.sql
   - optional: supabase/seed.sql
3. In Vercel add:
   - VITE_SUPABASE_URL
   - VITE_SUPABASE_ANON_KEY
4. Redeploy.

This version gives you:
- live signup
- live posts/events reads
- live favorites

Next phase after launch:
- create posts from app
- uploads from app
- real orders/reservations
- payment capture
