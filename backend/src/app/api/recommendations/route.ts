import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";

const ML_URL = process.env.ML_RECOMMENDER_URL!;

export async function GET(req: Request) {
  try {
    const user = await verifyToken(req);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const orders = await prisma.order.findMany({
      where: { user_id: user.id },
      include: { items: true },
    });
    if (orders.length === 0) {
      const products = await prisma.product.findMany({
        orderBy: { stock_quantity: "desc" },
        take: 8,
      });
      return NextResponse.json({ products });
    }
    const orderItems = orders.flatMap(order =>
      order.items.map(item => ({
        user_id: user.id,
        product_id: item.product_id,
        quantity: item.qty,
      }))
    );
    const mlRes = await fetch(`${ML_URL}/recommend`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_id: user.id,
        order_items: orderItems,
      }),
    });

    const { recommended_product_ids } = await mlRes.json();
    if (!recommended_product_ids.length) {
      const products = await prisma.product.findMany({
        orderBy: { stock_quantity: "desc" },
        take: 8,
      });
      return NextResponse.json({ products });
    }
    const products = await prisma.product.findMany({
      where: {
        id: { in: recommended_product_ids },
      },
    });

    return NextResponse.json({ products });
  } catch (err) {
    console.error("RECOMMENDATION_ERROR:", err);
    return NextResponse.json(
      { error: "Failed to get recommendations" },
      { status: 500 }
    );
  }
}
