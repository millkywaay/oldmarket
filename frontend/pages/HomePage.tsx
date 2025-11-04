import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Product } from '../types';
import * as productService from '../services/productService';
import ProductCard from '../components/common/ProductCard';
import LoadingSpinner from '../components/common/LoadingSpinner';
import Button from '../components/common/Button';
import { useAuth } from '../contexts/AuthContext';
import { Star, ChevronLeft, ChevronRight } from 'lucide-react';

const HomePage: React.FC = () => {
  const { user, isAdmin } = useAuth();
  const [newArrivals, setNewArrivals] = useState<Product[]>([]);
  const [topSelling, setTopSelling] = useState<Product[]>([]);
  const [forYou, setForYou] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  const testimonials = [
    { name: "Fadhil", rating: 5, comment: "Jerseynya bagus banget, pasti sering order lagi!" },
    { name: "Faqih", rating: 5, comment: "Keren banget, aku suka aku suka!" },
    { name: "Huda", rating: 5, comment: "Bagus kualitasnya, gak akan beli di tempat lain lagi!" },
    { name: "Rizky", rating: 4, comment: "Pengirimannya cepat dan bahannya adem. Recommended." },
    { name: "Aulia", rating: 5, comment: "Desainnya persis seperti yang ori. Mantap JER.CO!" },
  ];
  
  const brands = ["Nike", "Adidas", "Puma", "Kappa", "Ortuseight"];

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const { items: allProducts } = await productService.getAllProducts();
        
        // Mock logic: Newest are those with IDs like O5, K5, P5 etc.
        const sortedById = [...allProducts].sort((a, b) => b.id.localeCompare(a.id));
        setNewArrivals(sortedById.slice(0, 4));

        // Mock logic: Top selling have higher stock, implying popularity/restock.
        const sortedByStock = [...allProducts].sort((a,b) => b.stock_quantity - a.stock_quantity);
        setTopSelling(sortedByStock.slice(0, 8));

        // Conditionally set recommendations for logged-in customers
        if (user && !isAdmin) {
          // A simple shuffle for homepage recommendations
          const recommendations = [...allProducts].sort(() => 0.5 - Math.random()).slice(0, 4);
          setForYou(recommendations);
        } else {
          setForYou([]);
        }
      } catch (err: any) {
        setError(err.message || 'Failed to load products.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProducts();
  }, [user, isAdmin]);

  const nextTestimonial = () => {
    setCurrentTestimonial(prev => (prev === testimonials.length - 1 ? 0 : prev + 1));
  };

  const prevTestimonial = () => {
    setCurrentTestimonial(prev => (prev === 0 ? testimonials.length - 1 : prev - 1));
  };
  
  const TestimonialCard: React.FC<{ testimonial: typeof testimonials[0] }> = ({ testimonial }) => (
    <div className="bg-white rounded-lg p-6 shadow-md border">
        <div className="flex items-center mb-4">
            {[...Array(testimonial.rating)].map((_, i) => (
            <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
            ))}
        </div>
        <div className="flex items-center mb-4">
            <span className="font-semibold">{testimonial.name}</span>
            <span className="ml-2 text-green-500">✓ Verified Customer</span>
        </div>
        <p className="text-gray-700 italic">"{testimonial.comment}"</p>
    </div>
  );

  return (
    <div className="space-y-16 md:space-y-24">
      {/* Hero Section */}
      <header className="bg-gradient-to-r from-gray-100 to-gray-200">
        <div className="container mx-auto px-4 py-12 md:py-20">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div className="md:w-full">
              <h1 className="text-4xl md:text-6xl font-extrabold text-black mb-4 leading-tight">
                SHOW YOUR SUPPORT,<br />
                WEAR YOUR PRIDE.
              </h1>
              <p className="text-gray-700 mb-8 text-lg">
                Tailored for comfort, perfected in detail. Premium apparel for fans who demand more than just a shirt.
              </p>
              <Link to="/products">
                <Button variant="primary" size="lg">Shop Now</Button>
              </Link>
              <div className="flex flex-wrap gap-x-8 gap-y-4 mt-8">
                <div>
                  <div className="text-3xl font-bold">5</div>
                  <div className="text-gray-600">Brands</div>
                </div>
                <div>
                  <div className="text-3xl font-bold">500+</div>
                  <div className="text-gray-600">High-Quality Products</div>
                </div>
                <div>
                  <div className="text-3xl font-bold">5,000+</div>
                  <div className="text-gray-600">Happy Customers</div>
                </div>
              </div>
            </div>
            <div className="md:w-full flex justify-center">
              <img
                src="https://i.imgur.com/tO6NAgj.png"
                alt="Football Players"
                className="w-full max-w-md h-auto rounded-lg shadow-2xl object-cover"
              />
            </div>
          </div>
        </div>
      </header>

      {/* Brand Logos */}
      <section className="bg-black py-8">
        <div className="container mx-auto px-4">
          <div className="flex justify-around items-center flex-wrap gap-8">
            {brands.map((brand, index) => (
              <div key={index} className="text-white text-2xl font-bold opacity-75 hover:opacity-100 transition-opacity">
                {brand}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Product Sections */}
      {isLoading ? <LoadingSpinner message="Loading products..." /> : error ? <div className="text-center text-red-500">{error}</div> : (
        <>
        {newArrivals.length > 0 && (
          <section className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">NEW ARRIVALS</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
              {newArrivals.map(product => <ProductCard key={product.id} product={product} />)}
            </div>
            <div className="text-center mt-12">
              <Link to="/new-arrival">
                <Button variant="outline" size="md">View All</Button>
              </Link>
            </div>
          </section>
        )}
        
        {topSelling.length > 0 && (
          <section className="py-16 bg-white">
            <div className="container mx-auto px-4">
              <h2 className="text-3xl font-bold text-center mb-12">TOP SELLING</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
                {topSelling.map(product => <ProductCard key={product.id} product={product} />)}
              </div>
              <div className="text-center mt-12">
                <Link to="/top-selling">
                  <Button variant="outline" size="md">View All</Button>
                </Link>
              </div>
            </div>
          </section>
        )}

        {user && !isAdmin && forYou.length > 0 && (
          <section className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">FOR YOU</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
              {forYou.map(product => <ProductCard key={product.id} product={product} />)}
            </div>
            <div className="text-center mt-12">
              <Link to="/recommendations">
                <Button variant="outline" size="md">View All</Button>
              </Link>
            </div>
          </section>
        )}
        </>
      )}

      {/* Customer Testimonials */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-12">
            <h2 className="text-3xl font-bold">OUR HAPPY CUSTOMERS</h2>
            <div className="flex space-x-2">
              <button onClick={prevTestimonial} className="p-2 rounded-full bg-white shadow-md hover:shadow-lg transition-shadow" aria-label="Previous testimonial">
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button onClick={nextTestimonial} className="p-2 rounded-full bg-white shadow-md hover:shadow-lg transition-shadow" aria-label="Next testimonial">
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <TestimonialCard testimonial={testimonials[currentTestimonial]} />
            <div className="hidden md:block">
              <TestimonialCard testimonial={testimonials[(currentTestimonial + 1) % testimonials.length]} />
            </div>
            <div className="hidden md:block">
              <TestimonialCard testimonial={testimonials[(currentTestimonial + 2) % testimonials.length]} />
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default HomePage;