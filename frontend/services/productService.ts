import api from './api';
import { Product, Brand } from '../types';

export const getAllProducts = async (): Promise<Product[]> => {
  const response = await api.get('/products');
  return response.data;
};

export const getSearchProducts = async (params?: any): Promise<Product[]> => {
  const response = await api.get('/products', { params });
  return response.data;
};


export const getProductById = async (id: string): Promise<Product> => {
  const response = await api.get(`/products/${id}`);
  return response.data;
};

export const getBrands = async (): Promise<Brand[]> => {
  const response = await api.get('/brands');
  return Array.isArray(response.data) ? response.data : response.data.brands;
};

export const getProductsByBrand = async (brandId: string): Promise<Product[]> => {
  const products = await getAllProducts();
  return products.filter(p => p.brand_id.toString() === brandId.toString());
};