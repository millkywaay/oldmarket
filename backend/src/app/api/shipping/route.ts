/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from "next/server";
import { fetchApiCo } from "@/lib/apiCo";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const destination = searchParams.get("destination");
  const weight = searchParams.get("weight");

  if (!destination || !weight) {
    return NextResponse.json(
      { is_success: false, message: "Missing params" },
      { status: 400 }
    );
  }

  try {
    const data = await fetchApiCo(
      `/expedition/shipping-cost?origin_village_code=3173011001&destination_village_code=${destination}&weight=${weight}`
    );

    return NextResponse.json(data);
  } catch (err: any) {
    return NextResponse.json(
      { is_success: false, message: err.message },
      { status: 500 }
    );
  }
}
