/* eslint-disable @typescript-eslint/no-explicit-any */

import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { serializeProduct } from "@/lib/serialize";
import { supabase } from "@/services/supabaseClient";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(req: Request, context: RouteContext) {
  const { id } = await context.params;
  const productId = Number(id);

  const product = await prisma.product.findUnique({
    where: { id: productId },
    include: { brand: true, images: true },
  });

  if (!product) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }

  return NextResponse.json(serializeProduct(product));
}

export async function PUT(req: Request, context: RouteContext) {
  const { id } = await context.params;
  const productId = Number(id);
  const body = await req.json();

  if (!body || !body.name) {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }
  await prisma.productImage.deleteMany({
    where: { product_id: productId },
  });

  const product = await prisma.product.update({
    where: { id: productId },
    data: {
      name: body.name,
      description: body.description ?? null,
      price: body.price,
      size: body.size,
      stock_quantity: Number(body.stock_quantity) || 0,
      brand_id: Number(body.brand_id),
      images: {
        create:
          (body.images as any[] | undefined)?.map((img) => ({
            image_url: img.image_url, 
            is_thumbnail: !!img.is_thumbnail,
          })) ?? [],
      },
    },
    include: { brand: true, images: true },
  });

  return NextResponse.json({  
    message: "Product updated",
    product: serializeProduct(product),
  });
}

export async function DELETE(req: Request, context: RouteContext) {
  const { id } = await context.params;
  const productId = Number(id);

  const productImages = await prisma.productImage.findMany({
    where: { product_id: productId },
  });

if (productImages.length > 0) {
    const filePaths = productImages.map(img => {
      const parts = img.image_url.split('/');
      return parts[parts.length - 1]; 
    });

    await supabase.storage
      .from('product-images')
      .remove(filePaths);
  }
  await prisma.productImage.deleteMany({ where: { product_id: productId } });
  await prisma.product.delete({ where: { id: productId } });

  return NextResponse.json({ message: "Produk dan gambar berhasil dihapus" });

}

