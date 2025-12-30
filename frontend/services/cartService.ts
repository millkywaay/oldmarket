import { CartItem } from "../types";
import api from "./api";

const BASE = "/cart";

export const getCart = async () => {
  const response = await api.get(BASE);
  return response.data;
};

export const addToCart = async (productId: string | number, quantity: number) => {
  const response = await api.post(BASE, {
    product_id: productId,
    quantity: quantity,
  });
  return response.data;
};

export const updateItem = async (
  productId: string | number,
  quantity: number
): Promise<CartItem | { message: string }> => {
  const response = await api.patch(BASE, {
    product_id: productId,
    quantity,
  });
  return response.data;
};


export const removeItem = async (
  productId: string | number
): Promise<{ message: string }> => {
  const response = await api.delete(BASE, {
    params: { product_id: productId },
  });
  return response.data;
};

export const clearCart = async (): Promise<{ message: string }> => {
  const response = await api.delete(BASE);
  return response.data;
};
