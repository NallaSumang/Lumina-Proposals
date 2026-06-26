"use client";
import { useDropzone } from "react-dropzone";
import { Upload, FileText } from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/common/page-header";
import { knowledgeDocs } from "@/lib/mock";
import { formatDate } from "@/lib/utils";

export default function DocumentsPage() {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    multiple: true,
    onDrop: (files) => toast.success(`${files.length} file(s) queued`),
  });
  return (
    <div className="space-y-6">
      <PageHeader title="Documents" description="Manage uploads, files and source material across your workspace." actions={<Button><Upload className="h-4 w-4" /> Upload</Button>} />
      <Card>
        <CardContent {...getRootProps()} className={`flex flex-col items-center justify-center gap-2 py-14 text-center transition ${isDragActive ? "bg-primary/5" : ""}`}>
          <input {...getInputProps()} />
          <div className="grid h-12 w-12 place-items-center rounded-2xl bg-primary/10 text-primary"><Upload className="h-6 w-6" /></div>
          <p className="text-sm font-medium">{isDragActive ? "Drop files…" : "Drag files anywhere or click to browse"}</p>
          <p className="text-xs text-muted-foreground">PDF · DOCX · XLSX · CSV — up to 50MB each</p>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-0">
          <table className="w-full text-sm">
            <thead className="bg-muted/40">
              <tr>{["File", "Type", "Size", "Uploaded", "Status"].map((h) => (
                <th key={h} className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{h}</th>
              ))}</tr>
            </thead>
            <tbody>
              {knowledgeDocs.map((d) => (
                <tr key={d.id} className="border-t hover:bg-muted/40">
                  <td className="px-4 py-3"><div className="flex items-center gap-3"><FileText className="h-4 w-4 text-muted-foreground" /> <span className="font-medium">{d.title}.pdf</span></div></td>
                  <td className="px-4 py-3 capitalize text-muted-foreground">{d.type.replace("_", " ")}</td>
                  <td className="px-4 py-3 text-xs text-muted-foreground">{d.size}</td>
                  <td className="px-4 py-3 text-xs text-muted-foreground">{formatDate(d.uploadedAt)}</td>
                  <td className="px-4 py-3"><Badge variant={d.status === "indexed" ? "success" : "accent"}>{d.status}</Badge></td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
