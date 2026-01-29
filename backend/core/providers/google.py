import os
import google.generativeai as genai
from dotenv import load_dotenv
from backend.core.providers.base import LLMProvider

load_dotenv()

class GoogleProvider(LLMProvider):
    def __init__(self):
        self.api_key = os.getenv("GEMINI_API_KEY")
        if not self.api_key:
            # We don't raise error immediately to allow other providers to work if this one is not configured
            print("Warning: GEMINI_API_KEY not found. Google Provider will be disabled.")
            self._available = False
        else:
            genai.configure(api_key=self.api_key)
            self._available = True
            self.default_model = self._get_best_model()

    @property
    def provider_name(self) -> str:
        return "google"

    def is_available(self) -> bool:
        return self._available

    def _get_best_model(self) -> str:
        """Dynamically finds the best available model for the API key."""
        try:
            # Simple caching or just run it once during init
            # For robustness, we can try to list models. 
            # If list_models fails, just default to a safe bet.
            
            # Optimization: Just return a safe default to avoid startup latency if not strictly necessary
            # But the original code did this, so let's preserve the logic but maybe make it lazy if needed.
            # For now, let's just do what the original code did but wrapped here.
            
            priorities = [
                "models/gemini-1.5-flash",
                "models/gemini-1.5-pro",
                "models/gemini-1.0-pro",
                "models/gemini-pro",
            ]
            
            try:
                available_models = [
                    m.name for m in genai.list_models() 
                    if 'generateContent' in m.supported_generation_methods
                ]
            except Exception:
                return "models/gemini-1.5-flash" # Fallback if list fails

            for priority in priorities:
                if priority in available_models:
                    return priority
            
            for model in available_models:
                 if "flash" in model.lower(): return model

            if available_models:
                return available_models[0]
                
            return "models/gemini-1.5-flash"

        except Exception as e:
            print(f"Error determining best Google model: {e}")
            return "models/gemini-1.5-flash"

    def generate_text(self, prompt: str, **kwargs) -> str:
        if not self._available:
             raise ValueError("Google Provider is not available (missing API Key)")

        model_name = kwargs.get("model", self.default_model)
        
        # Google specific: ensure 'models/' prefix if not present for some cases, 
        # but usually the registry handles the ID. 
        # If the user selects "gemini-1.5-flash", we might strictly need "models/gemini-1.5-flash".
        # The registry should probably handle the full ID.
        
        try:
            model = genai.GenerativeModel(model_name)
            response = model.generate_content(prompt)
            
            if not response.text:
                raise ValueError("Empty response from Google API")
                
            return response.text.strip()
        except Exception as e:
            raise ValueError(f"Google generation error ({model_name}): {str(e)}")
