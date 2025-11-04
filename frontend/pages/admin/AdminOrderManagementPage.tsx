import React, { useEffect, useState, useCallback } from 'react';
import { Order, OrderStatus, PaginatedResponse } from '../../types';
import * as adminService from '../../services/adminService';
import { useAuth } from '../../contexts/AuthContext';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Button from '../../components/common/Button';
import { DEFAULT_CURRENCY } from '../../constants';
import { Link } from 'react-router-dom';

const AdminOrderManagementPage: React.FC = () => {
  const { token } = useAuth();
  const [ordersResponse, setOrdersResponse] = useState<PaginatedResponse<Order> | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [filterStatus, setFilterStatus] = useState<OrderStatus | ''>('');
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 10;

  const fetchOrders = useCallback(async () => {
    if (!token) return;
    setIsLoading(true);
    setError(null);
    try {
      const response = await adminService.getAllAdminOrders(token, { 
        status: filterStatus || undefined,
        page: currentPage,
        limit: ordersPerPage
      });
      setOrdersResponse(response);
    } catch (err: any) {
      setError(err.message || 'Failed to load orders.');
    } finally {
      setIsLoading(false);
    }
  }, [token, filterStatus, currentPage]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const handleStatusChange = async (orderId: string, newStatus: OrderStatus) => {
    if (!token) return;
    try {
      await adminService.updateOrderStatus(token, orderId, newStatus);
      fetchOrders();
    } catch (err: any) {
      setError(err.message || 'Failed to update order status.');
    }
  };
  
  const getStatusChipClass = (status: OrderStatus) => {
    const baseClass = "text-xs font-medium px-2.5 py-1 rounded-full";
    switch(status) {
        case OrderStatus.DELIVERED: return `${baseClass} bg-green-100 text-green-800`;
        case OrderStatus.SHIPPED: return `${baseClass} bg-blue-100 text-blue-800`;
        case OrderStatus.PENDING: return `${baseClass} bg-yellow-100 text-yellow-800`;
        case OrderStatus.PAID: return `${baseClass} bg-indigo-100 text-indigo-800`;
        case OrderStatus.CANCELLED: return `${baseClass} bg-red-100 text-red-800`;
        default: return `${baseClass} bg-gray-100 text-gray-800`;
    }
  }

  const totalPages = ordersResponse ? Math.ceil(ordersResponse.total / ordersPerPage) : 1;
  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) setCurrentPage(newPage);
  };

  const orders = ordersResponse?.items || [];

  return (
    <div className="space-y-6 p-4 md:p-6 bg-gray-100 min-h-full">
      <h1 className="text-3xl font-bold text-gray-800">Order Management</h1>

      {error && <p className="text-red-500 bg-red-100 p-3 rounded-md">{error}</p>}

      <div className="p-4 bg-white rounded-lg shadow-sm flex items-center gap-4">
        <label htmlFor="status-filter" className="font-medium text-sm">Filter by Status:</label>
        <select
          id="status-filter"
          value={filterStatus}
          onChange={(e) => {setFilterStatus(e.target.value as OrderStatus | ''); setCurrentPage(1);}}
          className="border border-gray-300 rounded-md px-3 py-1.5 text-sm focus:ring-black focus:border-black"
        >
          <option value="">All Statuses</option>
          {Object.values(OrderStatus).map(status => (
            <option key={status} value={status}>{status.charAt(0).toUpperCase() + status.slice(1)}</option>
          ))}
        </select>
      </div>

      {isLoading ? <LoadingSpinner message="Fetching orders..." /> :
       !isLoading && orders.length === 0 ? <p className="text-gray-600 text-center py-10">No orders found matching your criteria.</p> : (
        <div className="bg-white shadow-md rounded-lg overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Update Status</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {orders.map(order => (
                <tr key={order.id} className="hover:bg-gray-50 transition-colors duration-150">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      <Link to={`/order-confirmation/${order.id}`} className="hover:underline">#{order.id}</Link>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.user_id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(order.created_at).toLocaleDateString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{DEFAULT_CURRENCY} {order.total_amount.toLocaleString('id-ID')}</td>
                  <td className="px-6 py-4 whitespace-nowrap"><span className={getStatusChipClass(order.order_status)}>{order.order_status.toUpperCase()}</span></td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                     <select
                        name={`status-${order.id}`}
                        value={order.order_status}
                        onChange={(e) => handleStatusChange(order.id, e.target.value as OrderStatus)}
                        className="text-xs p-1.5 rounded-md border-gray-300 focus:ring-black focus:border-black"
                        aria-label={`Update status for order ${order.id}`}
                      >
                        {Object.values(OrderStatus).map(status => (
                          <option key={status} value={status}>{status.charAt(0).toUpperCase() + status.slice(1)}</option>
                        ))}
                      </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      
      {ordersResponse && ordersResponse.total > ordersPerPage && !isLoading && (
        <div className="mt-8 flex justify-center items-center gap-2">
            <Button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} variant="outline" size="md" className="!rounded-md">Previous</Button>
            <span className="text-sm text-gray-600">Page {currentPage} of {totalPages}</span>
            <Button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} variant="outline" size="md" className="!rounded-md">Next</Button>
        </div>
      )}
    </div>
  );
};

export default AdminOrderManagementPage;