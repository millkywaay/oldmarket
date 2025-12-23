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