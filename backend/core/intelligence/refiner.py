from backend.core.llm_client import generate_text

def refine_content(original_text: str, instruction: str) -> str:
    """
    Refines the given text based on a specific instruction (e.g. 'Make it punchier', 'Shorten').
    Uses a delta-based approach where the LLM is instructed to ONLY output the rewritten text.
    """
    # Defensive check
    if not original_text or not original_text.strip():
        return ""

    prompt = f"""
    You are an expert editor. Your task is to rewrite the following text according to the user's instruction.
    
    ORIGINAL TEXT:
    {original_text}
    
    INSTRUCTION:
    {instruction}
    
    RULES:
    1. Output ONLY the rewritten text.
    2. Do not add conversational filler like "Here is the rewritten text".
    3. Maintain the core meaning of the original.
    4. If the instruction is impossible for the text (e.g. "shorten" a single word), return the original.
    """
    
    return generate_text(prompt, model="models/gemini-flash-latest")

def get_suggestions(text: str) -> list[str]:
    """
    Analyzes text and returns a list of 3 short, actionable suggestions for improvement.
    """
    prompt = f"""
    Analyze the following text and provide 3 specific, actionable suggestions to improve it.
    Focus on clarity, tone, and impact.
    
    TEXT:
    {text}
    
    OUTPUT FORMAT:
    Return ONLY a raw JSON list of strings, e.g. ["Use stronger verbs", "Shorten the second sentence", "Add a Call to Action"].
    Do not use markdown formatting.
    """
    
    response = generate_text(prompt, model="models/gemini-flash-latest")
    
    # Simple cleanup to ensure list format if LLM misbehaves slightly
    import json
    import re
    
    try:
        # Extract JSON-like content
        match = re.search(r'\[.*\]', response, re.DOTALL)
        if match:
            return json.loads(match.group())
        return []
    except:
        return ["Could not generate specific suggestions."] # Fallback

def merge_contents(contents: list[str], instruction: str = "") -> str:
    """
    Combines multiple text segments into one cohesive piece.
    """
    if not contents:
        return ""
    
    combined_input = "\n\n---\n\n".join(contents)
    
    prompt = f"""
    You are an expert editor. Your task is to merge the following separate text segments into one cohesive, well-flowing document.
    
    SEGMENTS TO MERGE:
    {combined_input}
    
    INSTRUCTION:
    {instruction if instruction else "Merge them naturally, ensuring smooth transitions between topics."}
    
    RULES:
    1. Output ONLY the merged text.
    2. Do not add conversational filler.
    3. Ensure the tone is consistent throughout.
    """
    
    return generate_text(prompt, model="models/gemini-flash-latest")
