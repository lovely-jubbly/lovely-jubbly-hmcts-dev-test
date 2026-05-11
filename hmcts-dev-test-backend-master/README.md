# HMCTS Task Management API

![Backend CI](https://github.com/lovely-jubbly/lovely-jubbly-hmcts-dev-test/actions/workflows/backend-ci.yml/badge.svg)

Express API for caseworker tasks, backed by PostgreSQL and Prisma.

## Run locally

Start PostgreSQL from the repository root with `docker compose up -d`, then run:

```bash
npm install
cp .env.example .env
npx prisma migrate dev
npm run dev
```

API: `http://localhost:3000`  
Swagger UI: `http://localhost:3000/api-docs`

The frontend expects this API on port `3000`.

## Environment variables

| Variable | Purpose |
| --- | --- |
| `PORT` | API port |
| `DATABASE_URL` | PostgreSQL connection string for Docker local setup |
| `CORS_ORIGINS` | Allowed browser origins, including `http://localhost:5173` |

## Tests

```bash
npm test
```

PostgreSQL must be running and migrations applied before the full test suite.

## Live API

| Item | URL |
| --- | --- |
| API | `https://lovely-jubbly-hmcts-dev-test-backend.onrender.com` |
| Health | `https://lovely-jubbly-hmcts-dev-test-backend.onrender.com/health` |
| Swagger | `https://lovely-jubbly-hmcts-dev-test-backend.onrender.com/api-docs` |

Full local and live setup: repository root `README.md`.
