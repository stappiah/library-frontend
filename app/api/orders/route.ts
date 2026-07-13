import { NextResponse } from "next/server";
import { getOrders } from "@/lib/services/catalog-service";

export async function GET() {
  return NextResponse.json(await getOrders());
}
