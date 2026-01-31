from .schemas import PromptTemplate, PromptBlock, PromptVariable, BlockType

LINKEDIN_AUTHORITY = PromptTemplate(
    id="linkedin-authority-v1",
    name="LinkedIn Authority Builder",
    description="Creates high-engagement, thought-leadership style posts optimized for the LinkedIn algorithm.",
    tags=["Social Media", "LinkedIn", "Thought Leadership"],
    variables=[
        PromptVariable(name="topic", description="The main subject of the post"),
        PromptVariable(name="audience", description="Target reader persona", default_value="Professionals"),
        PromptVariable(name="tone", description="Voice of the post", default_value="Professional but Authentic")
    ],
    blocks=[
        PromptBlock(
            id="system_core",
            type=BlockType.SYSTEM,
            content="You are a LinkedIn Influencer and Copywriting Expert. Your goal is to write posts that drive engagement, comments, and shares. Use short paragraphs, clear hooks, and a conversational yet professional tone.",
            is_locked=True,
            description="Core system persona (Locked)"
        ),
        PromptBlock(
            id="instruction_hook",
            type=BlockType.INSTRUCTION,
            content="Write a catchy 'hook' (first 2 lines) about {{topic}} that stops the scroll. It should challenge a common belief or state a surprising fact.",
            is_locked=False,
            description="The opening hook strategy"
        ),
        PromptBlock(
            id="instruction_body",
            type=BlockType.INSTRUCTION,
            content="Expand on the {{topic}} for {{audience}}. \n- Use a 'Problem-Agitation-Solution' structure.\n- Include personal insight or 'I' statements to build authenticity.\n- Keep sentences under 20 words where possible.\n- Tone: {{tone}}.",
            is_locked=False,
            description="Main body instructions"
        ),
        PromptBlock(
            id="instruction_cta",
            type=BlockType.INSTRUCTION,
            content="End with a question to {{audience}} that encourages comments. Do not use generic CTAs like 'Thoughts?'. Be specific.",
            is_locked=False,
            description="Call to Action logic"
        )
    ]
)

BLOG_POST_SEO = PromptTemplate(
    id="blog-seo-v1",
    name="SEO Optimized Blog Post",
    description="Writes a structured, keyword-rich blog post designed to rank.",
    tags=["Blog", "SEO", "Long-form"],
    variables=[
        PromptVariable(name="topic", description="Blog Title/Topic"),
        PromptVariable(name="keywords", description="Comma-separated keywords", default_value="industry trends"),
        PromptVariable(name="tone", description="Writing tone", default_value="Informative")
    ],
    blocks=[
        PromptBlock(
            id="system_core",
            type=BlockType.SYSTEM,
            content="You are an SEO Content Writer. You write comprehensive, easy-to-read articles that Google loves.",
            is_locked=True
        ),
        PromptBlock(
            id="instruction_structure",
            type=BlockType.INSTRUCTION,
            content="Write a blog post about '{{topic}}'.\nInclude a Tantalizing Title (H1).\nUse H2s and H3s for structure.\nIntegrate these keywords naturally: {{keywords}}.\nTone: {{tone}}.",
            is_locked=False
        )
    ]
)

DEFAULT_TEMPLATES = [LINKEDIN_AUTHORITY, BLOG_POST_SEO]
