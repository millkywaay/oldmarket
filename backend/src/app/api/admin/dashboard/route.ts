import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const range = searchParams.get('range') || 'month';

    const now = new Date();
    let startDate = new Date();

    if (range === 'day') startDate.setHours(0, 0, 0, 0);
    else if (range === 'week') startDate.setDate(now.getDate() - 7);
    else if (range === 'month') startDate.setMonth(now.getMonth() - 1);
    else if (range === 'year') startDate.setFullYear(now.getFullYear() - 1);
    const ordersInRange = await prisma.order.findMany({
      where: { 
        status: "COMPLETED", 
        created_at: { gte: startDate } 
      },
      include: { items: true }
    });
    const totalRevenue = ordersInRange.reduce((sum, o) => sum + Number(o.grand_total), 0);
    const totalOrders = ordersInRange.length;
    const totalProducts = await prisma.product.count();
    const lowStockCount = await prisma.product.count({
      where: { stock_quantity: { lt: 5 } } // Alert stok < 5
    });
    const salesMap = new Map();
    ordersInRange.forEach(o => {
      o.items.forEach(item => {
        const curr = salesMap.get(item.product_id) || { qty: 0, name: item.name_snapshot };
        salesMap.set(item.product_id, { qty: curr.qty + item.qty, name: curr.name });
      });
    });

    const bestSellers = await Promise.all(
      Array.from(salesMap.entries())
        .sort((a, b) => b[1].qty - a[1].qty)
        .slice(0, 5)
        .map(async ([id, val]) => {
          const p = await prisma.product.findUnique({
            where: { id: Number(id) },
            include: { images: { where: { is_thumbnail: true }, take: 1 } }
          });
          return { name: val.name, total_sold: val.qty, image: p?.images[0]?.image_url };
        })
    );
    const recentOrders = await prisma.order.findMany({
      take: 5,
      orderBy: { created_at: 'desc' },
      include: { user: { select: { name: true } } }
    });

    return NextResponse.json({
      totalRevenue,
      totalOrders,
      totalProducts,
      lowStockCount,
      bestSellingProducts: bestSellers,
      recentOrders: recentOrders.map(o => ({
        id: o.id,
        customer: o.user.name,
        date: o.created_at,
        amount: Number(o.grand_total),
        status: o.status
      }))
    });
  } catch (error) {
    return NextResponse.json({ error: "Gagal memuat dashboard" }, { status: 500 });
  }
}