from .schemas import PromptTemplate
import uuid

# Standard System Templates
SYSTEM_TEMPLATES = [
    PromptTemplate(
        id="sys_linkedin_default",
        name="LinkedIn Standard",
        description="Professional LinkedIn post with engagement hooks.",
        category="LinkedIn Post",
        is_system=True,
        variables=["topic", "tone", "target_audience", "keywords", "content_length", "include_emojis"],
        template_text="""
You are an expert LinkedIn ghostwriter.
Create a LinkedIn post about {{topic}}.

Context:
- Tone: {{tone}}
- Target Audience: {{target_audience}}
- Content Length: {{content_length}}
- Keywords to include: {{keywords}}
- Use Emojis: {{include_emojis}}

Instructions:
1. Start with a strong hook (question or bold statement).
2. Provide value or insight in the middle paragraph.
3. End with a call to action (question for the audience).
4. Use formatting (bullet points) for readability.
"""
    ),
    PromptTemplate(
        id="sys_blog_educational",
        name="Educational Blog Post",
        description="Structured blog post for teaching a concept.",
        category="Blog Post",
        is_system=True,
        variables=["topic", "tone", "target_audience", "keywords"],
        template_text="""
Write an educational blog post about {{topic}}.

Target Audience: {{target_audience}}
Tone: {{tone}}

Structure:
1. Introduction: Hook and definition of the topic.
2. Why it matters: Explain the importance.
3. Key Concepts: 3 subheadings explaining core details.
4. Practical Tips: Bullet points on how to apply this.
5. Conclusion: Summary and final thought.

Ensure the content is SEO-friendly and uses the keywords: {{keywords}}.
"""
    ),
    PromptTemplate(
        id="sys_sales_email",
        name="Cold Sales Email",
        description="Persuasive cold email based on AIDA framework.",
        category="Email",
        is_system=True,
        variables=["topic", "tone", "target_audience"],
        template_text="""
Write a cold sales email about {{topic}}.

Audience: {{target_audience}}
Tone: {{tone}}

Use the AIDA framework:
- Attention: Grab their attention in the subject line and first sentence.
- Interest: Pique interest with a statistic or relevant problem.
- Desire: Show how our solution (related to {{topic}}) solves it.
- Action: specific call to action (book a call).

Keep it concise and conversational.
"""
    )
]

def get_default_templates():
    return SYSTEM_TEMPLATES
