import os
try:
    import anthropic
except ImportError:
    anthropic = None

from dotenv import load_dotenv
from backend.core.providers.base import LLMProvider

load_dotenv()

class AnthropicProvider(LLMProvider):
    def __init__(self):
        self.api_key = os.getenv("ANTHROPIC_API_KEY")
        self._available = False
        self.client = None
        
        if self.api_key and anthropic:
            try:
                self.client = anthropic.Anthropic(api_key=self.api_key)
                self._available = True
            except Exception as e:
                print(f"Failed to initialize Anthropic client: {e}")

    @property
    def provider_name(self) -> str:
        return "anthropic"

    def is_available(self) -> bool:
        return self._available

    def generate_text(self, prompt: str, **kwargs) -> str:
        if not self._available:
             if not anthropic:
                 raise ValueError("anthropic package is not installed.")
             raise ValueError("Anthropic Provider is not available (missing API Key)")

        model_name = kwargs.get("model", "claude-3-5-sonnet-20240620") 

        try:
            response = self.client.messages.create(
                model=model_name,
                max_tokens=kwargs.get("max_tokens", 2000),
                temperature=kwargs.get("temperature", 0.7),
                messages=[
                    {"role": "user", "content": prompt}
                ]
            )
            
            # Anthropic response structure
            return response.content[0].text.strip()
        except Exception as e:
            raise ValueError(f"Anthropic generation error ({model_name}): {str(e)}")
