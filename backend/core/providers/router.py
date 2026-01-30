from typing import Dict, Optional
from backend.core.providers.base import LLMProvider
from backend.core.providers.google import GoogleProvider
from backend.core.providers.openai import OpenAIProvider
from backend.core.providers.anthropic import AnthropicProvider
from backend.core.providers.registry import get_model_info, MODEL_REGISTRY

class ModelRouter:
    _instance = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(ModelRouter, cls).__new__(cls)
            cls._instance._init_providers()
        return cls._instance

    def _init_providers(self):
        self.providers: Dict[str, LLMProvider] = {}
        
        # Initialize providers safely
        try:
            google = GoogleProvider()
            self.providers["google"] = google
        except Exception as e:
            print(f"Error initializing Google Provider: {e}")

        try:
            openai = OpenAIProvider()
            self.providers["openai"] = openai
        except Exception as e:
            print(f"Error initializing OpenAI Provider: {e}")

        try:
            anthropic = AnthropicProvider()
            self.providers["anthropic"] = anthropic
        except Exception as e:
            print(f"Error initializing Anthropic Provider: {e}")

    def get_provider(self, provider_name: str) -> Optional[LLMProvider]:
        provider = self.providers.get(provider_name)
        if provider and provider.is_available():
            return provider
        return None

    def generate(self, prompt: str, model_id: Optional[str] = None, **kwargs) -> str:
        """
        Routes the generation request to the appropriate provider based on model_id.
        Handles fallback if needed (though defined simplified here).
        """
        
        # 1. Determine Model & Provider
        selected_model_id = model_id
        
        # Default to Google Gemini Flash if nothing specified
        if not selected_model_id:
            selected_model_id = "models/gemini-flash-latest"
            
        model_info = get_model_info(selected_model_id)
        
        if not model_info:
            # Fallback to default if unknown model
            # print(f"Unknown model {model_id}, falling back.")
            model_info = MODEL_REGISTRY.get("gemini-flash-latest") # Fallback
            if not model_info: # Extreme fallback
                 # If registry is broken, try manual google
                 provider = self.get_provider("google")
                 if not provider:
                     raise ValueError("No providers available.")
                 return provider.generate_text(prompt, model="models/gemini-flash-latest", **kwargs)

        provider_name = model_info.provider
        provider = self.get_provider(provider_name)
        
        if not provider:
            # Fallback logic could go here (e.g., if OpenAI key missing, try Google)
            print(f"Provider {provider_name} unavailable. Attempting fallback...")
            
            # Simple fallback chain: Google -> OpenAI -> Anthropic
            fallback_order = ["google", "openai", "anthropic"]
            for p_name in fallback_order:
                fallback_provider = self.get_provider(p_name)
                if fallback_provider:
                    print(f"Falling back to {p_name}")
                    # We might need to pick a default model for that provider
                    # For simplify, just let the provider pick its default or explicit
                    if p_name == "google":
                         return fallback_provider.generate_text(prompt, model="models/gemini-flash-latest", **kwargs)
                    if p_name == "openai":
                         return fallback_provider.generate_text(prompt, model="gpt-4o-mini", **kwargs)
                    if p_name == "anthropic":
                         return fallback_provider.generate_text(prompt, model="claude-3-haiku-20240307", **kwargs)
            
            raise ValueError(f"Provider '{provider_name}' is not configured and no fallbacks available.")

        # 2. Generate
        return provider.generate_text(prompt, model=model_info.id, **kwargs)

# Global Router Instance
router = ModelRouter()
