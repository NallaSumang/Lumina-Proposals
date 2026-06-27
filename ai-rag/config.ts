/* ------------------------------------------------------------------ */
/*  AI & RAG Module — Centralised Configuration                       */
/*  TenderDox · TeamMate 3                                            */
/* ------------------------------------------------------------------ */

import type {
  ChunkOptions,
  EmbeddingProviderConfig,
  VectorStoreConfig,
  LLMProviderConfig,
  RetrievalOptions,
} from "./types";

// ── Chunking defaults ───────────────────────────────────────────────

export const DEFAULT_CHUNK_OPTIONS: ChunkOptions = {
  maxTokens: 512,
  overlapTokens: 64,
  strategy: "semantic",
  preserveMetadata: true,
};

// ── Embedding defaults ──────────────────────────────────────────────

export const DEFAULT_EMBEDDING_CONFIG: EmbeddingProviderConfig = {
  provider: "openai",
  model: "text-embedding-ada-002",
  dimensions: 1536,
  batchSize: 64,
  // apiKey loaded from process.env.OPENAI_API_KEY at runtime
};

// ── Vector store defaults ───────────────────────────────────────────

export const DEFAULT_VECTOR_STORE_CONFIG: VectorStoreConfig = {
  provider: "chromadb",
  collectionName: "tenderdox-main",
  dimensions: 1536,
  // For local dev ChromaDB uses in-process mode; no host/key required.
  // For production, set CHROMA_HOST env var.
};

// ── LLM defaults ────────────────────────────────────────────────────

export const DEFAULT_LLM_CONFIG: LLMProviderConfig = {
  provider: "openai",
  model: "gpt-4o",
  maxTokens: 4096,
  temperature: 0.1,   // low temp for factual/compliance answers
  // apiKey loaded from process.env.OPENAI_API_KEY at runtime
};

// ── Retrieval defaults ──────────────────────────────────────────────

export const DEFAULT_RETRIEVAL_OPTIONS: RetrievalOptions = {
  topK: 5,
  scoreThreshold: 0.7,
  rerank: true,
};

// ── Supported file types ────────────────────────────────────────────

export const SUPPORTED_MIME_TYPES: Record<string, string> = {
  "application/pdf": "PDF",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": "DOCX",
  "text/plain": "TXT",
  "text/csv": "CSV",
  "text/markdown": "Markdown",
};

export const MAX_FILE_SIZE_BYTES = 50 * 1024 * 1024; // 50 MB

// ── Prompt budgets ──────────────────────────────────────────────────

export const PROMPT_TOKEN_BUDGET = 12_000;    // context window budget
export const MAX_CONTEXT_CHUNKS = 8;          // hard cap on chunks fed to LLM
export const CITATION_FORMAT = "inline";      // "inline" | "footnote"
