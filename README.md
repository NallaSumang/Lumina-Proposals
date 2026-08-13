<div align="center">
  <h1>📄 Lumina-Proposals</h1>
  <p>A local-first RAG document extraction engine for corporate RFP automation.</p>
</div>

---

## 📖 Overview

**Lumina-Proposals** is a Next.js application that demonstrates a complete Retrieval-Augmented Generation (RAG) pipeline for processing large corporate RFPs and security questionnaires. The system ingests, chunks, embeds, and retrieves document content through a modular service architecture — all running locally in V8 memory without external database dependencies.

> **Status:** This is a local development prototype. All data is served from in-memory mock stores. The RAG pipeline code is fully implemented but the embedding provider currently falls back to a deterministic mock (the OpenAI API integration is stubbed but not yet wired to a live key).

## 🏗️ System Architecture

The repository enforces strict separation of concerns within the RAG lifecycle:

- **Frontend & API Routes:** Next.js 15 (TypeScript) handling file uploads, RFP management, analytics dashboards, and search interfaces.
- **RAG Services (`ai-rag/services/`):**
  - `document-parser.ts` — Extracts text from uploaded PDFs (PDF, DOCX, TXT, CSV, Markdown).
  - `chunker.ts` — Semantically chunks large documents with configurable token limits and overlap.
  - `embeddings.ts` — Interfaces with embedding providers (mock provider active; OpenAI `text-embedding-ada-002` stubbed).
  - `ingestion-pipeline.ts` — Orchestrates the sequential parse → chunk → embed → store flow.
  - `retrieval-pipeline.ts` — Handles semantic search queries against the vector store.
  - `prompt-engine.ts` — Constructs LLM prompts with retrieved context and citation formatting.
- **Vector Store (`lib/vector-store.ts`):** An `InMemoryVectorStore` singleton that holds vectors and text chunks directly in V8 memory. Fast for development, but ephemeral — data is lost on restart.
- **Mock Data (`lib/mock.ts`):** All RFP documents, questions, and analytics are served from hardcoded mock data for UI development.

### ⚠️ Production Architecture Notes

This repository is optimized for **local-first speed and development simplicity**:
1. **No external database** — all data lives in `lib/mock.ts` and in-memory stores.
2. **No live LLM calls** — the OpenAI embedding/LLM integration is stubbed in code (`ai-rag/config.ts` targets `gpt-4o` and `text-embedding-ada-002`) but currently delegates to a mock provider.
3. **No vector database** — config references ChromaDB but no ChromaDB client is installed; the `InMemoryVectorStore` is used instead.
4. **Not deployed** — no `vercel.json`, `Dockerfile`, or deployment configuration exists.

## 🛠️ Tech Stack

| Layer | Technology |
| :--- | :--- |
| **Framework** | Next.js 15, React 19, TypeScript |
| **UI** | shadcn/ui (Radix primitives), Tailwind CSS, Framer Motion |
| **State** | Zustand, TanStack Query, TanStack Table |
| **RAG Pipeline** | Custom TypeScript services (chunker, embeddings, retrieval, prompt engine) |
| **Vector Store** | InMemoryVectorStore (V8 heap) |
| **Charts** | Recharts |

## 🚀 Getting Started

```bash
npm install
npm run dev
```

The application runs at `http://localhost:3000` with mock data pre-loaded.

## 📜 License
Distributed under the MIT License.
