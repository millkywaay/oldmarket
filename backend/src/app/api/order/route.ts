/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma'; 
import { OrderStatus, PaymentStatus } from '@prisma/client';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { userId, cartItems, subtotal, shippingFee, addressId, notes } = body;

    const order = await prisma.$transaction(async (tx) => {
      for (const item of cartItems) {
        const product = await tx.product.update({
          where: { id: item.product_id },
          data: { stock_quantity: { decrement: item.qty } }
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
          grand_total: subtotal + shippingFee,
          address_id: addressId,
          status: OrderStatus.PENDING_PAYMENT,
          payment_status: PaymentStatus.UNPAID,
          notes: notes,
          recipient_name: "",
          street: "",     
          city: "",           
          province: "",       
          postal_code: "",   
          items: {
            create: cartItems.map((item: any) => ({
              product_id: item.product_id,
              name_snapshot: item.product.name,
              unit_price: item.product.price,
              qty: item.qty,
              line_total: item.product.price * item.qty,
              size_snapshot: item.size || 'M'
            }))
          }
        }
      });

      await tx.cartItem.deleteMany({
        where: { 
          user_id: userId, 
          product_id: { in: cartItems.map((i: any) => i.product_id) } 
        }
      });

      return newOrder;
    });

    return NextResponse.json(order);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}