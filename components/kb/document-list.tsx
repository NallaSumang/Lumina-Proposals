"use client";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";
import type { KnowledgeDoc } from "@/types";
import { typeIcon } from "./document-grid";

export function DocumentList({ data }: { data: KnowledgeDoc[] }) {
  return (
    <Card>
      <CardContent className="p-0">
        <table className="w-full text-sm">
          <thead className="bg-muted/40">
            <tr>{["Document", "Type", "Tags", "Version", "Size", "Uploaded", "Status"].map((h) => (
              <th key={h} className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{h}</th>
            ))}</tr>
          </thead>
          <tbody>
            {data.map((d) => {
              const Icon = typeIcon[d.type];
              return (
                <tr key={d.id} className="border-t hover:bg-muted/40">
                  <td className="px-4 py-3"><div className="flex items-center gap-3">
                    <div className="grid h-8 w-8 place-items-center rounded-md bg-primary/10 text-primary"><Icon className="h-4 w-4" /></div>
                    <span className="font-medium">{d.title}</span>
                  </div></td>
                  <td className="px-4 py-3 capitalize text-muted-foreground">{d.type.replace("_", " ")}</td>
                  <td className="px-4 py-3"><div className="flex flex-wrap gap-1">{d.tags.map((t) => <Badge key={t} variant="secondary" className="text-[10px]">{t}</Badge>)}</div></td>
                  <td className="px-4 py-3 text-xs text-muted-foreground">{d.version}</td>
                  <td className="px-4 py-3 text-xs text-muted-foreground">{d.size}</td>
                  <td className="px-4 py-3 text-xs text-muted-foreground">{formatDate(d.uploadedAt)}</td>
                  <td className="px-4 py-3"><Badge variant={d.status === "indexed" ? "success" : d.status === "processing" ? "accent" : "danger"}>{d.status}</Badge></td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </CardContent>
    </Card>
  );
}
