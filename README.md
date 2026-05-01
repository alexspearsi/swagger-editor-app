# Swagger Editor App

A Swagger/OpenAPI UI with REST client capabilities — edit OpenAPI specifications and test API endpoints directly in the browser.

## Demo

<!-- Add deployed app URL here -->
> 🔗 [Live Demo](https://swagger-editor-app.vercel.app)

## YouTube Walkthrough

<!-- Add video link here -->
> 📹 [Video Review](https://youtube.com/)

---

## Features

- **Swagger Editor** — paste or type OpenAPI/Swagger specs in JSON or YAML with auto-detection, validation, and format switching
- **Swagger Viewer** — browse endpoints organized by path and method with full parameter and schema details
- **Try-It-Out** — execute requests through the server (CORS-free), view response status, headers, and body
- **cURL Generator** — generate and copy cURL commands from filled request details
- **Authentication** — sign up / sign in with JWT; private routes protected
- **History & Analytics** — server-side rendered request history with duration, status, size, and error details
- **i18n** — English and Russian language support
- **Responsive layout** — horizontal/vertical split view based on screen orientation

## Tech Stack

| Layer    | Technology                          |
|----------|-------------------------------------|
| Frontend | React Router 7 (Framework mode)     |
| Backend  | NestJS                              |
| Database | PostgreSQL (Neon)                   |
| ORM      | Prisma                              |
| Deploy   | Vercel                              |

## Getting Started

### Prerequisites

- Node.js ≥ 20
- npm ≥ 10

### Installation

```bash
git clone https://github.com/<your-username>/swagger-editor-app.git
cd swagger-editor-app
npm install
```

### Environment Variables

Copy the example files and fill in the values:

```bash
cp apps/frontend/.env.example apps/frontend/.env
cp apps/backend/.env.example apps/backend/.env
```

**`apps/backend/.env`**

```env
DATABASE_URL=postgresql://...
JWT_SECRET=your_jwt_secret
```

**`apps/frontend/.env`**

```env
BACKEND_URL=http://localhost:3001
```

### Running Locally

```bash
# Run both frontend and backend
npm run dev

# Frontend only (http://localhost:5173)
npm run dev --workspace=apps/frontend

# Backend only (http://localhost:3001)
npm run dev --workspace=apps/backend
```

### Running Tests

```bash
npm run test
npm run test:coverage
```

## Project Structure

```
swagger-editor-app/
├── apps/
│   ├── frontend/   # React Router 7 (framework mode)
│   └── backend/    # NestJS
├── .github/
│   └── pull_request_template.md
├── .gitignore
└── README.md
```

## Team

| Name | Role | GitHub |
|------|------|--------|
| Alex | Developer | [@rosenbaum-dv](https://github.com/rosenbaum-dv) |

## Course

This project was built as part of the [RS School](https://rs.school/) JavaScript/Frontend course.
