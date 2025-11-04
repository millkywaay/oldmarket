export enum UserRole {
  USER = 'USER',
  ADMIN = 'ADMIN'
}

export interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
}

export interface Brand {
  id: string;
  name: string;
  description?: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock_quantity: number;
  image_url: string;
  brand_id: string;
  brand?: Brand; // Optional: populated if joining
  created_at?: string;
  updated_at?: string;
}

export interface CartItem {
  id: string; // This could be product_id if items are unique by product in cart
  product_id: string;
  quantity: number;
  product?: Product; // Populated for display
  price_at_addition?: number; // Could be useful
}

export interface Cart {
  id: string;
  user_id: string;
  items: CartItem[];
  created_at?: string;
}

export enum OrderStatus {
  PENDING = 'pending',
  PAID = 'paid',
  SHIPPED = 'shipped',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled',
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  quantity: number;
  price_at_purchase: number;
  product?: Product; // Populated for display
}

export interface Order {
  id: string;
  user_id: string;
  total_amount: number;
  order_status: OrderStatus;
  shipping_address: string; // Simplified for now
  payment_method: string; // e.g., "Internal Courier" "Manual Bank Transfer"
  transaction_currency: 'IDR';
  created_at: string;
  updated_at?: string;
  items: OrderItem[];
}

export interface SalesDataPoint {
  date: string; // or any other grouping like month, product
  revenue: number;
  orders: number;
}

export interface BestSellingProduct {
  product_id: string;
  name: string;
  total_sold: number;
}

export interface AdminDashboardSummary {
  totalRevenue: number;
  totalOrders: number;
  totalProducts: number;
  lowStockItemsCount: number;
  bestSellingProducts: BestSellingProduct[];
}

// For API responses that might include pagination
export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
}