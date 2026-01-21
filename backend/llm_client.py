import os
from dotenv import load_dotenv
from google import genai

load_dotenv()

class LLMClient:
    def __init__(self):
        api_key = os.getenv("GEMINI_API_KEY")
        if not api_key:
            raise EnvironmentError("GEMINI_API_KEY not found in .env")

        # Configure Gemini client
        self.client = genai.Client(api_key=api_key)

        # Stable, supported model
        self.model = "models/gemini-flash-latest"

    def generate_content(self, prompt: str) -> str:
        try:
            response = self.client.models.generate_content(
                model=self.model,
                contents=prompt
            )
            return response.text.strip()
        except Exception as e:
            return f"LLM Error: {str(e)}"
