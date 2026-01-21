from templates.content_templates import CONTENT_TEMPLATES

def build_prompt(content_type: str, topic: str) -> str:
    template_data = CONTENT_TEMPLATES.get(content_type)

    if not template_data:
        return f"Write content about {topic}."

    return template_data["prompt"].format(topic=topic)
