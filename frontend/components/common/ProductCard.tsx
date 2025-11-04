import React from 'react';
import { Link } from 'react-router-dom';
import { Product } from '../../types';
import { DEFAULT_CURRENCY } from '../../constants';
import Button from './Button';
import { useCart } from '../../contexts/CartContext';
import { Star, ShoppingCart } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart, isLoading } = useCart();
  const rating = Math.random() * 1.5 + 3.5; // Mock rating between 3.5 and 5.0

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent link navigation when clicking the button
    addToCart(product, 1);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden group transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
      <Link to={`/product/${product.id}`} className="block">
        <div className="aspect-[4/5] bg-gray-100 relative overflow-hidden">
          <img
            src={product.image_url || `https://picsum.photos/seed/${product.id}/400/500`}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
           {product.stock_quantity === 0 && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <span className="text-white font-bold text-lg">OUT OF STOCK</span>
            </div>
          )}
        </div>
        <div className="p-4">
          <h3 className="font-semibold text-gray-800 text-base mb-2 truncate" title={product.name}>{product.name}</h3>
          <div className="flex items-center mb-2">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-4 h-4 ${i < Math.floor(rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
              />
            ))}
            <span className="ml-2 text-sm text-gray-600">{rating.toFixed(1)}</span>
          </div>
          <div className="flex items-baseline justify-between">
            <div className="flex items-baseline gap-2">
              <span className="font-bold text-lg text-black">
                {DEFAULT_CURRENCY} {product.price.toLocaleString('id-ID')}
              </span>
              {/* Mock original price for sale items */}
              {product.price < 700000 && (
                 <span className="text-sm text-gray-500 line-through">
                    {DEFAULT_CURRENCY} {(product.price * 1.25).toLocaleString('id-ID')}
                </span>
              )}
            </div>
             <Button 
                size="sm" 
                variant="outline"
                onClick={handleAddToCart}
                disabled={isLoading || product.stock_quantity === 0}
                aria-label={`Add ${product.name} to cart`}
                className="!rounded-lg !p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            >
                <ShoppingCart size={18} />
            </Button>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;