import { createVectorStore } from "@/ai-rag/services/vector-store";

const globalForVectorStore = globalThis as unknown as {
  vectorStore: ReturnType<typeof createVectorStore> | undefined;
};

export const vectorStore = globalForVectorStore.vectorStore ?? createVectorStore();

if (process.env.NODE_ENV !== "production") {
  globalForVectorStore.vectorStore = vectorStore;
}
