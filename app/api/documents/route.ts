import { NextResponse } from "next/server";
import { knowledgeDocs } from "@/lib/mock";
import { ingestDocument } from "@/ai-rag/services/ingestion-pipeline";
import { vectorStore } from "@/lib/vector-store";

export async function GET() {
  // In a real app, this would fetch from a database.
  // For now, we combine the mock documents with whatever was dynamically uploaded.
  return NextResponse.json(knowledgeDocs);
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;
    
    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const buffer = await file.arrayBuffer();
    
    // Process document through the ingestion RAG pipeline
    const result = await ingestDocument(
      buffer, 
      file.name, 
      file.type, 
      vectorStore
    );

    return NextResponse.json(result);
  } catch (error: unknown) {
    console.error("Document ingestion failed:", error);
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unknown error" }, { status: 500 });
  }
}
