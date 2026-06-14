"""
Portfolio Backend API — FastAPI + PostgreSQL (asyncpg)
Serves: chat bot (limited scope), blog, contact, statistics
"""
import json
import os
import time
from contextlib import asynccontextmanager
from typing import Optional

import asyncpg
from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://mohammed@localhost/portfolio")

# ── Mohammed's Portfolio Knowledge Base ──────────────────────────

PORTFOLIO_KB = {
    "about": (
        "Mohammed Yousif is an AI Research Engineer specializing in Reinforcement Learning, "
        "Computer Vision, and Autonomous Systems. He holds a B.Sc. in Electrical & Electronics "
        "Engineering from the University of Khartoum with First Class Honours (GPA 8.91/10.0). "
        "He is based in Abu Dhabi, UAE."
    ),
    "education": (
        "University of Khartoum — B.Sc. Electrical & Electronics Engineering, GPA 8.91/10.0, "
        "First Class Honours. Currently pursuing MPhil in Data Intensive Science at the "
        "University of Cambridge (conditional offer, Mastercard Foundation Scholar)."
    ),
    "research": (
        "3 publications:\n"
        "1. SHA-ZA: Advanced RL for Othello Mastery Using PPO (Feb 2025, doi:10.18178/ijml.2025.15.1.1173)\n"
        "2. Enhancing Generalization in Audio Deepfake Detection (Apr 2024, arXiv:2404.13008)\n"
        "3. Design and Implementation of a CV-Based Autopilot in Simulation (Aug 2023)"
    ),
    "projects": (
        "4 major projects:\n"
        "1. Hierarchical RL Agent for Cost-Efficient Document Processing (Oct 2025) — PPO + GRPO, "
        "POMDP formulation, contrastive learning vision encoders\n"
        "2. OthelloSHAZA: Mastering Othello via Self-Play and RL (Feb 2024) — PPO beats MiniMax depth 12\n"
        "3. Computer-Vision Autopilot for Autonomous Vehicles (Apr 2022) — YOLOv4 + U-Net, Raspberry Pi car\n"
        "4. Euler: IoT Surgery Robot (Aug 2018) — 4-DOF surgical robot prototype, C++/Flask/Arduino"
    ),
    "skills": (
        "ML & AI: PyTorch, TensorFlow, Keras, Hugging Face, scikit-learn, OpenCV, RL, RLHF, QLoRA\n"
        "Programming: Python, C++, C, Java, JavaScript, Go, SQL\n"
        "Cloud: GCP, Vertex AI, Docker, Linux, Bash, Git\n"
        "Specialized: Computer Vision, NLP, Robotics, FPGA (VHDL/Verilog), Embedded Systems"
    ),
    "contact": (
        "Email: mohammed.yah.yousif@gmail.com\n"
        "GitHub: github.com/mohammed-tech-innovator\n"
        "LinkedIn: linkedin.com/in/mohammed-yousif-86208b245\n"
        "Google Scholar: scholar.google.com/citations?user=27RB04gAAAAJ"
    ),
    "greeting": (
        "Hello! I'm Mohammed's AI assistant. I can tell you about his background, research, "
        "projects, skills, education, and how to contact him. What would you like to know?"
    ),
}

COMMAND_MAP = {
    "/about": "about", "/education": "education", "/research": "research",
    "/projects": "projects", "/skills": "skills", "/contact": "contact",
    "/help": "greeting", "/start": "greeting", "/hello": "greeting",
    "about": "about", "education": "education", "research": "research",
    "projects": "projects", "skills": "skills", "contact": "contact",
    "help": "greeting", "hello": "greeting", "hi": "greeting",
}

TOPIC_KEYWORDS = {
    "about": ["who are you", "who is mohammed", "background", "bio", "about mohammed"],
    "education": ["education", "university", "degree", "school", "khartoum", "cambridge", "gpa", "scholarship", "mphil"],
    "research": ["research", "paper", "publication", "publish", "doi", "arxiv", "deepfake", "othello", "autopilot", "sha-za"],
    "projects": ["project", "build", "built", "portfolio", "work", "experience", "rl agent", "surgery robot", "yolov4", "raspberry pi"],
    "skills": ["skills", "tech stack", "technologies", "languages", "tools", "know", "pytorch", "tensorflow"],
    "contact": ["contact", "email", "reach", "github", "linkedin", "social", "hire"],
}

FALLBACK = (
    "I'm Mohammed's portfolio assistant — I can tell you about his background, research, "
    "projects, skills, education, and how to contact him. Try asking about any of those, "
    "or type /help to see all commands."
)

# ── Startup / Shutdown ───────────────────────────────────────────

@asynccontextmanager
async def lifespan(app: FastAPI):
    pool = await asyncpg.create_pool(DATABASE_URL, min_size=2, max_size=10)
    async with pool.acquire() as conn:
        await conn.execute("""
            CREATE TABLE IF NOT EXISTS messages (
                id SERIAL PRIMARY KEY,
                session_id TEXT NOT NULL,
                role TEXT NOT NULL CHECK(role IN ('user','bot')),
                content TEXT NOT NULL,
                topic TEXT,
                created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
            )
        """)
        await conn.execute("""
            CREATE TABLE IF NOT EXISTS blog_posts (
                id SERIAL PRIMARY KEY,
                title TEXT NOT NULL,
                summary TEXT NOT NULL,
                content TEXT DEFAULT '',
                tags JSONB DEFAULT '[]',
                created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
                updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
            )
        """)
        await conn.execute("""
            CREATE TABLE IF NOT EXISTS contact_submissions (
                id SERIAL PRIMARY KEY,
                name TEXT NOT NULL,
                email TEXT NOT NULL,
                message TEXT NOT NULL,
                created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
            )
        """)
    app.state.pool = pool
    yield
    await pool.close()


app = FastAPI(title="Mohammed's Portfolio API", lifespan=lifespan)
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"])


# ── Models ────────────────────────────────────────────────────────

class ChatRequest(BaseModel):
    message: str
    session_id: Optional[str] = None

class BlogPost(BaseModel):
    title: str
    summary: str
    content: str = ""
    tags: list[str] = []

class BlogUpdate(BaseModel):
    title: Optional[str] = None
    summary: Optional[str] = None
    content: Optional[str] = None
    tags: Optional[list[str]] = None

class ContactSubmission(BaseModel):
    name: str
    email: str
    message: str


# ── Helpers ───────────────────────────────────────────────────────

def detect_topic(text: str) -> Optional[str]:
    text_lower = text.lower().strip()
    cmd = text_lower.lstrip("/")
    if cmd in COMMAND_MAP:
        return COMMAND_MAP[cmd]
    for topic, keywords in TOPIC_KEYWORDS.items():
        for kw in keywords:
            if kw in text_lower:
                return topic
    return None


def chat_response(message: str) -> dict:
    topic = detect_topic(message)
    response_text = PORTFOLIO_KB.get(topic, FALLBACK) if topic else FALLBACK
    return {"reply": response_text, "topic": topic}


# ── Chat Endpoints ────────────────────────────────────────────────

@app.post("/api/chat")
async def chat(req: ChatRequest, request: Request):
    pool: asyncpg.Pool = request.app.state.pool
    session_id = req.session_id or f"web_{int(time.time() * 1000)}"
    result = chat_response(req.message)

    async with pool.acquire() as conn:
        await conn.execute(
            "INSERT INTO messages (session_id, role, content, topic) VALUES ($1, 'user', $2, $3)",
            session_id, req.message, result["topic"],
        )
        await conn.execute(
            "INSERT INTO messages (session_id, role, content, topic) VALUES ($1, 'bot', $2, $3)",
            session_id, result["reply"], result["topic"],
        )

    return {"reply": result["reply"], "session_id": session_id, "topic": result["topic"]}


@app.get("/api/chat/messages")
async def get_messages(
    request: Request, session_id: Optional[str] = None,
    limit: int = 100, offset: int = 0,
):
    pool: asyncpg.Pool = request.app.state.pool
    async with pool.acquire() as conn:
        if session_id:
            rows = await conn.fetch(
                "SELECT id, session_id, role, content, topic, created_at FROM messages "
                "WHERE session_id = $1 ORDER BY id DESC LIMIT $2 OFFSET $3",
                session_id, limit, offset,
            )
        else:
            rows = await conn.fetch(
                "SELECT id, session_id, role, content, topic, created_at FROM messages "
                "ORDER BY id DESC LIMIT $1 OFFSET $2",
                limit, offset,
            )
        total = await conn.fetchval("SELECT COUNT(*) FROM messages")
    return {"total": total, "messages": [dict(r) for r in rows]}


@app.get("/api/chat/stats")
async def get_stats(request: Request):
    pool: asyncpg.Pool = request.app.state.pool
    async with pool.acquire() as conn:
        total = await conn.fetchval("SELECT COUNT(*) FROM messages")
        by_role = {r["role"]: r["count"] for r in await conn.fetch(
            "SELECT role, COUNT(*) FROM messages GROUP BY role")}
        sessions = await conn.fetchval("SELECT COUNT(DISTINCT session_id) FROM messages")
        by_topic = {r["topic"]: r["count"] for r in await conn.fetch(
            "SELECT COALESCE(topic,'unknown') as topic, COUNT(*) FROM messages "
            "WHERE role='user' GROUP BY topic ORDER BY COUNT(*) DESC")}
        daily = {str(r["day"]): r["count"] for r in await conn.fetch(
            "SELECT created_at::date as day, COUNT(*) FROM messages "
            "WHERE created_at >= NOW() - INTERVAL '30 days' GROUP BY day ORDER BY day")}
        recent = [dict(r) for r in await conn.fetch(
            "SELECT session_id, MIN(created_at) as started, COUNT(*) as msgs FROM messages "
            "GROUP BY session_id ORDER BY started DESC LIMIT 20")]
    return {
        "total_messages": total, "by_role": by_role, "unique_sessions": sessions,
        "by_topic": by_topic, "daily": daily, "recent_sessions": recent,
    }


@app.get("/api/chat/sessions")
async def list_sessions(request: Request, limit: int = 50):
    pool: asyncpg.Pool = request.app.state.pool
    async with pool.acquire() as conn:
        rows = await conn.fetch(
            "SELECT session_id, MIN(created_at) as started, MAX(created_at) as last_active, "
            "COUNT(*) as total_msgs, SUM(CASE WHEN role='user' THEN 1 ELSE 0 END) as user_msgs, "
            "SUM(CASE WHEN role='bot' THEN 1 ELSE 0 END) as bot_msgs "
            "FROM messages GROUP BY session_id ORDER BY started DESC LIMIT $1", limit)
    return {"sessions": [dict(r) for r in rows]}


# ── Blog Endpoints ────────────────────────────────────────────────

@app.get("/api/blog")
async def list_blogs(request: Request):
    pool: asyncpg.Pool = request.app.state.pool
    async with pool.acquire() as conn:
        rows = await conn.fetch(
            "SELECT id, title, summary, content, tags, created_at, updated_at "
            "FROM blog_posts ORDER BY created_at DESC")
    return {"blogs": [dict(r) for r in rows]}


@app.post("/api/blog")
async def create_blog(post: BlogPost, request: Request):
    pool: asyncpg.Pool = request.app.state.pool
    async with pool.acquire() as conn:
        row = await conn.fetchrow(
            "INSERT INTO blog_posts (title, summary, content, tags) VALUES ($1,$2,$3,$4) RETURNING id, title",
            post.title, post.summary, post.content, json.dumps(post.tags))
    return dict(row)


@app.put("/api/blog/{post_id}")
async def update_blog(post_id: int, post: BlogUpdate, request: Request):
    pool: asyncpg.Pool = request.app.state.pool
    async with pool.acquire() as conn:
        exists = await conn.fetchval("SELECT id FROM blog_posts WHERE id = $1", post_id)
        if not exists:
            raise HTTPException(404, "Blog post not found")
        sets, args, n = [], [], 1
        for field, val in [("title", post.title), ("summary", post.summary),
                           ("content", post.content), ("tags", post.tags)]:
            if val is not None:
                sets.append(f"{field} = ${n}"); n += 1
                args.append(json.dumps(val) if field == "tags" else val)
        if not sets:
            raise HTTPException(400, "No fields to update")
        sets.append(f"updated_at = NOW()")
        args.append(post_id)
        await conn.execute(f"UPDATE blog_posts SET {', '.join(sets)} WHERE id = ${n}", *args)
    return {"updated": True}


@app.delete("/api/blog/{post_id}")
async def delete_blog(post_id: int, request: Request):
    pool: asyncpg.Pool = request.app.state.pool
    async with pool.acquire() as conn:
        result = await conn.execute("DELETE FROM blog_posts WHERE id = $1", post_id)
        if result == "DELETE 0":
            raise HTTPException(404, "Blog post not found")
    return {"deleted": True}


# ── Contact Endpoint ─────────────────────────────────────────────

@app.post("/api/contact")
async def contact(submission: ContactSubmission, request: Request):
    pool: asyncpg.Pool = request.app.state.pool
    async with pool.acquire() as conn:
        await conn.execute(
            "INSERT INTO contact_submissions (name, email, message) VALUES ($1, $2, $3)",
            submission.name, submission.email, submission.message)
    return {"status": "received", "message": "Thank you! Your message has been received."}


@app.get("/api/contact/submissions")
async def list_contacts(request: Request, limit: int = 50):
    pool: asyncpg.Pool = request.app.state.pool
    async with pool.acquire() as conn:
        rows = await conn.fetch(
            "SELECT id, name, email, message, created_at FROM contact_submissions "
            "ORDER BY created_at DESC LIMIT $1", limit)
    return {"submissions": [dict(r) for r in rows]}


# ── Health ────────────────────────────────────────────────────────

@app.get("/api/health")
async def health(request: Request):
    pool: asyncpg.Pool = request.app.state.pool
    try:
        async with pool.acquire() as conn:
            await conn.fetchval("SELECT 1")
        db_status = "connected"
    except Exception as e:
        db_status = f"error: {e}"
    return {"status": "ok", "service": "portfolio-backend", "database": db_status}
