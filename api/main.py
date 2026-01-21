from fastapi import FastAPI
from pydantic import BaseModel
from backend.content_engine import generate_content
from fastapi.middleware.cors import CORSMiddleware


app = FastAPI(
    title="AI Content Studio API",
    description="Backend API for AI-driven content generation",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ---------------------------
# Request & Response Models
# ---------------------------
class ContentRequest(BaseModel):
    content_type: str
    topic: str

class ContentResponse(BaseModel):
    content: str

# ---------------------------
# Health Check
# ---------------------------
@app.get("/")
def root():
    return {"status": "API is running"}

# ---------------------------
# Generate Content Endpoint
# ---------------------------
@app.post("/generate", response_model=ContentResponse)
def generate(request: ContentRequest):
    content = generate_content(
        content_type=request.content_type,
        topic=request.topic
    )
    return {"content": content}
