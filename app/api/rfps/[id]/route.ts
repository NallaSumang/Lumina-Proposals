import { NextResponse } from "next/server";
import { rfps, questionsByRfp } from "@/lib/mock";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const id = (await params).id;
  const rfp = rfps.find((r) => r.id === id);
  
  if (!rfp) {
    return NextResponse.json({ error: "RFP not found" }, { status: 404 });
  }

  const questions = questionsByRfp[id] ?? [];
  return NextResponse.json({ rfp, questions });
}
