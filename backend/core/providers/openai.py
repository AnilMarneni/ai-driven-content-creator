import os
try:
    from openai import OpenAI
except ImportError:
    OpenAI = None

from dotenv import load_dotenv
from backend.core.providers.base import LLMProvider

load_dotenv()

class OpenAIProvider(LLMProvider):
    def __init__(self):
        self.api_key = os.getenv("OPENAI_API_KEY")
        self._available = False
        self.client = None
        
        if self.api_key and OpenAI:
            try:
                self.client = OpenAI(api_key=self.api_key)
                self._available = True
            except Exception as e:
                print(f"Failed to initialize OpenAI client: {e}")

    @property
    def provider_name(self) -> str:
        return "openai"

    def is_available(self) -> bool:
        return self._available

    def generate_text(self, prompt: str, **kwargs) -> str:
        if not self._available:
             if not OpenAI:
                 raise ValueError("openai package is not installed.")
             raise ValueError("OpenAI Provider is not available (missing API Key)")

        model_name = kwargs.get("model", "gpt-4o") # Default to a modern model

        try:
            response = self.client.chat.completions.create(
                model=model_name,
                messages=[
                    {"role": "user", "content": prompt}
                ],
                # Add support for other params like max_tokens, temperature if passed in kwargs
                max_tokens=kwargs.get("max_tokens", 2000),
                temperature=kwargs.get("temperature", 0.7),
            )
            
            return response.choices[0].message.content.strip()
        except Exception as e:
            raise ValueError(f"OpenAI generation error ({model_name}): {str(e)}")
