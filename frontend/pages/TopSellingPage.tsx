
import React, { useEffect, useState } from 'react';
import { Product } from '../types';
import * as productService from '../services/productService';
import ProductCard from '../components/common/ProductCard';
import LoadingSpinner from '../components/common/LoadingSpinner';

const TopSellingPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const { items } = await productService.getAllProducts();
        // Mock logic: Top selling have higher stock, implying popularity/restock.
        const sortedByStock = [...items].sort((a,b) => b.stock_quantity - a.stock_quantity);
        setProducts(sortedByStock.slice(0, 15)); 
      } catch (err: any) {
        setError(err.message || 'Failed to load products.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchProducts();
  }, []);

  return (
    <div className="pb-16">
      <header className="bg-gray-100 py-10">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-extrabold text-black">Top Selling</h1>
          <p className="text-gray-600 mt-2 max-w-2xl mx-auto">Discover our most popular jerseys, loved by fans worldwide.</p>
        </div>
      </header>
      
      <main className="container mx-auto px-4 pt-12">
        {isLoading ? (
          <LoadingSpinner message="Loading best sellers..." />
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {products.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-600 py-10">Could not determine top selling products. Please check back later.</p>
        )}
      </main>
    </div>
  );
};

export default TopSellingPage;
