import { prisma } from "@/lib/prismas";
import { NextResponse } from "next/server";
import { serializeData } from "@/lib/serialize";

export async function GET() {
  try {
    const brands = await prisma.brand.findMany({
      orderBy: { name: "asc" },
    });
    return NextResponse.json({ 
      brands: serializeData(brands) 
    });
  } catch (error) {
    console.error("Error fetching brands:", error);
    return NextResponse.json(
      { error: "Gagal mengambil data brand" }, 
      { status: 500 }
    );
  }
}