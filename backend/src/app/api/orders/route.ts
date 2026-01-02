/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { OrderStatus, PaymentStatus } from "@prisma/client";

export async function OPTIONS() {
  return NextResponse.json(
    {},
    {
      headers: {
        "Access-Control-Allow-Origin": "http://localhost:5173",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
      },
    }
  );
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => null);
    if (!body) {
      return NextResponse.json(
        { error: "Data body tidak ditemukan" },
        { status: 400 }
      );
    }

    const {
      userId,
      cartItems,
      subtotal,
      shippingFee,
      addressId,
      notes,
      courierName,
      courierService,
    } = body;
    if (!userId || !cartItems || cartItems.length === 0 || !addressId) {
      return NextResponse.json(
        { error: "Informasi pesanan tidak lengkap." },
        { status: 400 }
      );
    }
    const result = await prisma.$transaction(async (tx) => {
      const address = await tx.address.findUnique({
        where: { id: addressId },
      });
      if (!address)
        throw new Error("Alamat pengiriman tidak ditemukan di database.");
      for (const item of cartItems) {
        const product = await tx.product.update({
          where: { id: item.product_id },
          data: { stock_quantity: { decrement: item.qty } },
        });
        if (product.stock_quantity < 0) {
          throw new Error(`Stok untuk produk ${product.name} tidak mencukupi.`);
        }
      }

      const newOrder = await tx.order.create({
        data: {
          user_id: userId,
          subtotal_amount: subtotal,
          shipping_amount: shippingFee,
          grand_total: Number(subtotal) + Number(shippingFee),
          address_id: addressId,
          status: OrderStatus.PENDING_PAYMENT,
          payment_status: PaymentStatus.UNPAID,
          recipient_name: address.recipient_name,
          phone: address.phone,
          street: address.street,
          city: address.city,
          province: address.province,
          postal_code: address.postal_code,
          notes: notes || "",
          courier_name: courierName,
          courier_service: courierService,
          items: {
            create: cartItems.map((item: any) => ({
              product_id: item.product_id,
              name_snapshot: item.product.name,
              unit_price: item.product.price,
              qty: item.qty,
              line_total: Number(item.product.price) * item.qty,
              size_snapshot: item.product.size,
            })),
          },
        },
      });
      await tx.cartItem.deleteMany({
        where: {
          user_id: userId,
          product_id: { in: cartItems.map((i: any) => i.product_id) },
        },
      });

      return newOrder;
    });
    return NextResponse.json(
      { success: true, message: "Order berhasil dibuat", data: result },
      {
        status: 201,
        headers: {
          "Access-Control-Allow-Origin": "http://localhost:5173",
          "Access-Control-Allow-Methods": "POST, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type",
        },
      }
    );
  } catch (error: any) {
    console.error("TRANSACTION_ERROR:", error.message);
    return NextResponse.json(
      { error: error.message || "Terjadi kesalahan internal server" },
      {
        status: 500,
        headers: {
          "Access-Control-Allow-Origin": "http://localhost:5173",
        },
      }
    );
  }
}
