"use client";
import { useState } from "react";
import { RfpTable } from "@/components/rfp/rfp-table";
import { UploadDialog } from "@/components/rfp/upload-dialog";
import { PageHeader } from "@/components/common/page-header";
import { Button } from "@/components/ui/button";
import { Filter, Upload, Plus } from "lucide-react";
import { useRFPs } from "@/hooks/use-queries";

export default function RFPsPage() {
  const [open, setOpen] = useState(false);
  const { data: rfps = [] } = useRFPs();

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

      <RfpTable data={rfps} />

      <UploadDialog open={open} onOpenChange={setOpen} />
    </div>
  );
}

