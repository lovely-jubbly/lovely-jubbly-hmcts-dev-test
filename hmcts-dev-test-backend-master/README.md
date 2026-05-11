# HMCTS Task Management API

Express API for caseworker task management, backed by PostgreSQL and Prisma.

## Local setup

1. Install dependencies with `npm install`.
2. Copy `.env.example` to `.env` and set `PORT`, `DATABASE_URL`, and `CORS_ORIGINS`.
3. Apply database migrations with `npx prisma migrate dev`.
4. Start the API with `npm run dev`.

## Database migrations

- Local development: `npx prisma migrate dev`
- Render release: `npx prisma migrate deploy`

## Scripts

- `npm start` — run the API
- `npm run dev` — run the API with nodemon
- `npm test` — run tests
- `npm run lint` — run ESLint
- `npm run format:check` — check formatting with Prettier
