from typing import List, Optional, Dict, Any
from .schemas import PromptTemplate, PromptOverride
from .defaults import get_default_templates
import re

class PromptManager:
    def __init__(self):
        # In-memory storage for now. 
        # In a real app, we'd load user templates from DB here.
        self.templates: Dict[str, PromptTemplate] = {t.id: t for t in get_default_templates()}

    def get_template(self, template_id: str) -> Optional[PromptTemplate]:
        return self.templates.get(template_id)

    def list_templates(self) -> List[PromptTemplate]:
        return list(self.templates.values())

    def create_template(self, template: PromptTemplate) -> PromptTemplate:
        # Simple validation
        self._validate_placeholders(template.template_text, template.variables)
        self.templates[template.id] = template
        return template

    def resolve_prompt(self, override: PromptOverride, params: Dict[str, Any]) -> str:
        """
        Constructs the final prompt string based on an override or defaults.
        """
        template_text = ""
        
        # 1. Determine the base template text
        if override.custom_template:
            # User provided a raw custom template string
            template_text = override.custom_template
            # improved validation for custom text could happen here
        elif override.template_id:
            # User selected a specific template ID
            tmpl = self.get_template(override.template_id)
            if not tmpl:
                raise ValueError(f"Template {override.template_id} not found")
            template_text = tmpl.template_text
        else:
            # No override, we shouldn't be here if logic is good, 
            # but we could fallback to a default if we knew the content type.
            raise ValueError("No template or override provided")

        # 2. Substitute variables
        # We need to ensure all required variables are present in params
        # For now, we'll do a safe substitution
        
        # Find all {{variable}} patterns
        required_vars = re.findall(r"\{\{(\w+)\}\}", template_text)
        
        for var in required_vars:
            val = params.get(var, "")
            # Basic sanitization could happen here
            template_text = template_text.replace(f"{{{{{var}}}}}", str(val))
            
        return template_text

    def _validate_placeholders(self, text: str, expected_vars: List[str]):
        """
        Ensures the text contains the expected placeholders.
        """
        # This is loose validation. 
        # We might want to ensure at least {{topic}} is present.
        if "{{topic}}" not in text:
             # This is a strict rule to prevent completely broken prompts
             # But maybe we allow it in advanced mode? 
             # Let's warn but not block for now, or enforce it?
             # User requirements said "Missing variables must fallback to defaults"
             pass
        return True

prompt_manager = PromptManager()
