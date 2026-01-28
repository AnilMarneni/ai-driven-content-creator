import os
import requests
from dotenv import load_dotenv

load_dotenv()

API_KEY = os.getenv("GEMINI_API_KEY")
if not API_KEY:
    print("Error: GEMINI_API_KEY not found.")
    exit(1)

MODELS = [
    "gemini-1.5-flash",
    "gemini-1.5-flash-8b",
    "gemini-1.5-pro",
    "gemini-1.0-pro",
    "gemini-2.0-flash-exp",
    "gemini-pro"
]

VERSIONS = ["v1beta", "v1"]

print(f"Testing API Key ending in ...{API_KEY[-5:]}")

for version in VERSIONS:
    for model in MODELS:
        print(f"Testing {model} on {version}...", end=" ")
        
        url = f"https://generativelanguage.googleapis.com/{version}/models/{model}:generateContent?key={API_KEY}"
        headers = {"Content-Type": "application/json"}
        payload = {
            "contents": [{
                "parts": [{"text": "Hello, this is a test."}]
            }]
        }
        
        try:
            response = requests.post(url, headers=headers, json=payload)
            if response.status_code == 200:
                print("SUCCESS! ✅")
                print(f"Working URL: {url}")
                print(f"Response: {response.text[:100]}...")
                exit(0) # Found one!
            else:
                print(f"Failed ({response.status_code}) ❌")
                # print(response.text) # Uncomment for detailed debug
        except Exception as e:
            print(f"Error: {e}")

print("\nNo working model/endpoint found. The API Key might be invalid or has no access to these models.")
