import { Order } from "../types";

const baseUrl = import.meta.env.VITE_URL_BACKEND;

export interface CheckoutData {
  shipping_address: string;
  payment_method: string;
}

export async function getMyOrders(token: string): Promise<Order[]> {
  const res = await fetch(`${baseUrl}/api/orders/my`, {
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
  const response = await fetch(`${baseUrl}/api/orders/${orderId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!response.ok) throw new Error("Pesanan tidak ditemukan");
  return await response.json();
};
export async function markOrderCompleted(
  token: string,
  orderId: string
) {
  const res = await fetch(
    `${baseUrl}/api/orders/${orderId}`,
    {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!res.ok) {
    throw new Error("Gagal menyelesaikan pesanan");
  }

  return res.json();
}

