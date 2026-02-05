from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional
from backend.core.intelligence.refiner import refine_content, get_suggestions, merge_contents

router = APIRouter(prefix="/edit", tags=["edit"])

class RefineRequest(BaseModel):
    text: str
    instruction: str

class SuggestRequest(BaseModel):
    text: str

class MergeRequest(BaseModel):
    contents: List[str]
    instruction: Optional[str] = ""

@router.post("/refine")
async def refine(req: RefineRequest):
    """
    Applies an AI edit to the provided text.
    """
    try:
        result = refine_content(req.text, req.instruction)
        return {"result": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/suggest")
async def suggest(req: SuggestRequest):
    """
    Get improvement suggestions for the text.
    """
    try:
        suggestions = get_suggestions(req.text)
        return {"suggestions": suggestions}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/merge")
async def merge(req: MergeRequest):
    """
    Merges multiple text segments into one.
    """
    try:
        result = merge_contents(req.contents, req.instruction)
        return {"result": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
