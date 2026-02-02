from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from backend.core.intelligence.refiner import refine_content, get_suggestions

router = APIRouter(prefix="/edit", tags=["edit"])

class RefineRequest(BaseModel):
    text: str
    instruction: str

class SuggestRequest(BaseModel):
    text: str

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
