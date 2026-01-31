from fastapi import APIRouter, HTTPException, Depends
from typing import List, Dict, Any
from backend.core.prompts.schemas import PromptTemplate, PromptOverride
from backend.core.prompts.engine import prompt_engine
from backend.core.prompts.defaults import DEFAULT_TEMPLATES

router = APIRouter(prefix="/prompts", tags=["prompts"])

# Initialize Engine with Defaults on usage (idempotent)
for t in DEFAULT_TEMPLATES:
    prompt_engine.register_template(t)

@router.get("/templates", response_model=List[PromptTemplate])
async def get_templates():
    """List all available prompt templates."""
    return list(prompt_engine._system_templates.values())

@router.get("/templates/{template_id}", response_model=PromptTemplate)
async def get_template(template_id: str):
    """Get specific template details."""
    try:
        return prompt_engine.get_template(template_id)
    except ValueError:
        raise HTTPException(status_code=404, detail="Template not found")

@router.post("/preview")
async def preview_prompt(
    template_id: str, 
    variables: Dict[str, Any], 
    overrides: Dict[str, str] = None
):
    """
    Simulate prompt resolution without calling the LLM. 
    Useful for the 'Prompt Studio' UI to show what will be sent.
    """
    try:
        prompt_text = prompt_engine.resolve_prompt(template_id, variables, overrides)
        return {"prompt_text": prompt_text}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
