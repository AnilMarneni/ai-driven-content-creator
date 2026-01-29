from fastapi import FastAPI, HTTPException, Depends, Header
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Dict, Any, Optional
from backend.api.schemas import ContentRequest, ContentResponse, HistoryItem, UserPreferences, UserCreate, UserLogin, UserResponse, ProfileUpdate, ModelSchema
from backend.core.content_engine import generate_content
from backend.core.database import (
    init_db, save_generation, get_recent_generations, save_preferences, get_preferences,
    create_user, get_user_by_email, create_session, get_session_user, get_user_by_id, hash_password, update_user
)

app = FastAPI(
    title="LuminaAI API",
    description="Backend API for AI-driven content generation",
    version="3.0.0"
)

# User Dependency
async def get_current_user(authorization: Optional[str] = Header(None)) -> Dict[str, Any]:
    if not authorization:
        raise HTTPException(status_code=401, detail="Missing Token")
    
    token = authorization.replace("Bearer ", "")
    user = get_session_user(token)
    if not user:
        raise HTTPException(status_code=401, detail="Invalid or Expired Token")
    return user

# Initialize DB on startup
@app.on_event("startup")
def on_startup():
    init_db()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------- Routes ----------
from backend.api import batch_routes
app.include_router(batch_routes.router)

# ---------- Auth Routes ----------

@app.post("/auth/register", response_model=UserResponse)
def register(user: UserCreate):
    existing = get_user_by_email(user.email)
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    try:
        user_id = create_user(user.model_dump())
        token = create_session(user_id)
        return {
            "id": user_id, 
            "email": user.email, 
            "full_name": user.full_name, 
            "avatar_url": "", 
            "bio": "", 
            "token": token
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/auth/login", response_model=UserResponse)
def login(creds: UserLogin):
    user = get_user_by_email(creds.email)
    if not user or user['password_hash'] != hash_password(creds.password):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    token = create_session(user['id'])
    return {
        "id": user['id'], 
        "email": user['email'], 
        "full_name": user['full_name'], 
        "avatar_url": user['avatar_url'], 
        "bio": user['bio'], 
        "token": token
    }

@app.get("/auth/me", response_model=UserResponse)
def get_me(user: Dict[str, Any] = Depends(get_current_user)):
    return user

@app.put("/auth/me", response_model=UserResponse)
def update_profile(updates: ProfileUpdate, user: Dict[str, Any] = Depends(get_current_user)):
    update_user(user['id'], updates.model_dump(exclude_unset=True))
    # Return updated user
    updated = get_user_by_id(user['id'])
    return updated


# ---------- Content Routes ----------

@app.get("/")
def health_check():
    return {"status": "LuminaAI API Running", "mode": "Premium"}

@app.get("/models", response_model=List[ModelSchema])
def get_models():
    from backend.core.providers.registry import list_available_models
    return [ModelSchema(**m.model_dump()) for m in list_available_models()]

@app.get("/preferences", response_model=UserPreferences)
def get_user_preferences():
    prefs = get_preferences()
    return UserPreferences(
        default_tone=prefs.get("default_tone", "Professional"),
        default_audience=prefs.get("default_audience", "General"),
        default_length=prefs.get("default_length", "Medium")
    )

@app.post("/preferences")
def save_user_preferences(prefs: UserPreferences):
    save_preferences(prefs.model_dump())
    return {"status": "Preferences saved"}

@app.post("/generate", response_model=ContentResponse)
async def generate(req: ContentRequest):
    try:
        content = generate_content(**req.model_dump())
        
        # Analyze Content
        from backend.core.quality_analyzer import analyze_quality
        metrics = analyze_quality(content)
        
        # Save to History
        save_generation(
            content_type=req.content_type,
            topic=req.topic,
            tone=req.tone,
            target_audience=req.target_audience,
            content=content
        )
        
        return ContentResponse(content=content, metrics=metrics)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/history", response_model=List[HistoryItem])
def get_history():
    try:
        return get_recent_generations(limit=50)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
