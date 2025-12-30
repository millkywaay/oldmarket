const BASE_URL = "https://use.api.co.id";

const DEFAULT_HEADERS = {
  "x-api-co-id": process.env.API_CO_ID!,
  Accept: "application/json",
};

async function apiCoFetch(path: string, options: RequestInit = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      ...DEFAULT_HEADERS,
      ...(options.headers || {}),
    },
    cache: "no-store",
  });

  if (!res.ok) {
    const text = await res.text();
    console.error("API CO ERROR:", res.status, text);
    throw new Error(`API.co.id error: ${res.status}`);
  }

  return res.json();
}

export function fetchRegional(endpoint: string) {
  return apiCoFetch(endpoint);
}

export function fetchApiCo(path: string, options?: RequestInit) {
  return apiCoFetch(path, options);
}
