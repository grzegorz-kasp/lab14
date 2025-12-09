import { NextResponse } from "next/server";
import { getAllProductsAlphabetical, getAllProductsNewest } from "@/lib/products";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const sort = searchParams.get("sort");

  const products = sort === "newest" ? getAllProductsNewest() : getAllProductsAlphabetical();

  return NextResponse.json(products);
}
