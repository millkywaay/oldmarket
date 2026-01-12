/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const corsHeaders = {
  "Access-Control-Allow-Origin": "http://localhost:5173",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: corsHeaders });
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");
    const date = searchParams.get("date");

    const where: any = {};
    if (status && status !== "") where.status = status;
    
    if (date && date !== "") {
      const start = new Date(date);
      start.setHours(0, 0, 0, 0);
      const end = new Date(date);
      end.setHours(23, 59, 59, 999);
      where.created_at = { gte: start, lte: end };
    }

    const orders = await prisma.order.findMany({
      where,
      include: { user: { select: { name: true, email: true } } },
      orderBy: { created_at: 'desc' },
    });

    const formatted = orders.map(order => ({
      id: order.id.toString(),
      user_id: order.user_id.toString(),
      user: order.user,
      created_at: order.created_at.toISOString(),
      total_amount: Number(order.grand_total),
      order_status: order.status,
      payment_status: order.payment_status,
      tracking_number: order.tracking_number
    }));

    return NextResponse.json({ success: true, items: formatted }, { 
      status: 200, 
      headers: {
        "Access-Control-Allow-Origin": "http://localhost:5173",
        "Access-Control-Allow-Methods": "GET, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
      } 
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}