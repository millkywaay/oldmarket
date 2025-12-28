import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Package } from 'lucide-react';
import { Order, OrderStatus } from '../../types';
import { DEFAULT_CURRENCY } from '../../constants';

const OrdersTab: React.FC<{ orders: Order[] }> = ({ orders }) => {
  if (orders.length === 0) return (
    <div className="text-center py-10 bg-white rounded-xl border">
      <Package className="mx-auto text-gray-300 mb-3" size={48} />
      <p className="text-gray-500">Belum ada riwayat pesanan.</p>
    </div>
  );

  return (
    <div className="space-y-4">
      {orders.map((order) => (
        <Link key={order.id} to={`/order-confirmation/${order.id}`} className="block bg-white p-4 rounded-xl border border-gray-100 hover:border-black transition-all">
          <div className="flex justify-between items-start mb-3">
            <div>
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">ID PESANAN</span>
              <p className="font-mono text-sm">#{order.id.slice(0, 8)}</p>
            </div>
            <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${
              order.order_status === OrderStatus.PAID ? 'bg-green-100 text-green-700' : 'bg-gray-100'
            }`}>
              {order.order_status}
            </span>
          </div>
          <div className="flex justify-between items-end">
            <div>
              <p className="text-xs text-gray-500">{new Date(order.created_at).toLocaleDateString('id-ID', { dateStyle: 'long' })}</p>
              <p className="font-bold">{DEFAULT_CURRENCY} {order.total_amount.toLocaleString()}</p>
            </div>
            <div className="flex items-center text-sm font-bold">
              Detail <ChevronRight size={16} />
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default OrdersTab;