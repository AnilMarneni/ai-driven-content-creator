# AI-Driven Content Creator

An AI-powered content generation tool that helps create blog posts, tweets, LinkedIn updates, and emails using Google's Gemini Pro.

## Project Structure

- **backend/**: FastAPI backend service.
  - `api/`: API endpoints.
  - `core/`: Business logic and LLM integration.
- **frontend/**: Next.js frontend application.
  - Modern UI with Tailwind CSS and Shadcn/UI.

## Prerequisites

- Python 3.9+
- Node.js 18+
- Google Gemini API Key

## Setup

1. **Environment Variables**:
   Ensure you have a `.env` file in the root directory with your API keys:
   ```env
   GEMINI_API_KEY=your_key_here
   ```

2. **Backend**:
   ```bash
   # Install dependencies
   pip install -r requirements.txt
   
   # Run backend
   run_backend.bat
   ```

3. **Frontend**:
   ```bash
   # Install dependencies and run
   run_frontend.bat
   ```

## Usage

- Open the frontend URL (typically `http://localhost:3000`).
- Select the content type (Blog, Tweet, etc.).
- Enter the topic and other details.
- Click "Generate" to get your AI-generated content.
