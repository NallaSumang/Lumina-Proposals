"use client";
import { use, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Search, Sparkles, ThumbsUp, ThumbsDown, MessageSquare, Save, Download, History, FileText, Filter, ChevronRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { PageHeader } from "@/components/common/page-header";
import { ConfidenceBadge, QuestionStatusBadge, StatusBadge } from "@/components/common/badges";
import { rfps, questionsByRfp } from "@/lib/mock";
import { toast } from "sonner";
import { notFound } from "next/navigation";
import { formatRelative, initials } from "@/lib/utils";

export default function RFPWorkspacePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const rfp = rfps.find((r) => r.id === id);
  if (!rfp) notFound();
  const questions = questionsByRfp[id] ?? [];
  const [activeId, setActiveId] = useState(questions[0]?.id);
  const [filter, setFilter] = useState("");
  const active = questions.find((q) => q.id === activeId)!;
  const [answer, setAnswer] = useState(active?.answer ?? "");
  const filtered = useMemo(() => questions.filter((q) => (q.text + q.number + q.section).toLowerCase().includes(filter.toLowerCase())), [filter, questions]);

  const pct = Math.round((rfp.answered / rfp.questions) * 100);

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

      {/* Summary strip */}
      <Card>
        <CardContent className="grid gap-4 p-4 md:grid-cols-4">
          <div>
            <p className="text-[11px] uppercase tracking-wider text-muted-foreground">Status</p>
            <div className="mt-1.5"><StatusBadge status={rfp.status} /></div>
          </div>
          <div>
            <p className="text-[11px] uppercase tracking-wider text-muted-foreground">Progress</p>
            <div className="mt-2 flex items-center gap-2"><Progress value={pct} className="h-1.5" /><span className="text-xs tabular-nums">{pct}%</span></div>
          </div>
          <div>
            <p className="text-[11px] uppercase tracking-wider text-muted-foreground">Confidence</p>
            <p className="mt-1 text-lg font-semibold">{rfp.confidence}%</p>
          </div>
          <div>
            <p className="text-[11px] uppercase tracking-wider text-muted-foreground">Owner</p>
            <div className="mt-1 flex items-center gap-2">
              <Avatar className="h-6 w-6"><AvatarFallback className="text-[10px]">{initials(rfp.owner.name)}</AvatarFallback></Avatar>
              <span className="text-sm">{rfp.owner.name}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 lg:grid-cols-12">
        {/* Questions list */}
        <Card className="lg:col-span-5 xl:col-span-4">
          <CardContent className="p-0">
            <div className="flex items-center gap-2 border-b p-3">
              <div className="relative flex-1">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input placeholder="Search questions…" className="h-9 pl-9" value={filter} onChange={(e) => setFilter(e.target.value)} />
              </div>
              <Button variant="outline" size="icon" aria-label="Filter"><Filter className="h-4 w-4" /></Button>
            </div>
            <ul className="max-h-[640px] divide-y overflow-y-auto">
              {filtered.map((q) => (
                <li key={q.id}>
                  <button
                    onClick={() => { setActiveId(q.id); setAnswer(q.answer ?? ""); }}
                    className={`flex w-full items-start gap-3 p-4 text-left transition ${activeId === q.id ? "bg-primary/5" : "hover:bg-muted/40"}`}
                  >
                    <div className="flex w-10 shrink-0 flex-col items-center">
                      <span className="text-[10px] font-semibold text-muted-foreground">{q.number}</span>
                      <ConfidenceBadge value={q.confidence} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">{q.section}</p>
                      <p className="mt-0.5 line-clamp-2 text-sm">{q.text}</p>
                      <div className="mt-2"><QuestionStatusBadge status={q.status} /></div>
                    </div>
                    <ChevronRight className="h-4 w-4 self-center text-muted-foreground" />
                  </button>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Editor */}
        <Card className="lg:col-span-7 xl:col-span-8">
          <CardContent className="space-y-5 p-6">
            <motion.div key={active.id} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="outline">{active.section}</Badge>
                  <Badge variant="secondary">Q {active.number}</Badge>
                  <ConfidenceBadge value={active.confidence} />
                  <QuestionStatusBadge status={active.status} />
                  <div className="ml-auto flex items-center gap-1 text-xs text-muted-foreground"><Save className="h-3 w-3" /> Autosaved {formatRelative(active.updatedAt)}</div>
                </div>
                <h2 className="text-lg font-semibold tracking-tight">{active.text}</h2>
              </div>

              <Tabs defaultValue="answer">
                <TabsList>
                  <TabsTrigger value="answer">Answer</TabsTrigger>
                  <TabsTrigger value="sources">Sources ({active.sources.length})</TabsTrigger>
                  <TabsTrigger value="history">Versions</TabsTrigger>
                  <TabsTrigger value="comments">Comments</TabsTrigger>
                </TabsList>

                <TabsContent value="answer" className="space-y-4">
                  <Textarea value={answer} onChange={(e) => setAnswer(e.target.value)} className="min-h-[280px] text-sm leading-relaxed" />
                  <div className="flex flex-wrap items-center gap-2">
                    <Button onClick={() => toast.success("Answer regenerated")}><Sparkles className="h-4 w-4" /> Regenerate</Button>
                    <Button variant="outline" onClick={() => toast.success("Saved")}><Save className="h-4 w-4" /> Save draft</Button>
                    <div className="ml-auto flex items-center gap-2">
                      <Button variant="outline" onClick={() => toast.message("Rejected")}><ThumbsDown className="h-4 w-4" /> Reject</Button>
                      <Button onClick={() => toast.success("Approved")}><ThumbsUp className="h-4 w-4" /> Approve</Button>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="sources" className="space-y-3">
                  {active.sources.map((s) => (
                    <div key={s.id} className="rounded-xl border bg-card p-4">
                      <div className="flex items-start gap-3">
                        <div className="grid h-9 w-9 place-items-center rounded-lg bg-primary/10 text-primary"><FileText className="h-4 w-4" /></div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between gap-2">
                            <p className="truncate text-sm font-medium">{s.documentTitle}</p>
                            <Badge variant="success">{s.relevance}% match</Badge>
                          </div>
                          <p className="text-xs text-muted-foreground">Page {s.page}</p>
                          <p className="mt-2 rounded-md bg-muted/50 p-3 text-xs italic text-foreground">“{s.excerpt}”</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </TabsContent>

                <TabsContent value="history">
                  <ol className="space-y-3">
                    {[1, 2, 3].map((v) => (
                      <li key={v} className="flex items-start gap-3 rounded-lg border bg-card p-3">
                        <Avatar className="h-7 w-7"><AvatarFallback className="text-[10px]">AM</AvatarFallback></Avatar>
                        <div className="flex-1">
                          <p className="text-sm"><span className="font-medium">Alex Morgan</span> edited version <span className="font-medium">v{4 - v}</span></p>
                          <p className="text-xs text-muted-foreground">{v}d ago · 12 lines changed</p>
                        </div>
                        <Button variant="outline" size="sm">Restore</Button>
                      </li>
                    ))}
                  </ol>
                </TabsContent>

                <TabsContent value="comments">
                  <div className="space-y-3">
                    <div className="flex items-start gap-3 rounded-lg border bg-card p-3">
                      <Avatar className="h-7 w-7"><AvatarFallback className="text-[10px]">PS</AvatarFallback></Avatar>
                      <div className="flex-1">
                        <p className="text-sm"><span className="font-medium">Priya Shah</span> · <span className="text-xs text-muted-foreground">2h ago</span></p>
                        <p className="mt-1 text-sm">Can we add a sentence about FIPS 140-2 validated modules? Worth calling out for federal RFPs.</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <Textarea placeholder="Add a comment…" className="min-h-[60px]" />
                      <Button onClick={() => toast.success("Comment posted")}><MessageSquare className="h-4 w-4" /> Post</Button>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </motion.div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
