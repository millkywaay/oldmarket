import { fetchRegional } from "@/lib/apiCo";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ provinceCode: string }> }
) {
  const { provinceCode } = await params;

  const data = await fetchRegional(
    `/regional/indonesia/regencies?province_code=${provinceCode}`
  );

  return Response.json(data);
}
