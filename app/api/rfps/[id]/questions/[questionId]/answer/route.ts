import { NextResponse } from "next/server";
import { questionsByRfp } from "@/lib/mock";
import { retrieve } from "@/ai-rag/services/retrieval-pipeline";
import { vectorStore } from "@/lib/vector-store";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string; questionId: string }> }
) {
  const { id, questionId } = await params;
  const rfpQuestions = questionsByRfp[id];

  if (!rfpQuestions) {
    return NextResponse.json({ error: "RFP not found" }, { status: 404 });
  }

  const question = rfpQuestions.find((q) => q.id === questionId);
  if (!question) {
    return NextResponse.json({ error: "Question not found" }, { status: 404 });
  }

  try {
    // 1. Retrieve context using the RAG pipeline
    const retrievalResult = await retrieve(question.text, { topK: 3 }, { vectorStore });

    // 2. Generate an answer based on retrieved context (Mock Generation for now)
    let generatedAnswer = "Based on our policies, ";
    let confidence = 0;

    if (retrievalResult.results.length > 0) {
      const topContext = retrievalResult.results[0];
      generatedAnswer += `we comply with ${topContext.documentId} standards as outlined in ${topContext.metadata.sectionHeading || "the document"}. Specifically, ${topContext.text}`;
      confidence = Math.round(topContext.score * 100);
    } else {
      generatedAnswer = "We could not find specific documentation addressing this question in our knowledge base. Please review manually.";
      confidence = 10;
    }

    // 3. Format sources
    const sources = retrievalResult.results.map((r, i) => ({
      id: `src_${i}`,
      documentId: r.documentId,
      documentTitle: r.documentId,
      page: r.metadata.pageNumber || 1,
      excerpt: r.text,
      relevance: Math.round(r.score * 100),
    }));

    return NextResponse.json({
      answer: generatedAnswer,
      confidence,
      sources,
      telemetry: retrievalResult.telemetry
    });

  } catch (error: unknown) {
    console.error("Answer generation failed:", error);
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unknown error" }, { status: 500 });
  }
}
