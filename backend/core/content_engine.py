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
    model: str = None
) -> str:
    # Build dynamic prompt
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
    text = generate_text(prompt, model=model)
    
    return text
