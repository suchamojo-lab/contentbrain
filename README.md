# Everything Content

A milestone-one local prototype for founders: build a Content Universe, add one real idea, receive a curated recommendation, and lock a direction.

## Run locally

```bash
npm install
npm run dev
```

The first run offers local Convex setup. Choose **Start without an account**, then open the URL Vite prints, usually `http://localhost:5173`.

## Verify

```bash
npm test -- --run
npm run build
```

Resume state is stored in the browser under `everything-content:v1`. Content Universes, submitted ideas, and locked directions are stored in the local Convex database with linked record IDs. This milestone does not claim live research: its examples are a small curated library, and deeper-research clicks are saved as requests.

Use `npx convex data` to inspect the three server tables. The local database must be running through `npm run dev` while using the app.
