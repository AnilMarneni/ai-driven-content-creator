from backend.core.providers.router import router

def generate_text(prompt: str, model: str = None, **kwargs) -> str:
    """
    Generates text using the configured ModelRouter.
    
    Args:
        prompt: The input text prompt.
        model: Optional model ID to use. If None, the router selects a default.
        **kwargs: Additional generation parameters (temperature, etc.)
        
    Returns:
        Generated text string.
    """
    try:
        return router.generate(prompt, model_id=model, **kwargs)
    except Exception as e:
        # Log error here if needed
        print(f"LLM Generation Error: {e}")
        raise ValueError(f"Error generating content: {str(e)}")

