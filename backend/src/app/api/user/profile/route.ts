/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken } from "@/lib/auth";


export async function GET (req: Request) {
  try {
    const decoded = verifyToken(req);
    if (!decoded) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: { id: true, name: true, email: true, phone: true }
    });
    return NextResponse.json(user);
  } catch (error) {
    return NextResponse.json({ error: "Gagal mengambil profil" }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const decoded = verifyToken(req);
    if (!decoded) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const { name, phone } = body;

    const updatedUser = await prisma.user.update({
      where: { id: decoded.id },
      data: { name, phone },
      select: { 
        id: true, 
        name: true, 
        email: true, 
        phone: true, 
        role: true,
        default_address_id: true 
      }
    });
    return NextResponse.json(updatedUser); 
  } catch (error) {
    return NextResponse.json({ error: "Gagal update profil" }, { status: 500 });
  }
}