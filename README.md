# StudyFlow

StudyFlow is a full-stack study planning and progress tracking application.

## Structure

- `client/`: React frontend.
- `server/`: Node.js backend.
- `PRD.md`: product requirements.
- `HLD.md`: high-level design.
- `LLD.md`: low-level design.
- `PROJECT_SCORE.md`: Project Score implementation plan.

## Status

The initial React/Vite and Express foundations are in place. Implementation is intentionally staged; see `PROJECT_SCORE.md` for the planned sequence.

## Development

Create local environment files from the examples:

```bash
cp client/.env.example client/.env
cp server/.env.example server/.env
```

Install dependencies in each app directory:

```bash
cd client && npm install
cd ../server && npm install
```

Run the client with `npm run dev` from `client/` and the server with `npm run dev` from `server/`.

The browser loads the Vite client at `http://localhost:5173`. API requests go to the URL in `VITE_API_URL`, such as `http://localhost:5000`. Express receives `GET /api/health`, runs the CORS and JSON middleware, and returns a JSON health response.

CORS is required because the Vite client and Express server use different local origins. `CLIENT_URL` allows the backend to explicitly permit the frontend origin. Environment variables keep ports, URLs, and future secrets outside committed source code.

## PostgreSQL foundation

Set `DATABASE_URL` in `server/.env`, then run these commands from `server/`:

```bash
npm run db:migrate
npm run db:seed
```

The migration creates the `users`, `subjects`, and `tasks` tables, their primary and foreign keys, and the indexes needed for common relationship and due-date lookups. The seed command inserts development-only sample data in a transaction.
