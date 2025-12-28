import { fetchRegional } from "@/lib/apiCo";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ districtCode: string }> }
) {
  const { districtCode } = await params;

  const data = await fetchRegional(
    `/regional/indonesia/villages?district_code=${districtCode}`
  );

  return Response.json(data);
}
