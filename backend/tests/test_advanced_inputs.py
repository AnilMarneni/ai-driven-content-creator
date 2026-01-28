
import requests
import json

url = "http://localhost:8000/generate"

payload = {
    "content_type": "LinkedIn Post",
    "topic": "Milestone 2 Features",
    "tone": "Excited",
    "target_audience": "Developers",
    "content_length": "Short",
    "keywords": "AI, Progress, Upgrade",
    "formality": 2,
    "include_emojis": True
}

try:
    print("Testing Advanced Inputs API...")
    response = requests.post(url, json=payload)
    
    if response.status_code == 200:
        print("✅ Success!")
        print(response.json()["content"])
    else:
        print(f"❌ Failed: {response.status_code}")
        print(response.text)

except Exception as e:
    print(f"Error: {e}")
