import { Brand } from '../types';

const BASE_URL = "http://localhost:3000/api";

export const addProduct = async (token: string, productData: any): Promise<any> => {
  console.log('Admin: Sending product to Backend...', productData);
  
  const response = await fetch(`${BASE_URL}/products`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(productData),
  });

  const result = await response.json();
  if (!response.ok) {
    throw new Error(result.error || "Gagal menambah produk ke database");
  }
  return result;
};

export const editProduct = async (token: string, productId: string, productData: any): Promise<any> => {
  const response = await fetch(`${BASE_URL}/products/${productId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(productData),
  });

  const result = await response.json();
  if (!response.ok) throw new Error(result.error || "Gagal update produk");
  return result;
};

export const deleteProduct = async (token: string, productId: string): Promise<void> => {
  const response = await fetch(`${BASE_URL}/products/${productId}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`
    },
  });

  if (!response.ok) throw new Error("Gagal menghapus produk");
};

export const getAdminBrands = async (): Promise<Brand[]> => {
  const response = await fetch(`${BASE_URL}/brands`);
  const data = await response.json();
  return data.brands || data; 
};
export const getAllAdminOrders = async (token: string, params: any) => {
  const query = new URLSearchParams();
  if (params.status) query.append("status", params.status);
  if (params.date) query.append("date", params.date);

  const response = await fetch(`${BASE_URL}/admin/orders?${query.toString()}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json'
    },
  });

  if (!response.ok) throw new Error("Gagal mengambil data admin");
  return await response.json(); 
};

export const updateOrderStatus = async (
  token: string, 
  orderId: string | number, 
  payload: { status: string, tracking_number?: string }
) => {
  const response = await fetch(`${BASE_URL}/admin/orders/${orderId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) throw new Error("Gagal update status");
  return await response.json();
};
export const getSalesReports = async (token: string, params: { dateFrom?: string; dateTo?: string }) => {
  const query = new URLSearchParams(params as any).toString();
  const response = await fetch(`${BASE_URL}/admin/sales?${query}`, { 
    headers: { 
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json'
    }
  });
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.error || "Gagal mengambil laporan");
  }
  return response.json();
};
export const getDashboardSummary = async (token: string, range: string = 'month') => {
  const response = await fetch(`${BASE_URL}/admin/dashboard?range=${range}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json'
    },
  });

  if (!response.ok) throw new Error("Gagal mengambil ringkasan dashboard");
  return await response.json();
};