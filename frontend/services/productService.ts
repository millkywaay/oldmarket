const BASE = "http://localhost:3000/api";

export async function getAllProducts() {
  const res = await fetch(`${BASE}/products`);
  if (!res.ok) throw new Error("Gagal mengambil produk");
  const data = await res.json();
  return Array.isArray(data) ? data : data.products || []; 
}

export async function getProductById(proudctId: String){
  const res = await fetch(`${BASE}/products/${proudctId}`)
  if (!res.ok) throw new Error("Produk tidak ditemukan");
  return await res.json()
}
export async function getBrands() {
  const res = await fetch(`${BASE}/brands`);
  if (!res.ok) throw new Error("Gagal mengambil brand");
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