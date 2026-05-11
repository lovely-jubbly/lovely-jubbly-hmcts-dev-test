## Stack

**Backend:** Node.js + Express + PostgreSQL
- Deployed on **Render**

**Frontend:** React + Vite
- Deployed on **Netlify**

---

## Architecture Plan

**Backend (Express API)**
- RESTful endpoints for full CRUD on tasks
- Input validation with `express-validator` or `zod`
- Swagger/OpenAPI docs (this alone will impress — it satisfies "Document API endpoints" cleanly)
- Unit tests with **Jest** + **Supertest**
- PostgreSQL via **Prisma** ORM (clean schema, easy migrations)
- **ESLint** and **Prettier** for consistent JavaScript style, with `lint` and `format` npm scripts in the backend app

**Frontend (React + Vite)**
- Clean task dashboard: list, create, edit, delete
- Status filter/badge (e.g. pending / in progress / done)
- Form validation
- Fetch from your deployed backend API
- Use **GOV.UK Frontend** design system — HMCTS literally uses this, and it'll signal cultural fit strongly
- **ESLint** (React + Vite rules) and **Prettier** for consistent JavaScript and JSX style, with `lint` and `format` npm scripts in the frontend app

---

## Deploying to Netlify + GitHub

- Deploy the **frontend to Netlify** — straightforward with Vite
- Deploy the **backend to Render** — supports Node + Postgres with minimal config
- In your README, include: the live Netlify URL, the API base URL, and the GitHub repos

---

## README — Make It Count

This is explicitly called out. Include:
- What the app does and why
- Architecture diagram or description
- How to run locally (backend + frontend separately)
- Environment variables needed (`.env.example`)
- How to run tests
- How to run ESLint and Prettier (`lint`, `lint:fix`, `format`, `format:check`) for backend and frontend
- Live demo links

---

## Quick Wins That Will Impress

| Thing | Why it matters |
|---|---|
| GOV.UK Frontend styling | Shows awareness of HMCTS's actual design system |
| Swagger UI at `/api-docs` | Satisfies "document API endpoints" visually |
| `.env.example` file | Shows production awareness |
| Separate repos for front/back | Mirrors professional team setups |
| CI badge in README (GitHub Actions) | Shows DevOps awareness |
| ESLint + Prettier on backend and frontend | Shows consistent code quality and formatting discipline |

---

## Anonymous GitHub Account — Critical Checks
Since the process is name-blind, make sure:
- No real name in the GitHub profile, commits, or README
- No personal email in git config (check with git config user.email in Cursor's terminal)
- No portfolio links, LinkedIn, or identifying info anywhere in the repo
- Generic README author references (e.g. "the developer" or just omit attribution entirely)

---

## The 250-Word Personal Statement
This is separate from the code itself. You need to write a 250-word technical statement that:
- Describes what you built and why each technical decision was made
- Highlights your personal actions ("I implemented...", "I chose X because...")
- Covers impact: what does the system do well, what best practices did you apply
- References the repo link directly

Since it'll be screened for AI-generated content, you must write this yourself in your own voice. The code challenge is fine to build with Cursor, but the written statement needs to sound like you.
A rough structure for the 250 words:
- What you built (2-3 sentences)
- Backend decisions — language, framework, DB, why (4-5 sentences)
- Frontend decisions — framework, UX approach, GOV.UK styling (3-4 sentences)
- Testing, validation, error handling, ESLint, and Prettier specifics (3-4 sentences)
- Deployment approach — Netlify + Render, what that demonstrates (2-3 sentences)
- Repo link

---
