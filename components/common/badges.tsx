import { Badge } from "@/components/ui/badge";
import type { RFPStatus, Priority, QuestionStatus } from "@/types";

const statusMap: Record<RFPStatus, { label: string; variant: React.ComponentProps<typeof Badge>["variant"]; dot: string }> = {
  draft: { label: "Draft", variant: "secondary", dot: "bg-slate-400" },
  processing: { label: "Processing", variant: "accent", dot: "bg-accent" },
  in_review: { label: "In review", variant: "warning", dot: "bg-warning" },
  completed: { label: "Completed", variant: "success", dot: "bg-success" },
  archived: { label: "Archived", variant: "outline", dot: "bg-slate-300" },
};

export function StatusBadge({ status }: { status: RFPStatus }) {
  const s = statusMap[status];
  return <Badge variant={s.variant}><span className={`h-1.5 w-1.5 rounded-full ${s.dot}`} />{s.label}</Badge>;
}

const priMap: Record<Priority, { label: string; variant: React.ComponentProps<typeof Badge>["variant"] }> = {
  low: { label: "Low", variant: "secondary" },
  medium: { label: "Medium", variant: "outline" },
  high: { label: "High", variant: "warning" },
  urgent: { label: "Urgent", variant: "danger" },
};
export function PriorityBadge({ priority }: { priority: Priority }) {
  const p = priMap[priority];
  return <Badge variant={p.variant}>{p.label}</Badge>;
}

const qMap: Record<QuestionStatus, { label: string; variant: React.ComponentProps<typeof Badge>["variant"] }> = {
  pending: { label: "Pending", variant: "secondary" },
  answered: { label: "Answered", variant: "default" },
  approved: { label: "Approved", variant: "success" },
  rejected: { label: "Rejected", variant: "danger" },
  needs_review: { label: "Needs review", variant: "warning" },
};
export function QuestionStatusBadge({ status }: { status: QuestionStatus }) {
  const s = qMap[status];
  return <Badge variant={s.variant}>{s.label}</Badge>;
}

export function ConfidenceBadge({ value }: { value: number }) {
  const variant = value >= 85 ? "success" : value >= 70 ? "warning" : "danger";
  return <Badge variant={variant}>{value}%</Badge>;
}
