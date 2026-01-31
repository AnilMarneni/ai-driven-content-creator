import re
from typing import Dict, Any, List
from .schemas import PromptTemplate, PromptBlock, PromptOverride

class PromptEngine:
    def __init__(self):
        # In a real app, this might load from a DB
        # For now, we'll keep an in-memory registry of system templates
        self._system_templates: Dict[str, PromptTemplate] = {}

    def register_template(self, template: PromptTemplate):
        """Register a template in the system."""
        self._system_templates[template.id] = template

    def get_template(self, template_id: str) -> PromptTemplate:
        """Retrieve a template by ID."""
        if template_id not in self._system_templates:
            raise ValueError(f"Template {template_id} not found")
        return self._system_templates[template_id]

    def resolve_prompt(self, 
                      template_id: str, 
                      variables: Dict[str, Any], 
                      overrides: Dict[str, str] = None) -> str:
        """
        Compiles the final prompt string from blocks, variables, and overrides.
        Enforces safety locks.
        """
        template = self.get_template(template_id)
        overrides = overrides or {}
        
        final_prompt_parts = []

        for block in template.blocks:
            content = block.content

            # 1. Apply Block Overrides (if allowed)
            if block.id in overrides:
                if block.is_locked:
                    # Ignore override for locked blocks (Security Constraint)
                    # We log a warning in a real system, here we just stick to original
                    print(f"WARNING: Attempted to override locked block '{block.id}'. Ignoring.")
                else:
                    content = overrides[block.id]

            # 2. Variable Substitution
            # We use simple {{ key }} replacement
            # Identify needed variables from schema or regex?
            # For robustness, we iterate the known variables
            
            # Apply substitutions
            for var_name, var_val in variables.items():
                if var_val is None: 
                    # Use default from template variable def if exists?
                    # Simplified logic:
                    var_val = ""
                
                # Replace {{var_name}}
                pattern = f"{{{{\s*{var_name}\s*}}}}" # Matches {{ var }} or {{var}}
                content = re.sub(pattern, str(var_val), content, flags=re.IGNORECASE)

            # Handle missing variables (defaults)
            for defined_var in template.variables:
                if defined_var.name not in variables and defined_var.default_value:
                     pattern = f"{{{{\s*{defined_var.name}\s*}}}}"
                     content = re.sub(pattern, defined_var.default_value, content, flags=re.IGNORECASE)

            final_prompt_parts.append(content)

        return "\n\n".join(final_prompt_parts)

# Global Instance
prompt_engine = PromptEngine()
