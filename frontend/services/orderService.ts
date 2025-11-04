import apiService from './api';
import { Order, OrderStatus } from '../types';
import { DEFAULT_CURRENCY } from '../constants';
import { mockOrders } from './mockData';

export interface CheckoutData {
  shipping_address: string;
  payment_method: string;
  // Cart contents are usually derived server-side from the user's cart
}

export const checkout = async (token: string, orderDetails: CheckoutData): Promise<Order> => {
  // MOCK IMPLEMENTATION
  console.log('Processing checkout:', { orderDetails, token });
  const newOrder: Order = {
    id: `order-${Math.random().toString(36).substring(2, 9)}`,
    user_id: '1', // Get from token ideally
    total_amount: Math.floor(Math.random() * 1000000) + 500000, // Random total
    order_status: OrderStatus.PENDING,
    shipping_address: orderDetails.shipping_address,
    payment_method: orderDetails.payment_method,
    transaction_currency: DEFAULT_CURRENCY,
    created_at: new Date().toISOString(),
    items: [ /* Should be populated based on cart */ ]
  };
  mockOrders.unshift(newOrder); // Add to mock data
  return new Promise(resolve => setTimeout(() => resolve(newOrder), 700));
  // return apiService<Order>('/orders/checkout', { method: 'POST', data: orderDetails, token });
};

export const getMyOrders = async (token: string): Promise<Order[]> => {
  // MOCK IMPLEMENTATION
  console.log('Fetching my orders with token:', token);
  // User with ID '1' is our demo user
  return new Promise(resolve => setTimeout(() => resolve(mockOrders.filter(o => o.user_id === '1')), 500));
  // return apiService<Order[]>('/orders', { method: 'GET', token });
};

export const getOrderById = async (token: string, orderId: string): Promise<Order> => {
  // MOCK IMPLEMENTATION
  console.log('Fetching order by ID:', { orderId, token });
  const order = mockOrders.find(o => o.id === orderId);
  return new Promise((resolve, reject) => setTimeout(() => {
    if (order) resolve(order);
    else reject(new Error('Order not found'));
  }, 300));
  // return apiService<Order>(`/orders/${orderId}`, { method: 'GET', token });
};
