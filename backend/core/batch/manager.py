import uuid
import pandas as pd
import io
from concurrent.futures import ThreadPoolExecutor
from datetime import datetime
from typing import List, Dict, Any
from backend.core.content_engine import generate_content

# Simple In-Memory Batch Store (Could be SQLite in future)
BATCH_JOBS: Dict[str, Any] = {}

class BatchManager:
    def __init__(self, max_workers=3):
        self.executor = ThreadPoolExecutor(max_workers=max_workers)

    def create_batch_job(self, file_content: bytes, filename: str, settings: Dict[str, Any]) -> str:
        job_id = str(uuid.uuid4())
        
        # Parse CSV
        try:
            df = pd.read_csv(io.BytesIO(file_content))
            if "topic" not in df.columns:
                 # Fallback: try first column
                 df.rename(columns={df.columns[0]: "topic"}, inplace=True)
        except Exception as e:
            raise ValueError(f"Invalid CSV: {str(e)}")

        items = []
        for _, row in df.iterrows():
            items.append({
                "id": str(uuid.uuid4()),
                "topic": row.get("topic", "Untitled"),
                "status": "pending",
                "result": None,
                "error": None,
                "overrides": {k: v for k, v in row.items() if k != "topic" and pd.notna(v)}
                # Allows CSV cols like 'tone', 'audience' to override global settings
            })

        BATCH_JOBS[job_id] = {
            "id": job_id,
            "filename": filename,
            "status": "processing",
            "created_at": datetime.now().isoformat(),
            "total_items": len(items),
            "completed_items": 0,
            "items": items,
            "settings": settings
        }

        # Start Processing in Background
        self.executor.submit(self._process_batch, job_id)
        
        return job_id

    def _process_batch(self, job_id: str):
        job = BATCH_JOBS[job_id]
        
        for item in job["items"]:
            try:
                # Merge settings: Row overrides > Global Settings
                # (Simple merge logic)
                params = job["settings"].copy()
                
                # If CSV has 'tone', use it
                if "tone" in item["overrides"]:
                    params["tone"] = item["overrides"]["tone"]
                if "audience" in item["overrides"]:
                    params["target_audience"] = item["overrides"]["audience"]
                
                # Generate
                content = generate_content(
                    topic=item["topic"],
                    **params
                )
                
                item["status"] = "completed"
                item["result"] = content
                
            except Exception as e:
                item["status"] = "failed"
                item["error"] = str(e)
            
            job["completed_items"] += 1
        
        job["status"] = "completed"

    def get_job_status(self, job_id: str) -> Dict[str, Any]:
        return BATCH_JOBS.get(job_id)

    def get_all_jobs(self) -> List[Dict[str, Any]]:
         return list(BATCH_JOBS.values())

# Global Instance
batch_manager = BatchManager()
