"use client";
import { use } from "react";
import { Download, History, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/common/page-header";
import { useRFP } from "@/hooks/use-queries";
import { notFound } from "next/navigation";
import { TriageQueue } from "@/components/rfp/triage-queue";

export default function RFPWorkspacePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { data, isLoading, error } = useRFP(id);

  if (error) notFound();
  if (isLoading || !data) return <div className="p-8 text-center text-muted-foreground">Loading workspace...</div>;

  const { rfp, questions } = data;

  return (
    <div className="space-y-6">
      <PageHeader
        title={rfp.title}
        description={`${rfp.client} · #${rfp.id.replace("rfp_", "")}`}
        actions={
          <>
            <Button variant="outline"><History className="h-4 w-4" /> History</Button>
            <Button variant="outline"><Download className="h-4 w-4" /> Export</Button>
            <Button><Sparkles className="h-4 w-4" /> Generate all</Button>
          </>
        }
      />

      {questions.length > 0 ? (
        <TriageQueue questions={questions} rfpId={id} />
      ) : (
        <div className="flex h-64 items-center justify-center rounded-xl border border-dashed text-muted-foreground">
          No questions found in this RFP workspace.
        </div>
      )}
    </div>
  );
}
