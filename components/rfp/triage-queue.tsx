"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Edit2, ThumbsDown, Sparkles, FileText, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ConfidenceBadge } from "@/components/common/badges";
import { useGenerateAnswer } from "@/hooks/use-queries";
import { toast } from "sonner";
import type { Question } from "@/types";

interface TriageQueueProps {
  questions: Question[];
  rfpId: string;
}

export function TriageQueue({ questions, rfpId }: TriageQueueProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  
  // Local state for the current answer being triaged
  const [draftAnswer, setDraftAnswer] = useState("");
  
  const { mutate: generateAnswer, isPending } = useGenerateAnswer();

  const activeQuestion = questions[currentIndex];
  const isFinished = currentIndex >= questions.length;

  // Initialize draft answer when question changes
  useState(() => {
    if (activeQuestion) {
      setDraftAnswer(activeQuestion.answer || "");
    }
  });

  if (isFinished) {
    return (
      <div className="flex h-[80vh] flex-col items-center justify-center text-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="flex flex-col items-center"
        >
          <div className="grid h-24 w-24 place-items-center rounded-full bg-success/20 text-success mb-6">
            <CheckCircle2 className="h-12 w-12" />
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-foreground">Inbox Zero!</h2>
          <p className="text-muted-foreground mt-2 max-w-md">
            You&apos;ve successfully triaged all questions in this RFP. You can now export the final document.
          </p>
          <Button className="mt-8" size="lg">Export Responses</Button>
        </motion.div>
      </div>
    );
  }

  const handleNext = () => {
    setIsEditing(false);
    setCurrentIndex((prev) => prev + 1);
    const nextQ = questions[currentIndex + 1];
    if (nextQ) {
      setDraftAnswer(nextQ.answer || "");
    }
  };

  const handleApprove = () => {
    toast.success("Answer approved");
    handleNext();
  };

  const handleReject = () => {
    toast.message("Answer rejected");
    handleNext();
  };

  const handleRegenerate = () => {
    const promise = new Promise((resolve, reject) => {
      generateAnswer(
        { rfpId, questionId: activeQuestion.id },
        {
          onSuccess: (data) => {
            setDraftAnswer(data.answer);
            // Optionally, update sources/confidence in a real app
            resolve(data);
          },
          onError: reject
        }
      );
    });

    toast.promise(promise, {
      loading: 'Running RAG pipeline...',
      success: 'New answer generated',
      error: 'Failed to generate answer'
    });
  };

  return (
    <div className="mx-auto flex h-[calc(100vh-140px)] w-full max-w-7xl flex-col overflow-hidden relative">
      {/* Top Progress Bar */}
      <div className="mb-8 flex items-center justify-between">
        <div className="flex flex-col">
          <span className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
            Triage Queue
          </span>
          <span className="text-2xl font-semibold">
            {currentIndex + 1} of {questions.length}
          </span>
        </div>
        <div className="flex gap-1">
          {questions.map((_, idx) => (
            <div 
              key={idx} 
              className={`h-2 w-8 rounded-full transition-colors ${idx < currentIndex ? 'bg-primary' : idx === currentIndex ? 'bg-primary/50' : 'bg-muted'}`}
            />
          ))}
        </div>
      </div>

      <div className="relative flex-1">
        <AnimatePresence mode="popLayout">
          <motion.div
            key={activeQuestion.id}
            initial={{ opacity: 0, x: 100, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: -100, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="absolute inset-0 grid grid-cols-1 lg:grid-cols-2 gap-8"
          >
            {/* LEFT PANE: The Question & Answer */}
            <div className="flex flex-col rounded-3xl border bg-card/50 backdrop-blur-xl shadow-elevated p-8">
              <div className="mb-6 flex items-center gap-3">
                <Badge variant="outline" className="text-sm px-3 py-1 bg-background/50 backdrop-blur-md">
                  {activeQuestion.section}
                </Badge>
                <ConfidenceBadge value={activeQuestion.confidence} />
              </div>
              
              <h2 className="text-2xl font-bold tracking-tight mb-8 leading-snug">
                {activeQuestion.text}
              </h2>

              <div className="relative flex-1 rounded-2xl bg-muted/30 p-6 border border-border/50 flex flex-col">
                <div className="absolute -top-3 left-6 bg-background px-2 text-xs font-semibold uppercase tracking-wider text-primary">
                  Draft Answer
                </div>
                
                {isEditing ? (
                  <Textarea 
                    value={draftAnswer}
                    onChange={(e) => setDraftAnswer(e.target.value)}
                    className="flex-1 resize-none bg-transparent border-none focus-visible:ring-0 p-0 text-base leading-relaxed"
                  />
                ) : (
                  <p className="text-base leading-relaxed whitespace-pre-wrap flex-1 overflow-y-auto pr-2">
                    {draftAnswer || "No answer generated yet."}
                  </p>
                )}
              </div>

              {/* Action Buttons */}
              <div className="mt-8 grid grid-cols-2 lg:grid-cols-4 gap-3">
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="rounded-xl h-14"
                  onClick={() => setIsEditing(!isEditing)}
                >
                  <Edit2 className="h-5 w-5 mr-2" />
                  {isEditing ? "Done" : "Edit"}
                </Button>
                
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="rounded-xl h-14"
                  onClick={handleRegenerate}
                  disabled={isPending}
                >
                  <Sparkles className="h-5 w-5 mr-2 text-primary" />
                  Regen
                </Button>

                <Button 
                  variant="destructive" 
                  size="lg" 
                  className="rounded-xl h-14 bg-destructive/10 text-destructive hover:bg-destructive/20 border-none"
                  onClick={handleReject}
                >
                  <ThumbsDown className="h-5 w-5 mr-2" />
                  Reject
                </Button>

                <Button 
                  size="lg" 
                  className="rounded-xl h-14 shadow-glow"
                  onClick={handleApprove}
                >
                  <Check className="h-5 w-5 mr-2" />
                  Approve
                </Button>
              </div>
            </div>

            {/* RIGHT PANE: Sources Context */}
            <div className="flex flex-col rounded-3xl border bg-card/30 backdrop-blur-xl p-8">
              <h3 className="text-lg font-semibold tracking-tight mb-6 flex items-center gap-2">
                <FileText className="h-5 w-5 text-muted-foreground" />
                Sourced Context
              </h3>
              
              <div className="flex-1 space-y-4 overflow-y-auto pr-2">
                {activeQuestion.sources.map((src, i) => (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    key={src.id} 
                    className="rounded-2xl border bg-background/50 p-5 shadow-sm"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-medium text-sm text-foreground truncate mr-4">
                        {src.documentTitle}
                      </span>
                      <Badge variant="secondary" className="bg-success/10 text-success border-success/20">
                        {src.relevance}% Match
                      </Badge>
                    </div>
                    <p className="text-sm leading-relaxed text-muted-foreground italic border-l-2 border-primary/30 pl-4 py-1">
                      &quot;{src.excerpt}&quot;
                    </p>
                  </motion.div>
                ))}
                
                {activeQuestion.sources.length === 0 && (
                  <div className="h-full flex items-center justify-center text-muted-foreground text-sm">
                    No sources were used for this answer.
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
