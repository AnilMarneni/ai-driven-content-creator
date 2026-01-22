import os
from dotenv import load_dotenv
from google import genai

# Load environment variables
load_dotenv()

# Create Gemini client
client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

print("Available models that support generateContent:\n")

# List models and filter by generateContent support
for model in client.models.list():
    if "generateContent" in model.supported_generation_methods:
        print(model.name)
