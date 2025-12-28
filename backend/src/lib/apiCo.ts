export async function fetchRegional(endpoint: string) {
  const res = await fetch(`https://use.api.co.id${endpoint}`, {
    headers: {
      "x-api-co-id": process.env.API_CO_ID!,
      "User-Agent": "Mozilla/5.0", 
      "Accept": "application/json",
    },
    cache: "no-store",
  });

  if (!res.ok) {
    const text = await res.text();
    console.error("API CO ERROR:", res.status, text);
    throw new Error("Failed to fetch regional data");
  }

  return res.json();
}
