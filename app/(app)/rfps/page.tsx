"use client";
import { useMemo, useState } from "react";
import Link from "next/link";
import { useReactTable, getCoreRowModel, getSortedRowModel, getPaginationRowModel, getFilteredRowModel, flexRender, type ColumnDef, type SortingState } from "@tanstack/react-table";
import { ArrowUpDown, ChevronLeft, ChevronRight, MoreHorizontal, Plus, Search, Upload, Filter } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useDropzone } from "react-dropzone";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { PageHeader } from "@/components/common/page-header";
import { StatusBadge, PriorityBadge, ConfidenceBadge } from "@/components/common/badges";
import { rfps } from "@/lib/mock";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import type { RFP } from "@/types";
import { formatDate, initials } from "@/lib/utils";

export default function RFPsPage() {
  const [filter, setFilter] = useState("");
  const [sorting, setSorting] = useState<SortingState>([]);
  const [open, setOpen] = useState(false);

  const columns = useMemo<ColumnDef<RFP>[]>(() => [
    {
      accessorKey: "title",
      header: ({ column }) => (
        <button className="flex items-center gap-1" onClick={() => column.toggleSorting()}>RFP <ArrowUpDown className="h-3 w-3" /></button>
      ),
      cell: ({ row }) => (
        <Link href={`/rfps/${row.original.id}`} className="block min-w-0">
          <p className="truncate text-sm font-medium text-foreground hover:text-primary">{row.original.title}</p>
          <p className="text-xs text-muted-foreground">{row.original.client} · #{row.original.id.replace("rfp_", "")}</p>
        </Link>
      ),
    },
    { accessorKey: "status", header: "Status", cell: ({ row }) => <StatusBadge status={row.original.status} /> },
    { accessorKey: "priority", header: "Priority", cell: ({ row }) => <PriorityBadge priority={row.original.priority} /> },
    {
      id: "progress", header: "Progress",
      cell: ({ row }) => {
        const pct = Math.round((row.original.answered / row.original.questions) * 100);
        return (
          <div className="flex items-center gap-2 min-w-[140px]">
            <Progress value={pct} className="h-1.5" />
            <span className="w-12 text-right text-[11px] tabular-nums text-muted-foreground">{pct}%</span>
          </div>
        );
      },
    },
    { accessorKey: "confidence", header: "Confidence", cell: ({ row }) => <ConfidenceBadge value={row.original.confidence} /> },
    {
      accessorKey: "owner", header: "Owner",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Avatar className="h-6 w-6"><AvatarFallback className="text-[10px]">{initials(row.original.owner.name)}</AvatarFallback></Avatar>
          <span className="text-xs">{row.original.owner.name.split(" ")[0]}</span>
        </div>
      ),
    },
    {
      accessorKey: "dueDate", header: "Due",
      cell: ({ row }) => <span className="text-xs text-muted-foreground">{formatDate(row.original.dueDate)}</span>,
    },
    {
      id: "actions",
      cell: () => <Button variant="ghost" size="icon" className="h-7 w-7"><MoreHorizontal className="h-4 w-4" /></Button>,
    },
  ], []);

  const table = useReactTable({
    data: rfps,
    columns,
    state: { sorting, globalFilter: filter },
    onSortingChange: setSorting,
    onGlobalFilterChange: setFilter,
    globalFilterFn: "includesString",
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    initialState: { pagination: { pageSize: 10 } },
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="RFPs"
        description="Manage all your RFP, RFI and security questionnaire workspaces."
        actions={
          <>
            <Button variant="outline"><Filter className="h-4 w-4" /> Filter</Button>
            <Button onClick={() => setOpen(true)}><Upload className="h-4 w-4" /> Upload RFP</Button>
            <Button variant="secondary"><Plus className="h-4 w-4" /> New</Button>
          </>
        }
      />

      <Card>
        <CardContent className="p-0">
          {/* Toolbar */}
          <div className="flex flex-wrap items-center gap-3 border-b p-4">
            <div className="relative w-full md:w-80">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Search RFPs, clients, owners…" className="pl-9" value={filter} onChange={(e) => setFilter(e.target.value)} />
            </div>
            <div className="flex items-center gap-2">
              {["All", "Processing", "In review", "Completed"].map((s, i) => (
                <Badge key={s} variant={i === 0 ? "default" : "outline"} className="cursor-pointer">{s}</Badge>
              ))}
            </div>
            <p className="ml-auto text-xs text-muted-foreground">{table.getFilteredRowModel().rows.length} of {rfps.length} workspaces</p>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/40">
                {table.getHeaderGroups().map((hg) => (
                  <tr key={hg.id}>
                    {hg.headers.map((h) => (
                      <th key={h.id} className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                        {h.isPlaceholder ? null : flexRender(h.column.columnDef.header, h.getContext())}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody>
                <AnimatePresence>
                  {table.getRowModel().rows.map((row) => (
                    <motion.tr
                      key={row.id}
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                      className="border-t transition-colors hover:bg-muted/40"
                    >
                      {row.getVisibleCells().map((cell) => (
                        <td key={cell.id} className="px-4 py-3 align-middle">
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </td>
                      ))}
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between border-t p-4">
            <p className="text-xs text-muted-foreground">
              Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
            </p>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}><ChevronLeft className="h-3.5 w-3.5" /> Prev</Button>
              <Button variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>Next <ChevronRight className="h-3.5 w-3.5" /></Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <UploadDialog open={open} onOpenChange={setOpen} />
    </div>
  );
}

function UploadDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) {
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
