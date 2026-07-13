import { NextResponse } from "next/server";
import { getProducts } from "@/lib/services/catalog-service";

export async function GET() {
  return NextResponse.json(await getProducts());
}
