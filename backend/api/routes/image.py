from fastapi import APIRouter, HTTPException, Depends
from backend.api.schemas import ImageGenerationRequest, ImageGenerationResponse
from backend.core.image_client import generate_image_url

router = APIRouter(prefix="/generate", tags=["Image Generation"])

@router.post("/image", response_model=ImageGenerationResponse)
async def create_image(request: ImageGenerationRequest):
    """
    Generate an image based on the prompt.
    """
    try:
        image_url = generate_image_url(
            prompt=request.prompt,
            style=request.style,
            size=request.size
        )
        return ImageGenerationResponse(image_url=image_url, revised_prompt=request.prompt)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
