<div align="center">
  <h1>📄 Lumina-Proposals</h1>
  <p>An enterprise-ready UI with a local-first RAG document extraction engine.</p>
</div>

---

## 📖 Overview

**Lumina-Proposals** is designed to process and synthesize massive corporate RFPs. It combines an excellent structural RAG pipeline abstraction with a fast Next.js API layer to ingest, chunk, and embed large PDF documents for semantic retrieval.

## 🏗️ System Architecture

The repository enforces strict separation of concerns within the RAG lifecycle:

- **Frontend & API Routes:** Next.js (TypeScript) handling the file uploads and interface interactions.
- **RAG Services (`ai-rag/services`):**
  - `document-parser.ts`: Extracts text from PDFs.
  - `chunker.ts`: Semantically chunks large strings.
  - `embeddings.ts`: Interfaces with embedding models.
  - `ingestion-pipeline.ts`: Orchestrates the sequential flow.
- **Vector Store (`lib/vector-store.ts`):** Utilizes an extremely fast `InMemoryVectorStore` interface to keep vectors and text chunks directly in V8 memory without relying on external network requests.

### ⚠️ Production Architecture Notes

Currently, this repository is optimized for **local-first speed and development simplicity**:
1. **Single-Threaded Ingestion:** The `ingestDocument` pipeline runs synchronously inline within the Next.js `POST` API route. Because Node.js utilizes a single-threaded event loop, processing massive 100+ page PDFs will temporarily block concurrent API requests. *For enterprise production deployments*, this pipeline should be refactored to emit a Job ID and offload the parsing/chunking to a Redis-backed queue (e.g., BullMQ) or an external background worker.
2. **In-Memory Store:** The current implementation uses an array mapped in RAM. This provides zero-latency reads, but lacks disk persistence. *Before scaling to thousands of documents*, swap out the in-memory factory for a persistent vector database connection like Pinecone or Supabase pgvector to avoid Out-Of-Memory (OOM) leaks.

## 🚀 Getting Started

1. **Install Dependencies:**
   ```bash
   npm install
   ```
2. **Launch the Development Server:**
   ```bash
   npm run dev
   ```

## 📜 License
Distributed under the MIT License.
