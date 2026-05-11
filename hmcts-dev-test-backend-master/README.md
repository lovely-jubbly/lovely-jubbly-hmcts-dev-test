# HMCTS Task Management API

![Backend CI](https://github.com/lovely-jubbly/lovely-jubbly-hmcts-dev-test/actions/workflows/backend-ci.yml/badge.svg)

Express API for caseworker task management, backed by PostgreSQL and Prisma.

## Stack

- Node.js 20
- Express
- PostgreSQL
- Prisma
- Zod
- Jest and Supertest
- ESLint and Prettier
- Swagger UI at `/api-docs`

## Local setup

1. Install dependencies with `npm install`.
2. Copy `.env.example` to `.env` and set the environment variables below.
3. Apply database migrations with `npx prisma migrate dev`.
4. Start the API with `npm run dev`.
5. Open `http://localhost:3000/api-docs` for the API documentation.

## Environment variables

| Variable       | Purpose                                                 |
| -------------- | ------------------------------------------------------- |
| `PORT`         | HTTP port for the API server                            |
| `DATABASE_URL` | PostgreSQL connection string used by Prisma             |
| `CORS_ORIGINS` | Comma-separated browser origins allowed to call the API |

## Database migrations

- Local development: `npx prisma migrate dev`
- Render release: `npx prisma migrate deploy`

## Tests

Run the full test suite with `npm test`.

Use `npm run test:watch` to re-run tests when files change.

Integration tests need a running PostgreSQL database and an applied schema. Set `DATABASE_URL` in `.env`, run `npx prisma migrate dev`, then run `npm test`.

The suite includes unit tests for task validation and the task service, plus integration tests for `/health` and the task routes.

## Scripts

- `npm start` — run the API
- `npm run dev` — run the API with nodemon
- `npm test` — run tests
- `npm run lint` — run ESLint
- `npm run lint:fix` — fix ESLint issues
- `npm run format` — format files with Prettier
- `npm run format:check` — check formatting with Prettier
- `npm run prisma:generate` — generate the Prisma client
- `npm run prisma:migrate` — create and apply local migrations
- `npm run prisma:deploy` — apply migrations in production

## Render deployment

Use these settings for the backend service:

- Build command: `npm install && npm run prisma:generate && npm run prisma:deploy`
- Start command: `npm start`

Set `DATABASE_URL` and `CORS_ORIGINS` in Render. Set `PORT` only if the platform does not provide it automatically.

Run `npx prisma migrate deploy` during release so the database schema matches the deployed code.
