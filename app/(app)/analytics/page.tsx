"use client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/common/page-header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ActivityChart, ConfidenceChart, MonthlyChart, StatusPie } from "@/components/charts/charts";
import { weeklyActivity, confidenceDistribution, monthlyRfps, users, rfps } from "@/lib/mock";
import { Download, Filter } from "lucide-react";
import { initials } from "@/lib/utils";

const statusBreakdown = [
  { name: "Completed", value: rfps.filter((r) => r.status === "completed").length },
  { name: "In review", value: rfps.filter((r) => r.status === "in_review").length },
  { name: "Processing", value: rfps.filter((r) => r.status === "processing").length },
  { name: "Draft", value: rfps.filter((r) => r.status === "draft").length },
];

const topContribs = users.slice(0, 5).map((u, i) => ({ ...u, answers: 142 - i * 23, approved: 124 - i * 21 }));

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Analytics"
        description="Throughput, confidence, time saved and contributor performance."
        actions={<><Button variant="outline"><Filter className="h-4 w-4" /> Last 30 days</Button><Button><Download className="h-4 w-4" /> Export</Button></>}
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "RFPs delivered", value: "47", delta: "+12%" },
          { label: "Hours saved", value: "1,284", delta: "+18%" },
          { label: "Avg confidence", value: "86%", delta: "+2.1%" },
          { label: "Win rate", value: "68%", delta: "+5%" },
        ].map((s) => (
          <Card key={s.label}>
            <CardContent className="p-5">
              <p className="text-[11px] uppercase tracking-wider text-muted-foreground">{s.label}</p>
              <div className="mt-1 flex items-end justify-between">
                <p className="text-2xl font-semibold tracking-tight">{s.value}</p>
                <Badge variant="success">{s.delta}</Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader><CardTitle>Monthly RFPs & hours saved</CardTitle><CardDescription>Trailing 12 months</CardDescription></CardHeader>
          <CardContent><MonthlyChart data={monthlyRfps} /></CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Confidence trend</CardTitle><CardDescription>Distribution across questions</CardDescription></CardHeader>
          <CardContent><ConfidenceChart data={confidenceDistribution} /></CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader><CardTitle>Weekly activity</CardTitle><CardDescription>Answers generated and documents uploaded</CardDescription></CardHeader>
          <CardContent><ActivityChart data={weeklyActivity} /></CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>RFP status mix</CardTitle><CardDescription>Across all workspaces</CardDescription></CardHeader>
          <CardContent><StatusPie data={statusBreakdown} /></CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader><CardTitle>Top contributors</CardTitle><CardDescription>By answers approved this quarter</CardDescription></CardHeader>
        <CardContent>
          <ul className="divide-y">
            {topContribs.map((u, i) => (
              <li key={u.id} className="flex items-center gap-4 py-3">
                <span className="w-5 text-sm font-semibold text-muted-foreground">{i + 1}</span>
                <Avatar className="h-9 w-9"><AvatarFallback>{initials(u.name)}</AvatarFallback></Avatar>
                <div className="flex-1">
                  <p className="text-sm font-medium">{u.name}</p>
                  <p className="text-xs text-muted-foreground">{u.title}</p>
                </div>
                <div className="text-right text-xs">
                  <p><span className="font-semibold text-foreground">{u.answers}</span> answers</p>
                  <p className="text-muted-foreground">{u.approved} approved</p>
                </div>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
