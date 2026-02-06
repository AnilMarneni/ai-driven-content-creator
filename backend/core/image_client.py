import urllib.parse
import random
from typing import Optional

def generate_image_url(prompt: str, style: str = "realistic", size: str = "1024x1024") -> str:
    """
    Generates an image URL using Pollinations.ai (free AI tier).
    This provides actual AI-generated images based on the prompt, far superior to random placeholders.
    """
    print(f"[Image Gen] Generating image for '{prompt}' in style '{style}'")
    
    # Enhance prompt with style
    # e.g. "cinematic lighting, realistic, A futuristic city..."
    enhanced_prompt = f"{style}, {prompt}" if style else prompt
    encoded_prompt = urllib.parse.quote(enhanced_prompt)
    
    # Random seed to ensure unique results for same prompt if retried
    seed = random.randint(1, 999999)
    
    # Pollinations.ai URL structure
    # Supports sizing via query params or usage of specific model hints if needed
    return f"https://image.pollinations.ai/prompt/{encoded_prompt}?width=1024&height=1024&seed={seed}&nologo=true"
