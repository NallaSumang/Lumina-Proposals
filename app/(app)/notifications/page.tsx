"use client";
import { CheckCircle2, Info, AlertTriangle, XCircle, Filter } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/common/page-header";
import { notifications } from "@/lib/mock";
import { formatRelative } from "@/lib/utils";

const iconMap = {
  success: { Icon: CheckCircle2, tone: "bg-success/10 text-success" },
  info: { Icon: Info, tone: "bg-primary/10 text-primary" },
  warning: { Icon: AlertTriangle, tone: "bg-warning/15 text-warning" },
  error: { Icon: XCircle, tone: "bg-destructive/10 text-destructive" },
};

export default function NotificationsPage() {
  return (
    <div className="space-y-6">
      <PageHeader title="Notifications" description="Activity, alerts and review requests across your workspace."
        actions={<><Button variant="outline"><Filter className="h-4 w-4" /> Filter</Button><Button variant="ghost">Mark all read</Button></>} />
      <Card>
        <CardContent className="p-0">
          <ul className="divide-y">
            {notifications.map((n) => {
              const { Icon, tone } = iconMap[n.type];
              return (
                <li key={n.id} className={`flex items-start gap-4 p-5 transition hover:bg-muted/30 ${!n.read ? "bg-primary/[0.025]" : ""}`}>
                  <div className={`grid h-9 w-9 shrink-0 place-items-center rounded-lg ${tone}`}><Icon className="h-4 w-4" /></div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold">{n.title}</p>
                      {!n.read && <Badge variant="default">New</Badge>}
                    </div>
                    <p className="mt-0.5 text-sm text-muted-foreground">{n.message}</p>
                    <p className="mt-1 text-xs text-muted-foreground">{formatRelative(n.timestamp)}</p>
                  </div>
                </li>
              );
            })}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
