# Mohammed Yousif — Portfolio

**AI Research Engineer** — Reinforcement Learning · Computer Vision · Autonomous Systems

Live at: [mohammed-tech-innovator.github.io/my-portfolio](https://mohammed-tech-innovator.github.io/my-portfolio)

## About

A terminal-themed single-page portfolio built with React 19 + Tailwind CSS. Features interactive 3D visual effects (Three.js, OGL), a real-time AI chat assistant, blog section, and contact form.

## Features

- **Hero Section** — Typed code animation with profile, CV download, and social links
- **About** — Background, education (University of Khartoum, First Class Honours), achievements
- **Research** — 3 publications with DOI/arXiv links
- **Projects** — 4 featured projects (RL agents, CV autopilot, IoT robotics)
- **Skills** — Categorized tech stack (ML, Programming, Cloud, Specialized)
- **Blog** — Dynamic blog section powered by backend API
- **Chat Agent** — Terminal-style AI assistant (backend-powered, limited to portfolio scope)
- **Visual Effects** — LetterGlitch matrix, Waves animation, Hyperspeed 3D tunnel (Three.js)
- **Contact** — VS Code-themed form with EmailJS integration
- **Dark/Light mode** — Persisted to localStorage

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19.2, Tailwind CSS 3.4, Lucide React |
| 3D Graphics | Three.js 0.167, OGL, postprocessing (Bloom, SMAA) |
| Contact | EmailJS |
| Backend API | FastAPI, SQLite, aiosqlite (async) |
| Reverse Proxy | Nginx |
| Deployment | GitHub Pages (static) + self-hosted backend |

## Backend API

The backend provides:

- `POST /api/chat` — Chat with the portfolio assistant (scoped to portfolio info)
- `GET /api/chat/messages` — Retrieve all chat messages
- `GET /api/chat/stats` — Chat statistics (sessions, topics, daily activity)
- `GET /api/chat/sessions` — List all chat sessions
- `GET/POST/PUT/DELETE /api/blog` — Blog CRUD
- `POST /api/contact` — Contact form submissions
- `GET /api/contact/submissions` — List submissions
- `GET /api/health` — Health check

## Development

```bash
# Frontend
npm install
npm start          # Dev server on port 3000

# Backend
cd /var/www/portfolio-backend
pip install fastapi uvicorn aiosqlite
uvicorn main:app --host 0.0.0.0 --port 8001

# Production build
npm run build
```

## License

MIT — Mohammed Yousif
