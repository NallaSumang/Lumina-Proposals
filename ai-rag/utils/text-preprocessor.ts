/* ------------------------------------------------------------------ */
/*  Text Preprocessor                                                 */
/*  Cleaning & normalisation utilities applied after document parsing  */
/*  and before chunking.                                              */
/* ------------------------------------------------------------------ */

/**
 * Normalise whitespace — collapse runs of spaces/tabs, trim lines.
 */
export function normaliseWhitespace(text: string): string {
  return text
    .replace(/\t/g, " ")
    .replace(/ {2,}/g, " ")
    .split("\n")
    .map((line) => line.trim())
    .join("\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

/**
 * Remove common PDF artefacts (page numbers, headers/footers, form-feed).
 */
export function removePDFArtefacts(text: string): string {
  return text
    .replace(/\f/g, "\n")                        // form-feed → newline
    .replace(/^Page \d+ of \d+$/gm, "")          // "Page 3 of 12"
    .replace(/^\d+\s*$/gm, "")                   // lone page numbers
    .replace(/^(CONFIDENTIAL|DRAFT).*$/gim, "");  // watermark lines
}

/**
 * Collapse bullet-point variations into a uniform format.
 */
export function normaliseBullets(text: string): string {
  return text
    .replace(/^[•●◦▪▸►‣⁃]\s*/gm, "- ")
    .replace(/^\*\s+/gm, "- ");
}

/**
 * Strip non-printable / control characters (except newlines & tabs).
 */
export function stripControlChars(text: string): string {
  // eslint-disable-next-line no-control-regex
  return text.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, "");
}

/**
 * Extract sentences from text — simple regex-based splitter.
 */
export function splitSentences(text: string): string[] {
  return text
    .split(/(?<=[.!?])\s+(?=[A-Z])/)
    .map((s) => s.trim())
    .filter(Boolean);
}

/**
 * Full preprocessing pipeline — applies all transformations in order.
 */
export function preprocessText(raw: string): string {
  let text = raw;
  text = stripControlChars(text);
  text = removePDFArtefacts(text);
  text = normaliseBullets(text);
  text = normaliseWhitespace(text);
  return text;
}
