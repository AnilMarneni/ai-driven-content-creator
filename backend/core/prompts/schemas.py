from pydantic import BaseModel, Field
from typing import List, Dict, Optional, Any
from enum import Enum
from datetime import datetime

class BlockType(str, Enum):
    SYSTEM = "system"
    INSTRUCTION = "instruction"
    CONTEXT = "context"
    USER_INPUT = "user_input"

class PromptBlock(BaseModel):
    id: str
    type: BlockType
    content: str
    is_locked: bool = False
    description: Optional[str] = None

class PromptVariable(BaseModel):
    name: str
    description: str
    default_value: Optional[str] = None
    required: bool = True

class PromptTemplate(BaseModel):
    id: str
    name: str
    description: str
    version: str = "1.0.0"
    author: str = "system"  # 'system' or user_id
    
    # The structured blocks
    blocks: List[PromptBlock]
    
    # Variables expected in the blocks {{variable}}
    variables: List[PromptVariable]
    
    # Metadata for UI/filtering
    tags: List[str] = []
    recommended_models: List[str] = ["models/gemini-flash-latest"]
    created_at: datetime = Field(default_factory=datetime.now)
    updated_at: datetime = Field(default_factory=datetime.now)

class PromptOverride(BaseModel):
    """
    Used when a power user overrides specific editable blocks at runtime.
    """
    template_id: str
    # Map of block_id -> new_content
    # Only non-locked blocks can be keys here
    block_overrides: Dict[str, str] = {} 
