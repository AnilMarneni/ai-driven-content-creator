from fastapi import APIRouter, HTTPException
import asyncio
from backend.api.schemas import ABContentRequest, ABContentResponse, ContentResponse
from backend.core.content_engine import generate_content
from backend.core.quality_analyzer import analyze_quality

router = APIRouter(prefix="/ab", tags=["ab_testing"])

@router.post("/generate", response_model=ABContentResponse)
async def generate_ab(req: ABContentRequest):
    """
    Executes two content generation requests in parallel for A/B testing.
    """
    try:
        # Define wrapper to run sync generate_content in thread/async
        async def run_variant(variant_req):
            # Run the synchronous generate_content in a thread pool to avoid blocking
            content = await asyncio.to_thread(
                generate_content,
                **variant_req.model_dump()
            )
            metrics = analyze_quality(content)
            return ContentResponse(content=content, metrics=metrics)

        # Run both variants in parallel
        task_a = run_variant(req.variant_a)
        task_b = run_variant(req.variant_b)

        result_a, result_b = await asyncio.gather(task_a, task_b)

        return ABContentResponse(result_a=result_a, result_b=result_b)

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
