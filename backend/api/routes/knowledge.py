from fastapi import APIRouter, HTTPException
from typing import List
from backend.api.schemas import BrandVoiceCreate, BrandVoiceResponse
from backend.core.database import create_brand_voice, get_all_brand_voices, get_brand_voice_by_id, delete_brand_voice

router = APIRouter(prefix="/knowledge", tags=["knowledge"])

@router.get("/voices", response_model=List[BrandVoiceResponse])
def list_voices():
    """
    List all available brand voices.
    """
    voices = get_all_brand_voices()
    return [BrandVoiceResponse(**v) for v in voices]

@router.post("/voices", response_model=BrandVoiceResponse)
def create_voice(voice: BrandVoiceCreate):
    """
    Create a new brand voice.
    """
    try:
        voice_id = create_brand_voice(voice.name, voice.description, voice.voice_content)
        return {
            "id": voice_id,
            "name": voice.name,
            "description": voice.description,
            "voice_content": voice.voice_content
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.delete("/voices/{voice_id}")
def delete_voice(voice_id: int):
    """
    Delete a brand voice.
    """
    delete_brand_voice(voice_id)
    return {"status": "deleted"}
