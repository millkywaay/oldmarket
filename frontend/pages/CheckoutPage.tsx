
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import FormField from '../components/common/FormField';
import Button from '../components/common/Button';
import LoadingSpinner from '../components/common/LoadingSpinner';
import * as orderService from '../services/orderService';
import { DEFAULT_CURRENCY } from '../constants';
import { CreditCard, Truck } from 'lucide-react';

const CheckoutPage: React.FC = () => {
  const { 
    getSelectedCartItems, 
    getSelectedSubtotal, 
    removeSelectedItems, 
    selectedItemCount 
  } = useCart();
  const { user, token } = useAuth();
  const navigate = useNavigate();
  
  const selectedItems = getSelectedCartItems();

  const [shippingAddress, setShippingAddress] = useState(user ? `${user.username}\n123 Football Lane\nJersey City, 12345` : '');
  const [paymentMethod, setPaymentMethod] = useState('Manual Bank Transfer');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !token) { setError('You must be logged in to place an order.'); return; }
    if (selectedItemCount === 0) { setError('You have no items selected for checkout.'); navigate('/cart'); return; }
    if (!shippingAddress.trim()) { setError('Shipping address is required.'); return; }

    setIsProcessing(true);
    setError(null);

    try {
      const newOrder = await orderService.checkout(token, { shipping_address: shippingAddress, payment_method: paymentMethod });
      await removeSelectedItems();
      navigate(`/order-confirmation/${newOrder.id}`);
    } catch (err: any) {
      setError(err.message || 'Failed to place order. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  // Redirect if user lands here with no selected items.
  useEffect(() => {
    if (!isProcessing && selectedItemCount === 0) {
      navigate('/cart');
    }
  }, [selectedItemCount, isProcessing, navigate]);

  if (selectedItemCount === 0) {
    return <LoadingSpinner message="No items selected. Redirecting..." />;
  }

  const subtotal = getSelectedSubtotal();
  const shippingFee = subtotal > 500000 ? 0 : 25000;
  const total = subtotal + shippingFee;

  return (
    <div className="bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <nav className="text-sm mb-6 text-gray-500">
            <Link to="/home" className="hover:text-black">Home</Link>
            <span className="mx-2">/</span>
            <Link to="/cart" className="hover:text-black">Cart</Link>
            <span className="mx-2">/</span>
            <span className="text-black font-medium">Checkout</span>
        </nav>
        <h1 className="text-3xl md:text-4xl font-extrabold text-black mb-8 text-center">Checkout</h1>
        
        {error && <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg text-center">{error}</div>}

        <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Shipping and Payment Forms */}
          <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-sm border">
              <section className="mb-8">
                <h2 className="text-xl font-semibold text-gray-700 mb-4 flex items-center gap-2"><Truck size={20} /> Shipping Information</h2>
                <FormField
                  as="textarea"
                  label="Shipping Address"
                  name="shippingAddress"
                  value={shippingAddress}
                  onChange={(e) => setShippingAddress(e.target.value)}
                  rows={5}
                  placeholder="Enter your full shipping address..."
                  required
                  containerClassName="!mb-2"
                />
                 <p className="text-xs text-gray-500 mt-1">Shipping via Internal Courier only.</p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-gray-700 mb-4 flex items-center gap-2"><CreditCard size={20} /> Payment Method</h2>
                 <div className="space-y-3">
                    <label className={`flex items-center p-4 border rounded-lg cursor-pointer transition-all duration-200 ${paymentMethod === 'Manual Bank Transfer' ? 'border-black ring-2 ring-black' : 'border-gray-300 hover:border-gray-400'}`}>
                        <input type="radio" name="paymentMethod" value="Manual Bank Transfer" checked={paymentMethod === 'Manual Bank Transfer'} onChange={e => setPaymentMethod(e.target.value)} className="h-4 w-4 text-black focus:ring-black" />
                        <span className="ml-3 font-medium">Manual Bank Transfer</span>
                    </label>
                    <label className={`flex items-center p-4 border rounded-lg cursor-pointer transition-all duration-200 ${paymentMethod === 'Internal Courier COD' ? 'border-black ring-2 ring-black' : 'border-gray-300 hover:border-gray-400'}`}>
                        <input type="radio" name="paymentMethod" value="Internal Courier COD" checked={paymentMethod === 'Internal Courier COD'} onChange={e => setPaymentMethod(e.target.value)} className="h-4 w-4 text-black focus:ring-black" />
                        <span className="ml-3 font-medium">Cash on Delivery (COD)</span>
                    </label>
                </div>
              </section>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
             <div className="bg-white rounded-lg border border-gray-200 p-6 sticky top-24">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Your Order</h2>
                <div className="space-y-4 max-h-60 overflow-y-auto pr-2 mb-4">
                  {selectedItems.map(item => (
                    <div key={item.product_id} className="flex justify-between items-center text-sm">
                      <div className="flex items-center gap-2">
                        <img src={item.product?.image_url} alt={item.product?.name} className="w-12 h-12 object-cover rounded-md"/>
                        <div>
                           <p className="font-medium text-gray-800">{item.product?.name}</p>
                           <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                        </div>
                      </div>
                      <span className="font-mono">{DEFAULT_CURRENCY} {(item.product?.price || 0 * item.quantity).toLocaleString('id-ID')}</span>
                    </div>
                  ))}
                </div>
                <div className="border-t pt-4 space-y-2">
                   <div className="flex justify-between text-gray-600">
                      <span>Subtotal</span>
                      <span className="font-semibold">{DEFAULT_CURRENCY} {subtotal.toLocaleString('id-ID')}</span>
                   </div>
                   <div className="flex justify-between text-gray-600">
                      <span>Shipping</span>
                      <span className="font-semibold">{shippingFee > 0 ? `${DEFAULT_CURRENCY} ${shippingFee.toLocaleString('id-ID')}` : 'FREE'}</span>
                   </div>
                   <div className="flex justify-between font-bold text-lg text-gray-800 border-t pt-3 mt-3">
                      <span>Total</span>
                      <span>{DEFAULT_CURRENCY} {total.toLocaleString('id-ID')}</span>
                   </div>
                </div>
                <Button type="submit" variant="primary" size="lg" className="w-full mt-6" isLoading={isProcessing}>
                    Place Order
                </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CheckoutPage;
