from backend.core.llm_client import generate_text
from backend.core.prompt_builder import build_prompt

def generate_content(
    content_type: str, 
    topic: str, 
    tone: str, 
    target_audience: str = "General", 
    content_length: str = "Medium", 
    keywords: str = "",
    formality: int = 3,
    include_emojis: bool = True,
    model: str = None,
    prompt_override: dict = None # {"template_id": ..., "custom_template": ...}
) -> str:
    # 1. Check for overrides
    if prompt_override:
        # Import here to avoid circular dependencies if any
        from backend.core.prompts.manager import prompt_manager
        from backend.core.prompts.schemas import PromptOverride
        
        # Prepare params for substitution
        context_params = {
            "topic": topic,
            "tone": tone,
            "target_audience": target_audience,
            "content_length": content_length,
            "keywords": keywords,
            "formality": formality,
            "include_emojis": include_emojis
        }
        
        # Resolve prompt
        override_obj = PromptOverride(**prompt_override)
        prompt = prompt_manager.resolve_prompt(override_obj, context_params)
        
    else:
        # 2. Build dynamic prompt (Standard Flow)
        prompt = build_prompt(
            content_type=content_type,
            topic=topic,
            tone=tone,
            target_audience=target_audience,
            content_length=content_length,
            keywords=keywords,
            formality=formality,
            include_emojis=include_emojis
        )
    
    # Generate text using LLM
    
    # Generate text using LLM
    text = generate_text(prompt, model=model)
    
    return text
