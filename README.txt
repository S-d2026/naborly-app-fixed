Naborly Final Launch Build

What is included:
- fuller homepage sections
- one-row desktop nav
- creator-only admin controls using VITE_ADMIN_EMAIL
- sample/example content toggle for creator only
- Free Meals & Services quick route
- Med Help quick route
- share modal with QR, WhatsApp, copy links, flyer-friendly QR
- rotating promoted event/ad ribbon
- Supabase auth signup modal
- marketplace / support / events / post / partners / saved / account sections

What is still UI-level / next phase:
- actual post submission writes
- actual image upload writes
- actual payment capture
- actual RSVP/order writes
- secure backend admin flags beyond email gate

Setup:
1. Upload files to GitHub
2. Run supabase/schema.sql
3. Run supabase/storage.sql
4. Add VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY, VITE_ADMIN_EMAIL, VITE_APP_BASE_URL in Vercel
5. Redeploy
