/* ------------------------------------------------------------------ */
/*  Embedding Service                                                 */
/*  Generates vector embeddings from document chunks.                 */
/*  Pluggable provider — defaults to a mock for dev/testing.          */
/*  TenderDox · TeamMate 3 — AI & RAG                                 */
/* ------------------------------------------------------------------ */

import type {
  DocumentChunk,
  EmbeddingVector,
  EmbeddingProviderConfig,
} from "../types";
import { DEFAULT_EMBEDDING_CONFIG } from "../config";

// ── Provider interface ──────────────────────────────────────────────

export interface EmbeddingProvider {
  readonly model: string;
  readonly dimensions: number;
  embed(texts: string[]): Promise<number[][]>;
}

// ── Mock provider (deterministic, no external calls) ────────────────

export class MockEmbeddingProvider implements EmbeddingProvider {
  readonly model = "mock-embedding-v1";
  readonly dimensions: number;

  constructor(dimensions = 1536) {
    this.dimensions = dimensions;
  }

  /**
   * Generate deterministic pseudo-embeddings from text.
   * Uses a simple hash-based approach so the same text always
   * produces the same vector — useful for testing similarity logic.
   */
  async embed(texts: string[]): Promise<number[][]> {
    return texts.map((text) => {
      const vec = new Array(this.dimensions).fill(0);
      for (let i = 0; i < text.length; i++) {
        const charCode = text.charCodeAt(i);
        const idx = (charCode * (i + 1)) % this.dimensions;
        vec[idx] += charCode / 1000;
      }
      // Normalise to unit vector
      const magnitude = Math.sqrt(vec.reduce((sum, v) => sum + v * v, 0)) || 1;
      return vec.map((v) => v / magnitude);
    });
  }
}

// ── OpenAI provider (placeholder — requires API key) ────────────────

export class OpenAIEmbeddingProvider implements EmbeddingProvider {
  readonly model: string;
  readonly dimensions: number;
  private readonly apiKey: string;

  constructor(config: Partial<EmbeddingProviderConfig> = {}) {
    const merged = { ...DEFAULT_EMBEDDING_CONFIG, ...config };
    this.model = merged.model;
    this.dimensions = merged.dimensions;
    this.apiKey = merged.apiKey || process.env.OPENAI_API_KEY || "";
  }

  async embed(texts: string[]): Promise<number[][]> {
    if (!this.apiKey) {
      console.warn("[EmbeddingService] No API key — falling back to mock embeddings.");
      return new MockEmbeddingProvider(this.dimensions).embed(texts);
    }

    // Production implementation:
    // const response = await fetch("https://api.openai.com/v1/embeddings", {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json",
    //     Authorization: `Bearer ${this.apiKey}`,
    //   },
    //   body: JSON.stringify({ model: this.model, input: texts }),
    // });
    // const data = await response.json();
    // return data.data.map((d: any) => d.embedding);

    // For now, delegate to mock
    return new MockEmbeddingProvider(this.dimensions).embed(texts);
  }
}

// ── Factory ─────────────────────────────────────────────────────────

export function createEmbeddingProvider(
  config: Partial<EmbeddingProviderConfig> = {},
): EmbeddingProvider {
  const merged = { ...DEFAULT_EMBEDDING_CONFIG, ...config };

  switch (merged.provider) {
    case "openai":
      return new OpenAIEmbeddingProvider(merged);
    case "mock":
    default:
      return new MockEmbeddingProvider(merged.dimensions);
  }
}

// ── Public API ──────────────────────────────────────────────────────

/**
 * Generate embeddings for a batch of document chunks.
 * Automatically batches by the configured batch size.
 */
export async function generateEmbeddings(
  chunks: DocumentChunk[],
  provider?: EmbeddingProvider,
  batchSize = DEFAULT_EMBEDDING_CONFIG.batchSize,
): Promise<EmbeddingVector[]> {
  const emb = provider ?? createEmbeddingProvider();
  const results: EmbeddingVector[] = [];

  // Process in batches
  for (let i = 0; i < chunks.length; i += batchSize) {
    const batch = chunks.slice(i, i + batchSize);
    const texts = batch.map((c) => c.text);
    const vectors = await emb.embed(texts);

    for (let j = 0; j < batch.length; j++) {
      results.push({
        chunkId: batch[j].id,
        documentId: batch[j].documentId,
        vector: vectors[j],
        dimensions: emb.dimensions,
        model: emb.model,
        generatedAt: new Date().toISOString(),
      });
    }
  }

  return results;
}
