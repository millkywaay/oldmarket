/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const corsHeaders = {
  "Access-Control-Allow-Origin": "https://oldmarketjkt.vercel.app",
  "Access-Control-Allow-Methods": "PATCH, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: corsHeaders });
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> } 
) {
  try {
    const { id } = await params;
    const orderId = Number(id);
    const body = await req.json();
    const { status, tracking_number } = body;

    if (status === "SHIPPED" && !tracking_number) {
      return NextResponse.json(
        { error: "Nomor resi wajib diisi untuk status SHIPPED" },
        { status: 400, headers: corsHeaders }
      );
    }

    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: {
        status: status,
        tracking_number: tracking_number || undefined,
        updated_at: new Date(),
      },
    });

    return NextResponse.json(
      { success: true, data: updatedOrder },
      { status: 200, headers: corsHeaders }
    );
  } catch (error: any) {
    console.error("PATCH_ERROR:", error);
    return NextResponse.json(
      { error: "Gagal update order: " + error.message },
      { status: 500, headers: corsHeaders }
    );
  }
}