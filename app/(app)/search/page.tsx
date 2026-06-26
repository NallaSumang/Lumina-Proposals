"use client";
import { useState } from "react";
import { Search as SearchIcon, Sparkles, FileText, Clock, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/common/page-header";

const recent = ["encryption at rest", "SOC 2 controls", "HIPAA BAA", "incident response RTO", "BYOK key rotation"];
const suggested = ["What is your data residency policy?", "Describe multi-tenancy isolation", "Outline disaster recovery RPO and RTO", "Which SSO providers are supported?"];

const results = [
  { title: "SOC 2 Type II Report 2025 · Page 14", snippet: "All production data stores employ **AES-256 encryption at rest**, with TLS 1.3 enforced for data in transit. Keys are rotated every 90 days via AWS KMS.", relevance: 96, doc: "SOC 2 Type II Report 2025" },
  { title: "Product Security Whitepaper · Page 8", snippet: "Envelope encryption is implemented via AWS KMS. Customers on Enterprise plans may **bring their own keys (BYOK)** via integration with their own KMS instance.", relevance: 91, doc: "Product Security Whitepaper" },
  { title: "Incident Response Policy · Page 4", snippet: "Confirmed customer-impacting incidents are notified within **24 hours**, with a written post-mortem delivered within 5 business days.", relevance: 84, doc: "Incident Response Policy" },
  { title: "ISO 27001 Statement of Applicability · Page 22", snippet: "Control A.10.1 — **Cryptographic controls**: a formal policy governs the use of cryptographic controls and key management, audited annually.", relevance: 79, doc: "ISO 27001 Statement of Applicability" },
];

export default function SearchPage() {
  const [q, setQ] = useState("encryption at rest");
  return (
    <div className="space-y-6">
      <PageHeader title="Search" description="Semantic search across your knowledge base, RFPs and past answers." />

      <Card className="overflow-visible">
        <CardContent className="p-4">
          <div className="relative">
            <Sparkles className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-primary" />
            <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Ask anything — try “What's our RPO for disaster recovery?”" className="h-14 rounded-xl pl-12 pr-32 text-base shadow-soft" />
            <kbd className="absolute right-4 top-1/2 -translate-y-1/2 rounded border bg-background px-2 py-1 text-[10px] font-medium text-muted-foreground">⌘ K</kbd>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardContent className="space-y-3 p-5">
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{results.length} results · {q ? `for "${q}"` : "popular queries"}</p>
            {results.map((r, i) => (
              <motion.div key={r.title} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
                className="group cursor-pointer rounded-xl border bg-card p-4 transition hover:shadow-soft">
                <div className="flex items-start gap-3">
                  <div className="grid h-9 w-9 place-items-center rounded-lg bg-primary/10 text-primary"><FileText className="h-4 w-4" /></div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <p className="truncate text-sm font-semibold group-hover:text-primary">{r.title}</p>
                      <Badge variant="success">{r.relevance}% match</Badge>
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">{r.doc}</p>
                    <p className="mt-2 text-sm leading-relaxed" dangerouslySetInnerHTML={{ __html: r.snippet.replace(/\*\*(.*?)\*\*/g, '<mark class="rounded bg-warning/30 px-1">$1</mark>') }} />
                  </div>
                  <ArrowRight className="h-4 w-4 self-center text-muted-foreground transition group-hover:translate-x-0.5" />
                </div>
              </motion.div>
            ))}
          </CardContent>
        </Card>

        <div className="space-y-4">
          <Card>
            <CardContent className="space-y-2 p-5">
              <p className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-muted-foreground"><Clock className="h-3 w-3" /> Recent searches</p>
              <ul className="space-y-1.5 text-sm">
                {recent.map((r) => (
                  <li key={r}><button className="flex w-full items-center justify-between rounded-lg px-2 py-1.5 text-left hover:bg-muted"><span>{r}</span><SearchIcon className="h-3.5 w-3.5 text-muted-foreground" /></button></li>
                ))}
              </ul>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="space-y-2 p-5">
              <p className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-muted-foreground"><Sparkles className="h-3 w-3" /> Suggested</p>
              <ul className="space-y-1.5 text-sm">
                {suggested.map((s) => (
                  <li key={s}><button className="rounded-lg px-2 py-1.5 text-left hover:bg-muted">{s}</button></li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
