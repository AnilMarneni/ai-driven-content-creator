from fastapi import APIRouter, UploadFile, File, HTTPException
import shutil
import os
import uuid

router = APIRouter()

UPLOAD_DIR = "backend/static/avatars"
os.makedirs(UPLOAD_DIR, exist_ok=True)

@router.post("/upload/avatar")
async def upload_avatar(file: UploadFile = File(...)):
    try:
        # Validate file type
        if not file.content_type.startswith("image/"):
            raise HTTPException(status_code=400, detail="File must be an image")
        
        # Determine extension
        ext = file.filename.split(".")[-1] if "." in file.filename else "jpg"
        
        # Generate unique filename
        filename = f"{uuid.uuid4()}.{ext}"
        file_path = os.path.join(UPLOAD_DIR, filename)
        
        # Save file
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
            
        # Return URL (Hardcoded base URL for now, or relative)
        # Assuming backend runs on port 8000
        url = f"http://127.0.0.1:8000/static/avatars/{filename}"
        
        return {"url": url}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
