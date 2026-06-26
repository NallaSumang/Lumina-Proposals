"use client";
import { useState, useMemo } from "react";
import { LayoutGrid, List, Search, Upload, Filter, FileText, ShieldCheck, BookOpen, Scale, Briefcase, FlaskConical } from "lucide-react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { PageHeader } from "@/components/common/page-header";
import { knowledgeDocs } from "@/lib/mock";
import { formatDate, initials } from "@/lib/utils";
import type { KnowledgeDoc } from "@/types";

const typeIcon: Record<KnowledgeDoc["type"], React.ComponentType<{ className?: string }>> = {
  security: ShieldCheck, policy: BookOpen, technical: FlaskConical, product: Briefcase, legal: Scale, case_study: FileText,
};

const tagFilters = ["All", "SOC2", "ISO27001", "HIPAA", "GDPR", "Security", "Policy", "Technical"];

export default function KnowledgeBasePage() {
  const [view, setView] = useState<"grid" | "list">("grid");
  const [query, setQuery] = useState("");
  const [tag, setTag] = useState("All");

  const filtered = useMemo(() => knowledgeDocs.filter((d) => {
    const q = query.toLowerCase();
    const matchesQ = !q || d.title.toLowerCase().includes(q) || d.tags.some((t) => t.toLowerCase().includes(q));
    const matchesT = tag === "All" || d.tags.includes(tag) || d.type === tag.toLowerCase();
    return matchesQ && matchesT;
  }), [query, tag]);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Knowledge Base"
        description="Your single source of truth — policies, security docs, past responses, and case studies."
        actions={<Button><Upload className="h-4 w-4" /> Upload document</Button>}
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
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((d, i) => {
            const Icon = typeIcon[d.type];
            return (
              <motion.div key={d.id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}>
                <Card className="group h-full cursor-pointer transition-all hover:-translate-y-0.5 hover:shadow-elevated">
                  <CardContent className="space-y-3 p-5">
                    <div className="flex items-start justify-between">
                      <div className="grid h-10 w-10 place-items-center rounded-lg bg-primary/10 text-primary"><Icon className="h-5 w-5" /></div>
                      <Badge variant={d.status === "indexed" ? "success" : d.status === "processing" ? "accent" : "danger"}>{d.status}</Badge>
                    </div>
                    <div>
                      <h3 className="line-clamp-2 text-sm font-semibold leading-snug">{d.title}</h3>
                      <p className="mt-1 text-xs text-muted-foreground">{d.version} · {d.size}</p>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {d.tags.slice(0, 3).map((t) => <Badge key={t} variant="secondary" className="text-[10px]">{t}</Badge>)}
                    </div>
                    <div className="flex items-center gap-2 border-t pt-3">
                      <Avatar className="h-6 w-6"><AvatarFallback className="text-[10px]">{initials(d.uploadedBy.name)}</AvatarFallback></Avatar>
                      <span className="text-xs text-muted-foreground">{d.uploadedBy.name.split(" ")[0]} · {formatDate(d.uploadedAt)}</span>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      ) : (
        <Card>
          <CardContent className="p-0">
            <table className="w-full text-sm">
              <thead className="bg-muted/40">
                <tr>{["Document", "Type", "Tags", "Version", "Size", "Uploaded", "Status"].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{h}</th>
                ))}</tr>
              </thead>
              <tbody>
                {filtered.map((d) => {
                  const Icon = typeIcon[d.type];
                  return (
                    <tr key={d.id} className="border-t hover:bg-muted/40">
                      <td className="px-4 py-3"><div className="flex items-center gap-3">
                        <div className="grid h-8 w-8 place-items-center rounded-md bg-primary/10 text-primary"><Icon className="h-4 w-4" /></div>
                        <span className="font-medium">{d.title}</span>
                      </div></td>
                      <td className="px-4 py-3 capitalize text-muted-foreground">{d.type.replace("_", " ")}</td>
                      <td className="px-4 py-3"><div className="flex flex-wrap gap-1">{d.tags.map((t) => <Badge key={t} variant="secondary" className="text-[10px]">{t}</Badge>)}</div></td>
                      <td className="px-4 py-3 text-xs text-muted-foreground">{d.version}</td>
                      <td className="px-4 py-3 text-xs text-muted-foreground">{d.size}</td>
                      <td className="px-4 py-3 text-xs text-muted-foreground">{formatDate(d.uploadedAt)}</td>
                      <td className="px-4 py-3"><Badge variant={d.status === "indexed" ? "success" : d.status === "processing" ? "accent" : "danger"}>{d.status}</Badge></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
