"""
Portfolio Backend API — FastAPI + SQLite
Serves: chat bot (limited scope), blog, contact form, statistics
"""
import asyncio
import json
import re
import time
from contextlib import asynccontextmanager
from datetime import datetime, timezone
from pathlib import Path
from typing import Optional

import aiosqlite
from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

DB_PATH = Path(__file__).parent / "portfolio.db"

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
    async with aiosqlite.connect(DB_PATH) as db:
        await db.execute("PRAGMA journal_mode=WAL")
        await db.execute("""
            CREATE TABLE IF NOT EXISTS messages (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                session_id TEXT NOT NULL,
                role TEXT NOT NULL CHECK(role IN ('user','bot')),
                content TEXT NOT NULL,
                topic TEXT,
                created_at TEXT NOT NULL DEFAULT (datetime('now'))
            )
        """)
        await db.execute("""
            CREATE TABLE IF NOT EXISTS blog_posts (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                title TEXT NOT NULL,
                summary TEXT NOT NULL,
                content TEXT DEFAULT '',
                tags TEXT DEFAULT '[]',
                created_at TEXT NOT NULL DEFAULT (datetime('now')),
                updated_at TEXT NOT NULL DEFAULT (datetime('now'))
            )
        """)
        await db.execute("""
            CREATE TABLE IF NOT EXISTS contact_submissions (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                email TEXT NOT NULL,
                message TEXT NOT NULL,
                created_at TEXT NOT NULL DEFAULT (datetime('now'))
            )
        """)
        await db.commit()
        app.state.db = db
        yield


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
    """Simple keyword-based topic detection."""
    text_lower = text.lower().strip()
    # Direct commands
    cmd = text_lower.lstrip("/")
    if cmd in COMMAND_MAP:
        return COMMAND_MAP[cmd]
    # Keyword matching
    for topic, keywords in TOPIC_KEYWORDS.items():
        for kw in keywords:
            if kw in text_lower:
                return topic
    return None


def chat_response(message: str) -> dict:
    """Generate a scoped chatbot response."""
    topic = detect_topic(message)
    response_text = PORTFOLIO_KB.get(topic, FALLBACK) if topic else FALLBACK
    return {"reply": response_text, "topic": topic}


# ── Chat Endpoints ────────────────────────────────────────────────

@app.post("/api/chat")
async def chat(req: ChatRequest, request: Request):
    """Chat with Mohammed's portfolio assistant (limited scope)."""
    db: aiosqlite.Connection = request.app.state.db
    session_id = req.session_id or f"web_{int(time.time() * 1000)}"
    result = chat_response(req.message)

    await db.execute(
        "INSERT INTO messages (session_id, role, content, topic) VALUES (?, 'user', ?, ?)",
        (session_id, req.message, result["topic"]),
    )
    await db.execute(
        "INSERT INTO messages (session_id, role, content, topic) VALUES (?, 'bot', ?, ?)",
        (session_id, result["reply"], result["topic"]),
    )
    await db.commit()

    return {"reply": result["reply"], "session_id": session_id, "topic": result["topic"]}


@app.get("/api/chat/messages")
async def get_messages(
    request: Request,
    session_id: Optional[str] = None,
    limit: int = 100,
    offset: int = 0,
):
    """Retrieve stored chat messages."""
    db: aiosqlite.Connection = request.app.state.db
    if session_id:
        cursor = await db.execute(
            "SELECT id, session_id, role, content, topic, created_at FROM messages "
            "WHERE session_id = ? ORDER BY id DESC LIMIT ? OFFSET ?",
            (session_id, limit, offset),
        )
    else:
        cursor = await db.execute(
            "SELECT id, session_id, role, content, topic, created_at FROM messages "
            "ORDER BY id DESC LIMIT ? OFFSET ?",
            (limit, offset),
        )
    rows = await cursor.fetchall()
    total_cursor = await db.execute("SELECT COUNT(*) FROM messages")
    total = (await total_cursor.fetchone())[0]
    return {
        "total": total,
        "messages": [
            {"id": r[0], "session_id": r[1], "role": r[2], "content": r[3], "topic": r[4], "created_at": r[5]}
            for r in rows
        ],
    }


@app.get("/api/chat/stats")
async def get_stats(request: Request):
    """Get chat statistics."""
    db: aiosqlite.Connection = request.app.state.db
    stats = {}

    # Total messages
    cursor = await db.execute("SELECT COUNT(*) FROM messages")
    stats["total_messages"] = (await cursor.fetchone())[0]

    # Messages by role
    cursor = await db.execute("SELECT role, COUNT(*) FROM messages GROUP BY role")
    stats["by_role"] = {r[0]: r[1] for r in await cursor.fetchall()}

    # Unique sessions
    cursor = await db.execute("SELECT COUNT(DISTINCT session_id) FROM messages")
    stats["unique_sessions"] = (await cursor.fetchone())[0]

    # Messages by topic
    cursor = await db.execute(
        "SELECT COALESCE(topic,'unknown'), COUNT(*) FROM messages WHERE role='user' GROUP BY topic ORDER BY COUNT(*) DESC"
    )
    stats["by_topic"] = {r[0]: r[1] for r in await cursor.fetchall()}

    # Messages over time (last 30 days)
    cursor = await db.execute(
        "SELECT DATE(created_at) as day, COUNT(*) FROM messages "
        "WHERE created_at >= datetime('now', '-30 days') GROUP BY day ORDER BY day"
    )
    stats["daily"] = {r[0]: r[1] for r in await cursor.fetchall()}

    # Recent sessions
    cursor = await db.execute(
        "SELECT session_id, MIN(created_at) as started, COUNT(*) as msgs FROM messages "
        "GROUP BY session_id ORDER BY started DESC LIMIT 20"
    )
    stats["recent_sessions"] = [
        {"session_id": r[0], "started": r[1], "message_count": r[2]}
        for r in await cursor.fetchall()
    ]

    return stats


@app.get("/api/chat/sessions")
async def list_sessions(request: Request, limit: int = 50):
    """List all chat sessions with metadata."""
    db: aiosqlite.Connection = request.app.state.db
    cursor = await db.execute(
        "SELECT session_id, MIN(created_at) as started, MAX(created_at) as last_active, "
        "COUNT(*) as total_msgs, "
        "SUM(CASE WHEN role='user' THEN 1 ELSE 0 END) as user_msgs, "
        "SUM(CASE WHEN role='bot' THEN 1 ELSE 0 END) as bot_msgs "
        "FROM messages GROUP BY session_id ORDER BY started DESC LIMIT ?",
        (limit,),
    )
    rows = await cursor.fetchall()
    return {
        "sessions": [
            {
                "session_id": r[0], "started": r[1], "last_active": r[2],
                "total_messages": r[3], "user_messages": r[4], "bot_messages": r[5],
            }
            for r in rows
        ]
    }


# ── Blog Endpoints ────────────────────────────────────────────────

@app.get("/api/blog")
async def list_blogs(request: Request):
    """List all blog posts."""
    db: aiosqlite.Connection = request.app.state.db
    cursor = await db.execute(
        "SELECT id, title, summary, content, tags, created_at, updated_at FROM blog_posts ORDER BY created_at DESC"
    )
    rows = await cursor.fetchall()
    return {
        "blogs": [
            {
                "id": r[0], "title": r[1], "summary": r[2], "content": r[3],
                "tags": json.loads(r[4]), "created_at": r[5], "updated_at": r[6],
            }
            for r in rows
        ]
    }


@app.post("/api/blog")
async def create_blog(post: BlogPost, request: Request):
    """Create a new blog post."""
    db: aiosqlite.Connection = request.app.state.db
    cursor = await db.execute(
        "INSERT INTO blog_posts (title, summary, content, tags) VALUES (?, ?, ?, ?)",
        (post.title, post.summary, post.content, json.dumps(post.tags)),
    )
    await db.commit()
    return {"id": cursor.lastrowid, "title": post.title}


@app.put("/api/blog/{post_id}")
async def update_blog(post_id: int, post: BlogUpdate, request: Request):
    """Update a blog post."""
    db: aiosqlite.Connection = request.app.state.db
    updates = {}
    if post.title is not None:
        updates["title"] = post.title
    if post.summary is not None:
        updates["summary"] = post.summary
    if post.content is not None:
        updates["content"] = post.content
    if post.tags is not None:
        updates["tags"] = json.dumps(post.tags)
    if not updates:
        raise HTTPException(400, "No fields to update")
    updates["updated_at"] = datetime.now(timezone.utc).isoformat()

    set_clause = ", ".join(f"{k}=?" for k in updates)
    values = list(updates.values()) + [post_id]
    cursor = await db.execute(f"UPDATE blog_posts SET {set_clause} WHERE id=?", values)
    await db.commit()
    if cursor.rowcount == 0:
        raise HTTPException(404, "Blog post not found")
    return {"updated": True}


@app.delete("/api/blog/{post_id}")
async def delete_blog(post_id: int, request: Request):
    """Delete a blog post."""
    db: aiosqlite.Connection = request.app.state.db
    cursor = await db.execute("DELETE FROM blog_posts WHERE id=?", (post_id,))
    await db.commit()
    if cursor.rowcount == 0:
        raise HTTPException(404, "Blog post not found")
    return {"deleted": True}


# ── Contact Endpoint ─────────────────────────────────────────────

@app.post("/api/contact")
async def contact(submission: ContactSubmission, request: Request):
    """Submit a contact form message."""
    db: aiosqlite.Connection = request.app.state.db
    await db.execute(
        "INSERT INTO contact_submissions (name, email, message) VALUES (?, ?, ?)",
        (submission.name, submission.email, submission.message),
    )
    await db.commit()
    return {"status": "received", "message": "Thank you! Your message has been received."}


@app.get("/api/contact/submissions")
async def list_contacts(request: Request, limit: int = 50):
    """List contact form submissions (admin)."""
    db: aiosqlite.Connection = request.app.state.db
    cursor = await db.execute(
        "SELECT id, name, email, message, created_at FROM contact_submissions ORDER BY created_at DESC LIMIT ?",
        (limit,),
    )
    rows = await cursor.fetchall()
    return {
        "submissions": [
            {"id": r[0], "name": r[1], "email": r[2], "message": r[3], "created_at": r[4]}
            for r in rows
        ]
    }


# ── Health ────────────────────────────────────────────────────────

@app.get("/api/health")
async def health():
    return {"status": "ok", "service": "portfolio-backend"}
