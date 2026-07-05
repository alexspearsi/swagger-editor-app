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

Copy the example files and fill in the values:

```bash
cp apps/backend/.env.example apps/backend/.env
cp apps/frontend/.env.example apps/frontend/.env
```

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
