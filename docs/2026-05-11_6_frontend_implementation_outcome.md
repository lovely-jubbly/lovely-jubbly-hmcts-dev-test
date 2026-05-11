# HMCTS Task Management – Frontend Implementation Outcome

## Overview

The frontend work described in [2026-05-11_5_frontend_implementation_plan.md](./2026-05-11_5_frontend_implementation_plan.md) is complete. The app in `hmcts-dev-test-frontend-master/` is a single-page React client built with Vite and GOV.UK Frontend. It creates, lists, updates status for, and deletes tasks against the Render API, with client-side validation, unit and component tests, linting, formatting, GitHub Actions, and deployment to Netlify.

---

## Delivered scope

- Single-page task dashboard at `/` with create form, status filter, task table, and page-level API error banner.
- API client for `GET /tasks`, `POST /tasks`, `PATCH /tasks/:id/status`, and `DELETE /tasks/:id`.
- Zod validation for create-form input and date helpers for `datetime-local` and `en-GB` display.
- GOV.UK Frontend styling across page layout, form fields, table, buttons, and error summary.
- Vitest unit tests for the API client, validator, and date helpers.
- React Testing Library component tests for create, filter, status update, delete, and API error display.
- ESLint, Prettier, `.env.example`, and a frontend `README.md`.
- GitHub Actions workflow for lint, format check, and tests.
- Netlify deployment with `VITE_API_BASE_URL` pointed at the Render API.
- Render `CORS_ORIGINS` updated to include the Netlify site origin.

The following remain out of scope, as planned: authentication, client-side routing, pagination, search, server-side filtering, post-create edits to title, description, or due date, end-to-end browser automation, backend changes, and the 250-word personal statement.

---

## Stack and structure

| Area | Choice |
| --- | --- |
| Runtime | Node.js 20 for local tooling and CI |
| Language | JavaScript (ES modules) |
| UI | React 19 |
| Build | Vite 6 |
| Styling | GOV.UK Frontend |
| Validation | Zod |
| Tests | Vitest + Testing Library |
| Quality | ESLint 9 flat config, Prettier |

Application code lives under `src/` with a thin API module, form validator, date helpers, page container in `App.jsx`, and presentational components under `src/components/`. `src/main.jsx` mounts the app and imports GOV.UK CSS.

---

## UI behaviour delivered

| UI action | API call | Success handling |
| --- | --- | --- |
| Load tasks | `GET /tasks` | Tasks stored in page state and shown in the task table. |
| Create task | `POST /tasks` | Form clears, list reloads, page-level errors clear. |
| Change status | `PATCH /tasks/:id/status` | Matching row updates from the API response. |
| Delete task | `DELETE /tasks/:id` | Row removed after browser confirmation. |

Status filter values are **All**, **Pending**, **In progress**, and **Done**. Filtering runs in the browser on the loaded task list. Create-form validation runs before `POST /tasks`. API failures render `error.message` and each `error.details` entry in the page-level banner.

The task list uses a GOV.UK table with one row per task. Columns are task title and description, due date, created and updated timestamps, status select, and delete action.

---

## Live deployment

| Item | Value |
| --- | --- |
| Frontend URL | `https://hmcts-dev-test.netlify.app` |
| API base URL | `https://lovely-jubbly-hmcts-dev-test-backend.onrender.com` |
| Repository | `https://github.com/lovely-jubbly/lovely-jubbly-hmcts-dev-test` |

Netlify settings in use:

- Site root directory: `hmcts-dev-test-frontend-master`
- Build command: `npm run build`
- Publish directory: `dist`
- Production branch: `main`
- Environment variable: `VITE_API_BASE_URL=https://lovely-jubbly-hmcts-dev-test-backend.onrender.com`

Render `CORS_ORIGINS` includes `http://localhost:5173` and `https://hmcts-dev-test.netlify.app`.

---

## Verification outcome

| Check | Result |
| --- | --- |
| Live Netlify create, list, status update, and delete against Render | Verified manually on `https://hmcts-dev-test.netlify.app` |
| Status filter and create-form validation in the browser | Verified manually on the deployed site |
| API validation errors from the backend envelope | Verified manually on the deployed site |
| `npm run lint` and `npm run format:check` | Pass locally |
| `npm test` | Pass locally |
| GitHub Actions `Frontend CI` | Workflow added for lint, format check, and tests on push and pull request |
| Netlify deploy on push to `main` | Git-linked continuous deployment configured for the repository |

---

## Local development and tests

Setup is documented in the repository root `README.md` and `hmcts-dev-test-frontend-master/README.md`.

1. `docker compose up -d` from the repository root
2. Start the API from `hmcts-dev-test-backend-master`
3. `npm install`
4. Copy `.env.example` to `.env`
5. `npm run dev`
6. Open `http://localhost:5173`

Run `npm test` for unit and component coverage. Use `npm run lint`, `npm run format:check`, and `npm run test:watch` as documented in the frontend README.

---

## Follow-up before submission

- Record the live frontend URL and API base URL in the repository root `README.md` and submission materials required by the challenge.

---

## Related documents

- [2026-05-11_1_challenge_details.md](./2026-05-11_1_challenge_details.md)
- [2026-05-11_2_initial_project_instructions.md](./2026-05-11_2_initial_project_instructions.md)
- [2026-05-11_3_backend_implementation_plan.md](./2026-05-11_3_backend_implementation_plan.md)
- [2026-05-11_4_backend_implementation_outcome.md](./2026-05-11_4_backend_implementation_outcome.md)
- [2026-05-11_5_frontend_implementation_plan.md](./2026-05-11_5_frontend_implementation_plan.md)
