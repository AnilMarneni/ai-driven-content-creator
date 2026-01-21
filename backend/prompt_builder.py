def build_prompt(content_type: str, topic: str) -> str:
    templates = {
        "LinkedIn Post": f"Write a professional LinkedIn post about {topic}.",
        "Email": f"Write a professional email about {topic}.",
        "Ad Copy": f"Write persuasive ad copy promoting {topic}.",
        "Blog Intro": f"Write an engaging blog introduction about {topic}."
    }
    return templates.get(content_type, f"Write content about {topic}.")
