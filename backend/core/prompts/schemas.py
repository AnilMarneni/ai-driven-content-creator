from pydantic import BaseModel, Field
from typing import List, Dict, Optional, Any
from datetime import datetime

class PromptVariable(BaseModel):
    name: str
    description: Optional[str] = None
    default_value: Optional[str] = None

class PromptTemplate(BaseModel):
    id: str
    name: str
    description: str
    template_text: str  # The actual prompt with {{variables}}
    variables: List[str] # List of variable names expected
    is_system: bool = False
    created_at: str = Field(default_factory=lambda: datetime.now().isoformat())
    category: Optional[str] = "General"
    recommended_models: List[str] = Field(default_factory=list, description="List of model IDs that work best with this prompt")
    avoid_models: List[str] = Field(default_factory=list, description="List of model IDs to avoid")
    reason: Optional[str] = None # Reason for recommendations


class PromptOverride(BaseModel):
    template_id: Optional[str] = None
    custom_template: Optional[str] = None
    # If custom_template is provided, it attempts to use it directly (validated)
    # If template_id is provided, it loads that template

class ABTestRequest(BaseModel):
    content_type: str
    prompt_a_override: PromptOverride
    prompt_b_override: PromptOverride
    topic: str
    params: Dict[str, Any] # Shared params like tone, audience
