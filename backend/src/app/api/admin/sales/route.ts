import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const dateFrom = searchParams.get('dateFrom');
    const dateTo = searchParams.get('dateTo');

    const startDate = dateFrom ? new Date(dateFrom) : undefined;
    const endDate = dateTo ? new Date(dateTo) : undefined;

    const orders = await prisma.order.findMany({
      where: {
        status: 'COMPLETED',
        created_at: {
          gte: startDate,
          lte: endDate ? new Date(new Date(endDate).setHours(23, 59, 59)) : undefined,
        },
      },
      include: {
        items: true
      },
    });
    const aggregatedMap = new Map();

    orders.forEach((order) => {
      order.items.forEach((item) => {
        const key = item.name_snapshot; 
        
        if (aggregatedMap.has(key)) {
          const existing = aggregatedMap.get(key);
          existing.quantity += item.qty;
          existing.total += Number(item.line_total);
        } else {
          aggregatedMap.set(key, {
            productName: item.name_snapshot || 'Produk Tidak Diketahui',
            price: Number(item.unit_price), // Harga satuan
            quantity: item.qty,
            total: Number(item.line_total),
          });
        }
      });
    });
    const reportData = Array.from(aggregatedMap.values());

    return NextResponse.json(reportData, { status: 200 });
  } catch (error) {
    console.error('API Sales Error:', error);
    return NextResponse.json({ error: 'Gagal memproses laporan' }, { status: 500 });
  }
}