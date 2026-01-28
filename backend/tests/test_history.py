
import requests
import time

base_url = "http://localhost:8000"

def test_history():
    print("Testing History API...")
    
    # 1. Generate content (should auto-save)
    print("Generating content...")
    payload = {
        "content_type": "Tweet",
        "topic": "History Feature Test",
        "tone": "Technical",
        "target_audience": "Developers",
        "content_length": "Short",
        "keywords": "database, sqlite",
        "formality": 3,
        "include_emojis": False
    }
    
    try:
        res = requests.post(f"{base_url}/generate", json=payload)
        if res.status_code != 200:
            print(f"❌ Generation failed: {res.text}")
            return
        print("✅ Content generated.")
        
        # 2. Check History
        print("Checking /history endpoint...")
        res = requests.get(f"{base_url}/history")
        if res.status_code != 200:
            print(f"❌ History fetch failed: {res.text}")
            return
            
        history = res.json()
        print(f"✅ History count: {len(history)}")
        
        if len(history) > 0:
            latest = history[0]
            print(f"Latest Item: [{latest['content_type']}] {latest['topic']}")
            if latest['topic'] == "History Feature Test":
                print("✅ Verification Successful: Item persisted correctly.")
            else:
                print("⚠️ Warning: Latest item doesn't match current generation (might be old data).")
        else:
            print("❌ Error: History is empty after generation.")
            
    except Exception as e:
        print(f"❌ Error: {e}")

if __name__ == "__main__":
    # Give server a moment to start if just launched
    time.sleep(2)
    test_history()
