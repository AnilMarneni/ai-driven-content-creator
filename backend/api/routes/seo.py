from fastapi import APIRouter, HTTPException
from backend.api.schemas import SEOAnalysisRequest, SEOAnalysisResponse
from backend.core.seo_analyzer import analyze_seo

router = APIRouter(prefix="/seo", tags=["SEO"])

@router.post("/analyze", response_model=SEOAnalysisResponse)
async def analyze_content(request: SEOAnalysisRequest):
    """
    Analyze content for SEO and readability.
    """
    try:
        results = analyze_seo(request.content, request.keywords or "")
        return SEOAnalysisResponse(**results)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
