import { NextResponse } from "next/server";
import { rfps } from "@/lib/mock";

export async function GET() {
  return NextResponse.json(rfps);
}
