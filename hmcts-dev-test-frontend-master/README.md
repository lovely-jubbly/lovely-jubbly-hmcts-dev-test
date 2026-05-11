# HMCTS Task Management Frontend

![Frontend CI](https://github.com/lovely-jubbly/lovely-jubbly-hmcts-dev-test/actions/workflows/frontend-ci.yml/badge.svg)

React app for caseworker tasks, built with Vite and GOV.UK Frontend.

## Run locally

Start PostgreSQL and the API first. Steps are in the repository root `README.md`.

Then run:

```bash
npm install
cp .env.example .env
npm run dev
```

Open `http://localhost:5173`.

## Environment variables

| Variable | Purpose |
| --- | --- |
| `VITE_API_BASE_URL` | API base URL. Defaults to `http://localhost:3000` for local development |

## Tests

```bash
npm test
```

## Live app

| Item | URL |
| --- | --- |
| Frontend | `https://hmcts-dev-test.netlify.app` |
| API | `https://lovely-jubbly-hmcts-dev-test-backend.onrender.com` |

Full local and live setup: repository root `README.md`.
