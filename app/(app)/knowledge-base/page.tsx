"use client";
import { useState, useMemo } from "react";
import { LayoutGrid, List, Search, Upload, Filter } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/common/page-header";
import { DocumentGrid } from "@/components/kb/document-grid";
import { DocumentList } from "@/components/kb/document-list";
import { useKnowledgeDocs, useUploadDocument } from "@/hooks/use-queries";
import { toast } from "sonner";
import { useRef } from "react";

const tagFilters = ["All", "SOC2", "ISO27001", "HIPAA", "GDPR", "Security", "Policy", "Technical"];

export default function KnowledgeBasePage() {
  const { data: knowledgeDocs = [] } = useKnowledgeDocs();
  const { mutate: uploadDocument, isPending } = useUploadDocument();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [view, setView] = useState<"grid" | "list">("grid");
  const [query, setQuery] = useState("");
  const [tag, setTag] = useState("All");

  const filtered = useMemo(() => knowledgeDocs.filter((d) => {
    const q = query.toLowerCase();
    const matchesQ = !q || d.title.toLowerCase().includes(q) || d.tags.some((t) => t.toLowerCase().includes(q));
    const matchesT = tag === "All" || d.tags.includes(tag) || d.type === tag.toLowerCase();
    return matchesQ && matchesT;
  }), [query, tag, knowledgeDocs]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    toast.promise(
      new Promise((resolve, reject) => {
        uploadDocument(file, { onSuccess: resolve, onError: reject });
      }),
      {
        loading: "Uploading and processing document...",
        success: "Document indexed successfully",
        error: "Failed to upload document",
      }
    );
    
    // reset input
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Knowledge Base"
        description="Your single source of truth — policies, security docs, past responses, and case studies."
        actions={
          <>
            <input type="file" className="hidden" ref={fileInputRef} onChange={handleFileChange} />
            <Button onClick={() => fileInputRef.current?.click()} disabled={isPending}>
              <Upload className="h-4 w-4" /> 
              {isPending ? "Uploading..." : "Upload document"}
            </Button>
          </>
        }
      />

      <Card>
        <CardContent className="flex flex-wrap items-center gap-3 p-4">
          <div className="relative w-full md:w-96">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Search by title, tag, content…" className="pl-9" value={query} onChange={(e) => setQuery(e.target.value)} />
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {tagFilters.map((t) => (
              <Badge key={t} onClick={() => setTag(t)} variant={tag === t ? "default" : "outline"} className="cursor-pointer">{t}</Badge>
            ))}
          </div>
          <div className="ml-auto flex items-center gap-2">
            <Button variant="outline" size="icon"><Filter className="h-4 w-4" /></Button>
            <div className="flex overflow-hidden rounded-lg border">
              <button onClick={() => setView("grid")} className={`px-2.5 py-1.5 transition ${view === "grid" ? "bg-muted" : "hover:bg-muted/50"}`} aria-label="Grid view"><LayoutGrid className="h-4 w-4" /></button>
              <button onClick={() => setView("list")} className={`px-2.5 py-1.5 transition ${view === "list" ? "bg-muted" : "hover:bg-muted/50"}`} aria-label="List view"><List className="h-4 w-4" /></button>
            </div>
          </div>
        </CardContent>
      </Card>

      {view === "grid" ? (
        <DocumentGrid data={filtered} />
      ) : (
        <DocumentList data={filtered} />
      )}
    </div>
  );
}
