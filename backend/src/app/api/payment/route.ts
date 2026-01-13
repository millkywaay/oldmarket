/* eslint-disable @typescript-eslint/no-require-imports */
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";

const midtransClient = require('midtrans-client');
const snap = new midtransClient.Snap({
  isProduction: false,
  serverKey: process.env.MIDTRANS_SERVER_KEY,
  clientKey: process.env.MIDTRANS_CLIENT_KEY
});

export async function POST(req: Request) {
  try {
    const decoded = verifyToken(req);
    if (!decoded) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { orderId } = await req.json();

    const order = await prisma.order.findUnique({
      where: { id: Number(orderId) },
      include: { user: true }
    });

    if (!order) return NextResponse.json({ error: "Order not found" }, { status: 404 });

    const parameter = {
      transaction_details: {
        order_id: `ORDER-${order.id}-${Date.now()}`, 
        gross_amount: Number(order.grand_total)
      },
      customer_details: {
        first_name: order.user.name,
        email: order.user.email,
        phone: order.phone
      },
      callbacks: {
        finish: `${process.env.URL_FRONTEND}/profile` 
      }
    };

    const transaction = await snap.createTransaction(parameter);
    await prisma.order.update({
      where: { id: order.id },
      data: { payment_link: transaction.token }
    });

    return NextResponse.json({ token: transaction.token });
  } catch (error) {
    console.error("MIDTRANS_ERROR:", error);
    return NextResponse.json({ error: "Gagal membuat transaksi" }, { status: 500 });
  }
}