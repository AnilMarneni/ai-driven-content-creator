import streamlit as st

# Page config
st.set_page_config(
    page_title="AI Content Creator",
    page_icon="🤖",
    layout="wide"
)

# Sidebar
st.sidebar.title("🤖 AI Content Creator")
st.sidebar.markdown("Personalized AI-powered content generation")

page = st.sidebar.radio(
    "Navigation",
    ["Home", "Generate Content", "About"]
)

# Home Page
if page == "Home":
    st.title("AI-Driven Personalized Content Creation")
    st.subheader("Create high-quality content using AI")
    st.write(
        """
        This application helps users generate personalized content such as:
        - LinkedIn posts
        - Professional emails
        - Ad copy
        - Blog introductions
        
        Powered by Large Language Models (LLMs).
        """
    )

# Generate Content Page (Placeholder)
elif page == "Generate Content":
    st.title("Generate Content")
    st.info("Content generation module will be available in the next task.")

    st.text_input("Topic")
    st.selectbox("Content Type", ["LinkedIn Post", "Email", "Ad Copy", "Blog Intro"])
    st.button("Generate")

# About Page
elif page == "About":
    st.title("About This Project")
    st.write(
        """
        Developed as part of an AI-driven application to explore
        personalized content generation using modern LLMs.
        """
    )
