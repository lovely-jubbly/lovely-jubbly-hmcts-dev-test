# HMCTS Task Management Frontend

![Frontend CI](https://github.com/lovely-jubbly/lovely-jubbly-hmcts-dev-test/actions/workflows/frontend-ci.yml/badge.svg)

React app for caseworker task management, built with Vite and GOV.UK Frontend.

## Stack

- React
- Vite
- GOV.UK Frontend
- Zod
- Vitest and Testing Library
- ESLint and Prettier

## Local setup

1. Install dependencies with `npm install`.
2. Copy `.env.example` to `.env` and set the environment variables below.
3. Start the app with `npm run dev`.
4. Open `http://localhost:5173`.

The app expects the backend API to be running locally on port `3000` unless `VITE_API_BASE_URL` points elsewhere.

## Environment variables

| Variable            | Purpose                         |
| ------------------- | ------------------------------- |
| `VITE_API_BASE_URL` | Base URL for the HMCTS task API |

## Scripts

- `npm run dev` — start the Vite dev server
- `npm run build` — build the production bundle
- `npm run preview` — preview the production build locally
- `npm test` — run tests
- `npm run test:watch` — re-run tests when files change
- `npm run lint` — run ESLint
- `npm run lint:fix` — fix ESLint issues
- `npm run format` — format files with Prettier
- `npm run format:check` — check formatting with Prettier

## Live deployment

| Item | URL |
| --- | --- |
| Frontend | `https://hmcts-dev-test.netlify.app` |
| API base URL | `https://lovely-jubbly-hmcts-dev-test-backend.onrender.com` |

## Netlify deployment

Use `hmcts-dev-test-frontend-master` as the Netlify site root directory.

- Build command: `npm run build`
- Publish directory: `dist`
- SPA redirect: `/*` to `/index.html`
- Production branch: `main`

Set `VITE_API_BASE_URL` to `https://lovely-jubbly-hmcts-dev-test-backend.onrender.com`.

The Render backend `CORS_ORIGINS` value must include `https://hmcts-dev-test.netlify.app` for the deployed frontend to call the API.
