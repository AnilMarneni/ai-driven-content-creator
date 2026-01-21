import os
from dotenv import load_dotenv
from openai import OpenAI

load_dotenv()

class LLMClient:
    def __init__(self, model: str = "gpt-3.5-turbo"):
        self.api_key = os.getenv("OPENAI_API_KEY")
        self.model = model
        self.client = OpenAI(api_key=self.api_key) if self.api_key else None

    def generate_content(self, prompt: str, temperature: float = 0.7) -> str:
        """
        Generates AI content.
        Falls back to mock content if API quota is unavailable.
        """
        if not self.client:
            return self._mock_response(prompt)

        try:
            response = self.client.chat.completions.create(
                model=self.model,
                messages=[
                    {"role": "system", "content": "You are a professional content writer."},
                    {"role": "user", "content": prompt}
                ],
                temperature=temperature
            )
            return response.choices[0].message.content.strip()

        except Exception as error:
            return self._mock_response(prompt, error)

    def _mock_response(self, prompt: str, error=None) -> str:
        """
        Fallback content for development/demo purposes.
        """
        return (
            "⚠️ AI API unavailable (quota/billing issue).\n\n"
            "🔹 This is a mock AI-generated response used for development.\n\n"
            f"Prompt received:\n\"{prompt}\"\n\n"
            "Sample Output:\n"
            "Learning AI is a journey of curiosity, consistency, and creativity. "
            "Every experiment you run brings you one step closer to mastery."
        )
