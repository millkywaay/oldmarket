import { fetchRegional } from "@/lib/apiCo";

export async function GET() {
  const data = await fetchRegional("/regional/indonesia/provinces");
  return Response.json(data);
}
