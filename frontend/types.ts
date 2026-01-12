export enum UserRole {
  USER = 'USER',
  ADMIN = 'ADMIN'
}

export interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  phone?: string;
  addresses?: Address[];
  default_address_id?: number | null;
}

export interface Address {
  id: number;
  label?: string;
  recipient_name: string;
  phone?: string;
  street: string;

  province: string;
  province_code: string;

  city: string;
  city_code: string;

  district?: string;
  district_code?: string;

  village?: string;
  village_code?: string;

  postal_code: string;
  is_default: boolean;
}

export interface Brand {
  id: string;
  name: string;
}

export enum Size {
  XS = 'XS',
  S = 'S',
  M = 'M',
  L = 'L',
  XL = 'XL',
  XXL = 'XXL'
}

export interface ProductImage {
  id: number;
  product_id: number;
  image_url: string;
  is_thumbnail: boolean;
  created_at: string;
}

export interface Product {
  id: string; 
  brand_id: string;
  name: string;
  description?: string;
  price: number;
  stock_quantity: number;
  image_url?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  

  size?: Size | string; 
  images?: ProductImage[]; 

  brand?: {
    id: string | number;
    name: string;
  };
}

export interface CartItem {
  id: string;
  product_id: string;
  qty: number;
  product?: Product;
  price?: number;
}

export interface Cart {
  id: string;
  user_id: string;
  items: CartItem[];
  created_at?: string;
}

export enum OrderStatus {
  PENDING_PAYMENT = 'PENDING_PAYMENT',
  PAID = 'PAID', 
  PROCESSING = 'PROCESSING',
  SHIPPED = 'SHIPPED',
  COMPLETED = 'COMPLETED',
  CANCELED = 'CANCELED',
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  quantity: number;
  price_at_purchase: number;
  product?: Product; 
}

export interface Order {
  id: string;
  user_id: string;
  total_amount: number;
  order_status: OrderStatus;
  shipping_address: string; 
  payment_method: string; 
  transaction_currency: 'Rp';
  created_at: string;
  updated_at?: string;
  items: OrderItem[];
}

export interface SalesDataPoint {
  date: string; 
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


export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
}