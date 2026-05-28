# Strands Agent

A streaming AI chat interface powered by [Strands Agents SDK](https://github.com/strands-agents/sdk) and Gemini 2.5 Flash, with RAG support via ChromaDB.

## Stack

- **Frontend** — React + TypeScript + Vite
- **Backend** — Node.js + Express
- **AI** — Strands Agents SDK with Google Gemini 2.5 Flash
- **RAG** — ChromaDB + Gemini embeddings (`gemini-embedding-001`)

## Project Structure

```
├── backend/
│   ├── agent/        # Agent instantiation + RAG tool registration
│   ├── config/       # Environment config & model params
│   ├── routes/       # Express route handlers (SSE streaming)
│   └── tools/        # RAG tool (queries ChromaDB)
├── chroma/           # Local ChromaDB persistent store
├── chroma-collection.ts  # ChromaDB client + Gemini embedding function
├── ingest.ts         # PDF ingestion script
├── ragdocs/          # Source documents for RAG
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

### 3. Ingest documents (first time only)

Place PDFs in the `ragdocs/` folder, then run:

```bash
npx tsx --env-file=.env ingest.ts
```

This chunks the PDF and stores embeddings in ChromaDB locally.

### 4. Start the backend

```bash
npm run server
```

### 5. Start the frontend

In a **separate terminal**:

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## Available Scripts

| Script | Description |
|--------|-------------|
| `npm run server` | Start the Express backend |
| `npm run dev` | Start the Vite frontend dev server |
| `npm run build` | Build the frontend for production |
| `npm run lint` | Run ESLint |
