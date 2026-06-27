"use client";
import { motion } from "framer-motion";
import { Save, Sparkles, ThumbsUp, ThumbsDown, MessageSquare, FileText } from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ConfidenceBadge, QuestionStatusBadge } from "@/components/common/badges";
import type { Question } from "@/types";
import { formatRelative } from "@/lib/utils";
import { useGenerateAnswer } from "@/hooks/use-queries";
import { useState, useEffect } from "react";

interface QuestionEditorProps {
  active: Question;
  answer: string;
  setAnswer: (val: string) => void;
  rfpId: string;
}

export function QuestionEditor({ active, answer, setAnswer, rfpId }: QuestionEditorProps) {
  const { mutate: generateAnswer, isPending } = useGenerateAnswer();
  
  // Keep local state for the generated output so the UI updates
  const [sources, setSources] = useState(active.sources);
  const [confidence, setConfidence] = useState(active.confidence);

  useEffect(() => {
    setSources(active.sources);
    setConfidence(active.confidence);
  }, [active]);

  const handleRegenerate = () => {
    const promise = new Promise((resolve, reject) => {
      generateAnswer(
        { rfpId, questionId: active.id },
        {
          onSuccess: (data) => {
            setAnswer(data.answer);
            setSources(data.sources);
            setConfidence(data.confidence);
            resolve(data);
          },
          onError: reject
        }
      );
    });
    
    toast.promise(promise, {
      loading: 'Running RAG pipeline...',
      success: 'Answer generated successfully',
      error: 'Failed to generate answer'
    });
  };
  return (
    <Card className="lg:col-span-7 xl:col-span-8">
      <CardContent className="space-y-5 p-6">
        <motion.div key={active.id} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="outline">{active.section}</Badge>
              <Badge variant="secondary">Q {active.number}</Badge>
              <ConfidenceBadge value={confidence} />
              <QuestionStatusBadge status={active.status} />
              <div className="ml-auto flex items-center gap-1 text-xs text-muted-foreground"><Save className="h-3 w-3" /> Autosaved {formatRelative(active.updatedAt)}</div>
            </div>
            <h2 className="text-lg font-semibold tracking-tight">{active.text}</h2>
          </div>

          <Tabs defaultValue="answer">
            <TabsList>
              <TabsTrigger value="answer">Answer</TabsTrigger>
              <TabsTrigger value="sources">Sources ({sources.length})</TabsTrigger>
              <TabsTrigger value="history">Versions</TabsTrigger>
              <TabsTrigger value="comments">Comments</TabsTrigger>
            </TabsList>

            <TabsContent value="answer" className="space-y-4">
              <Textarea value={answer} onChange={(e) => setAnswer(e.target.value)} className="min-h-[280px] text-sm leading-relaxed" />
              <div className="flex flex-wrap items-center gap-2">
                <Button onClick={handleRegenerate} disabled={isPending}>
                  <Sparkles className="h-4 w-4" /> 
                  {isPending ? "Generating..." : "Regenerate"}
                </Button>
                <Button variant="outline" onClick={() => toast.success("Saved")}><Save className="h-4 w-4" /> Save draft</Button>
                <div className="ml-auto flex items-center gap-2">
                  <Button variant="outline" onClick={() => toast.message("Rejected")}><ThumbsDown className="h-4 w-4" /> Reject</Button>
                  <Button onClick={() => toast.success("Approved")}><ThumbsUp className="h-4 w-4" /> Approve</Button>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="sources" className="space-y-3">
              {sources.map((s) => (
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
  );
}
