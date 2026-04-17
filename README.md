# Naborly Real App Starter

This is a deployable React/Vite starter for a neighborhood marketplace app.

## Included
- Sign-in flow
- Browse feed with search and filters
- Save favorites
- Create listing form
- Image upload preview
- Report listing
- Admin moderation queue
- Local persistence with `localStorage`
- Backend handoff notes for Supabase/Firebase/custom API

## Run locally
```bash
npm install
npm run dev
```

## Build
```bash
npm install
npm run build
```

## Deploy
- Vercel: import the folder/repo and use default Vite settings.
- Netlify: build command `npm run build`, publish directory `dist`.

## Notes
This starter uses local storage as a mock backend so the UX works immediately.
