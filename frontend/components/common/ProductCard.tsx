import * as React from 'react';;
import { Link } from 'react-router-dom';
import { Product } from '../../types';
import { DEFAULT_CURRENCY } from '../../constants';
import Button from './Button';
import { useCart } from '../../contexts/CartContext';
import { ShoppingCart } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart, isLoading } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault(); 
    addToCart(product, 1);
  };

  const displayImage = 
    product.images?.find((img) => img.is_thumbnail)?.image_url || 
    product.images?.[0]?.image_url || 
    product.image_url || 
    `https://via.placeholder.com/400x500?text=${product.name}`;

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden group transition-all duration-300 hover:shadow-lg hover:-translate-y-1 border border-gray-100">
      <Link to={`/product/${product.id}`} className="block">
        <div className="aspect-[4/5] bg-gray-100 relative overflow-hidden">
          <img
            src={displayImage}
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
          <div className="mb-1">
             <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
               {product.brand?.name || 'Authentic'}
             </span>
          </div>
          <h3 className="font-bold text-gray-900 text-base mb-2 truncate" title={product.name}>
            {product.name}
          </h3>
          
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <span className="font-black text-lg text-black">
                {DEFAULT_CURRENCY} {product.price.toLocaleString('id-ID')}
              </span>
              <span className="text-xs text-gray-500 font-medium uppercase">
                Size: {product.size || '-'}
              </span>
            </div>

            <Button 
                size="sm" 
                variant="outline"
                onClick={handleAddToCart}
                disabled={isLoading || product.stock_quantity === 0}
                aria-label={`Add ${product.name} to cart`}
                className="!rounded-full !p-2.5 bg-gray-50 border-gray-200 hover:bg-black hover:text-white transition-all duration-300"
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