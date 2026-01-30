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
        print(f"UPLOAD ERROR: {str(e)}")
        raise HTTPException(status_code=400, detail=f"Upload failed: {str(e)}")

@router.get("/{job_id}")
def get_batch_status(job_id: str):
    job = batch_manager.get_job_status(job_id)
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
    return job

@router.get("/")
def list_jobs():
    return batch_manager.get_all_jobs()

@router.get("/{job_id}/download")
def download_batch_results(job_id: str):
    import io
    import zipfile
    from fastapi.responses import StreamingResponse
    
    job = batch_manager.get_job_status(job_id)
    if not job:
        raise HTTPException(status_code=404, detail="Job not found")
        
    if job["status"] != "completed":
        raise HTTPException(status_code=400, detail="Job not completed yet")
        
    # Create ZIP in memory
    zip_buffer = io.BytesIO()
    with zipfile.ZipFile(zip_buffer, "a", zipfile.ZIP_DEFLATED, False) as zip_file:
        for item in job["items"]:
            if item["status"] == "completed":
                # Create a filename based on topic
                safe_topic = "".join([c for c in item["topic"] if c.isalnum() or c in (' ', '-', '_')]).strip()
                safe_topic = safe_topic[:50] or "untitled"
                filename = f"{safe_topic}_{item['id'][:4]}.txt" # or .md
                
                content = f"Topic: {item['topic']}\n\n{item['result']}"
                zip_file.writestr(filename, content)
                
    zip_buffer.seek(0)
    
    return StreamingResponse(
        zip_buffer, 
        media_type="application/zip", 
        headers={"Content-Disposition": f"attachment; filename=batch_results_{job_id[:8]}.zip"}
    )
