/* ------------------------------------------------------------------ */
/*  Chunker Service                                                   */
/*  Splits parsed documents into semantically meaningful chunks for   */
/*  embedding and retrieval.                                          */
/*  TenderDox · TeamMate 3 — AI & RAG                                 */
/* ------------------------------------------------------------------ */

import type {
  ParsedDocument,
  DocumentChunk,
  ChunkOptions,
} from "../types";
import { countTokens } from "../utils/token-counter";
import { splitSentences } from "../utils/text-preprocessor";
import { DEFAULT_CHUNK_OPTIONS } from "../config";

// ── Unique-ID generator ─────────────────────────────────────────────

function chunkId(docId: string, index: number): string {
  return `chunk_${docId}_${index}`;
}

// ── Fixed-size chunking ─────────────────────────────────────────────

function fixedChunk(
  text: string,
  docId: string,
  maxTokens: number,
  overlapTokens: number,
  sectionHeading?: string,
): DocumentChunk[] {
  const chunks: DocumentChunk[] = [];
  const words = text.split(/\s+/);
  // Rough char-per-token ratio
  const approxCharsPerToken = 4;
  const chunkCharSize = maxTokens * approxCharsPerToken;
  const overlapCharSize = overlapTokens * approxCharsPerToken;

  let start = 0;
  let idx = 0;

  while (start < text.length) {
    const end = Math.min(start + chunkCharSize, text.length);
    let slice = text.slice(start, end);

    // Trim to last space for clean breaks
    if (end < text.length) {
      const lastSpace = slice.lastIndexOf(" ");
      if (lastSpace > chunkCharSize * 0.5) {
        slice = slice.slice(0, lastSpace);
      }
    }

    chunks.push({
      id: chunkId(docId, idx),
      documentId: docId,
      text: slice.trim(),
      tokenCount: countTokens(slice),
      index: idx,
      metadata: {
        sectionHeading,
        startOffset: start,
        endOffset: start + slice.length,
      },
    });

    idx++;
    start += slice.length - overlapCharSize;
    if (start <= chunks[chunks.length - 1].metadata.startOffset) {
      // Prevent infinite loop if overlap ≥ chunk
      start = chunks[chunks.length - 1].metadata.endOffset;
    }
  }

  return chunks;
}

// ── Sentence-based chunking ─────────────────────────────────────────

function sentenceChunk(
  text: string,
  docId: string,
  maxTokens: number,
  overlapTokens: number,
  sectionHeading?: string,
): DocumentChunk[] {
  const sentences = splitSentences(text);
  if (sentences.length === 0) return [];

  const chunks: DocumentChunk[] = [];
  let currentSentences: string[] = [];
  let currentTokens = 0;
  let charOffset = 0;
  let idx = 0;

  for (const sentence of sentences) {
    const sentTokens = countTokens(sentence);

    if (currentTokens + sentTokens > maxTokens && currentSentences.length > 0) {
      const chunkText = currentSentences.join(" ");
      chunks.push({
        id: chunkId(docId, idx),
        documentId: docId,
        text: chunkText,
        tokenCount: currentTokens,
        index: idx,
        metadata: {
          sectionHeading,
          startOffset: charOffset,
          endOffset: charOffset + chunkText.length,
        },
      });
      idx++;

      // Overlap: keep last N tokens worth of sentences
      let overlapAcc = 0;
      const overlap: string[] = [];
      for (let i = currentSentences.length - 1; i >= 0; i--) {
        const st = countTokens(currentSentences[i]);
        if (overlapAcc + st > overlapTokens) break;
        overlap.unshift(currentSentences[i]);
        overlapAcc += st;
      }

      charOffset += chunkText.length - overlap.join(" ").length;
      currentSentences = [...overlap];
      currentTokens = overlapAcc;
    }

    currentSentences.push(sentence);
    currentTokens += sentTokens;
  }

  // Flush remaining
  if (currentSentences.length > 0) {
    const chunkText = currentSentences.join(" ");
    chunks.push({
      id: chunkId(docId, idx),
      documentId: docId,
      text: chunkText,
      tokenCount: countTokens(chunkText),
      index: idx,
      metadata: {
        sectionHeading,
        startOffset: charOffset,
        endOffset: charOffset + chunkText.length,
      },
    });
  }

  return chunks;
}

// ── Semantic (section-aware) chunking ────────────────────────────────

function semanticChunk(
  doc: ParsedDocument,
  maxTokens: number,
  overlapTokens: number,
): DocumentChunk[] {
  const allChunks: DocumentChunk[] = [];

  for (const section of doc.sections) {
    const sectionTokens = countTokens(section.content);

    if (sectionTokens <= maxTokens) {
      // Section fits in one chunk — keep it whole
      allChunks.push({
        id: chunkId(doc.id, allChunks.length),
        documentId: doc.id,
        text: section.content,
        tokenCount: sectionTokens,
        index: allChunks.length,
        metadata: {
          sectionHeading: section.heading,
          pageNumber: section.pageNumber,
          startOffset: doc.rawText.indexOf(section.content),
          endOffset: doc.rawText.indexOf(section.content) + section.content.length,
        },
      });
    } else {
      // Section too large — split by sentences within it
      const subChunks = sentenceChunk(
        section.content,
        doc.id,
        maxTokens,
        overlapTokens,
        section.heading,
      );
      // Re-index
      for (const sc of subChunks) {
        sc.index = allChunks.length;
        sc.id = chunkId(doc.id, allChunks.length);
        sc.metadata.pageNumber = section.pageNumber;
        allChunks.push(sc);
      }
    }
  }

  return allChunks;
}

// ── Public API ──────────────────────────────────────────────────────

/**
 * Chunk a parsed document according to the chosen strategy.
 */
export function chunkDocument(
  doc: ParsedDocument,
  opts: Partial<ChunkOptions> = {},
): DocumentChunk[] {
  const options = { ...DEFAULT_CHUNK_OPTIONS, ...opts };

  switch (options.strategy) {
    case "fixed":
      return fixedChunk(
        doc.rawText,
        doc.id,
        options.maxTokens,
        options.overlapTokens,
      );

    case "sentence":
      return sentenceChunk(
        doc.rawText,
        doc.id,
        options.maxTokens,
        options.overlapTokens,
      );

    case "semantic":
    default:
      return semanticChunk(doc, options.maxTokens, options.overlapTokens);
  }
}
