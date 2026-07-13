# Swagger Editor App

A Swagger/OpenAPI UI with REST client capabilities, edit OpenAPI specifications and test API endpoints directly in the browser.

## Demo

## YouTube Walkthrough

## Features

- **Swagger Editor** — paste or type OpenAPI/Swagger specs in JSON or YAML with auto-detection and format switching
- **Swagger Viewer** — browse endpoints organized by path and method with full parameter and schema details
- **Try-It-Out** — execute requests through the server (CORS-free), view response status, headers, and body
- **cURL Generator** — generate and copy cURL commands from filled request details
- **Authentication** — sign up / sign in with email confirmation, 2FA, and JWT; private routes protected
- **Schema Persistence** — save your schema to the server; restored automatically on next login
- **History & Analytics** — server-side rendered request history with duration, status, size, and error details
- **Responsive layout** — horizontal/vertical split view based on screen orientation

## Tech Stack

| Layer    | Technology                                              |
|----------|---------------------------------------------------------|
| Frontend | Next.js 16 (App Router), React 19, TypeScript          |
| Styling  | Tailwind CSS 4, HeroUI                                  |
| Editor   | Monaco Editor                                           |
| Backend  | NestJS 11, TypeScript                                   |
| Database | PostgreSQL (Neon)                                       |
| ORM      | Prisma                                                  |
| Auth     | JWT (access + refresh tokens), Argon2, Passport         |
| Email    | Nodemailer + React Email                                |
| Deploy   | Vercel                                                  |

## Getting Started

### Prerequisites

- Node.js ≥ 20
- npm ≥ 10

### Installation

```bash
git clone https://github.com/alexspearsi/swagger-editor-app.git
cd swagger-editor-app
npm install
```

### Environment Variables

Create `apps/backend/.env` with the following (shared dev credentials, ready to use):

```bash
NODE_ENV=development

PORT=3001

ALLOWED_ORIGIN=http://localhost:3000

JWT_SECRET_KEY=secret123123
JWT_SECRET_REFRESH_KEY=secret123123
TOKEN_EXPIRE_TIME=1h
TOKEN_REFRESH_EXPIRE_TIME=24h

RESEND_API_KEY=re_7HxcPH8V_K2G172vhfeJeKkjfASiyvMby
MAIL_FROM=noreply@swaggergo.com

GOOGLE_RECAPTCHA_SECRET_KEY=6Le8K-YsAAAAAM5ut6A3jSK1sis3T8aTDqDh_NVt

DATABASE_URL=postgresql://neondb_owner:npg_ImR0kNgdJif7@ep-withered-dust-alntatn9-pooler.c-3.eu-central-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require
```

Create `apps/frontend/.env` with:

```bash
NEXT_PUBLIC_API_URL=http://localhost:3001
```

> These are the actual working development credentials for this project (shared Neon database,
> Resend email, reCAPTCHA) — no need to request or generate your own to run the app locally.

### Running Locally

```bash
# Run both frontend and backend concurrently
npm run dev
```

- Frontend: http://localhost:3000
- Backend: http://localhost:3001

```bash
# Frontend only
npm run dev:frontend

# Backend only
npm run dev:backend
```

### Other Commands

```bash
# Lint
npm run lint

# Format
npm run format

# Tests
npm run test

# Frontend tests with coverage report
npm run test:coverage
```

## Project Structure

```
swagger-editor-app/
├── apps/
│   ├── frontend/          # Next.js 16 (App Router)
│   │   ├── app/           # Pages and API routes
│   │   ├── components/    # UI components
│   │   └── types/         # TypeScript types
│   └── backend/           # NestJS
│       ├── src/
│       │   ├── auth/      # Authentication (JWT, 2FA, email confirmation)
│       │   ├── user/      # User profile
│       │   ├── schema/    # Saved schemas
│       │   ├── history/   # Request history
│       │   └── prisma/    # Database service
│       └── prisma/        # Schema and migrations
├── .github/
│   └── pull_request_template.md
├── .husky/
├── .gitignore
└── README.md
```

## Team

| Name | Role | GitHub |
|------|------|--------|
| Alex | Developer | [@alexspearsi](https://github.com/alexspearsi) |

## Course

This project was built as part of the [RS School](https://rs.school/) JavaScript/Frontend course.
