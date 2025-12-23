/* eslint-disable @typescript-eslint/no-explicit-any */
import { prisma } from "@/lib/prismas";
import { serializeProduct, serializeData } from "@/lib/serialize";
import { NextResponse } from "next/server";

export async function GET() {
  const products = await prisma.product.findMany({
    include: {
      brand: true,
      images: true,
    },
    orderBy: { created_at: "desc" },
  });
  const safeProducts = products.map(serializeProduct);
  return NextResponse.json(safeProducts);
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, description, price, stock_quantity, brand_id, images } = body;

    const product = await prisma.product.create({
      data: {
        name,
        description,
        price: Number(price),
        stock_quantity: Number(stock_quantity) || 0,
        brand: {
          connect: { id: BigInt(brand_id) } 
        },
        image_url: images.find((i: any) => i.is_thumbnail)?.image_url || images[0]?.image_url,
        images: {
          create: images.map((img: any) => ({
            image_url: img.image_url,
            is_thumbnail: img.is_thumbnail || false,
          })),
        },
      },
      include: { images: true },
    });

    return NextResponse.json({
      success: true,
      product: serializeData(product),
    });
  } catch (error) {
    console.error("Error creating product:", error);
    return NextResponse.json({ 
      success: false, 
      error: "Gagal menyimpan data ke database" 
    }, { status: 500 });
  }
}