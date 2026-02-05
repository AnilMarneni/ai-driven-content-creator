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
    brand_voice_id: int = None,
    prompt_override: dict = None # {"template_id": ..., "custom_template": ...}
) -> str:
    # 1. Check for overrides
    if prompt_override:
        # Import here to avoid circular dependencies if any
        from backend.core.prompts.engine import prompt_engine
        
        # Prepare params for substitution
        context_params = {
            "topic": topic,
            "tone": tone,
            "target_audience": target_audience,
            "content_length": content_length,
            "keywords": keywords,
            "formality": formality,
            "include_emojis": include_emojis,
            "brand_voice_id": brand_voice_id
        }
        
        # Check for legacy simple override or structured
        if "custom_template" in prompt_override:
             # Legacy/Simple override (just a string)
             prompt = prompt_override["custom_template"]
             # Perform some basic variable substitution manually if needed, or assume raw
             for k, v in context_params.items():
                 prompt = prompt.replace(f"{{{{{k}}}}}", str(v))
        else:
            # Structured Override
            t_id = prompt_override.get("template_id")
            b_ovr = prompt_override.get("block_overrides", {})
            
            if t_id:
                prompt = prompt_engine.resolve_prompt(t_id, context_params, b_ovr)
            else:
                # Fallback
                prompt = build_prompt(**context_params)

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
            include_emojis=include_emojis,
            brand_voice_id=brand_voice_id
        )
    
    # Generate text using LLM
    
    # Generate text using LLM
    text = generate_text(prompt, model=model)
    
    return text
