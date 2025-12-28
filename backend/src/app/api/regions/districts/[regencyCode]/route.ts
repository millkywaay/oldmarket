import { fetchRegional } from "@/lib/apiCo";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ regencyCode: string }> }
) {
  const { regencyCode } = await params;

  const data = await fetchRegional(
    `/regional/indonesia/districts?regency_code=${regencyCode}`
  );

  return Response.json(data);
}
