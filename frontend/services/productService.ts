
import apiService from './api';
import { Product, Brand, PaginatedResponse } from '../types';
import { mockProducts, mockBrands } from './mockData';

export const getAllProducts = async (filters?: { brand?: string; sortBy?: string; page?: number; limit?: number }): Promise<PaginatedResponse<Product>> => {
  // MOCK IMPLEMENTATION
  console.log('Fetching all products with filters:', filters);
  return new Promise(resolve => setTimeout(() => {
    let products = [...mockProducts];
    if (filters?.brand) {
        products = products.filter(p => p.brand_id === filters.brand);
    }
    // Add sorting/pagination if needed for mock
    resolve({ items: products, total: products.length, page: filters?.page || 1, limit: filters?.limit || products.length });
  }, 500));
  // const queryParams = new URLSearchParams(filters as any).toString();
  // return apiService<PaginatedResponse<Product>>(`/products?${queryParams}`);
};

export const getProductById = async (productId: string): Promise<Product> => {
  // MOCK IMPLEMENTATION
  console.log('Fetching product by ID:', productId);
  const product = mockProducts.find(p => p.id === productId);
  return new Promise((resolve, reject) => setTimeout(() => {
    if (product) resolve(product);
    else reject(new Error('Product not found'));
  }, 300));
  // return apiService<Product>(`/products/${productId}`);
};

export const getBrands = async (): Promise<Brand[]> => {
  // MOCK IMPLEMENTATION
  console.log('Fetching brands');
  return new Promise(resolve => setTimeout(() => resolve(mockBrands), 200));
  // return apiService<Brand[]>('/products/brands');
};
