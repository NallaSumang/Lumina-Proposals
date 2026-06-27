/* ------------------------------------------------------------------ */
/*  AI & RAG Module — Core Type Definitions                           */
/*  TenderDox · TeamMate 3                                            */
/* ------------------------------------------------------------------ */

// ── Document Parsing ────────────────────────────────────────────────

export interface DocumentMetadata {
  title: string;
  author?: string;
  createdAt?: string;
  pageCount?: number;
  mimeType: string;
  fileName: string;
  fileSize: number;            // bytes
  language?: string;
}

export interface DocumentSection {
  heading?: string;
  level: number;               // 0 = root, 1 = h1, 2 = h2 …
  content: string;
  pageNumber?: number;
  index: number;               // sequential position in document
}

export interface ParsedDocument {
  id: string;
  metadata: DocumentMetadata;
  sections: DocumentSection[];
  rawText: string;
  tables?: string[][];         // extracted tabular data (optional)
  parsedAt: string;            // ISO timestamp
}

// ── Chunking ────────────────────────────────────────────────────────

export interface ChunkOptions {
  maxTokens: number;           // default 512
  overlapTokens: number;       // default 64
  strategy: "fixed" | "semantic" | "sentence";
  preserveMetadata: boolean;
}

export interface DocumentChunk {
  id: string;
  documentId: string;
  text: string;
  tokenCount: number;
  index: number;               // position within document
  metadata: {
    sectionHeading?: string;
    pageNumber?: number;
    startOffset: number;       // char offset in rawText
    endOffset: number;
  };
}

// ── Embeddings ──────────────────────────────────────────────────────

export interface EmbeddingVector {
  chunkId: string;
  documentId: string;
  vector: number[];
  dimensions: number;
  model: string;               // e.g. "text-embedding-ada-002"
  generatedAt: string;
}

export interface EmbeddingProviderConfig {
  provider: "openai" | "cohere" | "local" | "mock";
  model: string;
  dimensions: number;
  batchSize: number;
  apiKey?: string;             // resolved from env at runtime
}

// ── Vector Store ────────────────────────────────────────────────────

export interface VectorSearchResult {
  chunkId: string;
  documentId: string;
  text: string;
  score: number;               // 0-1 normalised similarity
  metadata: DocumentChunk["metadata"];
  documentTitle?: string;
}

export interface CollectionInfo {
  name: string;
  documentCount: number;
  chunkCount: number;
  dimensions: number;
  createdAt: string;
  sizeBytes?: number;
}

export interface VectorStoreConfig {
  provider: "chromadb" | "pinecone" | "weaviate" | "in-memory";
  collectionName: string;
  dimensions: number;
  host?: string;
  apiKey?: string;
}

// ── Retrieval Pipeline ──────────────────────────────────────────────

export interface RetrievalOptions {
  topK: number;                // default 5
  scoreThreshold: number;      // minimum similarity, default 0.7
  filters?: Record<string, string | number | boolean>;
  collection?: string;
  rerank: boolean;             // whether to apply cross-encoder rerank
}

export interface RetrievalTelemetry {
  queryTimeMs: number;
  candidateCount: number;
  rerankTimeMs?: number;
  totalTimeMs: number;
}

// ── Prompt Engineering & Citations ──────────────────────────────────

export interface Citation {
  index: number;               // [1], [2], etc.
  chunkId: string;
  documentTitle: string;
  pageNumber?: number;
  excerpt: string;             // truncated chunk text used in prompt
  relevanceScore: number;
}

export interface RAGContext {
  question: string;
  retrievedChunks: VectorSearchResult[];
  systemPrompt: string;
  contextWindow: string;       // assembled context string
  tokenBudget: number;
}

export interface CitedAnswer {
  answer: string;              // Markdown text with inline [1], [2]…
  citations: Citation[];
  model: string;
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
  latencyMs: number;
  confidence: number;          // 0-1
}

export interface LLMProviderConfig {
  provider: "openai" | "anthropic" | "azure-openai" | "mock";
  model: string;               // e.g. "gpt-4o", "claude-3-sonnet"
  maxTokens: number;
  temperature: number;
  apiKey?: string;
}

// ── Ingestion Pipeline (Orchestration) ──────────────────────────────

export type PipelineStage =
  | "queued"
  | "parsing"
  | "chunking"
  | "embedding"
  | "storing"
  | "completed"
  | "failed";

export interface IngestionJob {
  id: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
  stage: PipelineStage;
  progress: number;            // 0-100
  chunksGenerated?: number;
  embeddingsStored?: number;
  error?: string;
  startedAt: string;
  completedAt?: string;
  duration?: number;           // ms
}

export interface PipelineMetrics {
  totalDocumentsIndexed: number;
  totalChunks: number;
  avgChunkSize: number;        // tokens
  totalQueriesToday: number;
  avgQueryLatencyMs: number;
  avgConfidenceScore: number;  // 0-1
  ingestionQueueSize: number;
  activeJobs: number;
  failedJobs24h: number;
  successRate: number;         // 0-1
}

export interface PipelineStageMetric {
  stage: PipelineStage;
  avgLatencyMs: number;
  throughputPerHour: number;
  errorRate: number;
}
