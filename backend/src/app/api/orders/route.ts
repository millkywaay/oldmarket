/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { OrderStatus, PaymentStatus } from "@prisma/client";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const {
      userId,
      cartItems,
      subtotal,
      shippingFee,
      addressId,
      notes,
      courierName,
      courierService,
      orderType = "CART",
    } = body;

    if (!userId || !cartItems?.length || !addressId) {
      return NextResponse.json(
        { error: "Data pesanan tidak lengkap" },
        { status: 400 }
      );
    }
    const address = await prisma.address.findUnique({
      where: { id: Number(addressId) },
    });
    if (!address) {
      return NextResponse.json(
        { error: "Alamat tidak ditemukan" },
        { status: 404 }
      );
    }
    const productIds = cartItems.map((i: any) => Number(i.product_id));
    const products = await prisma.product.findMany({
      where: { id: { in: productIds } },
    });
    for (const item of cartItems) {
      const product = products.find(p => p.id === Number(item.product_id));
      if (!product) throw new Error("Produk tidak ditemukan");
      if (product.stock_quantity < item.qty) {
        throw new Error(`Stok ${product.name} tidak mencukupi`);
      }
    }

    const orderItems = products.map(p => {
      const qty = cartItems.find((i:any) => Number(i.product_id) === p.id)?.qty ?? 1;
      return {
        product_id: p.id,
        name_snapshot: p.name,
        size_snapshot: p.size,
        unit_price: p.price,
        qty,
        line_total: Number(p.price) * qty,
      };
    });

    const result = await prisma.$transaction([
      ...cartItems.map((item:any) =>
        prisma.product.update({
          where: { id: Number(item.product_id) },
          data: { stock_quantity: { decrement: item.qty } },
        })
      ),
      prisma.order.create({
        data: {
          user_id: Number(userId),
          status: OrderStatus.PENDING_PAYMENT,
          payment_status: PaymentStatus.UNPAID,

          subtotal_amount: subtotal,
          shipping_amount: shippingFee,
          grand_total: Number(subtotal) + Number(shippingFee),
          recipient_name: address.recipient_name,
          phone: address.phone,
          street: address.street,
          city: address.city,
          province: address.province,
          postal_code: address.postal_code,

          courier_name: courierName,
          courier_service: courierService,
          notes: notes || "",

          items: {
            create: orderItems,
          },
        },
      }),
      ...(orderType === "CART"
        ? [
            prisma.cartItem.deleteMany({
              where: {
                user_id: Number(userId),
                product_id: { in: productIds },
              },
            }),
          ]
        : []),
    ]);

    return NextResponse.json({
      success: true,
      data: result[result.length - 1],
    });

  } catch (err: any) {
    console.error("ORDER ERROR:", err);
    return NextResponse.json(
      { error: err.message || "Gagal membuat order" },
      { status: 500 }
    );
  }
}

