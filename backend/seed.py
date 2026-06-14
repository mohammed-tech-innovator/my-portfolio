"""Seed the blog with initial posts."""
import asyncio, aiosqlite, json, sys
from pathlib import Path

DB_PATH = Path(__file__).parent / "portfolio.db"

POSTS = [
    ("Demystifying Proximal Policy Optimization (PPO)",
     "A deep dive into how PPO balances sample complexity and training stability in reinforcement learning environments.",
     "PPO has become the go-to algorithm for RL...",
     ["Reinforcement Learning", "PPO", "Theory"]),
    ("Building a Vision-Based Autopilot from Scratch",
     "Lessons learned from training YOLOv4 and U-Net models for a physical Raspberry Pi self-driving car.",
     "The journey of building an autonomous vehicle...",
     ["Computer Vision", "YOLOv4", "Robotics"]),
    ("The Future of AI in Medical Document Processing",
     "How hierarchical RL agents are revolutionizing the way we extract and process complex medical data.",
     "Medical document processing is being transformed...",
     ["NLP", "Healthcare", "AI Pipeline"]),
]

async def seed():
    db = await aiosqlite.connect(DB_PATH)
    await db.execute("PRAGMA journal_mode=WAL")
    await db.execute("""CREATE TABLE IF NOT EXISTS blog_posts (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL, summary TEXT NOT NULL, content TEXT DEFAULT '',
        tags TEXT DEFAULT '[]', created_at TEXT NOT NULL DEFAULT (datetime('now')),
        updated_at TEXT NOT NULL DEFAULT (datetime('now')))""")
    for title, summary, content, tags in POSTS:
        await db.execute(
            "INSERT OR IGNORE INTO blog_posts (title, summary, content, tags) VALUES (?,?,?,?)",
            (title, summary, content, json.dumps(tags)))
    await db.commit()
    await db.close()
    print(f"Seeded {len(POSTS)} blog posts into {DB_PATH}")

asyncio.run(seed())
