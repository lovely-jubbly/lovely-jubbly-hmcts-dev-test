# HMCTS Task Management – Backend Plan

## Overview

This plan describes the **backend work** for the HMCTS caseworker task API: a small Express service backed by PostgreSQL that supports task create, read (single and list), status update, and delete, with validation, documented endpoints, tests, linting, formatting, and deployment to Render.

The work is defined by [2026-05-11_1_challenge_details.md](./2026-05-11_1_challenge_details.md) and [2026-05-11_2_initial_project_instructions.md](./2026-05-11_2_initial_project_instructions.md). The backend starter folder is empty aside from licence, ignore rules, and scaffold directories, so this plan establishes the initial structure and conventions for the service.

---

## Principles

1. **Follow established Node patterns:** Thin routes, controllers for HTTP mapping, services for Prisma access, Zod validators at the boundary, one error envelope, and `src/app.js` exported for Supertest without starting a listener in tests.
2. **Keep it simple:** No authentication, pagination, search, filtering, or full task updates after create. Only status changes are required after task creation. No extra services or abstractions beyond what the challenge and project instructions require.
3. **Deliver a complete baseline:** Prisma migrations, OpenAPI at `/api-docs`, Jest + Supertest coverage, ESLint + Prettier, `.env.example`, backend README, and GitHub Actions that run lint, format check, and tests on push and pull request.

---

## Current State (Relevant Pieces)

- **Repository:** `hmcts-dev-test-backend-master/` contains licence, `.gitignore`, empty `README.md`, and scaffold folders under `prisma/`, `src/`, and `tests/`. No `package.json`, Prisma schema, or application code yet.
- **Stack:** Node.js 20 LTS, JavaScript (CommonJS), Express 4, PostgreSQL, Prisma, Zod, `swagger-jsdoc` + `swagger-ui-express`, Jest + Supertest, ESLint 9 flat config with `@eslint/js` and `globals`, Prettier with `eslint-config-prettier`.
- **Process layout:** `src/server.js` boots HTTP; `src/app.js` builds the Express app for runtime and tests.
- **Task identity:** UUID primary keys (`@default(uuid())` in Prisma).
- **Status values:** `pending`, `in_progress`, `done`.
- **Due date/time:** Required ISO 8601 datetime in API requests; stored as `DateTime` in UTC.
- **Description:** Optional on create; `null` in responses when unset.
- **List ordering:** `dueDate` ascending, then `createdAt` ascending. No query parameters.
- **Audit fields:** `createdAt` and `updatedAt` on every task row; `updatedAt` changes on status update.
- **Delete behaviour:** Hard delete.
- **CORS:** Origins from `CORS_ORIGINS` (comma-separated env var).
- **Operational endpoint:** `GET /health` returns `200` with `{ "status": "ok" }`.

---

## Contract: Task API

### Method and path

| Method | Path | Success status | Notes |
| --- | --- | --- | --- |
| `POST` | `/tasks` | `201` | Body: `title`, optional `description`, `status`, `dueDate`. |
| `GET` | `/tasks` | `200` | Returns all tasks in default sort order. |
| `GET` | `/tasks/:id` | `200` | `:id` must be a UUID. |
| `PATCH` | `/tasks/:id/status` | `200` | Body: `status` only. |
| `DELETE` | `/tasks/:id` | `204` | Empty response body. |
| `GET` | `/api-docs` | `200` | Swagger UI. |
| `GET` | `/health` | `200` | Operational health check. |

### Auth

- None. Tasks are global records with no caseworker identity in the data model.

### Request and response shape

Task JSON fields in success responses:

- `id` (UUID string)
- `title` (string)
- `description` (string or `null`)
- `status` (`pending` | `in_progress` | `done`)
- `dueDate` (ISO 8601 datetime string)
- `createdAt` (ISO 8601 datetime string)
- `updatedAt` (ISO 8601 datetime string)

`POST /tasks` accepts `title`, optional `description`, `status`, and `dueDate`.

`PATCH /tasks/:id/status` accepts `status` only. Title, description, and due date are immutable after creation.

### Behaviour

| ID | Story | Acceptance criteria |
| --- | --- | --- |
| US-C01 | Create a task with title, status, and due date. | `POST /tasks` with valid fields returns `201` and the created task including `id` and timestamps. |
| US-C02 | Add an optional description on create. | `POST /tasks` may include `description`; response includes it when provided. |
| US-C03 | Reject invalid create input. | Missing or invalid `title`, `status`, or `dueDate` returns `400` with the standard error envelope. Empty or whitespace-only `title`, unknown `status`, and non-ISO `dueDate` values are rejected. |
| US-C04 | Reject malformed JSON on create. | Invalid JSON on `POST /tasks` returns `400` with the standard error envelope. |
| US-R01 | Retrieve a task by id. | `GET /tasks/:id` with a valid UUID returns `200` and the task. |
| US-R02 | Return not found for a missing task. | `GET /tasks/:id` for an unknown UUID returns `404`. |
| US-R03 | Reject invalid task ids on read. | `GET /tasks/:id` with a non-UUID `id` returns `400`. |
| US-R04 | List all tasks. | `GET /tasks` returns `200` and tasks ordered by `dueDate` ascending, then `createdAt` ascending. |
| US-R05 | Return an empty list when no tasks exist. | `GET /tasks` returns `200` and `[]`. |
| US-U01 | Update task status. | `PATCH /tasks/:id/status` with a valid `status` returns `200` and the updated task; `updatedAt` changes. |
| US-U02 | Reject invalid status updates. | Missing `status`, unknown `status`, non-UUID `id`, or malformed JSON returns `400`. |
| US-U03 | Return not found for a missing task on status update. | `PATCH /tasks/:id/status` for an unknown UUID returns `404`. |
| US-D01 | Delete a task. | `DELETE /tasks/:id` for an existing task returns `204` with an empty body. |
| US-D02 | Return not found for a missing task on delete. | `DELETE /tasks/:id` for an unknown UUID returns `404`. |
| US-D03 | Reject invalid task ids on delete. | `DELETE /tasks/:id` with a non-UUID `id` returns `400`. |
| US-O01 | Document API endpoints. | `GET /api-docs` serves Swagger UI with all task endpoints, request bodies, response shapes, and error responses. |
| US-O02 | Expose a health endpoint. | `GET /health` returns `200` and `{ "status": "ok" }`. |
| US-O03 | Use one error format across the API. | Validation, not-found, and unexpected server errors use the same JSON error envelope and appropriate HTTP status codes. |

### Response (success)

`GET /tasks` returns a JSON array of task objects.

`GET /tasks/:id`, `POST /tasks`, and `PATCH /tasks/:id/status` return a single task object.

`DELETE /tasks/:id` returns an empty body.

`GET /health` returns:

```json
{
  "status": "ok"
}
```

### Errors

All error responses use:

```json
{
  "error": {
    "message": "Human-readable summary",
    "details": []
  }
}
```

- `details` is an array of field-level validation messages for `400` responses.
- `details` is an empty array when no field breakdown applies (`404`, `500`).

HTTP status mapping:

- `400`: validation failure (body, params, or business rules).
- `404`: task not found.
- `500`: unhandled server or database failure.

---

## Implementation Plan (Minimal Changes)

### 1. Repository bootstrap and runtime wiring

- **Files:** `package.json`, `jest.config.js`, `eslint.config.js`, `.prettierrc`, `.prettierignore`, `.env.example`, `.gitignore`, `src/app.js`, `src/server.js`, `src/config/env.js`, `src/lib/prisma.js`, `src/routes/health.routes.js`.
- **Scripts:** `start`, `dev`, `test`, `test:watch`, `lint`, `lint:fix`, `format`, `format:check`, `prisma:generate`, `prisma:migrate`, `prisma:deploy`.
- **Runtime dependencies:** `express`, `@prisma/client`, `zod`, `cors`, `swagger-jsdoc`, `swagger-ui-express`.
- **Development dependencies:** `prisma`, `jest`, `supertest`, `nodemon`, `eslint`, `@eslint/js`, `globals`, `prettier`, `eslint-config-prettier`.
- **App wiring:** `src/config/env.js` reads and validates `PORT`, `DATABASE_URL`, and `CORS_ORIGINS` at startup. `src/lib/prisma.js` is the single Prisma client instance. `src/app.js` applies JSON parsing, CORS, route registration, Swagger UI, not-found handling, and the error handler. `src/server.js` loads env config, creates the app, and listens on `PORT`. `GET /health` returns `{ "status": "ok" }`.

### 2. Database schema and migrations

- **File:** `prisma/schema.prisma`
- **Model:** `Task` with `id`, `title`, optional `description`, `status`, `dueDate`, `createdAt`, `updatedAt`.
- **Enum:** `status` maps to `pending`, `in_progress`, `done`.
- **Defaults:** `id` uses `uuid()`; `createdAt` uses `@default(now())`; `updatedAt` uses `@updatedAt`.
- **Migrations:** Create the initial migration. Document `npx prisma migrate dev` for local setup and `npx prisma migrate deploy` for Render release execution in the backend README.

### 3. Validation and error handling

- **Files:** `src/validators/tasks.validator.js`, `src/middleware/validate.js`, `src/middleware/errorHandler.js`, `src/middleware/notFoundHandler.js`, `tests/unit/tasks.validator.test.js`
- **Validators:** Zod schemas for create body, UUID route param, and status update body.
- **Middleware:** `validate.js` runs schema validation and attaches parsed data to the request. `errorHandler.js` maps Zod failures, Prisma not-found patterns, and unexpected errors to the standard error envelope. `notFoundHandler.js` handles unknown routes outside `/api-docs` and `/health`.
- **Tests:** Unit tests cover accepted and rejected inputs for US-C03, US-R03, and US-U02.

### 4. Task service layer

- **File:** `src/services/tasks.service.js`, `tests/unit/tasks.service.test.js`
- **Functions:** `createTask`, `getTaskById`, `listTasks`, `updateTaskStatus`, `deleteTask`.
- **Rules:** `createTask` persists `title`, optional `description`, `status`, and `dueDate`. `listTasks` orders by `dueDate` ascending then `createdAt` ascending. `updateTaskStatus` changes only `status` and relies on Prisma for `updatedAt`. `getTaskById` and `deleteTask` distinguish missing records (`404`) from successful operations.
- **Tests:** Unit tests use a mocked Prisma client for success and not-found paths.

### 5. Routes and controllers

- **Files:** `src/controllers/tasks.controller.js`, `src/routes/tasks.routes.js`, `tests/integration/tasks.routes.test.js`, `tests/integration/health.routes.test.js`, `tests/helpers/testDb.js`
- **Routes:** `POST /tasks`, `GET /tasks`, `GET /tasks/:id`, `PATCH /tasks/:id/status`, `DELETE /tasks/:id`.
- **Controller:** Maps service results and errors to HTTP status codes and response bodies.
- **Validation:** Each route uses the param and body validation defined in the contract.
- **Tests:** Integration tests cover US-C01 through US-D03, US-C04, and US-O02 against a test database or isolated test schema.

### 6. OpenAPI documentation

- **Files:** `src/config/swagger.js`, route annotations in `src/routes/health.routes.js` and `src/routes/tasks.routes.js`
- **Mounting:** Swagger UI at `/api-docs` in `src/app.js`.
- **Spec:** OpenAPI metadata, server URLs, and shared schemas for `Task` and the error envelope. Every task and health endpoint appears in the generated spec.
- **Verification:** US-O01 is checked manually in Swagger UI during implementation.

### 7. README, deployment, and CI

- **Files:** `README.md`, Render start configuration, GitHub Actions workflow
- **README:** Purpose, stack summary, local setup (install, env, migrate, run, test), environment variables, API docs URL, `npm run lint`, `npm run lint:fix`, `npm run format`, `npm run format:check`, and anonymous author references.
- **Render:** `start` uses `node src/server.js`; release runs `prisma migrate deploy`. Document `DATABASE_URL`, `CORS_ORIGINS`, and `PORT` when the platform does not supply it.
- **CI:** Install dependencies, generate the Prisma client, run migrations against a PostgreSQL service, then run `npm run lint`, `npm run format:check`, and `npm test`. Add a CI status badge to the backend README once the workflow exists.

### 8. Consistency checklist

- Response shapes match the contract for create, read, status update, delete, health, and documented errors.
- User stories US-C01 through US-O03 have passing automated coverage or a documented manual check for Swagger UI (US-O01).
- Prisma migrations apply cleanly on a fresh database.
- `.env.example` and the backend README allow a new developer to run the API, lint, format checks, and tests locally.
- `npm run lint` and `npm run format:check` pass locally and in GitHub Actions.
- The service runs on Render with PostgreSQL, CORS configured for the frontend origin, and `/health` returning `200`.

### 9. Greenfield delivery

- This is the first backend release. No existing routes or clients depend on prior behaviour.
- The frontend consumes this API contract as written; cross-origin access is handled through `CORS_ORIGINS` rather than a backend-for-frontend layer.

---

## Out of Scope (This Plan)

- Authentication, authorisation, and per-user task ownership.
- Pagination, search, filtering, and sorting query parameters beyond the fixed default list order.
- Full task field updates after creation.
- Frontend behaviour, GOV.UK UI, and Netlify deployment.
- The 250-word personal statement.

---

## Summary

| Item | Action |
| --- | --- |
| Bootstrap | `package.json`, ESLint, Prettier, Jest, `src/app.js`, `src/server.js`, env config, Prisma client, `GET /health` |
| Database | Prisma `Task` model, enum status values, initial migration, local and Render migration commands |
| Validation | Zod schemas, validate middleware, shared error envelope, not-found handler |
| Service | `tasks.service.js` with create, read, list, status update, delete |
| HTTP | `tasks.routes.js`, `tasks.controller.js`, integration tests for all task and health endpoints |
| Docs | Swagger UI at `/api-docs`, backend README, `.env.example` |
| Quality | `lint`, `lint:fix`, `format`, `format:check`, unit and integration tests, GitHub Actions |
| Deploy | Render with PostgreSQL, `CORS_ORIGINS`, release-time `prisma migrate deploy` |
| Reuse | Express layered layout, Prisma for persistence, Zod at the boundary, Supertest against `src/app.js` |
