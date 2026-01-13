import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth"; 

const allowedOrigin = process.env.URL_FRONTEND || "";
export async function GET(req: Request) {
  try {
    const decoded = verifyToken(req);

    if (!decoded || !decoded.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const orders = await prisma.order.findMany({
      where: { user_id: decoded.id },
      orderBy: { created_at: "desc" },
    });
    const formattedOrders = orders.map((order) => ({
      id: order.id,
      created_at: order.created_at,
      total_amount: Number(order.grand_total),
      order_status: order.status,
    }));

    const response = NextResponse.json(formattedOrders, { status: 200 });

    response.headers.set('Access-Control-Allow-Origin', allowedOrigin);
    response.headers.set('Access-Control-Allow-Methods', 'GET, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    return response;
  } catch (error) {
    console.error("GET_ORDERS_ERROR:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': allowedOrigin,
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}