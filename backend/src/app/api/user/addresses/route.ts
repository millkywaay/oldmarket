/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";

export async function GET(req: Request) {
  try {
    const decoded = verifyToken(req);
    if (!decoded) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const addresses = await prisma.address.findMany({
      where: { user_id: decoded.id },
      orderBy: { is_default: 'desc' } 
    });

    return NextResponse.json(addresses);
  } catch (error) {
    return NextResponse.json({ error: "Gagal mengambil alamat" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const decoded = verifyToken(req);
    if (!decoded) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const { label, recipient_name, phone, street, province, province_code,city, city_code, district, district_code, village, village_code, postal_code, is_default } = body;

    if (is_default) {
      await prisma.address.updateMany({
        where: { user_id: decoded.id },
        data: { is_default: false }
      });
    }

    const newAddress = await prisma.address.create({
      data: {
        user_id: decoded.id,
        label,
        recipient_name,
        phone,
        street,
        province, province_code,
        city, city_code,
        district, district_code,
        village, village_code,
        postal_code,
        is_default: is_default || false
      }
    });

    if (is_default) {
      await prisma.user.update({
        where: { id: decoded.id },
        data: { default_address_id: newAddress.id }
      });
    }

    return NextResponse.json(newAddress, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
export async function PATCH(req: Request) {
  try {
    const decoded = verifyToken(req);
    if (!decoded) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const { id, is_default, ...updateData } = body;
    const addressId = Number(id);
    
    if (is_default) {
      await prisma.address.updateMany({
        where: { user_id: decoded.id },
        data: { is_default: false },
      });
    }
    const updated = await prisma.address.update({
      where: { id: Number(id) },
      data: { ...updateData, is_default },
    });

    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({ error: "Gagal update alamat" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const decoded = verifyToken(req);
    if (!decoded) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if(!id) return NextResponse.json({ error: "ID alamat diperlukan" }, { status: 400 });

    await prisma.address.delete({
      where: { id: Number(id), user_id: decoded.id }
    });
    return NextResponse.json({ message: "Alamat dihapus" })
  } catch (error) {
    return NextResponse.json({ error: "Gagal menghapus alamat" }, { status: 500 });
  }
}