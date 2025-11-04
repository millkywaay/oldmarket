import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Product } from '../types';
import * as productService from '../services/productService';
import * as orderService from '../services/orderService';
import ProductCard from '../components/common/ProductCard';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { useAuth } from '../contexts/AuthContext';

const YourRecommendationsPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user, token } = useAuth();

  useEffect(() => {
    const fetchRecommendations = async () => {
      if (!token || !user) {
        setIsLoading(false);
        setError("Please log in to see your recommendations.");
        return;
      }

      setIsLoading(true);
      setError(null);
      try {
        // Step 1: Get user's order history
        const myOrders = await orderService.getMyOrders(token);
        
        if (myOrders.length === 0) {
          // If no orders, recommend top-selling items instead
          const { items } = await productService.getAllProducts();
          const sortedByStock = items.sort((a,b) => b.stock_quantity - a.stock_quantity);
          setProducts(sortedByStock.slice(0, 8));
          setIsLoading(false); // Set loading to false here
          return; // <-- This return was missing
        }

        // Step 2: Find user's favorite brand and purchased products
        const purchasedProductIds = new Set<string>();
        const brandFrequency: { [brandId: string]: number } = {};

        myOrders.forEach(order => {
          order.items.forEach(item => {
            purchasedProductIds.add(item.product_id);
            if(item.product) {
                brandFrequency[item.product.brand_id] = (brandFrequency[item.product.brand_id] || 0) + item.quantity;
            }
          });
        });

        const favoriteBrandId = Object.keys(brandFrequency).sort((a,b) => brandFrequency[b] - brandFrequency[a])[0];

        // Step 3: Get all products and filter for recommendations
        const { items: allProducts } = await productService.getAllProducts();
        
        const recommendations = allProducts.filter(p => 
            p.brand_id === favoriteBrandId && // From favorite brand
            !purchasedProductIds.has(p.id)    // Not already purchased
        );
        
        setProducts(recommendations.slice(0, 8));

      } catch (err: any) {
        setError(err.message || 'Failed to load your recommendations.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchRecommendations();
  }, [user, token]);

  return (
    <div className="pb-16">
      <header className="bg-gray-100 py-10">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-extrabold text-black">Specially For You, {user?.username}</h1>
          <p className="text-gray-600 mt-2 max-w-2xl mx-auto">Based on your interests and purchase history, we think you'll love these.</p>
        </div>
      </header>
      
      <main className="container mx-auto px-4 pt-12">
         <div className="mb-8 p-4 bg-blue-50 border border-blue-200 rounded-lg text-blue-800 text-sm">
            <strong>How this works:</strong> We've analyzed your purchase history to find your favorite brand. These recommendations are other products from that brand that you haven't bought yet! If you're new, we'll show you our top sellers.
         </div>

        {isLoading ? (
          <LoadingSpinner message="Finding recommendations for you..." />
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {products.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-600 py-10">We've run out of recommendations for your favorite brand! Check out our <Link to="/products" className="text-black font-semibold hover:underline">full collection</Link>.</p>
        )}
      </main>
    </div>
  );
};

export default YourRecommendationsPage;
