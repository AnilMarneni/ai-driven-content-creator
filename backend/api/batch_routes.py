from fastapi import APIRouter, UploadFile, File, HTTPException, Form
from typing import Optional
import json
from backend.core.batch.manager import batch_manager

router = APIRouter(prefix="/batch", tags=["batch"])

@router.post("/upload")
async def upload_batch(
    file: UploadFile = File(...),
    settings: str = Form(...) # JSON string of settings
):
    try:
        settings_dict = json.loads(settings)
        content = await file.read()
        job_id = batch_manager.create_batch_job(content, file.filename, settings_dict)
        return {"job_id": job_id, "status": "processing"}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/{job_id}")
def get_batch_status(job_id: str):
    job = batch_manager.get_job_status(job_id)
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    return job

@router.get("/")
def list_jobs():
    return batch_manager.get_all_jobs()
