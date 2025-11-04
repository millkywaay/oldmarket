
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Product } from '../types';
import * as productService from '../services/productService';
import LoadingSpinner from '../components/common/LoadingSpinner';
import Button from '../components/common/Button';
import ProductCard from '../components/common/ProductCard';
import { DEFAULT_CURRENCY } from '../constants';
import { useCart } from '../contexts/CartContext';
import { Star, Minus, Plus, ShoppingCart, ShieldCheck } from 'lucide-react';

const ProductDetailPage: React.FC = () => {
  const { productId } = useParams<{ productId: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const { addToCart, isLoading: isCartLoading } = useCart();

  useEffect(() => {
    if (!productId) {
      setError('Product ID is missing.');
      setIsLoading(false);
      return;
    }
    const fetchProductData = async () => {
      setIsLoading(true);
      setError(null);
      window.scrollTo(0, 0); // Scroll to top on new product load
      try {
        const fetchedProduct = await productService.getProductById(productId);
        setProduct(fetchedProduct);
        
        // Fetch related products (e.g., from the same brand)
        const { items } = await productService.getAllProducts({ brand: fetchedProduct.brand_id, limit: 5 });
        setRelatedProducts(items.filter(p => p.id !== productId).slice(0, 4));

      } catch (err: any) {
        setError(err.message || 'Failed to load product details.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchProductData();
  }, [productId]);
  
  const handleQuantityChange = (change: number) => {
    setQuantity(prev => {
        const newQuantity = prev + change;
        if (newQuantity < 1) return 1;
        if (product && newQuantity > product.stock_quantity) return product.stock_quantity;
        return newQuantity;
    });
  };

  const handleAddToCart = () => {
    if (product) {
        addToCart(product, quantity);
        // We can add a more sophisticated notification system later
        alert(`${quantity} x ${product.name} added to cart!`);
    }
  };

  if (isLoading) return <div className="min-h-[60vh] flex items-center justify-center"><LoadingSpinner message="Loading product..." /></div>;
  if (error) return <div className="text-center text-red-500 py-10">{error}</div>;
  if (!product) return <div className="text-center text-gray-600 py-10">Product not found.</div>;

  const rating = 4.7; // Mock rating

  return (
    <div className="bg-white">
        <div className="container mx-auto px-4 py-8">
            {/* Breadcrumbs */}
            <nav className="text-sm mb-6 text-gray-500">
                <Link to="/home" className="hover:text-black">Home</Link>
                <span className="mx-2">/</span>
                <Link to="/products" className="hover:text-black">Products</Link>
                <span className="mx-2">/</span>
                <span className="text-black font-medium">{product.name}</span>
            </nav>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* Product Image */}
                <div className="aspect-[4/5] bg-gray-100 rounded-xl overflow-hidden">
                    <img 
                        src={product.image_url || `https://picsum.photos/seed/${product.id}/600/750`} 
                        alt={product.name} 
                        className="w-full h-full object-cover"
                    />
                </div>

                {/* Product Details */}
                <div>
                    <h1 className="text-3xl md:text-4xl font-extrabold text-black mb-3">{product.name}</h1>
                    <div className="flex items-center mb-4">
                        <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                                <Star key={i} className={`w-5 h-5 ${i < 4 ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
                            ))}
                        </div>
                        <span className="ml-2 text-sm text-gray-600">{rating}/5.0</span>
                    </div>

                    <p className="text-3xl font-bold text-black mb-6">
                        {DEFAULT_CURRENCY} {product.price.toLocaleString('id-ID')}
                    </p>

                    <div className="prose text-gray-600 mb-8">
                        <p>{product.description}</p>
                    </div>

                    {product.stock_quantity > 0 ? (
                        <>
                            <div className="flex items-center gap-4 mb-6">
                                <label className="font-semibold">Quantity:</label>
                                <div className="flex items-center border border-gray-300 rounded-full">
                                    <button onClick={() => handleQuantityChange(-1)} disabled={quantity <= 1} className="px-4 py-2 text-lg text-gray-700 hover:bg-gray-100 rounded-l-full transition">-</button>
                                    <input 
                                        type="text" 
                                        value={quantity} 
                                        readOnly
                                        className="w-12 text-center bg-transparent focus:outline-none py-1.5 font-bold text-black"
                                        aria-label="Quantity"
                                    />
                                    <button onClick={() => handleQuantityChange(1)} disabled={quantity >= product.stock_quantity} className="px-4 py-2 text-lg text-gray-700 hover:bg-gray-100 rounded-r-full transition">+</button>
                                </div>
                                <p className="text-sm text-green-600">({product.stock_quantity} available)</p>
                            </div>
                            <Button 
                                size="lg" 
                                variant="primary" 
                                className="w-full sm:w-auto"
                                leftIcon={<ShoppingCart />}
                                onClick={handleAddToCart}
                                isLoading={isCartLoading}
                            >
                                Add to Cart
                            </Button>
                        </>
                    ) : (
                        <div className="p-4 bg-gray-100 rounded-lg text-center">
                            <p className="font-bold text-xl text-red-600">Out of Stock</p>
                        </div>
                    )}
                    
                    <div className="mt-8 border-t pt-6">
                        <div className="flex items-center gap-3 text-green-700">
                            <ShieldCheck />
                            <span className="font-semibold">Official & Authentic Product Guarantee</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Related Products Section */}
            {relatedProducts.length > 0 && (
                <section className="mt-24">
                    <h2 className="text-2xl font-bold text-center mb-10">You Might Also Like</h2>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
                        {relatedProducts.map(p => <ProductCard key={p.id} product={p}/>)}
                    </div>
                </section>
            )}
        </div>
    </div>
  );
};

export default ProductDetailPage;