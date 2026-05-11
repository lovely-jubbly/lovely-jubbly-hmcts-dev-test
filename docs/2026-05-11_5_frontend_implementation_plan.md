# HMCTS Task Management – Frontend Plan

## Overview

This plan describes the **frontend work** for the HMCTS caseworker task application: a single-page React app built with Vite that creates, lists, updates status for, and deletes tasks against the deployed backend API, with GOV.UK Frontend styling, client-side validation, unit tests, linting, formatting, and deployment to Netlify.

The work is defined by [2026-05-11_1_challenge_details.md](./2026-05-11_1_challenge_details.md) and [2026-05-11_2_initial_project_instructions.md](./2026-05-11_2_initial_project_instructions.md). The frontend consumes the API contract delivered in [2026-05-11_3_backend_implementation_plan.md](./2026-05-11_3_backend_implementation_plan.md) and documented in [2026-05-11_4_backend_implementation_outcome.md](./2026-05-11_4_backend_implementation_outcome.md). The frontend starter folder contains licence, ignore rules, and no application code yet, so this plan establishes the initial structure and conventions for the app.

---

## Principles

1. **Follow established frontend patterns:** One page, one API module, small presentational components, Zod validation at the form boundary, and a single error display pattern for API failures.
2. **Keep it simple:** No authentication, routing, global state library, pagination, search, or post-create edits to title, description, or due date. Status is the only mutable field after create.
3. **Deliver a complete baseline:** GOV.UK Frontend styling, Vitest unit tests, ESLint + Prettier, `.env.example`, frontend README, GitHub Actions for lint, format check, and tests, and Netlify deployment wired to the Render API.

---

## Current State (Relevant Pieces)

- **Repository:** `hmcts-dev-test-frontend-master/` contains licence and `.gitignore` only. No `package.json`, Vite config, or application code yet.
- **Backend API base URL (production):** `https://lovely-jubbly-hmcts-dev-test-backend.onrender.com`
- **Backend API base URL (local):** `http://localhost:3000`
- **Local dev server port:** `5173` (Vite default). Backend `CORS_ORIGINS` already includes `http://localhost:5173`.
- **Task identity:** UUID strings from the API.
- **Status values:** `pending`, `in_progress`, `done`.
- **Due date/time:** ISO 8601 datetime strings in API requests and responses.
- **Description:** Optional on create; `null` in API responses when unset.
- **List ordering:** Backend returns tasks ordered by `dueDate` ascending, then `createdAt` ascending. The frontend preserves that order and applies status filtering in the browser only.
- **Post-create updates:** `PATCH /tasks/:id/status` with `status` only. Title, description, and due date are immutable in the UI after a task is created.
- **Error envelope:** `{ "error": { "message": string, "details": string[] } }` with HTTP `400`, `404`, or `500`.

---

## Contract: Frontend Behaviour

### Pages and navigation

- One route at `/` with no client-side router.
- The page title is **HMCTS Task Management**.
- Sections on the page, in order: page header, create-task form, status filter, task list, and page-level error banner.

### API usage

| UI action | API call | Success handling |
| --- | --- | --- |
| Load tasks | `GET /tasks` | Store the returned array in page state and render the list. |
| Create task | `POST /tasks` | On `201`, clear the form, reload the task list, and clear page-level errors. |
| Change status | `PATCH /tasks/:id/status` | On `200`, replace the matching task in page state and clear page-level errors. |
| Delete task | `DELETE /tasks/:id` | On `204`, remove the task from page state and clear page-level errors. |

The frontend does not call `GET /tasks/:id`. Task details are shown from list data.

### Task fields in the UI

| Field | Create form | List display | Editable after create |
| --- | --- | --- | --- |
| Title | Required text input | Shown as the primary row heading | No |
| Description | Optional textarea | Shown as body text, or **No description** when `null` | No |
| Status | Required select | GOV.UK tag with human-readable label | Yes, via per-row status select |
| Due date/time | Required `datetime-local` input | Shown in `en-GB` locale with date and time | No |
| Created / updated | Not collected | Shown as secondary metadata on each row | No |

Status labels in the UI:

- `pending` → **Pending**
- `in_progress` → **In progress**
- `done` → **Done**

### Status filter

- Filter control values: **All**, **Pending**, **In progress**, **Done**.
- **All** shows every task returned by `GET /tasks`.
- Other values show only tasks with the matching `status`.
- Filtering runs in the browser on the loaded task array. The API is not called again when the filter changes.

### Validation and errors

- Create-form validation runs in the browser before `POST /tasks`.
- Reject empty or whitespace-only title, missing status, missing due date/time, and unknown status values.
- Convert the `datetime-local` value to an ISO 8601 string before the create request.
- Omit `description` from the request body when the field is blank.
- Show field-level validation messages on the create form.
- Show API failures in one page-level error banner using `error.message` and each entry in `error.details`.
- Show a **Loading tasks...** message while the initial list request is in flight.
- Show **No tasks yet. Create a task using the form above.** when the filtered list is empty and loading has finished.

### Delete confirmation

- Show a browser confirmation dialog with the text **Delete this task?** before calling `DELETE /tasks/:id`.

### Accessibility and styling

- Use GOV.UK Frontend classes for page layout, typography, form fields, buttons, tags, inset text, and error summary styling.
- Associate form labels with inputs.
- Use semantic headings: one `h1` for the page title and `h2` for **Create a task** and **Tasks**.

---

## User Stories and Implementation Steps

| ID | Story | Acceptance criteria | Implementation steps |
| --- | --- | --- | --- |
| US-F01 | Load tasks on page open. | Opening `/` triggers `GET /tasks`, shows a loading message until the request completes, then renders the task list in backend sort order. | Add `src/api/tasks.js` with `listTasks()`. In `src/App.jsx`, load tasks in a `useEffect` on mount, store them in state, and pass them to `TaskList`. |
| US-F02 | Show an empty task list. | When `GET /tasks` returns `[]`, the page shows the empty-state message after loading finishes. | In `TaskList`, render the empty-state inset text when `tasks.length === 0` and `isLoading` is false. |
| US-F03 | Create a task. | Submitting valid create-form data calls `POST /tasks`, clears the form on success, reloads the list, and shows the new task. | Add `createTask(payload)` in `src/api/tasks.js`. Build `TaskForm` with controlled inputs and a submit handler in `App` that calls `createTask`, then reloads tasks. |
| US-F04 | Validate create input in the browser. | Invalid title, status, or due date/time blocks submit and shows field-level messages without calling the API. | Add `src/validators/taskForm.validator.js` with Zod schemas. Call the validator in `TaskForm` before submit and render field errors next to the inputs. |
| US-F05 | Send optional description on create only when provided. | A blank description is omitted from `POST /tasks`; a non-blank description is sent and shown in the list after reload. | Trim description in `TaskForm`; include `description` in the request body only when the trimmed value is non-empty. |
| US-F06 | Display task details in the list. | Each task row shows title, description or **No description**, status tag, due date/time, created time, and updated time. | Implement `TaskItem` to render all task fields with `en-GB` formatting via `src/utils/date.js`. |
| US-F07 | Filter tasks by status. | Choosing a filter value updates the visible rows without a new API request. **All** shows every loaded task. | Add `StatusFilter` with the four filter values. In `App`, store `statusFilter` state and pass a filtered array from `tasks` into `TaskList`. |
| US-F08 | Update task status. | Changing a row status select calls `PATCH /tasks/:id/status`, updates that row on success, and leaves title, description, and due date unchanged. | Add `updateTaskStatus(id, status)` in `src/api/tasks.js`. In `TaskItem`, call it from the status-select `onChange` handler and update page state with the returned task. |
| US-F09 | Delete a task. | Confirming deletion calls `DELETE /tasks/:id` and removes the row on `204`. | Add `deleteTask(id)` in `src/api/tasks.js`. In `TaskItem`, call `window.confirm`, then `deleteTask`, then remove the task from page state. |
| US-F10 | Show API errors consistently. | Failed API calls show `error.message` and each `error.details` entry in the page-level banner. | Add `src/api/http.js` to parse JSON error bodies. In `App`, store `apiError` state and render `ErrorBanner` above the form and list. |
| US-F11 | Use GOV.UK Frontend styling. | The page uses GOV.UK layout, form, button, tag, and inset classes. | Install `govuk-frontend`, import its CSS in `src/main.jsx`, and apply GOV.UK classes in `App`, `TaskForm`, `TaskList`, `TaskItem`, `StatusFilter`, and `ErrorBanner`. |
| US-F12 | Configure API base URL by environment. | Local development calls `http://localhost:3000`; production calls the Render API URL from `VITE_API_BASE_URL`. | Add `src/config/env.js` that reads `import.meta.env.VITE_API_BASE_URL` with local fallback `http://localhost:3000`. Document the variable in `.env.example`. |
| US-F13 | Run unit tests for validation and core UI logic. | `npm test` runs Vitest unit tests for the create-form validator, date helpers, and the main user flows with mocked `fetch`. | Add `vitest.config.js`, `src/test/setup.js`, `tests/unit/taskForm.validator.test.js`, `tests/unit/date.test.js`, and component tests for create, filter, status update, delete, and API error display. |
| US-F14 | Enforce linting and formatting. | `npm run lint`, `npm run lint:fix`, `npm run format`, and `npm run format:check` work in the frontend app. | Add `eslint.config.js`, `.prettierrc`, `.prettierignore`, and matching npm scripts in `package.json`. |
| US-F15 | Deploy to Netlify and allow browser access to the API. | Netlify serves the built app, production uses the Render API URL, and Render `CORS_ORIGINS` includes the Netlify site origin. | Add `netlify.toml` with `npm run build` and `dist` publish settings plus SPA fallback. Set `VITE_API_BASE_URL` in Netlify. Append the Netlify origin to backend `CORS_ORIGINS` on Render. |
| US-F16 | Document local setup and delivery. | The frontend README explains purpose, stack, env vars, scripts, tests, lint/format commands, Netlify deployment, and anonymous author references. | Write `hmcts-dev-test-frontend-master/README.md` with local run steps, `VITE_API_BASE_URL`, quality commands, and the live Netlify URL once deployed. |
| US-F17 | Run frontend checks in GitHub Actions. | Push and pull request runs install, lint, format check, and tests for the frontend app. | Add `.github/workflows/frontend-ci.yml` with `working-directory: hmcts-dev-test-frontend-master` and a CI badge in the frontend README. |
| US-F18 | Publish the submission entry point after delivery. | After the frontend is built, deployed, and tested against the live API, the repository root `README.md` gives reviewers the GitHub repo URL, live Netlify URL, live API base URL, local run steps for both apps, and quality commands. | After US-F15 verification passes, add or update the repository root `README.md` with the final URLs and pointers to `hmcts-dev-test-backend-master/README.md` and `hmcts-dev-test-frontend-master/README.md`. |

---

## Implementation Plan (Minimal Changes)

### 1. Repository bootstrap and Vite wiring

- **Files:** `package.json`, `vite.config.js`, `index.html`, `src/main.jsx`, `src/App.jsx`, `src/index.css`, `.env.example`, `README.md`.
- **Scripts:** `dev`, `build`, `preview`, `test`, `test:watch`, `lint`, `lint:fix`, `format`, `format:check`.
- **Runtime dependencies:** `react`, `react-dom`, `govuk-frontend`, `zod`.
- **Development dependencies:** `vite`, `@vitejs/plugin-react`, `vitest`, `jsdom`, `@testing-library/react`, `@testing-library/jest-dom`, `@testing-library/user-event`, `eslint`, `@eslint/js`, `eslint-plugin-react`, `eslint-plugin-react-hooks`, `eslint-plugin-react-refresh`, `globals`, `prettier`, `eslint-config-prettier`.
- **App wiring:** `index.html` mounts `src/main.jsx`. `src/main.jsx` imports GOV.UK Frontend CSS, renders `App` inside `React.StrictMode`, and imports `src/index.css` for app-specific layout spacing only. `src/App.jsx` owns task list state, filter state, loading state, API error state, and handlers for load, create, status update, and delete.

### 2. Configuration and API client

- **Files:** `src/config/env.js`, `src/api/http.js`, `src/api/tasks.js`, `tests/unit/tasks.api.test.js`.
- **Config:** `src/config/env.js` exports `apiBaseUrl` from `VITE_API_BASE_URL`, defaulting to `http://localhost:3000` when unset.
- **HTTP helper:** `src/api/http.js` wraps `fetch`, prefixes `apiBaseUrl`, sets `Content-Type: application/json` for JSON bodies, parses success JSON, and throws a typed error using the backend error envelope on non-success responses.
- **Task API:** `listTasks`, `createTask`, `updateTaskStatus`, and `deleteTask` call `/tasks`, `/tasks/:id/status`, and `/tasks/:id` with the methods defined in the backend contract.
- **Tests:** Mock `fetch` in `tests/unit/tasks.api.test.js` for success and error parsing.

### 3. Validation and date utilities

- **Files:** `src/validators/taskForm.validator.js`, `src/utils/date.js`, `tests/unit/taskForm.validator.test.js`, `tests/unit/date.test.js`.
- **Validator:** Zod schema for create input: required trimmed `title`, optional trimmed `description`, enum `status`, and required due date/time converted to ISO 8601.
- **Date helpers:** `toIsoDateTime` converts `datetime-local` input to ISO 8601; `formatDateTime` renders API timestamps for list display in `en-GB`.
- **Tests:** Unit tests cover accepted and rejected create input and date conversion/formatting.

### 4. UI components

- **Files:** `src/components/ErrorBanner.jsx`, `src/components/StatusFilter.jsx`, `src/components/TaskForm.jsx`, `src/components/TaskList.jsx`, `src/components/TaskItem.jsx`, `tests/components/TaskForm.test.jsx`, `tests/components/TaskList.test.jsx`.
- **ErrorBanner:** Renders page-level API errors from `error.message` and `error.details`.
- **StatusFilter:** Renders the four filter options and reports the selected value to `App`.
- **TaskForm:** Controlled inputs for title, description, status, and due date/time; client validation; submit and field-error display.
- **TaskList:** Renders loading text, empty-state inset text, or a list of `TaskItem` rows.
- **TaskItem:** Read-only task fields, status tag, status-select for `PATCH /tasks/:id/status`, and delete button with confirmation.
- **Tests:** Component tests mock the API module and cover create success, validation failure, filter behaviour, status update, delete, and API error banner display.

### 5. README, deployment, and CI

- **Files:** `netlify.toml`, `.github/workflows/frontend-ci.yml`, `hmcts-dev-test-frontend-master/README.md`.
- **README:** Purpose, stack summary, local setup, `VITE_API_BASE_URL`, `npm run dev`, `npm test`, lint and format commands, Netlify deployment notes, live demo URL, and anonymous author references.
- **Netlify:** Build command `npm run build`; publish directory `dist`; SPA redirect `/*` → `/index.html`; environment variable `VITE_API_BASE_URL=https://lovely-jubbly-hmcts-dev-test-backend.onrender.com`.
- **Render CORS:** Append the Netlify site origin to backend `CORS_ORIGINS` before verifying production create, list, status update, and delete from the deployed frontend.
- **CI:** Install dependencies with `npm ci`, then run `npm run lint`, `npm run format:check`, and `npm test`. Add a frontend CI badge to the frontend README once the workflow exists.

### 6. Consistency checklist

- Create, list, status update, and delete in the UI map to the backend endpoints and response shapes without extra fields or update paths.
- User stories US-F01 through US-F18 have passing automated coverage or a documented manual check for Netlify deployment, Render CORS (US-F15), and the repository root submission README (US-F18).
- `.env.example` and the frontend README allow a new developer to run the app, lint, format checks, and tests locally against the local or deployed API.
- `npm run lint` and `npm run format:check` pass locally and in GitHub Actions.
- The Netlify site loads tasks from the Render API, creates tasks, updates status, deletes tasks, filters by status, and shows API validation errors from the backend envelope.

### 7. Greenfield delivery

- This is the first frontend release. No existing UI or client code depends on prior behaviour.
- The frontend talks directly to the Express API. Cross-origin access is handled through backend `CORS_ORIGINS`, not a frontend proxy layer.

### 8. Submission README

- **File:** repository root `README.md`.
- **When:** Complete this step after the frontend is built, deployed to Netlify, tested against the live Render API, and backend `CORS_ORIGINS` includes the Netlify origin.
- **Content:** Repository purpose, GitHub repository URL, live Netlify frontend URL, live API base URL, Swagger UI URL, local setup steps for backend and frontend, test commands, lint and format commands, and anonymous author references.
- **Cross-links:** Point to `hmcts-dev-test-backend-master/README.md` and `hmcts-dev-test-frontend-master/README.md` for app-specific setup detail.
- **Verification:** US-F18 is complete when the root `README.md` contains the final live URLs and matches the deployed, tested system.

---

## Out of Scope (This Plan)

- Authentication, authorisation, and per-user task ownership.
- Client-side routing and a dedicated task detail page.
- Pagination, search, server-side filtering, and reordering beyond the backend default list order.
- Editing title, description, or due date after task creation.
- End-to-end browser automation outside Vitest and React Testing Library unit tests.
- Backend API changes, Swagger updates, and Render database work.
- The 250-word personal statement.

---

## Summary

| Item | Action |
| --- | --- |
| Bootstrap | Vite React app, GOV.UK CSS import, `src/App.jsx`, env config, npm scripts |
| API client | `src/api/http.js`, `src/api/tasks.js`, backend error-envelope handling |
| Validation | Zod create-form schema, date helpers, unit tests |
| UI | Single-page dashboard with create form, status filter, task list, status update, delete confirmation |
| Quality | Vitest + Testing Library, ESLint, Prettier, GitHub Actions |
| Deploy | Netlify build of `dist`, `VITE_API_BASE_URL`, Render `CORS_ORIGINS` update |
| Docs | Frontend README, `.env.example`, CI badge |
| Submission | Repository root `README.md` with live URLs and links to both app READMEs after deploy and verification |
| Reuse | React + Vite JavaScript stack, GOV.UK Frontend, Zod at the form boundary, thin API module |
