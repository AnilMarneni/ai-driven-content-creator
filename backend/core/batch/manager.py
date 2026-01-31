import uuid
import pandas as pd
import io
import time
import threading
import queue
from datetime import datetime
from typing import List, Dict, Any, Optional
from backend.core.content_engine import generate_content
from backend.core.provider_limits import get_provider_limits

import json
import os

# Job Store
BATCH_JOBS: Dict[str, Any] = {}
DATA_FILE = os.path.join(os.path.dirname(__file__), "batch_store.json")

def save_jobs_to_disk():
    try:
        with open(DATA_FILE, 'w') as f:
            # Convert non-serializable objects if any? currently all simple types
            json.dump(BATCH_JOBS, f)
    except Exception as e:
        print(f"Failed to save batch jobs: {e}")

def load_jobs_from_disk():
    global BATCH_JOBS
    if os.path.exists(DATA_FILE):
        try:
            with open(DATA_FILE, 'r') as f:
                BATCH_JOBS = json.load(f)
        except Exception as e:
            print(f"Failed to load batch jobs: {e}")

class BatchWorker(threading.Thread):
    def __init__(self, job_queue: queue.PriorityQueue):
        threading.Thread.__init__(self)
        self.job_queue = job_queue
        self.daemon = True # Kill when main thread exits
        self.last_request_time: Dict[str, float] = {} # Per provider

    def run(self):
        while True:
            try:
                # Get item from queue
                # Priority is timestamp (FIFO basically for now)
                priority, job_id, _, item = self.job_queue.get(timeout=1)
                
                self._process_item(job_id, item)
                
                self.job_queue.task_done()
                
            except queue.Empty:
                continue
            except Exception as e:
                print(f"Worker Error: {e}")

    def _process_item(self, job_id: str, item: Dict[str, Any]):
        job = BATCH_JOBS.get(job_id)
        if not job:
            return

        try:
            # 1. Determine Model & Provider
            # Check row override -> Batch settings -> System Default
            settings = job["settings"]
            row_overrides = item.get("overrides", {})
            
            model_id = row_overrides.get("model", settings.get("model", "models/gemini-flash-latest"))
            
            # Simple provider extraction (assuming 'models/provider-model' or just mapped)
            provider = "gemini" # Default fallback
            if "gpt" in model_id: provider = "openai"
            elif "claude" in model_id: provider = "anthropic"
            elif "fake" in model_id: provider = "fake"
            
            # 2. Rate Limiting
            limits = get_provider_limits(provider)
            min_interval = 60.0 / limits["rpm"]
            
            last_time = self.last_request_time.get(provider, 0)
            elapsed = time.time() - last_time
            
            if elapsed < min_interval:
                time.sleep(min_interval - elapsed)
            
            self.last_request_time[provider] = time.time()

            # 3. Prepare Params
            # Base settings from the job (frontend defaults)
            base_settings = settings.copy()
            
            # Apply row overrides if present
            # We map 'audience' from CSV/Frontend to 'target_audience' for the backend function
            tone = row_overrides.get("tone", base_settings.get("tone", "Professional"))
            audience = row_overrides.get("audience", base_settings.get("audience", "General"))
            # Other potential overrides
            length = row_overrides.get("length", base_settings.get("contentLength", "Medium")) # Frontend often sends contentLength
            
            # 4. Generate - Pass explicitly to avoid unexpected kwargs
            content = generate_content(
                topic=item["topic"],
                content_type=base_settings.get("contentType", "Blog"), # Default to Blog if missing
                tone=tone,
                target_audience=audience,
                content_length=length,
                model=model_id
            )
            
            item["status"] = "completed"
            item["result"] = content
            
        except Exception as e:
            item["status"] = "failed"
            item["error"] = str(e)
        
        # Update Job Progress
        job["completed_items"] += 1
        if job["completed_items"] >= job["total_items"]:
            job["status"] = "completed"
        
        save_jobs_to_disk()


class BatchManager:
    def __init__(self):
        load_jobs_from_disk()
        self.queue = queue.PriorityQueue()
        # Start a few workers (concurrency is handled by rate limits mostly)
        self.workers = []
        for _ in range(3):
            w = BatchWorker(self.queue)
            w.start()
            self.workers.append(w)

    def create_batch_job(self, file_content: bytes, filename: str, settings: Dict[str, Any]) -> str:
        job_id = str(uuid.uuid4())
        
        try:
            df = pd.read_csv(io.BytesIO(file_content))
            # Normalize column names lower case for checking
            df.columns = [c.lower() for c in df.columns]
            
            if "topic" not in df.columns:
                 # Fallback: try first column
                 df.rename(columns={df.columns[0]: "topic"}, inplace=True)
        except Exception as e:
            raise ValueError(f"Invalid CSV: {str(e)}")

        items = []
        for _, row in df.iterrows():
            item_id = str(uuid.uuid4())
            item = {
                "id": item_id,
                "topic": row.get("topic", "Untitled"),
                "status": "pending",
                "result": None,
                "error": None,
                "overrides": {k: v for k, v in row.items() if k != "topic" and pd.notna(v)}
            }
            items.append(item)

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
        
        save_jobs_to_disk()

        # Enqueue items
        # Priority 1 (High) for now, using timestamp as FIFO tie breaker
        for item in items:
            # Add item['id'] as tie breaker so we never compare item dicts
            self.queue.put((1, job_id, item['id'], item))
        
        return job_id

    def get_job_status(self, job_id: str) -> Dict[str, Any]:
        return BATCH_JOBS.get(job_id)

    def get_all_jobs(self) -> List[Dict[str, Any]]:
         return list(BATCH_JOBS.values())

# Global Instance
batch_manager = BatchManager()
