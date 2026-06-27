"use client";
import { useMemo, useState } from "react";
import { Search, Filter, ChevronRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ConfidenceBadge, QuestionStatusBadge } from "@/components/common/badges";
import type { Question } from "@/types";

interface QuestionsListProps {
  questions: Question[];
  activeId: string;
  onSelect: (id: string, answer: string) => void;
}

export function QuestionsList({ questions, activeId, onSelect }: QuestionsListProps) {
  const [filter, setFilter] = useState("");
  
  const filtered = useMemo(() => 
    questions.filter((q) => (q.text + q.number + q.section).toLowerCase().includes(filter.toLowerCase())), 
  [filter, questions]);

  return (
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
                onClick={() => onSelect(q.id, q.answer ?? "")}
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
  );
}
