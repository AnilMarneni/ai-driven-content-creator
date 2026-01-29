from abc import ABC, abstractmethod
from typing import Dict, Any, Optional

class LLMProvider(ABC):
    """Abstract base class for LLM providers."""

    @abstractmethod
    def generate_text(self, prompt: str, **kwargs) -> str:
        """
        Generates text based on the given prompt.
        
        Args:
            prompt: The input prompt.
            **kwargs: Additional model-specific parameters (e.g., temperature, max_tokens).
            
        Returns:
            The generated text string.
            
        Raises:
            ValueError: If generation fails or response is empty.
        """
        pass

    @property
    @abstractmethod
    def provider_name(self) -> str:
        """Returns the name of the provider (e.g., 'google', 'openai')."""
        pass
