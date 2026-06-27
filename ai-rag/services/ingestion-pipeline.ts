/* ------------------------------------------------------------------ */
/*  Ingestion Pipeline                                                */
/*  Orchestrates: Upload → Parse → Chunk → Embed → Store              */
/*  TenderDox · TeamMate 3 — AI & RAG                                 */
/* ------------------------------------------------------------------ */

import type { IngestionJob, PipelineStage } from "../types";
import { parseDocument } from "./document-parser";
import { chunkDocument } from "./chunker";
import { generateEmbeddings, createEmbeddingProvider } from "./embeddings";
import { createVectorStore, type VectorStore } from "./vector-store";

// ── Job registry (in-memory for dev) ────────────────────────────────

const jobs = new Map<string, IngestionJob>();

function generateJobId(): string {
  return `job_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
}

function updateJob(
  id: string,
  updates: Partial<IngestionJob>,
): IngestionJob {
  const job = jobs.get(id);
  if (!job) throw new Error(`Job not found: ${id}`);
  const updated = { ...job, ...updates };
  jobs.set(id, updated);
  return updated;
}

// ── Progress callback type ──────────────────────────────────────────

export type ProgressCallback = (
  stage: PipelineStage,
  progress: number,
  message?: string,
) => void;

// ── Public API ──────────────────────────────────────────────────────

/**
 * Ingest a document through the full pipeline.
 *
 * Returns an IngestionJob that tracks progress through each stage.
 * In production this would be an async queue job; here it runs
 * sequentially and updates the job record at each stage.
 */
export async function ingestDocument(
  fileBuffer: ArrayBuffer,
  fileName: string,
  mimeType: string,
  vectorStore?: VectorStore,
  onProgress?: ProgressCallback,
): Promise<IngestionJob> {
  const jobId = generateJobId();

  // Create initial job record
  const job: IngestionJob = {
    id: jobId,
    fileName,
    fileSize: fileBuffer.byteLength,
    mimeType,
    stage: "queued",
    progress: 0,
    startedAt: new Date().toISOString(),
  };
  jobs.set(jobId, job);

  const store = vectorStore ?? createVectorStore();
  const embProvider = createEmbeddingProvider();

  try {
    // ── Stage 1: Parsing ──────────────────────────────────────────
    onProgress?.("parsing", 10, `Parsing ${fileName}...`);
    updateJob(jobId, { stage: "parsing", progress: 10 });

    const parsedDoc = await parseDocument(fileBuffer, fileName, mimeType);
    updateJob(jobId, { progress: 25 });

    // ── Stage 2: Chunking ─────────────────────────────────────────
    onProgress?.("chunking", 30, "Splitting into chunks...");
    updateJob(jobId, { stage: "chunking", progress: 30 });

    const chunks = chunkDocument(parsedDoc);
    updateJob(jobId, {
      progress: 45,
      chunksGenerated: chunks.length,
    });

    // ── Stage 3: Embedding ────────────────────────────────────────
    onProgress?.("embedding", 50, `Generating embeddings for ${chunks.length} chunks...`);
    updateJob(jobId, { stage: "embedding", progress: 50 });

    const embeddings = await generateEmbeddings(chunks, embProvider);
    updateJob(jobId, { progress: 75 });

    // ── Stage 4: Storing ──────────────────────────────────────────
    onProgress?.("storing", 80, "Storing in vector database...");
    updateJob(jobId, { stage: "storing", progress: 80 });

    await store.upsert(embeddings, chunks);
    updateJob(jobId, {
      progress: 95,
      embeddingsStored: embeddings.length,
    });

    // ── Complete ──────────────────────────────────────────────────
    const completed = updateJob(jobId, {
      stage: "completed",
      progress: 100,
      completedAt: new Date().toISOString(),
      duration: Date.now() - new Date(job.startedAt).getTime(),
    });

    onProgress?.("completed", 100, "Ingestion complete!");
    return completed;

  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";

    const failed = updateJob(jobId, {
      stage: "failed",
      error: errorMessage,
      completedAt: new Date().toISOString(),
      duration: Date.now() - new Date(job.startedAt).getTime(),
    });

    onProgress?.("failed", failed.progress, errorMessage);
    return failed;
  }
}

/**
 * Get the current status of an ingestion job.
 */
export function getJobStatus(jobId: string): IngestionJob | undefined {
  return jobs.get(jobId);
}

/**
 * List all ingestion jobs, most recent first.
 */
export function listJobs(): IngestionJob[] {
  return [...jobs.values()].sort(
    (a, b) => new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime(),
  );
}

/**
 * Clear completed/failed jobs from the registry.
 */
export function clearFinishedJobs(): number {
  let removed = 0;
  for (const [id, job] of jobs.entries()) {
    if (job.stage === "completed" || job.stage === "failed") {
      jobs.delete(id);
      removed++;
    }
  }
  return removed;
}
