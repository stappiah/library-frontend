import { NextResponse } from "next/server";
import { getVendors } from "@/lib/services/catalog-service";

export async function GET() {
  return NextResponse.json(await getVendors());
}
