from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any, Union

class ContentRequest(BaseModel):
    content_type: str = Field(..., example="LinkedIn Post")
    topic: str = Field(..., min_length=3, example="The future of AI")
    tone: str = Field(..., example="Professional")
    target_audience: Optional[str] = Field("General Audience", example="Startup Founders")
    content_length: str = Field("Medium", example="Short")  # Short, Medium, Long
    keywords: Optional[str] = Field("", example="AI, growth, future") # Comma separated
    formality: int = Field(3, ge=1, le=5, example=4)
    include_emojis: bool = Field(True, example=True)
    language: str = Field("English", example="Spanish")
    model: Optional[str] = Field(None, example="models/gemini-1.5-flash")
    brand_voice_id: Optional[int] = Field(None, example=1)
    prompt_override: Optional[Dict[str, Any]] = Field(None, example={"template_id": "sys_linkedin"})

class ModelSchema(BaseModel):
    id: str
    name: str
    provider: str
    description: str
    cost_tier: str
    capabilities: List[str]

class ContentResponse(BaseModel):
    content: str
    metrics: Optional[Dict[str, Any]] = None

class HistoryItem(BaseModel):
    id: Union[int, str]
    content_type: str
    topic: str
    tone: str
    target_audience: Optional[str]
    content: str
    timestamp: str

class UserPreferences(BaseModel):
    default_tone: Optional[str] = "Professional"
    default_audience: Optional[str] = "General"
    default_length: Optional[str] = "Medium"
    industry: Optional[str] = None
    writing_style: Optional[str] = None

# --- Auth Schemas ---

class UserCreate(BaseModel):
    email: str = Field(..., example="user@example.com")
    password: str = Field(..., min_length=6, example="secret123")
    full_name: Optional[str] = Field("Creator", example="John Doe")

class UserLogin(BaseModel):
    email: str
    password: str

class UserResponse(BaseModel):
    id: int
    email: str
    full_name: Optional[str]
    avatar_url: Optional[str]
    bio: Optional[str]
    token: Optional[str] = None # Returned on login/register

class ProfileUpdate(BaseModel):
    full_name: Optional[str]
    avatar_url: Optional[str]
    bio: Optional[str]
    email: Optional[str]





class ABContentRequest(BaseModel):
    variant_a: ContentRequest
    variant_b: ContentRequest

class ABContentResponse(BaseModel):
    result_a: ContentResponse
    result_b: ContentResponse

class BrandVoiceCreate(BaseModel):
    name: str = Field(..., min_length=2)
    description: Optional[str] = ""
    voice_content: str = Field(..., min_length=10)

class BrandVoiceResponse(BaseModel):
    id: int
    name: str
    description: Optional[str]
    voice_content: str

class ImageGenerationRequest(BaseModel):
    prompt: str = Field(..., min_length=3, example="A futuristic city with flying cars")
    style: str = Field("realistic", example="cartoon") # realistic, cartoon, sketch, painting
    size: str = Field("1024x1024", example="512x512")

class ImageGenerationResponse(BaseModel):
    image_url: str
    revised_prompt: Optional[str] = None

class SEOAnalysisRequest(BaseModel):
    content: str
    keywords: Optional[str] = ""

class SEOAnalysisResponse(BaseModel):
    score: int
    readability_score: float
    word_count: int
    keyword_analysis: List[Dict[str, Any]]
    checks: Dict[str, bool]

