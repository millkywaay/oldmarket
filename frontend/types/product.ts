export enum Size {
  XS = 'XS',
  S = 'S',
  M = 'M',
  L = 'L',
  XL = 'XL',
  XXL = 'XXL'
}

export interface ProductImage {
  id: string | number; 
  product_id: string | number;
  image_url: string;
  is_thumbnail: boolean;
  created_at: string;
}

export interface Product {
  id: string | number;
  brand_id: string | number;
  name: string;
  description?: string;
  price: number;
  
  size?: Size | string; 
  
  stock_quantity: number;
  image_url?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  images?: ProductImage[]; 
  brand?: {
    id: string | number;
    name: string;
  };
}