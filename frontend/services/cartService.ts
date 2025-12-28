// import { Cart, CartItem } from '../types';

// const BASE = "http://localhost:3000/api/cart";

// export const getCart = async (token: string): Promise<Cart> => {
//   const response = await fetch(BASE, {
//     headers: { 'Authorization': `Bearer ${token}` }
//   });
//   if (!response.ok) throw new Error("Gagal mengambil keranjang");
//   return await response.json();
// };

// export const addToCart = async (token: string, productId: string, quantity: number): Promise<CartItem> => {
//   const response = await fetch(`${BASE}/add`, {
//     method: 'POST',
//     headers: { 
//       'Content-Type': 'application/json',
//       'Authorization': `Bearer ${token}` 
//     },
//     body: JSON.stringify({ product_id: productId, quantity }),
//   });
//   if (!response.ok) throw new Error("Gagal menambah ke keranjang");
//   return await response.json();
// };

// export const updateItem = async (token: string, cartItemId: string, quantity: number): Promise<CartItem> => {
//   const response = await fetch(`${BASE}/item/${cartItemId}`, {
//     method: 'PUT',
//     headers: { 
//       'Content-Type': 'application/json',
//       'Authorization': `Bearer ${token}` 
//     },
//     body: JSON.stringify({ quantity }),
//   });
//   if (!response.ok) throw new Error("Gagal update item");
//   return await response.json();
// };

// export const removeItem = async (token: string, cartItemId: string): Promise<void> => {
//   const response = await fetch(`${BASE}/item/${cartItemId}`, {
//     method: 'DELETE',
//     headers: { 'Authorization': `Bearer ${token}` },
//   });
//   if (!response.ok) throw new Error("Gagal menghapus item");
// };