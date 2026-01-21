import sys
import os

# Add project root to Python path
ROOT_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
if ROOT_DIR not in sys.path:
    sys.path.append(ROOT_DIR)


import streamlit as st
from backend.content_engine import generate_content

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
st.sidebar.markdown("Personalized AI-powered content generation")

page = st.sidebar.radio(
    "Navigation",
    ["Home", "Generate Content", "About"]
)

# --------------------------------------------------
# Home Page
# --------------------------------------------------
if page == "Home":
    st.title("AI-Driven Personalized Content Creation")
    st.subheader("Create high-quality content using AI")

    st.write(
        """
        This application allows users to generate personalized content such as:
        
        - LinkedIn posts  
        - Professional emails  
        - Advertisement copy  
        - Blog introductions  

        The system uses Large Language Models (LLMs) with a robust backend
        architecture and fallback mechanisms for uninterrupted usage.
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
            placeholder="e.g., Artificial Intelligence in Education"
        )

    with col2:
        content_type = st.selectbox(
            "Select Content Type",
            ["LinkedIn Post", "Email", "Ad Copy", "Blog Intro"]
        )

    if st.button("Generate Content"):
        if not topic.strip():
            st.warning("⚠️ Please enter a topic before generating content.")
        else:
            with st.spinner("Generating content using AI..."):
                output = generate_content(content_type, topic)

            st.success("✅ Content generated successfully!")
            st.text_area(
                "Generated Content",
                value=output,
                height=300
            )

# --------------------------------------------------
# About Page
# --------------------------------------------------
elif page == "About":
    st.title("About This Project")

    st.write(
        """
        **AI-Driven Personalized Content Creation** is an internship project
        designed to explore how Large Language Models (LLMs) can be used to
        generate customized, high-quality written content.

        ### Key Features
        - Modular backend architecture
        - Prompt-based content generation
        - Streamlit-based interactive UI
        - Graceful handling of API limitations

        This project is built with scalability and real-world usability in mind.
        """
    )
