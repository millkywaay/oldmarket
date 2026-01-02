import { Order } from "../types";

const BASE = "http://localhost:3000/api/orders";
export interface CheckoutData {
  shipping_address: string;
  payment_method: string;
}

export async function getMyOrders(token: string): Promise<Order[]> {
  const res = await fetch(`${BASE}/my`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error("Gagal mengambil riwayat pesanan");
  }

  return res.json();
}
export const getOrderById = async (
  token: string,
  orderId: string
): Promise<Order> => {
  const response = await fetch(`${BASE}/${orderId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok) throw new Error("Pesanan tidak ditemukan");
  return await response.json();
};
