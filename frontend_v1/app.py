import sys
import os
import streamlit as st

# --------------------------------------------------
# ADD PROJECT ROOT TO PATH
# --------------------------------------------------
ROOT_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
if ROOT_DIR not in sys.path:
    sys.path.append(ROOT_DIR)

from backend.content_engine import generate_content
from templates.content_templates import CONTENT_TEMPLATES

# --------------------------------------------------
# PAGE SETUP
# --------------------------------------------------
st.set_page_config(
    page_title="AI Content Studio",
    page_icon="✨",
    layout="wide"
)

# --------------------------------------------------
# CUSTOM CSS
# --------------------------------------------------
st.markdown("""
<style>
/* GLOBAL STYLES */
body {
    font-family: "Segoe UI", "Helvetica Neue", Arial, sans-serif;
}

/* NAV BAR */
.topnav {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: linear-gradient(90deg, #4b6cb7, #182848);
    padding: 1rem 2rem;
    border-radius: 0 0 10px 10px;
}
.topnav-title {
    font-size: 28px;
    font-weight: bold;
    color: white;
}
.topnav-link {
    font-size: 16px;
    color: white;
    margin: 0 1rem;
    cursor: pointer;
}
.topnav-link:hover {
    color: #ffd700;
}

/* SECTION HEADER */
.section-header {
    font-size: 34px;
    font-weight: 700;
    margin-top: 1rem;
    margin-bottom: 0.5rem;
}

/* CARD */
.card {
    background: #ffffff;
    border-radius: 12px;
    box-shadow: 0px 4px 16px rgba(0,0,0,0.08);
    padding: 1.8rem;
    margin-bottom: 1.5rem;
}
.card-title {
    font-size: 22px;
    font-weight: 600;
    margin-bottom: 0.5em;
}
.card-text {
    font-size: 16px;
    color: #444;
}

/* BUTTON */
.stButton>button {
    background: #4b6cb7;
    color: white;
    border-radius: 8px;
    padding: 0.7em 1.5em;
    font-weight: bold;
}
.stButton>button:hover {
    background: #182848;
}

/* TEXTAREA */
textarea {
    font-size: 16px;
}

</style>
""", unsafe_allow_html=True)

# --------------------------------------------------
# TOP NAVIGATION
# --------------------------------------------------
st.markdown("""
<div class="topnav">
    <div class="topnav-title">✨ AI Content Studio</div>
    <div>
        <span class="topnav-link" onclick="window.location.reload()">🏠 Home</span>
        <span class="topnav-link" onclick="document.querySelector('#generate').scrollIntoView()">✍️ Generate</span>
        <span class="topnav-link" onclick="document.querySelector('#templates').scrollIntoView()">📦 Templates</span>
        <span class="topnav-link" onclick="document.querySelector('#about').scrollIntoView()">ℹ️ About</span>
    </div>
</div>
""", unsafe_allow_html=True)

# --------------------------------------------------
# BODY CONTENT
# --------------------------------------------------

# -----------------------
# HOME SECTION
# -----------------------
st.markdown('<div id="home"></div>', unsafe_allow_html=True)
st.markdown('<div class="section-header">Welcome to AI Content Studio</div>', unsafe_allow_html=True)
st.markdown("""
<div class="card">
    <div class="card-title">Your AI Writing Partner</div>
    <div class="card-text">
        Create high-quality content like posts, emails, ads, intros, and more — powered by AI.
        Think of it like your *creative assistant* — sleek, fast, intelligent.
    </div>
</div>
""", unsafe_allow_html=True)

# Feature Highlights
col1, col2, col3 = st.columns(3)
with col1:
    st.markdown("""
    <div class="card">
      📌 <b>Lightning Fast</b><br>
      Generate content instantly.
    </div>
    """, unsafe_allow_html=True)
with col2:
    st.markdown("""
    <div class="card">
      🎨 <b>Beautiful Templates</b><br>
      Professionally designed prompts.
    </div>
    """, unsafe_allow_html=True)
with col3:
    st.markdown("""
    <div class="card">
      ⚙️ <b>Smart Automation</b><br>
      Auto-formatting & consistency.
    </div>
    """, unsafe_allow_html=True)

st.markdown("---")

# -----------------------
# GENERATE CONTENT
# -----------------------
st.markdown('<div id="generate"></div>', unsafe_allow_html=True)
st.markdown('<div class="section-header">Generate Content</div>', unsafe_allow_html=True)

with st.container():
    with st.form(key="gen_form"):
        col1, col2 = st.columns([2, 1])
        with col1:
            topic = st.text_input("📌 Enter Topic", placeholder="Why AI is the future?")
        with col2:
            content_type = st.selectbox(
                "📄 Content Type",
                list(CONTENT_TEMPLATES.keys())
            )

        submitted = st.form_submit_button("✨ Generate")

    if submitted:
        if not topic:
            st.error("Please enter a topic.")
        else:
            with st.spinner("AI is generating your content..."):
                result = generate_content(content_type, topic)

            st.markdown("""
            <div class="card">
                <div class="card-title">Generated Output</div>
            </div>
            """, unsafe_allow_html=True)

            st.text_area(" ", value=result, height=350)


st.markdown("---")

# -----------------------
# TEMPLATES LIST
# -----------------------
st.markdown('<div id="templates"></div>', unsafe_allow_html=True)
st.markdown('<div class="section-header">Template Library</div>', unsafe_allow_html=True)

for key, data in CONTENT_TEMPLATES.items():
    st.markdown(f"""
    <div class="card">
        <b>{key}</b><br>
        {data.get('description', '')}
    </div>
    """, unsafe_allow_html=True)

st.markdown("---")

# -----------------------
# ABOUT SECTION
# -----------------------
st.markdown('<div id="about"></div>', unsafe_allow_html=True)
st.markdown('<div class="section-header">About The Project</div>', unsafe_allow_html=True)

st.markdown("""
<div class="card">
  <b>AI Content Studio</b> is built as a professional content generation tool,
  with modern UI/UX in mind. It’s designed for real usability, aesthetics,
  and extensibility — not just functionality.
</div>
""", unsafe_allow_html=True)
