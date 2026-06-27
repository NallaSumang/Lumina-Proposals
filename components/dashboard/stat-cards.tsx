"use client";
import { motion } from "framer-motion";
import { FileText, BookOpen, CheckCircle2, Sparkles, TrendingUp, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { stats } from "@/lib/mock";

const statCards = [
  { label: "Total RFPs", value: stats.totalRfps, delta: "+12%", icon: FileText, tone: "bg-primary/10 text-primary" },
  { label: "Pending", value: stats.pending, delta: "+3", icon: Clock, tone: "bg-warning/10 text-warning" },
  { label: "Completed", value: stats.completed, delta: "+8", icon: CheckCircle2, tone: "bg-success/10 text-success" },
  { label: "Knowledge docs", value: stats.knowledgeDocs, delta: "+4", icon: BookOpen, tone: "bg-accent/15 text-accent" },
  { label: "Avg confidence", value: `${stats.avgConfidence}%`, delta: "+2.1%", icon: Sparkles, tone: "bg-primary/10 text-primary" },
  { label: "Hours saved", value: stats.hoursSaved.toLocaleString(), delta: "+182", icon: TrendingUp, tone: "bg-success/10 text-success" },
];

export function StatCards() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
      {statCards.map((s, i) => (
        <motion.div key={s.label} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
          <Card className="transition-all hover:shadow-elevated">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div className={`grid h-8 w-8 place-items-center rounded-lg ${s.tone}`}><s.icon className="h-4 w-4" /></div>
                <span className="text-xs font-medium text-success">{s.delta}</span>
              </div>
              <p className="mt-4 text-[11px] uppercase tracking-wider text-muted-foreground">{s.label}</p>
              <p className="mt-1 text-2xl font-semibold tracking-tight">{s.value}</p>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}
