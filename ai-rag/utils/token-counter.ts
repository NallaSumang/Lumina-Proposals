/* ------------------------------------------------------------------ */
/*  Token Counter                                                     */
/*  Lightweight token estimation — avoids heavy tiktoken dependency    */
/*  in the browser/edge while remaining accurate enough for chunking. */
/* ------------------------------------------------------------------ */

/**
 * Approximate token count using the 4-chars-per-token heuristic.
 * This is accurate within ~10 % for English text and the
 * GPT-3.5/4 tokeniser family.
 */
export function estimateTokens(text: string): number {
  if (!text) return 0;
  return Math.ceil(text.length / 4);
}

/**
 * Word-based token estimation (¾ ratio — 1 token ≈ 0.75 words).
 * Slightly more conservative for mixed content.
 */
export function estimateTokensFromWords(text: string): number {
  if (!text) return 0;
  const wordCount = text.split(/\s+/).filter(Boolean).length;
  return Math.ceil(wordCount / 0.75);
}

/**
 * Returns the more conservative (higher) of the two heuristics.
 */
export function countTokens(text: string): number {
  return Math.max(estimateTokens(text), estimateTokensFromWords(text));
}

/**
 * Truncate text to fit within a token budget.
 * Returns the truncated string and its estimated token count.
 */
export function truncateToTokenBudget(
  text: string,
  maxTokens: number,
): { text: string; tokenCount: number } {
  const current = countTokens(text);
  if (current <= maxTokens) return { text, tokenCount: current };

  // Approximate character limit from token budget
  const charLimit = maxTokens * 4;
  const truncated = text.slice(0, charLimit);

  // Trim to last complete word
  const lastSpace = truncated.lastIndexOf(" ");
  const clean = lastSpace > 0 ? truncated.slice(0, lastSpace) : truncated;

  return { text: clean + "…", tokenCount: countTokens(clean) };
}
