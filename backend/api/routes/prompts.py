from fastapi import APIRouter, HTTPException, Depends
from typing import List, Dict, Any
from backend.core.prompts.manager import prompt_manager
from backend.core.prompts.schemas import PromptTemplate, ABTestRequest
from backend.core.content_engine import generate_content

router = APIRouter(prefix="/prompts", tags=["Prompts"])

@router.get("/templates", response_model=List[PromptTemplate])
async def list_templates():
    return prompt_manager.list_templates()

@router.post("/templates", response_model=PromptTemplate)
async def create_template(template: PromptTemplate):
    try:
        return prompt_manager.create_template(template)
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/ab-test")
async def run_ab_test(request: ABTestRequest):
    """
    Runs generation twice with different prompts.
    This is a simplified synchronous implementation. 
    """
    results = {}
    
    # Variant A
    try:
        content_a = generate_content(
            content_type=request.content_type,
            topic=request.topic,
            # Pass defaults or empty if overridden
            tone=request.params.get("tone", "Professional"), 
            model=request.params.get("model"),
            prompt_override=request.prompt_a_override.dict()
        )
        results["variant_a"] = {"content": content_a, "error": None}
    except Exception as e:
        results["variant_a"] = {"content": None, "error": str(e)}

    # Variant B
    try:
        content_b = generate_content(
            content_type=request.content_type,
            topic=request.topic,
            tone=request.params.get("tone", "Professional"),
            model=request.params.get("model"),
            prompt_override=request.prompt_b_override.dict()
        )
        results["variant_b"] = {"content": content_b, "error": None}
    except Exception as e:
        results["variant_b"] = {"content": None, "error": str(e)}

    return results
