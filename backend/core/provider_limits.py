from typing import Dict

# Rate Limits (Requests Per Minute)
PROVIDER_RPM: Dict[str, int] = {
    "gemini": 60,       # Google Gemini
    "openai": 500,      # Example
    "anthropic": 100,   # Example
    "fake": 1000        # Local testing
}

# Concurrent Request Limits
PROVIDER_CONCURRENCY: Dict[str, int] = {
    "gemini": 2,
    "openai": 10,
    "anthropic": 5,
    "fake": 50
}

def get_provider_limits(provider_name: str) -> Dict[str, int]:
    return {
        "rpm": PROVIDER_RPM.get(provider_name.lower(), 10),
        "concurrency": PROVIDER_CONCURRENCY.get(provider_name.lower(), 1)
    }
