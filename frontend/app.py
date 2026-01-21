import sys
import os
import streamlit as st

# --------------------------------------------------
# Fix Python path so backend & templates are visible
# --------------------------------------------------
ROOT_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
if ROOT_DIR not in sys.path:
    sys.path.append(ROOT_DIR)

# --------------------------------------------------
# Imports from project modules
# --------------------------------------------------
from backend.content_engine import generate_content
from templates.content_templates import CONTENT_TEMPLATES

# --------------------------------------------------
# Page Configuration
# --------------------------------------------------
st.set_page_config(
    page_title="AI Content Creator",
    page_icon="🤖",
    layout="wide"
)

# --------------------------------------------------
# Sidebar
# --------------------------------------------------
st.sidebar.title("🤖 AI Content Creator")
st.sidebar.markdown("AI-driven personalized content generation")

page = st.sidebar.radio(
    "Navigation",
    ["Home", "Generate Content", "About"]
)

# --------------------------------------------------
# Home Page
# --------------------------------------------------
if page == "Home":
    st.title("AI-Driven Personalized Content Creation")
    st.subheader("Generate high-quality content using AI")

    st.markdown(
        """
        This application helps users generate **personalized content** using
        Large Language Models (LLMs).

        ### Supported Content Types
        - LinkedIn Posts  
        - Professional Emails  
        - Advertisement Copy  
        - Blog Introductions  

        The system uses a **template-based prompt architecture**
        for clean, scalable, and professional content generation.
        """
    )

# --------------------------------------------------
# Generate Content Page
# --------------------------------------------------
elif page == "Generate Content":
    st.title("Generate Content")

    col1, col2 = st.columns(2)

    with col1:
        topic = st.text_input(
            "Enter Topic",
            placeholder="e.g., Why Artificial Intelligence is important"
        )

    with col2:
        content_type = st.selectbox(
            "Select Content Type",
            list(CONTENT_TEMPLATES.keys())
        )

    if st.button("Generate Content"):
        if not topic.strip():
            st.warning("⚠️ Please enter a topic.")
        else:
            with st.spinner("Generating content using AI..."):
                output = generate_content(content_type, topic)

            st.success("✅ Content generated successfully!")
            st.text_area(
                "Generated Content",
                value=output,
                height=320
            )

# --------------------------------------------------
# About Page
# --------------------------------------------------
elif page == "About":
    st.title("About This Project")

    st.markdown(
        """
        **AI-Driven Personalized Content Creation** is an internship-oriented project
        designed to explore real-world usage of Large Language Models (LLMs).

        ### Key Highlights
        - Modular backend architecture  
        - Template-based prompt system  
        - Streamlit UI with clean navigation  
        - Real AI content generation using Google Gemini  

        The project is built with **scalability, maintainability, and usability**
        as core principles.
        """
    )
