# Frontend - My Health Chain

## Setup

```powershell
npm ci
npm run dev
```

Runs on `http://localhost:3000`

## Pages

- `/` — Home page
- `/login` — User login
- `/dashboard` — Main dashboard
- `/patient-search` — Search patients by ID
- `/patient/[id]` — View patient record (dynamic)
- `/records/add` — Add medical record
- `/labs/upload` — Upload lab results

## Architecture

- **Next.js 14** with App Router
- **Tailwind CSS** for styling
- **Axios** for API calls
- **shadcn UI** ready to integrate (add components as needed)

## API Integration

The frontend connects to the backend at `http://localhost:4000/api`. Ensure the backend is running before starting the dev server.

## PWA Support

To enable PWA:
1. Add `next-pwa` package
2. Configure in `next.config.js`
3. Add service worker and manifest.json

Future: Offline-first sync with IndexedDB for local caching.
