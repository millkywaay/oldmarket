export interface ProductImage {
  id: string;
  product_id: string;
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
  images?: ProductImage[]; 
  brand?: {
    id: string;
    name: string;
  };
}