import sqlite3
import json
import secrets
import hashlib
from datetime import datetime, timedelta
from typing import List, Dict, Any, Optional

DB_NAME = "content_history.db"

def get_db_connection():
    conn = sqlite3.connect(DB_NAME)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_db_connection()
    c = conn.cursor()
    c.execute('''
        CREATE TABLE IF NOT EXISTS generations (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            content_type TEXT NOT NULL,
            topic TEXT NOT NULL,
            tone TEXT,
            target_audience TEXT,
            content TEXT NOT NULL,
            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    
    c.execute('''
        CREATE TABLE IF NOT EXISTS preferences (
            key TEXT PRIMARY KEY,
            value TEXT
        )
    ''')
    
    # Auth Tables
    c.execute('''
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            email TEXT UNIQUE NOT NULL,
            password_hash TEXT NOT NULL,
            full_name TEXT,
            avatar_url TEXT,
            bio TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    
    c.execute('''
        CREATE TABLE IF NOT EXISTS sessions (
            token TEXT PRIMARY KEY,
            user_id INTEGER NOT NULL,
            expires_at DATETIME NOT NULL,
            FOREIGN KEY(user_id) REFERENCES users(id)
        )
    ''')
    
    conn.commit()
    conn.close()

# --- Auth Helpers ---

def hash_password(password: str) -> str:
    # Simple SHA256 for demo (in prod use passlib/bcrypt)
    salt = "lumina_salt_v1" # In a real app, store random salt per user
    return hashlib.sha256((password + salt).encode()).hexdigest()

def create_user(user_data: Dict[str, Any]) -> int:
    conn = get_db_connection()
    c = conn.cursor()
    try:
        c.execute('''
            INSERT INTO users (email, password_hash, full_name, avatar_url, bio)
            VALUES (?, ?, ?, ?, ?)
        ''', (
            user_data['email'],
            hash_password(user_data['password']),
            user_data.get('full_name', 'Creator'),
            user_data.get('avatar_url', ''),
            user_data.get('bio', '')
        ))
        conn.commit()
        return c.lastrowid
    except sqlite3.IntegrityError:
        raise ValueError("Email already exists")
    finally:
        conn.close()

def get_user_by_email(email: str) -> Optional[Dict[str, Any]]:
    conn = get_db_connection()
    c = conn.cursor()
    c.execute('SELECT * FROM users WHERE email = ?', (email,))
    row = c.fetchone()
    conn.close()
    return dict(row) if row else None

def get_user_by_id(user_id: int) -> Optional[Dict[str, Any]]:
    conn = get_db_connection()
    c = conn.cursor()
    c.execute('SELECT * FROM users WHERE id = ?', (user_id,))
    row = c.fetchone()
    conn.close()
    return dict(row) if row else None

def update_user(user_id: int, updates: Dict[str, Any]):
    conn = get_db_connection()
    c = conn.cursor()
    # Filter only valid keys
    valid_keys = ['full_name', 'avatar_url', 'bio', 'email']
    query_parts = []
    params = []
    
    for k, v in updates.items():
        if k in valid_keys and v is not None:
             query_parts.append(f"{k} = ?")
             params.append(v)
    
    if query_parts:
        params.append(user_id)
        c.execute(f"UPDATE users SET {', '.join(query_parts)} WHERE id = ?", tuple(params))
        conn.commit()
    conn.close()

def create_session(user_id: int) -> str:
    token = secrets.token_hex(32)
    expires = datetime.now() + timedelta(days=7)
    conn = get_db_connection()
    c = conn.cursor()
    c.execute('INSERT INTO sessions (token, user_id, expires_at) VALUES (?, ?, ?)', 
              (token, user_id, expires))
    conn.commit()
    conn.close()
    return token

def get_session_user(token: str) -> Optional[Dict[str, Any]]:
    conn = get_db_connection()
    c = conn.cursor()
    c.execute('''
        SELECT u.* FROM sessions s
        JOIN users u ON s.user_id = u.id
        WHERE s.token = ? AND s.expires_at > ?
    ''', (token, datetime.now()))
    row = c.fetchone()
    conn.close()
    return dict(row) if row else None

# --- Existing Helpers ---

def save_preferences(defaults: Dict[str, Any]):
    conn = get_db_connection()
    c = conn.cursor()
    for k, v in defaults.items():
        c.execute('INSERT OR REPLACE INTO preferences (key, value) VALUES (?, ?)', (k, str(v)))
    conn.commit()
    conn.close()

def get_preferences() -> Dict[str, Any]:
    conn = get_db_connection()
    c = conn.cursor()
    c.execute('SELECT * FROM preferences')
    rows = c.fetchall()
    conn.close()
    return {row['key']: row['value'] for row in rows}

def save_generation(content_type: str, topic: str, tone: str, target_audience: str, content: str):
    conn = get_db_connection()
    c = conn.cursor()
    c.execute('''
        INSERT INTO generations (content_type, topic, tone, target_audience, content)
        VALUES (?, ?, ?, ?, ?)
    ''', (content_type, topic, tone, target_audience, content))
    conn.commit()
    conn.close()

def get_recent_generations(limit: int = 20) -> List[Dict[str, Any]]:
    conn = get_db_connection()
    c = conn.cursor()
    c.execute('SELECT * FROM generations ORDER BY timestamp DESC LIMIT ?', (limit,))
    rows = c.fetchall()
    conn.close()
    
    return [dict(row) for row in rows]
