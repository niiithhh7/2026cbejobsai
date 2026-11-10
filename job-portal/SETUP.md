# Coimbatore Jobs — Setup

## 1. Database
```bash
mysql -u root -p < schema.sql
```
This creates the `job_portal` database, all tables, and seed employers/jobs.

## 2. Server
```bash
cd server
npm install
cp ../.env.example .env   # edit with your MySQL password, JWT secret, OPENROUTER_API_KEY
npm run dev               # runs on http://localhost:5000
```

Create the default admin account (run once):
```bash
curl -X POST http://localhost:5000/api/auth/admin/bootstrap
```
Admin login: `admin@coimbatorejobs.in` / `admin123`

Get a free OpenRouter API key at https://openrouter.ai/keys and put it in `.env` as `OPENROUTER_API_KEY`.

## 3. Client
```bash
cd client
npm install
npm run dev   # runs on http://localhost:5173, proxies /api to the server
```

Open http://localhost:5173.

## Notes
- Job seeker signup/login: `/signup`, `/login`. Admin: `/admin/login`.
- "Upload your CV" on the home page opens the AI resume analyzer modal (PDF only; extracts text with `pdf-parse`, truncates to 3000 chars, sends one request to OpenRouter per upload).
- Admin dashboard (`/admin/dashboard`) can post jobs and view/accept/reject applicants per job.
