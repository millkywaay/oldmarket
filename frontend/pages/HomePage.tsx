import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Product } from '../types';
import * as productService from '../services/productService';
import ProductCard from '../components/common/ProductCard';
import LoadingSpinner from '../components/common/LoadingSpinner';
import Button from '../components/common/Button';
import { useAuth } from '../contexts/AuthContext';

const HomePage: React.FC = () => {
  const { user, isAdmin } = useAuth();
  const [newArrivals, setNewArrivals] = useState<Product[]>([]);
  const [topSelling, setTopSelling] = useState<Product[]>([]);
  const [forYou, setForYou] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const brands = ["Nike", "Adidas", "Puma", "Kappa", "Ortuseight"];

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const allProducts = await productService.getAllProducts();
        const sortedByNewest = [...allProducts].slice(0, 4);
        setNewArrivals(sortedByNewest);

        const sortedByStock = [...allProducts]
          .sort((a, b) => (b.stock_quantity || 0) - (a.stock_quantity || 0))
          .slice(0, 8);
        setTopSelling(sortedByStock);

        if (user && !isAdmin) {
          const recommendations = [...allProducts]
            .sort(() => 0.5 - Math.random())
            .slice(0, 4);
          setForYou(recommendations);
        }
      } catch (err: any) {
        setError(err.message || 'Gagal memuat produk dari database.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProducts();
  }, [user, isAdmin]);

  return (
    <div className="space-y-16 md:space-y-24 pb-20">
      {/* Hero Section */}
      <header className="bg-gradient-to-r from-gray-100 to-gray-200">
        <div className="container mx-auto px-4 py-12 md:py-20">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="md:w-full">
              <h1 className="text-4xl md:text-6xl font-extrabold text-black mb-4 leading-tight uppercase">
                Find Your Style,<br />
                Embrace Your Pride.
              </h1>
              <p className="text-gray-700 mb-8 text-lg">
                Temukan koleksi apparel terbaik dengan kualitas premium. Didesain untuk kenyamanan dan detail yang sempurna bagi kamu yang menginginkan lebih.
              </p>
              <Link to="/products">
                <Button variant="primary" size="lg" className="rounded-full px-10">Shop Now</Button>
              </Link>
              <div className="flex flex-wrap gap-x-8 gap-y-4 mt-12">
                <div>
                  <div className="text-3xl font-bold">5+</div>
                  <div className="text-gray-600">Top Brands</div>
                </div>
                <div>
                  <div className="text-3xl font-bold">Authentic</div>
                  <div className="text-gray-600">Quality Guaranteed</div>
                </div>
              </div>
            </div>
            <div className="md:w-full flex justify-center">
              <img
                src="https://qllmjfkxlsjnzbwnbqjc.supabase.co/storage/v1/object/public/product-images/hero.png"
                alt="Banner Hero"
                className="w-full max-w-md h-auto rounded-3xl shadow-2xl object-cover"
              />
            </div>
          </div>
        </div>
      </header>

      {/* Brand Logos */}
      <section className="bg-black py-10">
        <div className="container mx-auto px-4">
          <div className="flex justify-around items-center flex-wrap gap-8">
            {brands.map((brand, index) => (
              <div key={index} className="text-white text-2xl font-black italic opacity-60 hover:opacity-100 transition-opacity uppercase tracking-tighter">
                {brand}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Product Sections */}
      {isLoading ? (
        <div className="py-20">
          <LoadingSpinner message="Menghubungkan ke database..." />
        </div>
      ) : error ? (
        <div className="text-center text-red-500 py-20 font-medium">{error}</div>
      ) : (
        <div className="space-y-24">
          {/* New Arrivals */}
          {newArrivals.length > 0 && (
            <section className="container mx-auto px-4">
              <div className="flex flex-col items-center mb-12">
                <h2 className="text-4xl font-black text-black tracking-tighter uppercase">New Arrivals</h2>
                <div className="h-1 w-20 bg-black mt-2"></div>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
                {newArrivals.map(product => <ProductCard key={product.id} product={product} />)}
              </div>
              <div className="text-center mt-12">
                <Link to="/new-arrival">
                  <Button variant="outline" size="md" className="rounded-full px-8">View All Arrivals</Button>
                </Link>
              </div>
            </section>
          )}
          
          {/* Top Selling */}
          {topSelling.length > 0 && (
            <section className="py-20 bg-gray-50 border-y border-gray-100">
              <div className="container mx-auto px-4">
                <div className="flex flex-col items-center mb-12">
                  <h2 className="text-4xl font-black text-black tracking-tighter uppercase">Top Selling</h2>
                  <div className="h-1 w-20 bg-black mt-2"></div>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
                  {topSelling.map(product => <ProductCard key={product.id} product={product} />)}
                </div>
                <div className="text-center mt-12">
                  <Link to="/top-selling">
                    <Button variant="outline" size="md" className="rounded-full px-8">View Best Sellers</Button>
                  </Link>
                </div>
              </div>
            </section>
          )}

          {/* Personalized Section for User */}
          {user && !isAdmin && forYou.length > 0 && (
            <section className="container mx-auto px-4">
              <div className="flex flex-col items-center mb-12">
                <h2 className="text-4xl font-black text-black tracking-tighter uppercase">Picked For You</h2>
                <p className="text-gray-500 mt-2">Berdasarkan koleksi terbaik kami khusus untukmu</p>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
                {forYou.map(product => <ProductCard key={product.id} product={product} />)}
              </div>
              <div className="text-center mt-12">
                <Link to="/recommendations">
                  <Button variant="outline" size="md" className="rounded-full px-8">Explore More</Button>
                </Link>
              </div>
            </section>
          )}
        </div>
      )}
    </div>
  );
};

export default HomePage;