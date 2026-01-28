
import requests
import time

base_url = "http://localhost:8000"

def test_preferences():
    print("Testing Preferences API...")
    
    # 1. Save Preferences
    print("Saving new preferences...")
    payload = {
        "default_tone": "Witty",
        "default_audience": "Developers",
        "default_length": "Short"
    }
    
    try:
        res = requests.post(f"{base_url}/preferences", json=payload)
        if res.status_code != 200:
            print(f"❌ Save failed: {res.text}")
            return
        print("✅ Preferences saved.")
        
        # 2. Get Preferences
        print("Fetching preferences...")
        res = requests.get(f"{base_url}/preferences")
        if res.status_code != 200:
            print(f"❌ Fetch failed: {res.text}")
            return
            
        data = res.json()
        print(f"Retrieved: {data}")
        
        if data["default_tone"] == "Witty":
            print("✅ Verification Successful: Preferences match.")
        else:
            print(f"❌ Verification Failed: Expected 'Witty', got '{data['default_tone']}'")
            
    except Exception as e:
        print(f"❌ Error: {e}")

if __name__ == "__main__":
    time.sleep(2) # Wait for server
    test_preferences()
