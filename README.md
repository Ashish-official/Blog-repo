# Blogging Web App

A full-stack blogging application with authentication, public post reading, an admin panel, CRUD management, Google GPT test ad placements, and deployment configuration.

## Tech Stack

- Frontend: React, Vite
- Backend: Node.js, Express
- Database: MongoDB
- Auth: JWT
- Ads: Google Publisher Tag test ads
- Deployment: Vercel or VPS with Nginx and PM2

## Project Structure

```text
backend/backend
frontend/frontend/blogpost
DEPLOYMENT.md
```

## Local Setup

Backend:

```bash
cd backend/backend
npm install
npm run dev
```

Frontend:

```bash
cd frontend/frontend/blogpost
npm install
npm run dev
```

## Environment

Backend environment variables are documented in:

```text
backend/backend/.env.example
```

Frontend environment variables are documented in:

```text
frontend/frontend/blogpost/.env.example
```

## Deployment

See:

```text
DEPLOYMENT.md
```
