/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";
import { OrderStatus, PaymentStatus } from "@prisma/client";

export async function GET() {
  return NextResponse.json({ status: "OK" });
}

export async function HEAD() {
  return new NextResponse(null, { status: 200 });
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 200 });
}

export async function POST(req: Request) {
  let body: any;

  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ status: "OK" });
  }

  const { order_id } = body;

  if (!order_id || !order_id.startsWith("ORDER-")) {
    console.log("MIDTRANS TEST NOTIFICATION:", order_id);
    return NextResponse.json({ status: "OK" });
  }

  const { status_code, gross_amount, signature_key, transaction_status } = body;

  const serverKey = process.env.MIDTRANS_SERVER_KEY!;
  const expectedSignature = crypto
    .createHash("sha512")
    .update(order_id + status_code + gross_amount + serverKey)
    .digest("hex");

  if (signature_key !== expectedSignature) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 403 });
  }

  const orderId = Number(order_id.split("-")[1]);

  if (!orderId || Number.isNaN(orderId)) {
    console.error("Invalid ORDER ID:", order_id);
    return NextResponse.json({ status: "OK" });
  }

  let payment_status: PaymentStatus = PaymentStatus.UNPAID;
  let order_status: OrderStatus = OrderStatus.PENDING_PAYMENT;

  if (["capture", "settlement"].includes(transaction_status)) {
    payment_status = PaymentStatus.PAID;
    order_status = OrderStatus.PROCESSING;
  }

  if (["cancel", "expire", "deny"].includes(transaction_status)) {
    payment_status = PaymentStatus.UNPAID;
    order_status = OrderStatus.CANCELED;
  }

  await prisma.order.update({
    where: { id: orderId },
    data: {
      payment_status,
      status: order_status,
      external_id: order_id,
    },
  });

  return NextResponse.json({ received: true });
}
