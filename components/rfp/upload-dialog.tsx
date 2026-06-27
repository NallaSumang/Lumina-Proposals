"use client";
import { useState } from "react";
import { Upload } from "lucide-react";
import { useDropzone } from "react-dropzone";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";

export function UploadDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) {
  const [progress, setProgress] = useState(0);
  const [file, setFile] = useState<File | null>(null);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { "application/pdf": [".pdf"], "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"], "application/vnd.ms-excel": [".xls", ".xlsx"], "text/csv": [".csv"] },
    multiple: false,
    onDrop: (files) => {
      const f = files[0];
      if (!f) return;
      setFile(f);
      setProgress(0);
      const tick = () => setProgress((p) => {
        const next = Math.min(100, p + Math.random() * 18);
        if (next < 100) setTimeout(tick, 220);
        else { toast.success("RFP uploaded and queued for processing"); setTimeout(() => onOpenChange(false), 600); }
        return next;
      });
      setTimeout(tick, 200);
    },
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Upload an RFP</DialogTitle>
          <DialogDescription>Drop a PDF, DOCX, XLSX or CSV. We&apos;ll extract questions and match them to your knowledge base.</DialogDescription>
        </DialogHeader>
        <div
          {...getRootProps()}
          className={`flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-10 text-center transition ${isDragActive ? "border-primary bg-primary/5" : "border-border bg-muted/30"}`}
        >
          <input {...getInputProps()} />
          <div className="grid h-12 w-12 place-items-center rounded-2xl bg-primary/10 text-primary"><Upload className="h-5 w-5" /></div>
          <p className="mt-3 text-sm font-medium">{isDragActive ? "Drop the file here…" : "Drag & drop, or click to browse"}</p>
          <p className="mt-1 text-xs text-muted-foreground">PDF · DOCX · XLSX · CSV · up to 50MB</p>
        </div>
        {file && (
          <div className="space-y-2 rounded-lg border bg-muted/30 p-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-medium">{file.name}</span>
              <span className="tabular-nums text-muted-foreground">{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} />
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
