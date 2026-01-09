/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, PATCH, OPTIONS",
      "Access-Control-Allow-Headers": "Authorization, Content-Type",
    },
  });
}

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const orderId = Number(id);

    if (isNaN(orderId)) {
      return NextResponse.json(
        { error: "Order ID tidak valid" },
        { status: 400 }
      );
    }

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        items: true,
      },
    });

    if (!order) {
      return NextResponse.json(
        { error: "Pesanan tidak ditemukan" },
        { status: 404 }
      );
    }
    const productIds: number[] = order.items
      .map((i) => i.product_id)
      .filter((id): id is number => typeof id === "number");
    const products =
      productIds.length > 0
        ? await prisma.product.findMany({
            where: {
              id: { in: productIds },
            },
            select: {
              id: true,
              image_url: true,
            },
          })
        : [];

    const productImageMap = new Map<number, string | null>(
      products.map((p) => [p.id, p.image_url])
    );

    const responseData = {
      id: order.id,
      created_at: order.created_at,
      total_amount: Number(order.grand_total),

      shipping_address: `${order.street}, ${order.city}, ${order.province} ${order.postal_code}`,

      payment_method: order.payment_link
        ? "Pembayaran Online"
        : "Manual Transfer",

      order_status: order.status,

      items: order.items.map((item) => ({
        id: item.id,
        quantity: item.qty,
        price_at_purchase: Number(item.unit_price),
        product: {
          name: item.name_snapshot,
          image_url:
            typeof item.product_id === "number"
              ? productImageMap.get(item.product_id) || ""
              : "",
        },
      })),
    };

    return NextResponse.json(responseData, { status: 200 });
  } catch (error: any) {
    console.error("GET_ORDER_ERROR:", error);
    return NextResponse.json(
      { error: "Gagal mengambil detail pesanan" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const orderId = Number(id);
    const order = await prisma.order.findUnique({
      where: { id: orderId },
    });

    if (!order) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    if (order.status !== "SHIPPED") {
      return NextResponse.json(
        { error: "Pesanan belum dikirim" },
        { status: 400 }
      );
    }
    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: { status: "COMPLETED" },
    });
    return NextResponse.json(
      {
        message: "Pesanan berhasil dikonfirmasi",
        order: updatedOrder,
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("ERROR:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}


