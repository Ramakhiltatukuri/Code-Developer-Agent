# Dev AI: The Autonomous Software Engineering Workspace

**Dev AI** is a production-grade, AI-powered software engineering platform designed to integrate directly with issue trackers (like Jira) to autonomously analyze requirements, design architecture, generate test cases, write code, and review its own output.

---

## 🚀 Features

- **Jira Integration**: Instantly pull ticket descriptions and requirements.
- **Agentic Workflow Engine**: Built with `langgraph` to process tasks through distinct phases:
  1. Requirements Analysis
  2. Architecture & System Design
  3. Quality Assurance (Test Cases)
  4. Code Generation
  5. Automated Code Review
- **Production-Grade UI**: A beautiful, dark-themed dashboard built with React, Vite, TailwindCSS, and Framer Motion. 
- **Professional Code Editor**: Full-screen Monaco Editor integration with file trees, syntax highlighting, and 1-click ZIP downloads.
- **Artifact Exporting**: Export AI-generated QA test cases directly to PDF, JSON, or CSV formats.
- **Global Command Palette**: Navigate the workspace seamlessly using `Cmd + K`.
- **Persistent State**: Workspaces are saved to LocalStorage, allowing you to browse ticket history and jump back into past sessions at any time.

---

## 🛠 Tech Stack

### Frontend
- **Framework**: React 18 + TypeScript + Vite
- **Styling**: TailwindCSS
- **State Management**: Zustand
- **Routing**: React Router
- **Editor**: `@monaco-editor/react`
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **UI Components**: `cmdk` (Command Palette)

### Backend
- **Framework**: FastAPI (Python)
- **AI/LLM Routing**: LangChain & LangGraph
- **Data Parsing**: Pydantic

---

## ⚙️ Setup & Installation

### 1. Clone the repository
```bash
git clone git@github.com:Ramakhiltatukuri/Code-Developer-Agent.git
cd Code-Developer-Agent
```

### 2. Backend Setup
Create a virtual environment and install dependencies:
```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

Set up your environment variables:
Create a `.env` file inside the `backend/` directory with the required LLM API keys:
```env
OPENAI_API_KEY=your_api_key_here
```

Start the FastAPI server:
```bash
python main.py
```
*The backend will run on `http://localhost:8000`*

### 3. Frontend Setup
Open a new terminal window, navigate to the frontend directory, and install dependencies:
```bash
cd frontend
npm install
```

Start the Vite development server:
```bash
npm run dev
```
*The frontend will run on `http://localhost:5173`*

---

## 💡 Usage

1. Open `http://localhost:5173` in your browser.
2. Enter a mock Jira Ticket ID (e.g., `PROJ-123`).
3. Watch the autonomous agent flow through Analysis, Architecture, QA, Code Gen, and Review.
4. Explore the generated files in the Code Editor, or download your test cases from the QA tab!

---

## 📝 License

MIT License
