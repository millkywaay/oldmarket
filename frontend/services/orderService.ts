import { Order, OrderStatus } from '../types';

const BASE = "http://localhost:3000/api/orders";
export interface CheckoutData {
  shipping_address: string;
  payment_method: string;
}

export const checkout = async (token: string, orderDetails: CheckoutData): Promise<Order> => {
  const response = await fetch(`${BASE}/checkout`, {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}` 
    },
    body: JSON.stringify(orderDetails),
  });
  
  const result = await response.json();
  if (!response.ok) throw new Error(result.error || "Gagal memproses pesanan");
  return result;
};

export const getMyOrders = async (token: string): Promise<Order[]> => {
  const response = await fetch(BASE, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  if (!response.ok) throw new Error("Gagal mengambil riwayat pesanan");
  const data = await response.json();
  return data.orders || data;
};
export const getOrderById = async (token: string, orderId: string): Promise<Order> => {
  const response = await fetch(`${BASE}/${orderId}`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  if (!response.ok) throw new Error("Pesanan tidak ditemukan");
  return await response.json();
};