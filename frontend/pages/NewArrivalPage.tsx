import * as React from "react";
import { useEffect, useState } from 'react';
import { Product } from '../types';
import * as productService from '../services/productService';
import ProductCard from '../components/common/ProductCard';
import LoadingSpinner from '../components/common/LoadingSpinner';

const NewArrivalPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        const data = await productService.getAllProducts();
        const sorted = [...data].sort((a, b) => 
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
        setProducts(sorted.slice(0, 12));
      } catch (err: any) {
        console.error(err.message || 'Gagal memuat produk terbaru.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchProducts();
  }, []);

  return (
    <div className="container mx-auto px-4 pt-12 pb-16">
      <h1 className="text-4xl font-extrabold text-center mb-10 uppercase tracking-tighter">New Arrivals</h1>
      {isLoading ? <LoadingSpinner /> : (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {products.map(product => <ProductCard key={product.id} product={product} />)}
        </div>
      )}
    </div>
  );
};

export default NewArrivalPage;