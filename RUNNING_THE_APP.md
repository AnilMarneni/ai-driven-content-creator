# How to Run the AI Driven Content Creator App

## Prerequisites
Ensure you have the following installed on your system:
- **Python 3.8+**
- **Node.js 16+** & **npm**

## 1. Initial Setup
If this is your first time running the app, you need to set up the environment updates.

### Backend Setup
1. Open a terminal in the root directory `d:\InfosysSprinboard\ai-driven-content-creator`.
2. Ensure your virtual environment is active (if you haven't created one):
    ```powershell
    python -m venv venv
    ```
3. Activate the virtual environment:
    ```powershell
    .\venv\Scripts\activate
    ```
4. Install Python dependencies:
    ```powershell
    pip install -r requirements.txt
    ```
5. **Environment Variables**: Make sure you have a `.env` file in the root directory with your `GEMINI_API_KEY`.

### Frontend Setup
1. Navigate to the frontend directory:
    ```powershell
    cd frontend
    ```
2. Install dependencies:
    ```powershell
    npm install
    ```
    *(Note: This is automatically handled by the start script, but good to know)*

## 2. Running the Application
We have provided convenient batch scripts to start the application components.

### Step A: Start the Backend
1. Go to the root directory.
2. Double-click **`run_backend.bat`** OR run it from the terminal:
    ```powershell
    .\run_backend.bat
    ```
   *This will start the FastAPI server on [http://localhost:8000](http://localhost:8000).*

### Step B: Start the Frontend
1. Go to the root directory.
2. Double-click **`run_frontend.bat`** OR run it from the terminal:
    ```powershell
    .\run_frontend.bat
    ```
   *This will start the Next.js development server, usually on [http://localhost:3000](http://localhost:3000).*

## 3. Using the App
- Open your browser and navigate to **[http://localhost:3000](http://localhost:3000)**.
- You should see the Login/Signup page.
- Create an account or log in to start generating content!

## Troubleshooting
- **Modules not found**: Ensure you activated the virtual environment (`.\venv\Scripts\activate`) before running python commands manually.
- **Frontend errors**: Try deleting `node_modules` in the `frontend` folder and running `npm install` again.
- **Database errors**: The database is located at `backend/data/content_history.db`. Ensure the backend has permissions to write to this folder.
