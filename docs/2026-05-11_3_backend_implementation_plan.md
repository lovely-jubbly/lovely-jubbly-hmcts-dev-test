# Backend implementation plan — HMCTS task management API

## Purpose

This document defines the backend scope, user stories, technical decisions, and implementation steps for the caseworker task API described in [2026-05-11_1_challenge_details.md](./2026-05-11_1_challenge_details.md) and [2026-05-11_2_initial_project_instructions.md](./2026-05-11_2_initial_project_instructions.md).

The backend starter repository is empty aside from licence and placeholders, so this plan establishes the initial structure and conventions for the service. The implementation must stay small, layered, and consistent with common Express + Prisma practice rather than introducing extra abstractions.

## Scope boundary

### In scope

- REST API for task create, read (single and list), status update, and delete.
- PostgreSQL persistence through Prisma.
- Request validation and a single error-handling path for all endpoints.
- OpenAPI documentation served at `/api-docs`.
- Unit and HTTP integration tests with Jest and Supertest.
- Local development setup, `.env.example`, and Render deployment configuration.
- GitHub Actions workflow that runs the test suite on push and pull request.

### Out of scope

- Authentication, authorisation, and per-user task ownership.
- Pagination, search, filtering, and sorting query parameters beyond a fixed default list order.
- Full task field updates after creation (only status changes are required by the challenge backend specification).
- Frontend behaviour, GOV.UK UI, and Netlify deployment (covered in a separate frontend plan).
- The 250-word personal statement.

## Fixed technical decisions

These choices are final for the backend. The plan does not defer alternatives.

| Area | Decision | Rationale |
| --- | --- | --- |
| Runtime | Node.js 20 LTS | Matches the project stack and Render defaults. |
| Language | JavaScript (CommonJS) | Keeps tooling simple with Express, Jest, and Prisma without a TypeScript build step. |
| HTTP framework | Express 4 | Required by the project instructions. |
| Database | PostgreSQL | Required by the challenge and project instructions. |
| ORM | Prisma | Required by the project instructions; gives schema, migrations, and a typed client. |
| Validation | Zod schemas with a shared Express validation middleware | One schema per operation; consistent 400 responses without scattering rules in route handlers. |
| API documentation | `swagger-jsdoc` + `swagger-ui-express` at `/api-docs` | Satisfies endpoint documentation with an interactive UI. |
| Testing | Jest + Supertest | Required by the project instructions. |
| Linting | ESLint 9 flat config with `@eslint/js` and `globals` | Standard Node.js checks without a TypeScript parser. |
| Formatting | Prettier with `eslint-config-prettier` | One formatter; ESLint does not fight Prettier on style rules. |
| Task identifier | UUID (`@default(uuid())` in Prisma) | Stable public identifier for REST URLs. |
| Status values | `pending`, `in_progress`, `done` | Aligns with the frontend plan and caseworker workflow. |
| Due date/time | Required ISO 8601 datetime string in API requests; stored as `DateTime` in UTC | Matches the challenge field and avoids ambiguous date-only values. |
| Description | Optional on create; omitted or `null` in responses when unset | Matches the challenge field definition. |
| List ordering | All tasks returned sorted by `dueDate` ascending, then `createdAt` ascending | Gives caseworkers a predictable default without adding query parameters. |
| Audit fields | `createdAt` and `updatedAt` on every task row | Standard persistence metadata; `updatedAt` changes on status update. |
| Delete behaviour | Hard delete | Matches the challenge delete requirement. |
| CORS | Enabled for origins listed in `CORS_ORIGINS` (comma-separated env var) | Allows the Netlify frontend to call the Render API. |
| Operational endpoints | `GET /health` returns 200 with `{ "status": "ok" }` | Supports Render health checks and local smoke verification. |
| Process layout | `src/server.js` boots HTTP; `src/app.js` builds the Express app for tests and runtime | Keeps Supertest against the app without starting a listener in tests. |

## User stories and use cases

Stories are written from the caseworker and API consumer perspective. Together they define the full backend behaviour for this feature.

### Task creation

| ID | Story | Acceptance criteria |
| --- | --- | --- |
| US-C01 | As a caseworker, I want to create a task with a title, status, and due date so that work is recorded in the system. | `POST /tasks` with valid `title`, `status`, and `dueDate` returns `201` and the created task including `id`, timestamps, and stored field values. |
| US-C02 | As a caseworker, I want to add an optional description when creating a task so that extra context is available later. | `POST /tasks` may include `description`; response includes the description when provided. |
| US-C03 | As a caseworker, I want invalid create requests rejected clearly so that bad data never reaches the database. | Missing or invalid `title`, `status`, or `dueDate` returns `400` with a structured error body. Empty or whitespace-only `title` is rejected. Unknown `status` values are rejected. Non-ISO or unparseable `dueDate` values are rejected. |
| US-C04 | As an API consumer, I want malformed JSON rejected so that the API fails predictably. | Invalid JSON body on `POST /tasks` returns `400` with a structured error body. |

### Task retrieval

| ID | Story | Acceptance criteria |
| --- | --- | --- |
| US-R01 | As a caseworker, I want to open a task by id so that I can review its details. | `GET /tasks/:id` with a valid UUID returns `200` and the task. |
| US-R02 | As a caseworker, I want a clear response when a task does not exist so that I am not shown stale data. | `GET /tasks/:id` for an unknown UUID returns `404` with a structured error body. |
| US-R03 | As an API consumer, I want invalid task ids rejected so that the database is not queried with bad input. | `GET /tasks/:id` with a non-UUID `id` returns `400` with a structured error body. |
| US-R04 | As a caseworker, I want to see all my tasks in one list so that I can scan upcoming work. | `GET /tasks` returns `200` and an array of tasks ordered by `dueDate` ascending, then `createdAt` ascending. |
| US-R05 | As a caseworker, I want an empty task list handled cleanly when no tasks exist yet. | `GET /tasks` returns `200` and `[]` when the table has no rows. |

### Task status update

| ID | Story | Acceptance criteria |
| --- | --- | --- |
| US-U01 | As a caseworker, I want to change a task status so that progress is reflected in the system. | `PATCH /tasks/:id/status` with a valid `status` returns `200` and the updated task; `updatedAt` changes. |
| US-U02 | As a caseworker, I want invalid status updates rejected so that task state stays valid. | Missing `status`, unknown `status` values, non-UUID `id`, or malformed JSON return `400` with a structured error body. |
| US-U03 | As a caseworker, I want a clear response when updating a missing task so that I know the operation did not succeed. | `PATCH /tasks/:id/status` for an unknown UUID returns `404` with a structured error body. |

### Task deletion

| ID | Story | Acceptance criteria |
| --- | --- | --- |
| US-D01 | As a caseworker, I want to delete a task so that completed or cancelled work is removed from my list. | `DELETE /tasks/:id` for an existing task returns `204` with an empty body. |
| US-D02 | As a caseworker, I want a clear response when deleting a task that does not exist. | `DELETE /tasks/:id` for an unknown UUID returns `404` with a structured error body. |
| US-D03 | As an API consumer, I want invalid task ids rejected on delete. | `DELETE /tasks/:id` with a non-UUID `id` returns `400` with a structured error body. |

### API documentation and operations

| ID | Story | Acceptance criteria |
| --- | --- | --- |
| US-O01 | As a reviewer, I want documented API endpoints so that I can understand the contract without reading source code. | `GET /api-docs` serves Swagger UI; the OpenAPI document describes all task endpoints, request bodies, response shapes, and error responses. |
| US-O02 | As a platform operator, I want a health endpoint so that deployment health can be checked automatically. | `GET /health` returns `200` and `{ "status": "ok" }`. |
| US-O03 | As a developer, I want consistent error responses across the API so that clients can handle failures uniformly. | Validation, not-found, and unexpected server errors use the same JSON error envelope and appropriate HTTP status codes. |

## API contract

### Resource shape

Task JSON fields in success responses:

- `id` (UUID string)
- `title` (string)
- `description` (string or `null`)
- `status` (`pending` | `in_progress` | `done`)
- `dueDate` (ISO 8601 datetime string)
- `createdAt` (ISO 8601 datetime string)
- `updatedAt` (ISO 8601 datetime string)

### Endpoints

| Method | Path | Success status | Notes |
| --- | --- | --- | --- |
| `POST` | `/tasks` | `201` | Body: `title`, optional `description`, `status`, `dueDate`. |
| `GET` | `/tasks` | `200` | Returns an array of tasks in default sort order. |
| `GET` | `/tasks/:id` | `200` | `:id` must be a UUID. |
| `PATCH` | `/tasks/:id/status` | `200` | Body: `status` only. |
| `DELETE` | `/tasks/:id` | `204` | Empty response body. |
| `GET` | `/api-docs` | `200` | Swagger UI. |
| `GET` | `/health` | `200` | Operational health check. |

### Error envelope

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

### HTTP status mapping

| Condition | Status |
| --- | --- |
| Validation failure (body, params, or business rules) | `400` |
| Task not found | `404` |
| Unhandled server or database failure | `500` |

## Target project layout

```text
hmcts-dev-test-backend-master/
  .env.example
  .gitignore
  package.json
  jest.config.js
  eslint.config.js
  .prettierrc
  .prettierignore
  prisma/
    schema.prisma
    migrations/
  src/
    app.js
    server.js
    config/
      env.js
      swagger.js
    lib/
      prisma.js
    middleware/
      errorHandler.js
      notFoundHandler.js
      validate.js
    routes/
      health.routes.js
      tasks.routes.js
    controllers/
      tasks.controller.js
    services/
      tasks.service.js
    validators/
      tasks.validator.js
  tests/
    integration/
      tasks.routes.test.js
      health.routes.test.js
    unit/
      tasks.service.test.js
      tasks.validator.test.js
    helpers/
      testDb.js
  README.md
```

Routes stay thin: parse input, call the controller, map results to HTTP. Controllers map HTTP to service calls. Services own Prisma access and domain rules. Validators hold Zod schemas only.

## Implementation goals and steps

Each goal ends with a concrete step that can be checked during implementation.

### Goal 1 — Repository bootstrap and runtime wiring

1. Initialise `package.json` with scripts: `start`, `dev`, `test`, `test:watch`, `lint`, `lint:fix`, `format`, `format:check`, `prisma:generate`, `prisma:migrate`, `prisma:deploy`.
2. Add runtime dependencies: `express`, `@prisma/client`, `zod`, `cors`, `swagger-jsdoc`, `swagger-ui-express`.
3. Add development dependencies: `prisma`, `jest`, `supertest`, `nodemon`, `eslint`, `@eslint/js`, `globals`, `prettier`, `eslint-config-prettier`.
4. Configure Jest for the `tests/` directory and a test environment suitable for HTTP and unit tests.
5. Add `eslint.config.js`, `.prettierrc`, and `.prettierignore` for `src/` and `tests/`.
6. Expand `.gitignore` for `node_modules`, `.env`, coverage output, and Prisma local artefacts.
7. Implement `src/config/env.js` to read and validate `PORT`, `DATABASE_URL`, and `CORS_ORIGINS` at startup.
8. Implement `src/lib/prisma.js` as the single Prisma client instance used by services.
9. Implement `src/app.js` with JSON body parsing, CORS, route registration, Swagger UI, not-found handling, and the error handler.
10. Implement `src/server.js` to load env config, create the app, and listen on `PORT`.
11. Add `GET /health` in `src/routes/health.routes.js` returning `{ "status": "ok" }`.

### Goal 2 — Database schema and migrations

1. Define the Prisma `Task` model in `prisma/schema.prisma` with fields: `id`, `title`, `description` (optional), `status`, `dueDate`, `createdAt`, `updatedAt`.
2. Map `status` to the Prisma enum `pending`, `in_progress`, `done`.
3. Set `id` default to `uuid()`, timestamps to `@default(now())` and `@updatedAt` on `updatedAt`.
4. Create the initial migration and document `npx prisma migrate dev` for local setup in the backend README.
5. Document `npx prisma migrate deploy` for Render release execution in the backend README.

### Goal 3 — Validation and error handling

1. Implement Zod schemas in `src/validators/tasks.validator.js` for create body, UUID route param, and status update body.
2. Implement `src/middleware/validate.js` to run schema validation and attach parsed data to the request.
3. Implement `src/middleware/errorHandler.js` to map Zod failures, Prisma not-found patterns, and unexpected errors to the standard error envelope.
4. Implement `src/middleware/notFoundHandler.js` for unknown routes outside `/api-docs` and `/health`.
5. Add unit tests in `tests/unit/tasks.validator.test.js` for accepted and rejected inputs per user stories US-C03, US-R03, and US-U02.

### Goal 4 — Task service layer

1. Implement `src/services/tasks.service.js` with `createTask`, `getTaskById`, `listTasks`, `updateTaskStatus`, and `deleteTask`.
2. Implement `createTask` to persist `title`, optional `description`, `status`, and `dueDate`.
3. Implement `listTasks` with `orderBy` on `dueDate` ascending then `createdAt` ascending.
4. Implement `updateTaskStatus` to change only `status` and rely on Prisma for `updatedAt`.
5. Implement `getTaskById` and `deleteTask` to distinguish missing records (`404`) from successful operations.
6. Add unit tests in `tests/unit/tasks.service.test.js` using a mocked Prisma client for success and not-found paths.

### Goal 5 — HTTP routes and controllers

1. Implement `src/controllers/tasks.controller.js` to translate service results and errors to HTTP status codes and response bodies.
2. Implement `src/routes/tasks.routes.js` for `POST /tasks`, `GET /tasks`, `GET /tasks/:id`, `PATCH /tasks/:id/status`, and `DELETE /tasks/:id`.
3. Wire validation middleware on each route for params and body as defined in the API contract.
4. Add integration tests in `tests/integration/tasks.routes.test.js` covering user stories US-C01 through US-D03 and US-C04 against a test database or isolated test schema through `tests/helpers/testDb.js`.
5. Add integration tests in `tests/integration/health.routes.test.js` for US-O02.

### Goal 6 — OpenAPI documentation

1. Implement `src/config/swagger.js` with OpenAPI metadata, server URLs, and shared schemas for `Task` and the error envelope.
2. Add Swagger JSDoc annotations on task and health route definitions so every endpoint in Goal 5 appears in the generated spec.
3. Mount Swagger UI at `/api-docs` in `src/app.js`.
4. Verify US-O01 manually during implementation: each endpoint, field, and documented error response is visible in Swagger UI.

### Goal 7 — Local configuration and backend README

1. Create `.env.example` with `PORT`, `DATABASE_URL`, and `CORS_ORIGINS` documented inline.
2. Write the backend `README.md` with purpose, stack summary, local setup (install, env, migrate, run, test), environment variables, and API docs URL.
3. Document how to run Jest locally and how integration tests expect database access.
4. Document how to run `npm run lint`, `npm run lint:fix`, `npm run format`, and `npm run format:check`.
5. Keep README author references anonymous per project instructions.

### Goal 8 — Render deployment and CI

1. Add Render-oriented `start` script using `node src/server.js` and release-time `prisma migrate deploy`.
2. Document required Render environment variables: `DATABASE_URL`, `CORS_ORIGINS`, and `PORT` if not supplied by the platform.
3. Add a GitHub Actions workflow that installs dependencies, generates the Prisma client, runs migrations against a CI PostgreSQL service, and executes `npm run lint`, `npm run format:check`, and `npm test`.
4. Add a CI status badge to the backend README once the workflow exists.

## Implementation sequence

Work through goals in order 1 → 8. Goals 3 and 4 can be developed in parallel only after Goal 2 exists; Goal 5 depends on Goals 3 and 4; Goal 6 depends on Goal 5 route definitions; Goals 7 and 8 land once the API and tests are stable.

## Definition of done

The backend is complete for this plan when:

- Every user story in this document has passing automated test coverage or a documented manual check for Swagger UI (US-O01).
- All endpoints match the API contract and error envelope.
- Prisma migrations apply cleanly on a fresh database.
- `.env.example` and the backend README allow a new developer to run the API and tests locally.
- `npm run lint` and `npm run format:check` pass locally and in GitHub Actions.
- GitHub Actions runs the test suite successfully on push and pull request.
- The service runs on Render with PostgreSQL, CORS configured for the frontend origin, and `/health` returning `200`.

## Assumptions recorded for traceability

- The backend challenge requires status-only updates after create; title, description, and due date are immutable after creation unless the challenge scope is changed later.
- Tasks are global records with no caseworker identity in the data model, matching the absence of authentication in the challenge.
- The frontend will consume this API contract as written; cross-origin access is handled through `CORS_ORIGINS` rather than a backend-for-frontend layer.
