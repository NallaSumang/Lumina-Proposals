/* ------------------------------------------------------------------ */
/*  Prompt Engine — Prompt Engineering & Citation Service              */
/*  Builds LLM prompts from retrieved context and extracts citations. */
/*  TenderDox · TeamMate 3 — AI & RAG                                 */
/* ------------------------------------------------------------------ */

import type {
  VectorSearchResult,
  RAGContext,
  CitedAnswer,
  Citation,
  LLMProviderConfig,
} from "../types";
import {
  DEFAULT_LLM_CONFIG,
  PROMPT_TOKEN_BUDGET,
  MAX_CONTEXT_CHUNKS,
} from "../config";
import { countTokens, truncateToTokenBudget } from "../utils/token-counter";

// ── LLM Provider interface ──────────────────────────────────────────

export interface LLMProvider {
  readonly model: string;
  complete(prompt: string, systemPrompt: string): Promise<{
    text: string;
    promptTokens: number;
    completionTokens: number;
  }>;
}

// ── Mock LLM provider ──────────────────────────────────────────────

export class MockLLMProvider implements LLMProvider {
  readonly model = "mock-llm-v1";

  async complete(prompt: string, systemPrompt: string) {
    // Simulate an answer that references the provided sources
    const sourceCount = (prompt.match(/\[Source \d+\]/g) || []).length;
    const refs = Array.from({ length: Math.min(sourceCount, 3) }, (_, i) => `[${i + 1}]`);

    const answer = `Based on the provided documentation, here is a comprehensive answer to your question:

The organization maintains robust compliance and security measures as documented across multiple sources ${refs.join(", ")}. Key points include:

1. **Security Compliance**: SOC 2 Type II certification is maintained with annual audits and continuous monitoring ${refs[0] || ""}.

2. **Data Protection**: All data is encrypted at rest using AES-256 and in transit using TLS 1.3. Access controls follow the principle of least privilege ${refs[1] || ""}.

3. **Regulatory Adherence**: The platform complies with applicable regulations including GDPR, HIPAA, and industry-specific requirements ${refs[2] || ""}.

These measures ensure that the proposed solution meets or exceeds the security and compliance requirements outlined in the RFP.`;

    return {
      text: answer,
      promptTokens: countTokens(systemPrompt + prompt),
      completionTokens: countTokens(answer),
    };
  }
}

// ── OpenAI provider (placeholder) ───────────────────────────────────

export class OpenAILLMProvider implements LLMProvider {
  readonly model: string;
  private readonly apiKey: string;
  private readonly maxTokens: number;
  private readonly temperature: number;

  constructor(config: Partial<LLMProviderConfig> = {}) {
    const merged = { ...DEFAULT_LLM_CONFIG, ...config };
    this.model = merged.model;
    this.apiKey = merged.apiKey || process.env.OPENAI_API_KEY || "";
    this.maxTokens = merged.maxTokens;
    this.temperature = merged.temperature;
  }

  async complete(prompt: string, systemPrompt: string) {
    if (!this.apiKey) {
      console.warn("[PromptEngine] No API key — falling back to mock LLM.");
      return new MockLLMProvider().complete(prompt, systemPrompt);
    }

    // Production implementation:
    // const response = await fetch("https://api.openai.com/v1/chat/completions", {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json",
    //     Authorization: `Bearer ${this.apiKey}`,
    //   },
    //   body: JSON.stringify({
    //     model: this.model,
    //     messages: [
    //       { role: "system", content: systemPrompt },
    //       { role: "user", content: prompt },
    //     ],
    //     max_tokens: this.maxTokens,
    //     temperature: this.temperature,
    //   }),
    // });
    // const data = await response.json();
    // return {
    //   text: data.choices[0].message.content,
    //   promptTokens: data.usage.prompt_tokens,
    //   completionTokens: data.usage.completion_tokens,
    // };

    return new MockLLMProvider().complete(prompt, systemPrompt);
  }
}

// ── Prompt Templates ────────────────────────────────────────────────

const SYSTEM_PROMPT = `You are TenderDox AI, an expert assistant for responding to RFPs (Requests for Proposal) and RFIs (Requests for Information).

Your primary goal is to generate accurate, professional, and well-cited answers based ONLY on the provided context documents.

RULES:
1. Only use information from the provided context. Do NOT fabricate or hallucinate facts.
2. Cite your sources using numbered references [1], [2], etc. that map to the provided source documents.
3. If the context does not contain enough information to fully answer the question, clearly state what is missing.
4. Use a professional, confident tone appropriate for enterprise RFP responses.
5. Structure your answer with clear headings and bullet points where appropriate.
6. If multiple sources provide conflicting information, note the discrepancy.
7. Always include specific details (dates, versions, metrics) when available in the sources.`;

function buildContextBlock(chunks: VectorSearchResult[]): string {
  return chunks
    .map((chunk, i) => {
      const heading = chunk.metadata.sectionHeading
        ? ` — ${chunk.metadata.sectionHeading}`
        : "";
      const page = chunk.metadata.pageNumber
        ? ` (Page ${chunk.metadata.pageNumber})`
        : "";
      const docTitle = chunk.documentTitle
        ? ` from "${chunk.documentTitle}"`
        : "";

      return `[Source ${i + 1}]${docTitle}${heading}${page}\n${chunk.text}`;
    })
    .join("\n\n---\n\n");
}

// ── Public API ──────────────────────────────────────────────────────

/**
 * Build a RAGContext from a question and retrieved chunks.
 */
export function buildContext(
  question: string,
  chunks: VectorSearchResult[],
): RAGContext {
  // Limit chunks to budget
  const limitedChunks = chunks.slice(0, MAX_CONTEXT_CHUNKS);
  const contextWindow = buildContextBlock(limitedChunks);
  const { text: trimmedContext } = truncateToTokenBudget(
    contextWindow,
    PROMPT_TOKEN_BUDGET,
  );

  return {
    question,
    retrievedChunks: limitedChunks,
    systemPrompt: SYSTEM_PROMPT,
    contextWindow: trimmedContext,
    tokenBudget: PROMPT_TOKEN_BUDGET,
  };
}

/**
 * Build the full user prompt from a RAGContext.
 */
export function buildPrompt(context: RAGContext): string {
  return `## Context Documents

${context.contextWindow}

---

## Question

${context.question}

---

Please provide a comprehensive, well-cited answer based on the context documents above.`;
}

/**
 * Extract citations from the LLM response text and match them to source chunks.
 */
function extractCitations(
  answer: string,
  chunks: VectorSearchResult[],
): Citation[] {
  const citationPattern = /\[(\d+)\]/g;
  const cited = new Set<number>();
  let match;

  while ((match = citationPattern.exec(answer)) !== null) {
    cited.add(parseInt(match[1], 10));
  }

  return [...cited]
    .filter((idx) => idx >= 1 && idx <= chunks.length)
    .sort((a, b) => a - b)
    .map((idx) => {
      const chunk = chunks[idx - 1];
      return {
        index: idx,
        chunkId: chunk.chunkId,
        documentTitle: chunk.documentTitle ?? "Unknown Document",
        pageNumber: chunk.metadata.pageNumber,
        excerpt: chunk.text.slice(0, 200) + (chunk.text.length > 200 ? "…" : ""),
        relevanceScore: chunk.score,
      };
    });
}

/**
 * Generate a cited answer for a question using retrieved context.
 * This is the main entry point for the prompt engine.
 */
export async function generateAnswer(
  question: string,
  chunks: VectorSearchResult[],
  llm?: LLMProvider,
): Promise<CitedAnswer> {
  const startTime = performance.now();
  const provider = llm ?? createLLMProvider();

  // Build context & prompt
  const context = buildContext(question, chunks);
  const prompt = buildPrompt(context);

  // Generate
  const result = await provider.complete(prompt, context.systemPrompt);

  // Extract citations
  const citations = extractCitations(result.text, context.retrievedChunks);

  return {
    answer: result.text,
    citations,
    model: provider.model,
    promptTokens: result.promptTokens,
    completionTokens: result.completionTokens,
    totalTokens: result.promptTokens + result.completionTokens,
    latencyMs: Math.round(performance.now() - startTime),
    confidence:
      citations.length > 0
        ? citations.reduce((sum, c) => sum + c.relevanceScore, 0) / citations.length
        : 0,
  };
}

// ── Factory ─────────────────────────────────────────────────────────

export function createLLMProvider(
  config: Partial<LLMProviderConfig> = {},
): LLMProvider {
  const merged = { ...DEFAULT_LLM_CONFIG, ...config };

  switch (merged.provider) {
    case "openai":
      return new OpenAILLMProvider(merged);
    case "anthropic":
      // Placeholder for Anthropic Claude
      console.info("[PromptEngine] Anthropic not yet implemented — using mock.");
      return new MockLLMProvider();
    case "mock":
    default:
      return new MockLLMProvider();
  }
}
