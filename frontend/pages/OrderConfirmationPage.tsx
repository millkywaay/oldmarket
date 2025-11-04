
import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Order } from '../types';
import * as orderService from '../services/orderService';
import { useAuth } from '../contexts/AuthContext';
import LoadingSpinner from '../components/common/LoadingSpinner';
import Button from '../components/common/Button';
import { DEFAULT_CURRENCY } from '../constants';
import { CheckCircle2, ShoppingBag } from 'lucide-react';

const OrderConfirmationPage: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const { token } = useAuth();
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!orderId || !token) {
      setError('Order ID or authentication token is missing.');
      setIsLoading(false);
      return;
    }
    const fetchOrder = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const fetchedOrder = await orderService.getOrderById(token, orderId);
        setOrder(fetchedOrder);
      } catch (err: any) {
        setError(err.message || 'Failed to load order details.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchOrder();
  }, [orderId, token]);

  if (isLoading) return <div className="min-h-[60vh] flex items-center justify-center"><LoadingSpinner message="Loading your order confirmation..." /></div>;
  if (error) return <div className="text-center text-red-500 py-10 bg-white p-8 rounded-lg shadow-xl max-w-2xl mx-auto">{error}</div>;
  if (!order) return <div className="text-center text-gray-600 py-10 bg-white p-8 rounded-lg shadow-xl max-w-2xl mx-auto">Order details not found.</div>;

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="bg-white p-8 md:p-12 rounded-xl shadow-lg max-w-4xl mx-auto border">
        <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-green-100 mb-6">
                <CheckCircle2 className="h-12 w-12 text-green-600" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-3">Thank You For Your Order!</h1>
            <p className="text-gray-600 text-lg mb-8">Your order <span className="font-semibold text-black">#{order.id}</span> has been placed successfully.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div className="text-left bg-gray-50 p-6 rounded-lg border border-gray-200">
                <h2 className="text-xl font-semibold text-gray-700 mb-4">Order Summary</h2>
                <div className="space-y-3">
                    <div className="flex justify-between"><span className="text-gray-600">Order Date:</span> <strong>{new Date(order.created_at).toLocaleDateString()}</strong></div>
                    <div className="flex justify-between"><span className="text-gray-600">Shipping Address:</span> <strong className="text-right">{order.shipping_address}</strong></div>
                    <div className="flex justify-between"><span className="text-gray-600">Payment Method:</span> <strong>{order.payment_method}</strong></div>
                    <div className="flex justify-between"><span className="text-gray-600">Order Status:</span> <strong className="capitalize">{order.order_status}</strong></div>
                    <div className="flex justify-between text-lg border-t pt-3 mt-3"><span className="font-semibold">Total Amount:</span> <strong className="font-bold">{DEFAULT_CURRENCY} {order.total_amount.toLocaleString('id-ID')}</strong></div>
                </div>
            </div>
            <div className="text-left bg-gray-50 p-6 rounded-lg border border-gray-200">
                <h2 className="text-xl font-semibold text-gray-700 mb-4 flex items-center gap-2"><ShoppingBag size={20}/> Items Ordered</h2>
                <div className="space-y-4 max-h-60 overflow-y-auto pr-2">
                    {order.items.map(item => (
                        <div key={item.id} className="flex items-center gap-4">
                            <img src={item.product?.image_url} alt={item.product?.name} className="w-16 h-20 object-cover rounded-md bg-gray-200" />
                            <div className="flex-grow">
                                <p className="font-semibold text-gray-800">{item.product?.name}</p>
                                <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                            </div>
                            <p className="text-sm font-semibold text-gray-700">{DEFAULT_CURRENCY} {(item.price_at_purchase * item.quantity).toLocaleString('id-ID')}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>

        {order.payment_method === 'Manual Bank Transfer' && (
            <div className="mb-8 p-4 bg-blue-50 border border-blue-200 rounded-md">
                <h3 className="font-semibold text-blue-800">Payment Instructions:</h3>
                <p className="text-sm text-blue-700 mt-1">Please transfer the total amount to Bank XYZ, Account No: 123-456-7890, Name: JER.CO Store. Include your order number #{order.id} in the transfer description.</p>
            </div>
        )}
        
        <p className="text-gray-500 text-sm mb-8 text-center">You will receive an email confirmation shortly. If you have any questions, please contact our customer support.</p>
        
        <div className="space-y-3 sm:space-y-0 sm:flex sm:justify-center sm:space-x-4">
          <Button onClick={() => navigate('/products')} variant="primary" size="lg">
            Continue Shopping
          </Button>
          <Button onClick={() => navigate('/profile')} variant="outline" size="lg">
            View My Orders
          </Button>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmationPage;
