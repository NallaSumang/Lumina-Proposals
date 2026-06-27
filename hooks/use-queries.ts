import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { RFP, KnowledgeDoc, Question } from "@/types";

export function useRFPs() {
  return useQuery<RFP[]>({
    queryKey: ["rfps"],
    queryFn: async () => {
      const res = await fetch("/api/rfps");
      if (!res.ok) throw new Error("Failed to fetch RFPs");
      return res.json();
    }
  });
}

export function useRFP(id: string) {
  return useQuery<{ rfp: RFP, questions: Question[] }>({
    queryKey: ["rfps", id],
    queryFn: async () => {
      const res = await fetch(`/api/rfps/${id}`);
      if (!res.ok) throw new Error("Failed to fetch RFP");
      return res.json();
    }
  });
}

export function useKnowledgeDocs() {
  return useQuery<KnowledgeDoc[]>({
    queryKey: ["documents"],
    queryFn: async () => {
      const res = await fetch("/api/documents");
      if (!res.ok) throw new Error("Failed to fetch documents");
      return res.json();
    }
  });
}

export function useGenerateAnswer() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ rfpId, questionId }: { rfpId: string, questionId: string }) => {
      const res = await fetch(`/api/rfps/${rfpId}/questions/${questionId}/answer`, {
        method: "POST",
      });
      if (!res.ok) throw new Error("Failed to generate answer");
      return res.json();
    },
    // We could invalidate queries here if we wanted to refetch, but since we are handling local state in the component, we just return the result.
  });
}

export function useUploadDocument() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append("file", file);
      
      const res = await fetch("/api/documents", {
        method: "POST",
        body: formData,
      });
      
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Upload failed");
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["documents"] });
    },
  });
}
