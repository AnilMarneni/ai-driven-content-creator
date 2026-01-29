from typing import Dict, List, Optional
from pydantic import BaseModel

class ModelInfo(BaseModel):
    id: str
    name: str # Display name
    provider: str
    description: str
    cost_tier: str # "low", "medium", "high"
    capabilities: List[str] # "reasoning", "coding", "creative", "vision"
    context_window: int

# Central Model Registry
MODEL_REGISTRY: Dict[str, ModelInfo] = {
    # Google Models
    "gemini-1.5-flash": ModelInfo(
        id="models/gemini-1.5-flash",
        name="Gemini 1.5 Flash",
        provider="google",
        description="Fast, cost-effective, multimodal.",
        cost_tier="low",
        capabilities=["fast", "vision", "general"],
        context_window=1000000
    ),
    "gemini-1.5-pro": ModelInfo(
        id="models/gemini-1.5-pro",
        name="Gemini 1.5 Pro",
        provider="google",
        description="High intelligence, massive context.",
        cost_tier="medium",
        capabilities=["reasoning", "creative", "vision", "long-context"],
        context_window=2000000
    ),
    
    # OpenAI Models
    "gpt-4o": ModelInfo(
        id="gpt-4o",
        name="GPT-4o",
        provider="openai",
        description="Flagship, omni-model, high intelligence.",
        cost_tier="high",
        capabilities=["reasoning", "creative", "coding", "vision"],
        context_window=128000
    ),
    "gpt-4o-mini": ModelInfo(
        id="gpt-4o-mini",
        name="GPT-4o Mini",
        provider="openai",
        description="Affordable and fast small model.",
        cost_tier="low",
        capabilities=["fast", "coding"],
        context_window=128000
    ),

    # Anthropic Models
    "claude-3-5-sonnet": ModelInfo(
        id="claude-3-5-sonnet-20240620",
        name="Claude 3.5 Sonnet",
        provider="anthropic",
        description="Exceptional coding and nuance.",
        cost_tier="medium",
        capabilities=["coding", "creative", "nuance", "vision"],
        context_window=200000
    ),
     "claude-3-haiku": ModelInfo(
        id="claude-3-haiku-20240307",
        name="Claude 3 Haiku",
        provider="anthropic",
        description="Lightning fast and compact.",
        cost_tier="low",
        capabilities=["fast", "summary"],
        context_window=200000
    ),
}

def get_model_info(model_id: str) -> Optional[ModelInfo]:
    # Handle direct lookup or lookup by key if they differ (here keys match mostly, but google has 'models/' prefix sometimes)
    # The registry keys are the simplified keys for internal use if we wanted, but I used user-facing keys or full IDs.
    # Let's align on a logic: The key is the identifier we use in the API.
    
    # Try exact match
    if model_id in MODEL_REGISTRY:
        return MODEL_REGISTRY[model_id]
        
    # Try value.id match
    for m in MODEL_REGISTRY.values():
        if m.id == model_id:
            return m
            
    return None

def list_available_models() -> List[ModelInfo]:
    return list(MODEL_REGISTRY.values())
