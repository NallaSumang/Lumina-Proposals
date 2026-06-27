"use client";
import { motion } from "framer-motion";
import { FileText, ShieldCheck, BookOpen, Scale, Briefcase, FlaskConical } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { formatDate, initials } from "@/lib/utils";
import type { KnowledgeDoc } from "@/types";

export const typeIcon: Record<KnowledgeDoc["type"], React.ComponentType<{ className?: string }>> = {
  security: ShieldCheck, policy: BookOpen, technical: FlaskConical, product: Briefcase, legal: Scale, case_study: FileText,
};

export function DocumentGrid({ data }: { data: KnowledgeDoc[] }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {data.map((d, i) => {
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
  );
}
