# HMCTS Task Management

Caseworker task app with a React frontend and Express API.

## Live demo

| App | URL |
| --- | --- |
| Frontend | `https://hmcts-dev-test.netlify.app` |
| API | `https://lovely-jubbly-hmcts-dev-test-backend.onrender.com` |
| API docs | `https://lovely-jubbly-hmcts-dev-test-backend.onrender.com/api-docs` |

## Run locally

You need Node.js 20+, npm, and Docker.

1. Start PostgreSQL from the repository root:

```bash
docker compose up -d
```

2. Start the API in one terminal:

```bash
cd hmcts-dev-test-backend-master
npm install
cp .env.example .env
npx prisma migrate dev
npm run dev
```

3. Start the frontend in a second terminal:

```bash
cd hmcts-dev-test-frontend-master
npm install
cp .env.example .env
npm run dev
```

4. Open `http://localhost:5173`.

Stop PostgreSQL when you are finished:

```bash
docker compose down
```

## More detail

- Backend: `hmcts-dev-test-backend-master/README.md`
- Frontend: `hmcts-dev-test-frontend-master/README.md`
