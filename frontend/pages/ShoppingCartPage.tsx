import * as React from 'react';;
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
        <p className="text-gray-600 mb-8">Looks like you haven't added any products yet.</p>
        <Button onClick={() => navigate('/products')} variant="primary" size="lg">Continue Shopping</Button>
      </div>
    );
  }

  const subtotal = getSelectedSubtotal();

  const handleInputChange = (productId: string, value: string, maxStock: number) => {
    const newQty = parseInt(value);
    if (!isNaN(newQty) && newQty > 0) {
      if (newQty <= maxStock) {
        updateCartItemQuantity(productId, newQty);
      } else {
        updateCartItemQuantity(productId, maxStock);
      }
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
        <nav className="text-sm mb-6 text-gray-500">
            <Link to="/home" className="hover:text-black">Home</Link>
            <span className="mx-2">/</span>
            <span className="text-black font-medium">Cart</span>
        </nav>

        <h1 className="text-3xl md:text-4xl font-extrabold text-black mb-8">Your Cart</h1>
      
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            <div className="lg:col-span-2 space-y-4">
              <div className="bg-white rounded-lg border border-gray-200 p-4 flex items-center shadow-sm">
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
                if (!item.product) return null;
                const isSelected = selectedProductIds.includes(item.product_id);
                const priceValue = Number(item.product.price);
                const currentQty = (item as any).qty || (item as any).quantity || 0;

                return (
                    <div key={item.product_id} className={`bg-white rounded-lg border p-4 flex flex-col sm:flex-row items-start gap-4 transition-all shadow-sm ${isSelected ? 'border-blue-600 ring-1 ring-blue-50' : 'border-gray-200 opacity-90'}`}>
                        <div className="flex items-center h-full pt-1">
                            <input
                                type="checkbox"
                                className="h-5 w-5 rounded border-gray-300 text-black focus:ring-black cursor-pointer"
                                checked={isSelected}
                                onChange={() => toggleProductSelection(item.product_id)}
                            />
                        </div>
                        
                        <div className="w-24 h-24 sm:w-32 sm:h-32 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden border">
                            <img 
                              src={item.product.image_url || 'https://via.placeholder.com/150'} 
                              alt={item.product.name} 
                              className="w-full h-full object-cover"
                            />
                        </div>

                        <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">{item.product.name}</h3>
                                    <p className="text-xs text-gray-500 mt-1 uppercase tracking-wider">
                                      {item.product.brand?.name || 'Original'}
                                    </p>
                                </div>
                                <button onClick={() => removeFromCart(item.product_id)} className="text-gray-400 hover:text-red-600 transition-colors p-1">
                                    <Trash2 className="h-5 w-5" />
                                </button>
                            </div>
                            <div className="flex items-center justify-between mt-6">
                                <span className="text-xl font-bold text-blue-600">
                                  {DEFAULT_CURRENCY} {priceValue.toLocaleString('id-ID')}
                                </span>
                                
                                <div className="flex items-center space-x-2 bg-gray-50 p-1 rounded-md border">
                                    {/* Tombol Minus: Jika qty 1, maka akan remove item */}
                                    <button 
                                        onClick={() => {
                                          if (currentQty > 1) {
                                            updateCartItemQuantity(item.product_id, currentQty - 1);
                                          } else {
                                            removeFromCart(item.product_id);
                                          }
                                        }} 
                                        className="p-1.5 rounded-md hover:bg-white hover:shadow-sm text-gray-600"
                                    >
                                        <Minus className="h-4 w-4" />
                                    </button>

                                    {/* Input Quantity Manual */}
                                    <input 
                                      type="number"
                                      value={currentQty}
                                      onChange={(e) => item.product && handleInputChange(item.product_id, e.target.value, item.product.stock_quantity)}
                                      className="w-12 text-center bg-transparent font-bold text-sm focus:outline-none border-x border-gray-200"
                                      min="1"
                                    />

                                    <button 
                                        onClick={() => updateCartItemQuantity(item.product_id, currentQty + 1)} 
                                        disabled={currentQty >= (item.product.stock_quantity || 999)} 
                                        className="p-1.5 rounded-md hover:bg-white hover:shadow-sm disabled:opacity-30 text-gray-600"
                                    >
                                        <Plus className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                );
              })}
            </div>

            {/* ORDER SUMMARY */}
            <div className="lg:col-span-1">
                <div className="bg-white rounded-lg border border-gray-200 p-6 sticky top-24 shadow-sm">
                    <h2 className="text-xl font-bold text-gray-900 mb-6 border-b pb-4">Order Summary</h2>
                    <div className="space-y-4">
                        <div className="pt-4 flex justify-between items-center">
                            <span className="text-lg font-bold text-gray-900">Total Price</span>
                            <span className="text-2xl font-black text-blue-600">
                              {DEFAULT_CURRENCY} {Number(subtotal).toLocaleString('id-ID')}
                            </span>
                        </div>
                        <p className="text-[10px] text-gray-400 mt-2">* Belum termasuk ongkos kirim</p>
                    </div>
                    
                    <Button 
                        onClick={() => navigate('/checkout')}
                        variant="primary" 
                        size="lg" 
                        className="w-full mt-8 h-14 rounded-md shadow-lg"
                        rightIcon={<ArrowRight size={20} />}
                        disabled={selectedItemCount === 0}
                    >
                        Checkout Now
                    </Button>
                </div>
            </div>
        </div>
    </div>
  );
};

export default ShoppingCartPage;