
def build_prompt(
    content_type: str,
    topic: str,
    tone: str,
    target_audience: str = "General",
    content_length: str = "Medium",
    keywords: str = "",
    formality: int = 3,
    include_emojis: bool = True,
    brand_voice_id: int = None,
    language: str = "English"
) -> str:
    """
    Builds a detailed prompt for the LLM based on user inputs.
    """

    # 1. Base Instruction
    prompt = f"Goal: Write a {content_type} about '{topic}' in {language}.\n"
    prompt += f"Target Audience: {target_audience}.\n"
    
    # Brand Voice Logic
    if brand_voice_id:
        from backend.core.database import get_brand_voice_by_id
        voice = get_brand_voice_by_id(brand_voice_id)
        if voice:
            prompt += f"Tone/Style: Copy the style of '{voice['name']}'. Instructions: {voice['voice_content']}.\n"
        else:
            prompt += f"Tone: {tone}.\n"
    else:
        prompt += f"Tone: {tone}.\n"

    # 2. Length Constraints
    word_counts = {
        "Short": "50-80 words",
        "Medium": "100-150 words",
        "Long": "200-300 words"
    }
    length_instruction = word_counts.get(content_length, "150 words")
    prompt += f"Length: Approximately {length_instruction}.\n"

    # 3. Formality & Style
    formality_desc = {
        1: "Very casual, slang allowed, conversational",
        2: "Casual and friendly",
        3: "Standard professional",
        4: "Formal and structured",
        5: "Highly formal and academic"
    }
    prompt += f"Formality Level: {formality}/5 ({formality_desc.get(formality, 'Standard')}).\n"

    # 4. Keywords
    if keywords:
        prompt += f"Keywords to include: {keywords}.\n"

    # 5. Emojis
    if include_emojis:
        prompt += "Use emojis strategically to increase engagement.\n"
    else:
        prompt += "Do NOT use emojis.\n"

    # 6. Content-Type Specific Rules
    type_lower = content_type.lower()
    if "linkedin" in type_lower:
        prompt += "Structure: Hook -> Value -> Call to Action. Use short paragraphs. Add 3-5 hashtags at the end.\n"
    elif "twitter" in type_lower or "tweet" in type_lower:
        prompt += "Structure: Concise punchy text. Under 280 characters if possible. 2 hashtags max.\n"
    elif "email" in type_lower:
        prompt += "Structure: Subject Line -> Greeting -> Body -> Sign-off. Make it clear and actionable.\n"
    elif "ad" in type_lower:
        prompt += "Structure: Headline -> Benefit -> Offer -> Urgent CTA. Focus on conversion.\n"

    prompt += "\nOutput only the content, no explanations."
    return prompt
