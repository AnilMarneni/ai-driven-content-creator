from backend.core.llm_client import LLMClient
from backend.core.prompt_builder import build_prompt

llm = LLMClient()

def generate_content(content_type: str, topic: str) -> str:
    prompt = build_prompt(content_type, topic)
    return llm.generate_content(prompt)
