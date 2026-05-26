# Strands Agent

A streaming AI chat interface powered by [Strands Agents SDK](https://github.com/strands-agents/sdk) and Gemini 2.5 Flash.

## Stack

- **Frontend** — React + TypeScript + Vite
- **Backend** — Node.js + Express
- **AI** — Strands Agents SDK with Google Gemini 2.5 Flash

## Project Structure

```
├── backend/
│   ├── agent/        # Agent instantiation
│   ├── config/       # Environment config & model params
│   └── routes/       # Express route handlers (SSE streaming)
├── src/
│   ├── api/          # Frontend fetch layer
│   ├── components/   # React components (AgentChat)
│   └── App.tsx
└── strands-agent.ts  # Backend entry point
```

## Setup & Running

### Prerequisites

- Node.js 18+
- A [Google AI Studio](https://aistudio.google.com/apikey) API key

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment

Create a `.env` file in the project root:

```bash
GEMINI_API_KEY=your_api_key_here
```

### 3. Start the backend

The backend runs on `http://localhost:3001` and handles all agent communication.

```bash
npm run server
```

You should see:
```
Agent server running on http://localhost:3001
```

### 4. Start the frontend

In a **separate terminal**, start the Vite dev server:

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### 5. Use the app

Type a question in the input and press Enter or click the send button. The agent's response streams back in real time.

---

## Available Scripts

| Script | Description |
|--------|-------------|
| `npm run server` | Start the Express backend |
| `npm run dev` | Start the Vite frontend dev server |
| `npm run build` | Build the frontend for production |
| `npm run lint` | Run ESLint |
