const BASE = "http://localhost:3000/api/products";

export async function getAllProducts() {
  const res = await fetch(BASE);
  if (!res.ok) throw new Error("Gagal mengambil produk");
  const data = await res.json();
  return Array.isArray(data) ? data : []; 
}
export async function getBrands() {
  const res = await fetch("http://localhost:3000/api/brands");
  const data = await res.json();
  return data.brands || data; 
}

export async function createProduct(data: any) {
  const res = await fetch(BASE, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return res.json();
}