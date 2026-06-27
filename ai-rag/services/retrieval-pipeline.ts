/* ------------------------------------------------------------------ */
/*  Retrieval Pipeline                                                */
/*  End-to-end query → search → rerank → return pipeline.            */
/*  TenderDox · TeamMate 3 — AI & RAG                                 */
/* ------------------------------------------------------------------ */

import type {
  VectorSearchResult,
  RetrievalOptions,
  RetrievalTelemetry,
} from "../types";
import { DEFAULT_RETRIEVAL_OPTIONS } from "../config";
import { createEmbeddingProvider, type EmbeddingProvider } from "./embeddings";
import { createVectorStore, type VectorStore } from "./vector-store";

// ── Query preprocessing ─────────────────────────────────────────────

/**
 * Preprocess a user query before embedding:
 * - Trim and normalise whitespace
 * - Expand common abbreviations in the RFP domain
 * - Optionally rephrase for better retrieval (placeholder)
 */
function preprocessQuery(query: string): string {
  let q = query.trim().replace(/\s+/g, " ");

  // Domain-specific expansion
  const expansions: Record<string, string> = {
    "SOC2": "SOC 2 Type II compliance",
    "SOC 2": "SOC 2 Type II compliance",
    "GDPR": "General Data Protection Regulation GDPR",
    "HIPAA": "Health Insurance Portability and Accountability Act HIPAA",
    "ISO27001": "ISO 27001 information security",
    "SLA": "Service Level Agreement SLA",
    "RFP": "Request for Proposal RFP",
    "RFI": "Request for Information RFI",
  };

  for (const [abbr, expansion] of Object.entries(expansions)) {
    if (q.toUpperCase().includes(abbr) && !q.includes(expansion)) {
      q = q.replace(new RegExp(abbr, "gi"), expansion);
    }
  }

  return q;
}

// ── Simple cross-encoder reranker (placeholder) ─────────────────────

/**
 * Re-rank results using a lightweight heuristic.
 *
 * In production, replace with a proper cross-encoder model
 * (e.g. ms-marco-MiniLM) or an API-based reranker (Cohere Rerank).
 */
function rerank(
  query: string,
  results: VectorSearchResult[],
): VectorSearchResult[] {
  const queryTerms = query.toLowerCase().split(/\s+/).filter((t) => t.length > 2);

  return results
    .map((r) => {
      const text = r.text.toLowerCase();
      // Bonus for exact query-term matches in the chunk
      let termBonus = 0;
      for (const term of queryTerms) {
        const count = (text.match(new RegExp(term, "g")) || []).length;
        termBonus += count * 0.02;
      }
      // Bonus for section heading relevance
      const headingBonus =
        r.metadata.sectionHeading &&
        queryTerms.some((t) =>
          r.metadata.sectionHeading!.toLowerCase().includes(t),
        )
          ? 0.05
          : 0;

      return {
        ...r,
        score: Math.min(1, r.score + termBonus + headingBonus),
      };
    })
    .sort((a, b) => b.score - a.score);
}

// ── Public API ──────────────────────────────────────────────────────

export interface RetrievalResult {
  results: VectorSearchResult[];
  telemetry: RetrievalTelemetry;
}

/**
 * Run the full retrieval pipeline:
 * 1. Preprocess query
 * 2. Embed query
 * 3. Search vector store
 * 4. (Optional) Rerank results
 */
export async function retrieve(
  query: string,
  options: Partial<RetrievalOptions> = {},
  deps?: {
    embeddingProvider?: EmbeddingProvider;
    vectorStore?: VectorStore;
  },
): Promise<RetrievalResult> {
  const opts = { ...DEFAULT_RETRIEVAL_OPTIONS, ...options };
  const emb = deps?.embeddingProvider ?? createEmbeddingProvider();
  const store = deps?.vectorStore ?? createVectorStore();

  const startTime = performance.now();

  // 1. Preprocess
  const processedQuery = preprocessQuery(query);

  // 2. Embed query
  const [queryVector] = await emb.embed([processedQuery]);

  // 3. Search
  const candidateMultiplier = opts.rerank ? 3 : 1;
  const candidates = await store.search(
    queryVector,
    opts.topK * candidateMultiplier,
    opts.scoreThreshold * 0.8, // looser threshold for candidates
    opts.filters,
  );

  const searchTime = performance.now();

  // 4. Rerank (if enabled)
  let finalResults: VectorSearchResult[];
  let rerankTimeMs: number | undefined;

  if (opts.rerank && candidates.length > opts.topK) {
    const rerankStart = performance.now();
    const reranked = rerank(processedQuery, candidates);
    finalResults = reranked
      .filter((r) => r.score >= opts.scoreThreshold)
      .slice(0, opts.topK);
    rerankTimeMs = performance.now() - rerankStart;
  } else {
    finalResults = candidates.slice(0, opts.topK);
  }

  const totalTime = performance.now();

  return {
    results: finalResults,
    telemetry: {
      queryTimeMs: Math.round(searchTime - startTime),
      candidateCount: candidates.length,
      rerankTimeMs: rerankTimeMs ? Math.round(rerankTimeMs) : undefined,
      totalTimeMs: Math.round(totalTime - startTime),
    },
  };
}
