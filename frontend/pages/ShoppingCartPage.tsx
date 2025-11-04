
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import Button from '../components/common/Button';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { DEFAULT_CURRENCY } from '../constants';
import { Minus, Plus, Trash2, ArrowRight } from 'lucide-react';

const ShoppingCartPage: React.FC = () => {
  const { 
    cartItems, 
    isLoading, 
    error, 
    updateCartItemQuantity, 
    removeFromCart, 
    getSelectedSubtotal, 
    totalItemCount, 
    selectedItemCount,
    selectedProductIds,
    toggleProductSelection,
    toggleSelectAll,
    areAllSelected
  } = useCart();
  const navigate = useNavigate();

  if (isLoading) return <div className="min-h-[60vh] flex items-center justify-center"><LoadingSpinner message="Loading your cart..." /></div>;
  if (error) return <div className="text-center text-red-500 py-10">{error}</div>;

  if (totalItemCount === 0) {
    return (
      <div className="text-center py-20 container mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Your Cart is Empty</h1>
        <p className="text-gray-600 mb-8">Looks like you haven't added any jerseys yet. Let's find some!</p>
        <Button onClick={() => navigate('/products')} variant="primary" size="lg">
          Continue Shopping
        </Button>
      </div>
    );
  }

  const subtotal = getSelectedSubtotal();
  const shippingFee = subtotal > 500000 || subtotal === 0 ? 0 : 25000;
  const total = subtotal + shippingFee;

  return (
    <div className="container mx-auto px-4 py-8">
       {/* Breadcrumbs */}
        <nav className="text-sm mb-6 text-gray-500">
            <Link to="/home" className="hover:text-black">Home</Link>
            <span className="mx-2">/</span>
            <span className="text-black font-medium">Cart</span>
        </nav>

        <h1 className="text-3xl md:text-4xl font-extrabold text-black mb-8">Your Cart</h1>
      
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            {/* Cart Items List */}
            <div className="lg:col-span-2 space-y-4">
              <div className="bg-white rounded-lg border border-gray-200 p-4 flex items-center">
                  <input
                    type="checkbox"
                    id="select-all"
                    className="h-5 w-5 rounded border-gray-300 text-black focus:ring-black cursor-pointer"
                    checked={areAllSelected}
                    onChange={toggleSelectAll}
                  />
                  <label htmlFor="select-all" className="ml-3 text-sm font-medium text-gray-700 cursor-pointer">
                    Select All ({totalItemCount} items)
                  </label>
              </div>

              {cartItems.map(item => {
                if (!item.product) return null; // Should not happen
                const isSelected = selectedProductIds.includes(item.product_id);
                return (
                    <div key={item.product_id} className={`bg-white rounded-lg border p-4 flex flex-col sm:flex-row items-start gap-4 transition-all ${isSelected ? 'border-gray-200' : 'border-gray-200 bg-gray-50 opacity-70'}`}>
                        <div className="flex items-center h-full pt-1">
                            <input
                                type="checkbox"
                                className="h-5 w-5 rounded border-gray-300 text-black focus:ring-black cursor-pointer"
                                checked={isSelected}
                                onChange={() => toggleProductSelection(item.product_id)}
                                aria-label={`Select ${item.product.name}`}
                            />
                        </div>
                        <div className="w-24 h-24 sm:w-32 sm:h-32 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden">
                            <img src={item.product.image_url} alt={item.product.name} className="w-full h-full object-cover"/>
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900">{item.product.name}</h3>
                                    <p className="text-sm text-gray-500 mt-1">Brand: {item.product.brand?.name || 'N/A'}</p>
                                </div>
                                <button onClick={() => removeFromCart(item.product_id)} className="text-red-500 hover:text-red-700 p-1" aria-label="Remove item">
                                    <Trash2 className="h-5 w-5" />
                                </button>
                            </div>
                            <div className="flex items-center justify-between mt-4">
                                <span className="text-xl font-bold text-gray-900">{DEFAULT_CURRENCY} {item.product.price.toLocaleString('id-ID')}</span>
                                <div className="flex items-center space-x-2">
                                    <button onClick={() => updateCartItemQuantity(item.product_id, item.quantity - 1)} disabled={item.quantity <= 1} className="p-1.5 rounded-full border border-gray-300 hover:bg-gray-50 disabled:opacity-50">
                                        <Minus className="h-4 w-4" />
                                    </button>
                                    <span className="w-10 text-center font-medium">{item.quantity}</span>
                                    <button onClick={() => updateCartItemQuantity(item.product_id, item.quantity + 1)} disabled={item.quantity >= item.product.stock_quantity} className="p-1.5 rounded-full border border-gray-300 hover:bg-gray-50 disabled:opacity-50">
                                        <Plus className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                );
              })}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
                <div className="bg-white rounded-lg border border-gray-200 p-6 sticky top-24">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Order Summary</h2>
                    <div className="space-y-3">
                        <div className="flex justify-between text-gray-600">
                            <span>Subtotal ({selectedItemCount} items)</span>
                            <span className="font-semibold">{DEFAULT_CURRENCY} {subtotal.toLocaleString('id-ID')}</span>
                        </div>
                         <div className="flex justify-between text-gray-600">
                            <span>Shipping Fee</span>
                            <span className="font-semibold">{shippingFee > 0 ? `${DEFAULT_CURRENCY} ${shippingFee.toLocaleString('id-ID')}` : 'FREE'}</span>
                        </div>
                        <hr className="my-3" />
                        <div className="flex justify-between text-lg font-semibold">
                            <span>Total</span>
                            <span className="font-bold">{DEFAULT_CURRENCY} {total.toLocaleString('id-ID')}</span>
                        </div>
                    </div>
                    
                    <Button 
                        onClick={() => navigate('/checkout')}
                        variant="primary" 
                        size="lg" 
                        className="w-full mt-6"
                        rightIcon={<ArrowRight size={20} />}
                        disabled={selectedItemCount === 0}
                        title={selectedItemCount === 0 ? 'Please select items to purchase' : 'Proceed to Checkout'}
                    >
                        Proceed to Checkout
                    </Button>
                </div>
            </div>
        </div>
    </div>
  );
};

export default ShoppingCartPage;
