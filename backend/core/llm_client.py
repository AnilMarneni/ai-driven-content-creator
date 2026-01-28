import os
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()

API_KEY = os.getenv("GEMINI_API_KEY")
if not API_KEY:
    raise RuntimeError("GEMINI_API_KEY not found in environment")

genai.configure(api_key=API_KEY)

def get_best_model():
    """Dynamically finds the best available model for the API key."""
    try:
        print("Listing available models...")
        available_models = [
            m.name for m in genai.list_models() 
            if 'generateContent' in m.supported_generation_methods
        ]
        
        print(f"Found models: {available_models}")
        
        # Priority list
        priorities = [
            "models/gemini-1.5-flash",
            "models/gemini-1.5-pro",
            "models/gemini-1.0-pro",
            "models/gemini-pro",
        ]
        
        # 1. Check for exact matches in priority order
        for priority in priorities:
            if priority in available_models:
                print(f"Selected priority model: {priority}")
                return priority
                
        # 2. Check for any "flash" model
        for model in available_models:
            if "flash" in model.lower():
                print(f"Selected flash model: {model}")
                return model
                
        # 3. Check for any "pro" model
        for model in available_models:
            if "pro" in model.lower():
                print(f"Selected pro model: {model}")
                return model

        # 4. Fallback to the first available model
        if available_models:
            print(f"Selected fallback model: {available_models[0]}")
            return available_models[0]
            
        raise ValueError("No models found with generateContent support.")

    except Exception as e:
        print(f"Error listing models: {e}")
        # Severe fallback if listing fails (e.g. permissions)
        return "models/gemini-1.5-flash"

# Initialize model dynamically
CHOSEN_MODEL = get_best_model()
print(f"Initializing Chat with model: {CHOSEN_MODEL}")
model = genai.GenerativeModel(CHOSEN_MODEL)

def generate_text(prompt: str) -> str:
    try:
        response = model.generate_content(prompt)
        
        if not response.text:
             raise ValueError("Empty response from API")
             
        return response.text.strip()

    except Exception as e:
        raise ValueError(f"Error generating content with {CHOSEN_MODEL}: {str(e)}")
