/* ------------------------------------------------------------------ */
/*  Document Parser Service                                           */
/*  Extracts structured text from uploaded documents (PDF, DOCX, etc) */
/*  TenderDox · TeamMate 3 — AI & RAG                                 */
/* ------------------------------------------------------------------ */

import type {
  ParsedDocument,
  DocumentMetadata,
  DocumentSection,
} from "../types";
import { preprocessText, splitSentences } from "../utils/text-preprocessor";
import { SUPPORTED_MIME_TYPES } from "../config";

// ── Unique-ID generator ─────────────────────────────────────────────

function generateId(prefix: string): string {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

// ── Section-boundary heuristics ─────────────────────────────────────

const HEADING_PATTERNS = [
  /^#{1,6}\s+(.+)$/,                     // Markdown headings
  /^(\d+\.)+\s+(.+)$/,                   // Numbered sections: 1.2.3
  /^[A-Z][A-Z\s]{4,}$/,                  // ALL-CAPS lines (≥5 chars)
  /^(Section|Article|Part|Chapter)\s+/i,  // Labelled sections
];

function detectHeadingLevel(line: string): number | null {
  // Markdown
  const md = line.match(/^(#{1,6})\s/);
  if (md) return md[1].length;

  // Numbered e.g. "1." → level 1, "1.2" → level 2
  const numbered = line.match(/^((\d+\.)+)/);
  if (numbered) {
    const depth = (numbered[1].match(/\d+\./g) || []).length;
    return Math.min(depth, 4);
  }

  // All-caps title
  if (/^[A-Z][A-Z\s]{4,}$/.test(line.trim())) return 1;

  // Labelled
  if (/^(Section|Article|Part|Chapter)\s+/i.test(line.trim())) return 1;

  return null;
}

// ── Internal: split raw text into sections ──────────────────────────

function extractSections(rawText: string): DocumentSection[] {
  const lines = rawText.split("\n");
  const sections: DocumentSection[] = [];
  let currentHeading: string | undefined;
  let currentLevel = 0;
  let currentContent: string[] = [];
  let sectionIndex = 0;

  const pushSection = () => {
    const content = currentContent.join("\n").trim();
    if (content) {
      sections.push({
        heading: currentHeading,
        level: currentLevel,
        content,
        index: sectionIndex++,
      });
    }
    currentContent = [];
  };

  for (const line of lines) {
    const trimmed = line.trim();
    const level = detectHeadingLevel(trimmed);

    if (level !== null && trimmed.length > 0) {
      pushSection();
      currentHeading = trimmed.replace(/^#{1,6}\s+/, "");
      currentLevel = level;
    } else {
      currentContent.push(line);
    }
  }

  // Flush last section
  pushSection();

  // If no sections found, wrap everything as a single root section
  if (sections.length === 0) {
    sections.push({
      heading: undefined,
      level: 0,
      content: rawText.trim(),
      index: 0,
    });
  }

  return sections;
}

// ── Public API ──────────────────────────────────────────────────────

/**
 * Parse a plain-text document (or pre-extracted text) into structured
 * sections with metadata.
 *
 * In production, this would integrate with pdf-parse, mammoth (DOCX),
 * or equivalent libraries. The current implementation accepts pre-
 * extracted text and performs structural analysis.
 */
export function parseText(
  text: string,
  meta: Partial<DocumentMetadata> & Pick<DocumentMetadata, "fileName" | "mimeType">,
): ParsedDocument {
  const cleaned = preprocessText(text);
  const sections = extractSections(cleaned);

  const metadata: DocumentMetadata = {
    title: meta.title ?? meta.fileName.replace(/\.[^.]+$/, ""),
    fileName: meta.fileName,
    mimeType: meta.mimeType,
    fileSize: meta.fileSize ?? new Blob([text]).size,
    author: meta.author,
    pageCount: meta.pageCount,
    language: meta.language ?? "en",
    createdAt: meta.createdAt ?? new Date().toISOString(),
  };

  return {
    id: generateId("doc"),
    metadata,
    sections,
    rawText: cleaned,
    parsedAt: new Date().toISOString(),
  };
}

/**
 * Parse a PDF file.
 *
 * This is a placeholder that returns a simulated parsed result.
 * In production, plug in `pdf-parse`, `pdfjs-dist`, or a cloud-based
 * extraction service (e.g. Google Document AI, AWS Textract).
 */
export async function parsePDF(
  buffer: ArrayBuffer,
  fileName: string,
): Promise<ParsedDocument> {
  // Placeholder — in production, replace with:
  // const pdfParse = (await import("pdf-parse")).default;
  // const result = await pdfParse(Buffer.from(buffer));
  // return parseText(result.text, { fileName, mimeType: "application/pdf", pageCount: result.numpages });

  const simulatedText = `[Parsed PDF content from ${fileName}]\n\nSection 1: Introduction\nThis document outlines the requirements for the proposed solution.\n\nSection 2: Technical Requirements\n2.1 Security Compliance\nThe vendor must demonstrate SOC 2 Type II compliance.\n2.2 Data Handling\nAll data must be encrypted at rest and in transit.\n\nSection 3: Submission Guidelines\nProposals must be submitted by the specified deadline.`;

  return parseText(simulatedText, {
    fileName,
    mimeType: "application/pdf",
    pageCount: 3,
    fileSize: buffer.byteLength,
  });
}

/**
 * Parse a DOCX file.
 *
 * Placeholder — in production use `mammoth` or similar.
 */
export async function parseDOCX(
  buffer: ArrayBuffer,
  fileName: string,
): Promise<ParsedDocument> {
  const simulatedText = `[Parsed DOCX content from ${fileName}]\n\nOverview\nThis RFP document details the scope of work.\n\nRequirements\n- Cloud infrastructure certification\n- 99.9% uptime SLA\n- GDPR compliance documentation`;

  return parseText(simulatedText, {
    fileName,
    mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    fileSize: buffer.byteLength,
  });
}

/**
 * Router — parse any supported file format.
 */
export async function parseDocument(
  buffer: ArrayBuffer,
  fileName: string,
  mimeType: string,
): Promise<ParsedDocument> {
  if (!SUPPORTED_MIME_TYPES[mimeType]) {
    throw new Error(`Unsupported file type: ${mimeType}. Supported: ${Object.keys(SUPPORTED_MIME_TYPES).join(", ")}`);
  }

  switch (mimeType) {
    case "application/pdf":
      return parsePDF(buffer, fileName);

    case "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
      return parseDOCX(buffer, fileName);

    case "text/plain":
    case "text/csv":
    case "text/markdown": {
      const decoder = new TextDecoder("utf-8");
      const text = decoder.decode(buffer);
      return parseText(text, { fileName, mimeType, fileSize: buffer.byteLength });
    }

    default:
      throw new Error(`Parser not implemented for: ${mimeType}`);
  }
}
