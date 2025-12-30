/* eslint-disable @typescript-eslint/no-unused-vars */

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyToken } from '@/lib/auth';

export async function POST(req: Request) {
  try {
    const auth = await verifyToken (req);
    if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { product_id, quantity } = await req.json();

    const cartItem = await prisma.cartItem.upsert({
      where: {
        user_id_product_id: {
          user_id: auth.id,
          product_id: Number(product_id),
        },
      },
      update: { qty: { increment: Number(quantity) } },
      create: {
        user_id: auth.id,
        product_id: Number(product_id),
        qty: Number(quantity),
      },
    });

    return NextResponse.json(cartItem);
  } catch (error) {
    return NextResponse.json({ error: "Gagal menambah ke keranjang" }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const auth = await verifyToken (req);
    if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const items = await prisma.cartItem.findMany({
      where: { user_id: auth.id },
      include: { 
        product: {
          include: { brand: true, images: true}
        } 
      },
      orderBy: { created_at: 'desc' }
    });

    return NextResponse.json({ items });
  } catch (error) {
    return NextResponse.json({ error: "Gagal mengambil data keranjang" }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const auth = await verifyToken (req);
    if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { product_id, quantity } = await req.json();

    if (Number(quantity) <= 0) {
        await prisma.cartItem.delete({
            where: { user_id_product_id: { user_id: auth.id, product_id: Number(product_id) } }
        });
        return NextResponse.json({ message: "Item dihapus" });
    }

    const updatedItem = await prisma.cartItem.update({
      where: {
        user_id_product_id: {
          user_id: auth.id,
          product_id: Number(product_id),
        },
      },
      data: { qty: Number(quantity) },
      include: {
        product: {
          include: { brand: true, images: true}
        }
      }
    });

    return NextResponse.json(updatedItem);
  } catch (error) {
    return NextResponse.json({ error: "Gagal update kuantitas" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const auth = await verifyToken (req);
    if (!auth) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const product_id = searchParams.get('product_id');

    if (!product_id) {
        await prisma.cartItem.deleteMany({ where: { user_id: auth.id } });
        return NextResponse.json({ message: "Semua item dihapus" });
    }

    await prisma.cartItem.delete({
      where: {
        user_id_product_id: {
          user_id: auth.id,
          product_id: Number(product_id),
        },
      },
    });

    return NextResponse.json({ message: "Item berhasil dihapus" });
  } catch (error) {
    return NextResponse.json({ error: "Gagal menghapus item" }, { status: 500 });
  }
}