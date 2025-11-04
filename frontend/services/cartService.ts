
import apiService from './api';
import { Cart, CartItem } from '../types';

// This service would typically require authentication (token)

export const getCart = async (token: string): Promise<Cart> => {
  // MOCK IMPLEMENTATION
  console.log('Fetching cart with token:', token);
  // Simulate an empty cart for now, or a cart with some items
  const mockCart: Cart = {
    id: 'cart-123',
    user_id: 'user-1',
    items: [
      // { id: 'item-1', product_id: '1', quantity: 1, product: { id: '1', name: 'Classic Red Home Jersey 23/24', description: 'Desc', price: 750000, stock_quantity: 50, image_url: 'https://picsum.photos/seed/jersey1/600/400', category_id: '1'} },
    ],
    created_at: new Date().toISOString(),
  };
  return new Promise(resolve => setTimeout(() => resolve(mockCart), 300));
  // return apiService<Cart>('/cart', { method: 'GET', token });
};

export const addToCart = async (token: string, productId: string, quantity: number): Promise<CartItem> => {
  // MOCK IMPLEMENTATION
  console.log('Adding to cart:', { productId, quantity, token });
  const mockItem: CartItem = { id: `cartitem-${productId}`, product_id: productId, quantity };
  return new Promise(resolve => setTimeout(() => resolve(mockItem), 300));
  // return apiService<CartItem>('/cart/add', { method: 'POST', data: { product_id: productId, quantity }, token });
};

export const updateItem = async (token: string, cartItemId: string, quantity: number): Promise<CartItem> => {
  // MOCK IMPLEMENTATION
  console.log('Updating cart item:', { cartItemId, quantity, token });
  const mockItem: CartItem = { id: cartItemId, product_id: 'some-product-id', quantity };
  return new Promise(resolve => setTimeout(() => resolve(mockItem), 300));
  // return apiService<CartItem>(`/cart/item/${cartItemId}`, { method: 'PUT', data: { quantity }, token });
};

export const removeItem = async (token: string, cartItemId: string): Promise<void> => {
  // MOCK IMPLEMENTATION
  console.log('Removing item from cart:', { cartItemId, token });
  return new Promise(resolve => setTimeout(resolve, 300));
  // return apiService<void>(`/cart/item/${cartItemId}`, { method: 'DELETE', token });
};

export const clearCart = async (token: string): Promise<void> => {
  // MOCK IMPLEMENTATION
  console.log('Clearing cart with token:', token);
  return new Promise(resolve => setTimeout(resolve, 300));
  // return apiService<void>('/cart/clear', { method: 'POST', token });
};
