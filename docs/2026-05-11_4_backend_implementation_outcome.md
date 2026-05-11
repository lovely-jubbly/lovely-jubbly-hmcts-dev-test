# HMCTS Task Management – Backend Implementation Outcome

## Overview

The backend work described in [2026-05-11_3_backend_implementation_plan.md](./2026-05-11_3_backend_implementation_plan.md) is complete. The service in `hmcts-dev-test-backend-master/` is a small Express API backed by PostgreSQL and Prisma. It supports task create, read, status update, and delete, with validation, OpenAPI documentation, automated tests, linting, formatting, GitHub Actions, and deployment to Render.

---

## Delivered scope

- REST API for task create, read (single and list), status update, and delete.
- PostgreSQL persistence through Prisma with an initial migration.
- Zod validation and a shared JSON error envelope.
- OpenAPI documentation served at `/api-docs`.
- Unit tests for validators and the task service.
- Integration tests for `/health` and task routes.
- ESLint, Prettier, `.env.example`, and a backend `README.md`.
- GitHub Actions workflow for lint, format check, and tests.
- Render deployment with PostgreSQL and release-time `prisma migrate deploy`.

The following remain out of scope, as planned: authentication, per-user task ownership, pagination, search, filtering, and full task field updates after create.

---

## Stack and structure

| Area | Choice |
| --- | --- |
| Runtime | Node.js (Render currently uses Node 24; local README targets Node 20) |
| Language | JavaScript (CommonJS) |
| HTTP | Express 4 |
| Database | PostgreSQL |
| ORM | Prisma |
| Validation | Zod |
| API docs | `swagger-jsdoc` + `swagger-ui-express` |
| Tests | Jest + Supertest |
| Quality | ESLint 9 flat config, Prettier |

Application code follows a thin layered layout: routes, controllers, services, validators, middleware, and shared config under `src/`. `src/app.js` builds the Express app for runtime and tests; `src/server.js` starts the HTTP listener.

---

## API contract delivered

| Method | Path | Success status |
| --- | --- | --- |
| `POST` | `/tasks` | `201` |
| `GET` | `/tasks` | `200` |
| `GET` | `/tasks/:id` | `200` |
| `PATCH` | `/tasks/:id/status` | `200` |
| `DELETE` | `/tasks/:id` | `204` |
| `GET` | `/api-docs` | `200` |
| `GET` | `/health` | `200` |

Task responses include `id`, `title`, `description`, `status`, `dueDate`, `createdAt`, and `updatedAt`. Status values are `pending`, `in_progress`, and `done`. List results are ordered by `dueDate` ascending, then `createdAt` ascending.

Error responses use:

```json
{
  "error": {
    "message": "Human-readable summary",
    "details": []
  }
}
```

---

## Live deployment

| Item | Value |
| --- | --- |
| API base URL | `https://lovely-jubbly-hmcts-dev-test-backend.onrender.com` |
| Health check | `https://lovely-jubbly-hmcts-dev-test-backend.onrender.com/health` |
| Swagger UI | `https://lovely-jubbly-hmcts-dev-test-backend.onrender.com/api-docs` |
| Repository | `https://github.com/lovely-jubbly/lovely-jubbly-hmcts-dev-test` |

Render settings in use:

- Root directory: `hmcts-dev-test-backend-master`
- Build command: `npm install && npm run prisma:generate && npm run prisma:deploy`
- Start command: `npm start`
- Environment variables: `DATABASE_URL`, `CORS_ORIGINS`

`CORS_ORIGINS` is currently set to `http://localhost:5173` for local frontend development. Add the Netlify site origin when the frontend is deployed.

---

## Verification outcome

| Check | Result |
| --- | --- |
| Response shapes and HTTP status codes on Render | Verified with live requests for create, list, read, status update, delete, validation errors, and not-found responses |
| Swagger UI (US-O01) | Verified manually at `/api-docs` |
| Prisma migrations on a fresh database | Applied successfully during Render build |
| `npm run lint` and `npm run format:check` | Pass locally |
| GitHub Actions `Backend CI` | Reported successful on `main` |
| Render `/health` | Returns `{"status":"ok"}` |
| Automated tests | Unit tests and health integration test pass without a local database; full task route integration tests require PostgreSQL and applied migrations locally, matching the CI workflow |

---

## Local development and tests

Setup is documented in `hmcts-dev-test-backend-master/README.md`.

1. `npm install`
2. Copy `.env.example` to `.env`
3. `npx prisma migrate dev`
4. `npm run dev`

Run `npm test` after PostgreSQL is available and migrations are applied. Use `npm run lint`, `npm run format:check`, and `npm run test:watch` as documented in the backend README.

---

## Follow-up after frontend deployment

- Add the Netlify origin to `CORS_ORIGINS` on Render.
- Record the live frontend URL and API base URL in the project README when both apps are public.
- Confirm Render has stable GitHub access if automatic deploys on push are required.

---

## Related documents

- [2026-05-11_1_challenge_details.md](./2026-05-11_1_challenge_details.md)
- [2026-05-11_2_initial_project_instructions.md](./2026-05-11_2_initial_project_instructions.md)
- [2026-05-11_3_backend_implementation_plan.md](./2026-05-11_3_backend_implementation_plan.md)
