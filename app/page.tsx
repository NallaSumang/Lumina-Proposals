import Link from "next/link";
import { ArrowRight, Sparkles, ShieldCheck, Zap, FileSearch, Layers, Workflow } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const logos = ["ACME", "NORTHWIND", "GLOBEX", "INITECH", "UMBRA", "HOOLI"];

const features = [
  { icon: FileSearch, title: "Ingest in seconds", body: "Drop an RFP, RFI or security questionnaire. We parse, classify and route every question automatically." },
  { icon: Sparkles, title: "Grounded answers", body: "Responses generated from your own knowledge base with full source citations and confidence scoring." },
  { icon: Workflow, title: "Built-in review", body: "Assign reviewers, comment, version, and approve. Ship a polished response without leaving TenderDox." },
  { icon: Layers, title: "One knowledge layer", body: "Centralise policies, security docs and past responses. Stay versioned. Stay accurate." },
  { icon: ShieldCheck, title: "Enterprise-grade", body: "SOC 2, SSO, RBAC, audit logs, regional data residency, BYOK encryption." },
  { icon: Zap, title: "10× faster", body: "Teams cut response time by 80% and win more deals with consistent, on-brand answers." },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Nav */}
      <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur-xl">
        <div className="container flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br from-primary to-accent text-white shadow-soft">
              <Sparkles className="h-4 w-4" />
            </div>
            <span className="text-base font-semibold tracking-tight">TenderDox</span>
          </Link>
          <nav className="hidden items-center gap-7 text-sm text-muted-foreground md:flex">
            <a href="#features" className="hover:text-foreground">Features</a>
            <a href="#how" className="hover:text-foreground">How it works</a>
            <a href="#security" className="hover:text-foreground">Security</a>
            <a href="#pricing" className="hover:text-foreground">Pricing</a>
          </nav>
          <div className="flex items-center gap-2">
            <Button asChild variant="ghost" size="sm"><Link href="/login">Sign in</Link></Button>
            <Button asChild size="sm"><Link href="/register">Get started <ArrowRight className="h-3.5 w-3.5" /></Link></Button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 grid-pattern opacity-[0.4] [mask-image:radial-gradient(60%_50%_at_50%_30%,black,transparent)]" />
        <div className="absolute -top-40 left-1/2 -z-10 h-[600px] w-[1100px] -translate-x-1/2 rounded-full bg-gradient-to-br from-primary/20 via-accent/20 to-transparent blur-3xl" />
        <div className="container relative pt-20 pb-24 text-center">
          <Badge variant="outline" className="mx-auto mb-6"><span className="h-1.5 w-1.5 rounded-full bg-success" /> New · Confidence-graded answers v2</Badge>
          <h1 className="mx-auto max-w-3xl text-5xl font-semibold leading-[1.05] tracking-tight md:text-6xl">
            Respond to RFPs <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">10× faster</span>.
            With sources you can trust.
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-base text-muted-foreground md:text-lg">
            TenderDox turns your security docs, policies and past responses into a single AI-powered knowledge layer — so your team ships winning proposals in hours, not weeks.
          </p>
          <div className="mt-8 flex items-center justify-center gap-3">
            <Button asChild size="lg"><Link href="/register">Start free trial <ArrowRight className="h-4 w-4" /></Link></Button>
            <Button asChild size="lg" variant="outline"><Link href="/dashboard">View live demo</Link></Button>
          </div>

          {/* Product mockup */}
          <div className="mx-auto mt-16 max-w-5xl rounded-2xl border bg-card p-2 shadow-elevated">
            <div className="rounded-xl bg-gradient-to-br from-slate-50 to-white p-1">
              <div className="grid grid-cols-12 gap-1 rounded-lg border bg-background p-4 text-left">
                <div className="col-span-3 space-y-2">
                  <div className="flex items-center gap-2 rounded-md bg-primary/10 px-3 py-2 text-xs font-medium text-primary">Dashboard</div>
                  <div className="rounded-md px-3 py-2 text-xs text-muted-foreground">RFPs · 24</div>
                  <div className="rounded-md px-3 py-2 text-xs text-muted-foreground">Knowledge · 142</div>
                  <div className="rounded-md px-3 py-2 text-xs text-muted-foreground">Analytics</div>
                  <div className="rounded-md px-3 py-2 text-xs text-muted-foreground">Settings</div>
                </div>
                <div className="col-span-9 space-y-3">
                  <div className="grid grid-cols-4 gap-3">
                    {["Total RFPs","Pending","Completed","Avg Confidence"].map((s, i) => (
                      <div key={s} className="rounded-lg border bg-card p-3">
                        <p className="text-[10px] uppercase tracking-wider text-muted-foreground">{s}</p>
                        <p className="mt-1 text-lg font-semibold">{[24,7,12,"86%"][i]}</p>
                      </div>
                    ))}
                  </div>
                  <div className="rounded-lg border bg-card p-4">
                    <div className="mb-3 flex items-end justify-between">
                      <div className="text-xs font-medium">Weekly activity</div>
                      <div className="text-[10px] text-muted-foreground">Answers · Uploads</div>
                    </div>
                    <div className="flex h-20 items-end gap-2">
                      {[40,62,55,80,92,30,18].map((v) => (
                        <div key={v} className="flex-1 rounded-t bg-gradient-to-t from-primary to-accent" style={{ height: `${v}%` }} />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-12 flex flex-wrap items-center justify-center gap-x-10 gap-y-4 opacity-60">
            {logos.map((l) => (
              <span key={l} className="text-xs font-semibold tracking-[0.2em] text-muted-foreground">{l}</span>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="container py-24">
        <div className="mx-auto max-w-2xl text-center">
          <Badge variant="outline">Platform</Badge>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight md:text-4xl">Everything your proposal team needs.</h2>
          <p className="mt-3 text-muted-foreground">From ingestion to export — one workspace, one source of truth, one polished response.</p>
        </div>
        <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <div key={f.title} className="group rounded-2xl border bg-card p-6 shadow-soft transition-all hover:-translate-y-0.5 hover:shadow-elevated">
              <div className="grid h-10 w-10 place-items-center rounded-lg bg-primary/10 text-primary">
                <f.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-4 text-base font-semibold">{f.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{f.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="container pb-24">
        <div className="relative overflow-hidden rounded-3xl bg-secondary p-12 text-secondary-foreground shadow-elevated md:p-16">
          <div className="absolute inset-0 grid-pattern opacity-10" />
          <div className="relative max-w-2xl">
            <h3 className="text-3xl font-semibold tracking-tight md:text-4xl">Ready to win more deals?</h3>
            <p className="mt-3 text-base text-secondary-foreground/80">Get started in minutes. No credit card required. Cancel anytime.</p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button asChild size="lg" variant="glass" className="text-secondary"><Link href="/register">Start free trial</Link></Button>
              <Button asChild size="lg" variant="ghost" className="text-secondary-foreground hover:bg-white/10"><Link href="/login">Sign in <ArrowRight className="h-4 w-4" /></Link></Button>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t py-10 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} TenderDox · Built for enterprise proposal teams.
      </footer>
    </div>
  );
}
