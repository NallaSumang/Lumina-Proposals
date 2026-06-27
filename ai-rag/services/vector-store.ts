/* ------------------------------------------------------------------ */
/*  Vector Store Service                                              */
/*  Abstraction layer over vector databases.                          */
/*  Ships with an in-memory implementation for dev/testing.           */
/*  TenderDox · TeamMate 3 — AI & RAG                                 */
/* ------------------------------------------------------------------ */

import type {
  EmbeddingVector,
  VectorSearchResult,
  CollectionInfo,
  VectorStoreConfig,
  DocumentChunk,
} from "../types";
import { DEFAULT_VECTOR_STORE_CONFIG } from "../config";

// ── Interface ───────────────────────────────────────────────────────

export interface VectorStore {
  /** Insert or update embeddings */
  upsert(embeddings: EmbeddingVector[], chunks: DocumentChunk[]): Promise<void>;

  /** Similarity search */
  search(
    queryVector: number[],
    topK: number,
    scoreThreshold?: number,
    filters?: Record<string, string | number | boolean>,
  ): Promise<VectorSearchResult[]>;

  /** Delete all embeddings for a document */
  deleteByDocument(documentId: string): Promise<number>;

  /** Collection statistics */
  getStats(): Promise<CollectionInfo>;

  /** List all stored document IDs */
  listDocumentIds(): Promise<string[]>;
}

// ── In-memory implementation ────────────────────────────────────────

interface StoredEntry {
  embedding: EmbeddingVector;
  chunk: DocumentChunk;
}

export class InMemoryVectorStore implements VectorStore {
  private entries: StoredEntry[] = [];
  private readonly config: VectorStoreConfig;
  private readonly createdAt: string;

  constructor(config: Partial<VectorStoreConfig> = {}) {
    this.config = { ...DEFAULT_VECTOR_STORE_CONFIG, ...config };
    this.createdAt = new Date().toISOString();
  }

  async upsert(embeddings: EmbeddingVector[], chunks: DocumentChunk[]): Promise<void> {
    const chunkMap = new Map(chunks.map((c) => [c.id, c]));

    for (const emb of embeddings) {
      const chunk = chunkMap.get(emb.chunkId);
      if (!chunk) continue;

      // Upsert: replace if exists
      const existingIdx = this.entries.findIndex(
        (e) => e.embedding.chunkId === emb.chunkId,
      );

      const entry: StoredEntry = { embedding: emb, chunk };
      if (existingIdx >= 0) {
        this.entries[existingIdx] = entry;
      } else {
        this.entries.push(entry);
      }
    }
  }

  async search(
    queryVector: number[],
    topK: number,
    scoreThreshold = 0,
    filters?: Record<string, string | number | boolean>,
  ): Promise<VectorSearchResult[]> {
    // Compute cosine similarity for every entry
    const scored = this.entries
      .filter((entry) => {
        if (!filters) return true;
        // Simple metadata filtering
        for (const [key, value] of Object.entries(filters)) {
          const meta = entry.chunk.metadata as Record<string, unknown>;
          if (meta[key] !== undefined && meta[key] !== value) return false;
        }
        return true;
      })
      .map((entry) => ({
        entry,
        score: cosineSimilarity(queryVector, entry.embedding.vector),
      }))
      .filter((r) => r.score >= scoreThreshold)
      .sort((a, b) => b.score - a.score)
      .slice(0, topK);

    return scored.map((r) => ({
      chunkId: r.entry.chunk.id,
      documentId: r.entry.chunk.documentId,
      text: r.entry.chunk.text,
      score: r.score,
      metadata: r.entry.chunk.metadata,
    }));
  }

  async deleteByDocument(documentId: string): Promise<number> {
    const before = this.entries.length;
    this.entries = this.entries.filter(
      (e) => e.embedding.documentId !== documentId,
    );
    return before - this.entries.length;
  }

  async getStats(): Promise<CollectionInfo> {
    const docIds = new Set(this.entries.map((e) => e.embedding.documentId));
    return {
      name: this.config.collectionName,
      documentCount: docIds.size,
      chunkCount: this.entries.length,
      dimensions: this.config.dimensions,
      createdAt: this.createdAt,
      sizeBytes: JSON.stringify(this.entries).length, // rough estimate
    };
  }

  async listDocumentIds(): Promise<string[]> {
    return [...new Set(this.entries.map((e) => e.embedding.documentId))];
  }
}

// ── Cosine similarity ───────────────────────────────────────────────

function cosineSimilarity(a: number[], b: number[]): number {
  if (a.length !== b.length) return 0;

  let dotProduct = 0;
  let normA = 0;
  let normB = 0;

  for (let i = 0; i < a.length; i++) {
    dotProduct += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }

  const denominator = Math.sqrt(normA) * Math.sqrt(normB);
  return denominator === 0 ? 0 : dotProduct / denominator;
}

// ── Factory ─────────────────────────────────────────────────────────

/**
 * Create a vector store instance.
 *
 * Currently only "in-memory" is fully implemented.
 * For production ChromaDB integration, implement a ChromaVectorStore
 * class that wraps the chromadb client SDK.
 */
export function createVectorStore(
  config: Partial<VectorStoreConfig> = {},
): VectorStore {
  const merged = { ...DEFAULT_VECTOR_STORE_CONFIG, ...config };

  switch (merged.provider) {
    case "chromadb":
      // In production, return new ChromaVectorStore(merged);
      // For now, fall through to in-memory
      console.info(
        "[VectorStore] ChromaDB not configured — using in-memory store.",
      );
      return new InMemoryVectorStore(merged);

    case "in-memory":
    default:
      return new InMemoryVectorStore(merged);
  }
}
