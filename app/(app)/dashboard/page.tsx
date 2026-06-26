"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { FileText, BookOpen, CheckCircle2, Sparkles, TrendingUp, Clock, Upload, Search, Plus, ArrowUpRight } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

import { Progress } from "@/components/ui/progress";
import { PageHeader } from "@/components/common/page-header";
import { StatusBadge } from "@/components/common/badges";
import { ActivityChart, ConfidenceChart, StatusPie } from "@/components/charts/charts";
import { stats, rfps, activity, weeklyActivity, confidenceDistribution } from "@/lib/mock";
import { formatRelative, initials } from "@/lib/utils";

const statusBreakdown = [
  { name: "Completed", value: rfps.filter((r) => r.status === "completed").length },
  { name: "In review", value: rfps.filter((r) => r.status === "in_review").length },
  { name: "Processing", value: rfps.filter((r) => r.status === "processing").length },
  { name: "Draft", value: rfps.filter((r) => r.status === "draft").length },
  { name: "Archived", value: rfps.filter((r) => r.status === "archived").length },
];

const statCards = [
  { label: "Total RFPs", value: stats.totalRfps, delta: "+12%", icon: FileText, tone: "bg-primary/10 text-primary" },
  { label: "Pending", value: stats.pending, delta: "+3", icon: Clock, tone: "bg-warning/10 text-warning" },
  { label: "Completed", value: stats.completed, delta: "+8", icon: CheckCircle2, tone: "bg-success/10 text-success" },
  { label: "Knowledge docs", value: stats.knowledgeDocs, delta: "+4", icon: BookOpen, tone: "bg-accent/15 text-accent" },
  { label: "Avg confidence", value: `${stats.avgConfidence}%`, delta: "+2.1%", icon: Sparkles, tone: "bg-primary/10 text-primary" },
  { label: "Hours saved", value: stats.hoursSaved.toLocaleString(), delta: "+182", icon: TrendingUp, tone: "bg-success/10 text-success" },
];

const quickActions = [
  { href: "/rfps", label: "Upload RFP", icon: Upload },
  { href: "/knowledge-base", label: "Upload Knowledge", icon: BookOpen },
  { href: "/search", label: "Search Documents", icon: Search },
  { href: "/rfps", label: "Create Workspace", icon: Plus },
];

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Good morning, Alex 👋"
        description="Here's what's happening across your proposal workspace today."
        actions={
          <>
            <Button variant="outline"><Upload className="h-4 w-4" /> Upload RFP</Button>
            <Button><Plus className="h-4 w-4" /> New workspace</Button>
          </>
        }
      />

      {/* Stat grid */}
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

      {/* Charts row */}
      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <div><CardTitle>Weekly activity</CardTitle><CardDescription>Answers generated and documents uploaded</CardDescription></div>
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-primary" /> Answers</span>
              <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-accent" /> Uploads</span>
            </div>
          </CardHeader>
          <CardContent><ActivityChart data={weeklyActivity} /></CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Status breakdown</CardTitle><CardDescription>Across all RFPs</CardDescription></CardHeader>
          <CardContent><StatusPie data={statusBreakdown} /></CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader><CardTitle>Confidence distribution</CardTitle><CardDescription>Question-level confidence across active RFPs</CardDescription></CardHeader>
          <CardContent><ConfidenceChart data={confidenceDistribution} /></CardContent>
        </Card>
        {/* Quick actions */}
        <Card>
          <CardHeader><CardTitle>Quick actions</CardTitle><CardDescription>Jump back in</CardDescription></CardHeader>
          <CardContent className="space-y-2">
            {quickActions.map((q) => (
              <Link key={q.label} href={q.href} className="flex items-center gap-3 rounded-lg border bg-card p-3 text-sm transition hover:bg-muted hover:shadow-soft">
                <div className="grid h-8 w-8 place-items-center rounded-md bg-primary/10 text-primary"><q.icon className="h-4 w-4" /></div>
                <span className="flex-1 font-medium">{q.label}</span>
                <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
              </Link>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Active RFPs + Activity */}
      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <div><CardTitle>Active RFPs</CardTitle><CardDescription>Workspaces in flight</CardDescription></div>
            <Button asChild variant="ghost" size="sm"><Link href="/rfps">View all <ArrowUpRight className="h-3.5 w-3.5" /></Link></Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {rfps.slice(0, 5).map((r) => {
              const pct = Math.round((r.answered / r.questions) * 100);
              return (
                <Link key={r.id} href={`/rfps/${r.id}`} className="block rounded-xl border bg-card p-4 transition hover:shadow-soft">
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold">{r.title}</p>
                      <p className="text-xs text-muted-foreground">{r.client} · Owner {r.owner.name}</p>
                    </div>
                    <StatusBadge status={r.status} />
                  </div>
                  <div className="mt-4 flex items-center gap-4">
                    <div className="flex-1"><Progress value={pct} /></div>
                    <p className="w-20 text-right text-xs tabular-nums text-muted-foreground">{r.answered}/{r.questions} · {pct}%</p>
                  </div>
                </Link>
              );
            })}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Recent activity</CardTitle><CardDescription>Last 24 hours</CardDescription></CardHeader>
          <CardContent>
            <ol className="space-y-4">
              {activity.map((a, idx) => (
                <li key={a.id} className="relative flex gap-3">
                  <div className="flex flex-col items-center">
                    <Avatar className="h-8 w-8"><AvatarFallback>{initials(a.actor.name)}</AvatarFallback></Avatar>
                    {idx < activity.length - 1 && <div className="mt-1 w-px flex-1 bg-border" />}
                  </div>
                  <div className="-mt-0.5 flex-1 pb-1">
                    <p className="text-sm leading-snug">
                      <span className="font-medium">{a.actor.name}</span>{" "}
                      <span className="text-muted-foreground">
                        {a.type === "upload" && "uploaded"}
                        {a.type === "answer" && "answered"}
                        {a.type === "approve" && "approved"}
                        {a.type === "create" && "created"}
                        {a.type === "comment" && "commented on"}
                        {a.type === "export" && "exported"}
                      </span>{" "}
                      <span className="font-medium">{a.target}</span>
                    </p>
                    <p className="mt-0.5 text-xs text-muted-foreground">{formatRelative(a.timestamp)}</p>
                  </div>
                </li>
              ))}
            </ol>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
