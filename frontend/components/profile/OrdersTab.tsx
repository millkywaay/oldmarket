import React from 'react';
import { Link } from 'react-router-dom';
import { Package } from 'lucide-react';
import { Order } from '../../types';
import { DEFAULT_CURRENCY } from '../../constants';

const OrdersTab: React.FC<{ orders: Order[] }> = ({ orders }) => {
  if (orders.length === 0) return (
    <div className="text-center py-10 bg-white rounded-xl border border-gray-100">
      <Package className="mx-auto text-gray-300 mb-3" size={48} />
      <p className="text-gray-500">Belum ada riwayat pesanan.</p>
    </div>
  );
  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'PENDING_PAYMENT': return 'bg-yellow-100 text-yellow-600';
      case 'PAID': return 'bg-indigo-100 text-indigo-600';
      case 'DELIVERED': return 'bg-green-100 text-green-600';
      case 'CANCELED': return 'bg-red-100 text-red-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold mb-6">My Order History</h2>
      
      {orders.map((order) => (
        <div key={order.id} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <h3 className="font-bold text-lg text-gray-900">Order #{order.id}</h3>
              <p className="text-gray-500 text-sm">
                Date: {new Date(order.created_at).toLocaleDateString('en-GB')} 
              </p>
            </div>
            <span className={`px-4 py-1 rounded-full text-xs font-bold uppercase ${getStatusStyle(order.order_status)}`}>
              {order.order_status.replace('_', ' ')} 
            </span>
          </div>

          <div className="flex justify-between items-center mt-6">
            <p className="text-gray-900">
              Total : <span className="font-bold">{DEFAULT_CURRENCY} {order.total_amount.toLocaleString('id-ID')}</span> 
            </p>
            <Link 
              to={`/order-confirmation/${order.id}`} 
              className="text-gray-900 font-semibold flex items-center gap-1 hover:underline transition-all"
            >
              View Detail &gt;
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
};

export default OrdersTab;