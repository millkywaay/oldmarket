import * as React from "react";
import { useEffect, useState, useCallback } from 'react';
import { Order, OrderStatus, PaginatedResponse } from '../../types';
import * as adminService from '../../services/adminService';
import { useAuth } from '../../contexts/AuthContext';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Button from '../../components/common/Button';
import { format } from 'date-fns';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { swalService } from '../../services/swalService';


interface OrderWithUser extends Order {
  user?: {
    name: string;
    email: string;
  };
}

const AdminOrderManagementPage: React.FC = () => {
  const { token } = useAuth();
  const [ordersResponse, setOrdersResponse] = useState<PaginatedResponse<OrderWithUser> | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<OrderStatus | ''>('');
  const [filterDate, setFilterDate] = useState<string>('');
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 10;

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'SHIPPED':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'PROCESSING':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'CANCELED':
        return 'bg-red-100 text-red-700 border-red-200';
      case 'PENDING_PAYMENT':
        return 'bg-gray-100 text-gray-700 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };
  const [isResiModalOpen, setIsResiModalOpen] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  const [trackingNumber, setTrackingNumber] = useState('');

  const fetchOrders = useCallback(async () => {
    if (!token) return;
    setIsLoading(true);
    try {
      const response = await adminService.getAllAdminOrders(token, { 
        status: filterStatus || undefined,
        date: filterDate || undefined,
        page: currentPage,
        limit: ordersPerPage
      });
      if (Array.isArray(response)) {
        setOrdersResponse({ items: response, total: response.length, page: 1, limit: 100 });
      } else {
        setOrdersResponse(response);
      }
    } catch (err: any) {
      console.error("Fetch error:", err.message);
    } finally {
      setIsLoading(false);
    }
  }, [token, filterStatus, filterDate, currentPage]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const handleStatusUpdate = async (orderId: string, newStatus: OrderStatus) => {
    if (newStatus === OrderStatus.SHIPPED) {
      setSelectedOrderId(orderId);
      setIsResiModalOpen(true);
    } else {
      const isConfirmed = await swalService.confirm("Update status?", "Anda yakin ingin mengubah status pesanan ini?");
      if (isConfirmed) {
        try {
          await adminService.updateOrderStatus(token!, orderId, { status: newStatus });
          swalService.toast("Status berhasil diubah!", "success");
          fetchOrders();
        } catch (err: any) {
          swalService.error("Gagal!", err.message || "Terjadi kesalahan pada database.");
        }
      };
    }
  };

  const submitResi = async () => {
    if (!trackingNumber || !selectedOrderId) {
      swalService.error("Gagal!", "Nomor resi wajib diisi!");
      return;
    }
    try {
      await adminService.updateOrderStatus(token!, selectedOrderId, { 
        status: OrderStatus.SHIPPED, 
        tracking_number: trackingNumber 
      });
      setIsResiModalOpen(false);
      setTrackingNumber('');
      fetchOrders();
      await swalService.success("Berhasil!", "Pesanan telah ditandai sebagai dikirim dengan nomor resi.");
    } catch (err: any) {
      swalService.error("Gagal!", err.message || "Terjadi kesalahan pada database.");
    }
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.text("Laporan Order Oldmarketjkt", 14, 15);
    const tableData = ordersResponse?.items.map(o => [
      `#${o.id}`,
      o.user?.name || `User ID: ${o.user_id}`,
      format(new Date(o.created_at), 'dd/MM/yyyy'),
      `Rp ${Number(o.total_amount).toLocaleString()}`,
      o.order_status
    ]) || [];

    autoTable(doc, {
      startY: 20,
      head: [['ID', 'Customer', 'Tanggal', 'Total', 'Status']],
      body: tableData,
    });
    doc.save(`Order_Report_${format(new Date(), 'yyyy-MM-dd')}.pdf`);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Manajemen Pesanan</h1>
          <p className="text-gray-500">Pantau dan kelola status pengiriman pelanggan.</p>
        </div>
        <Button onClick={exportPDF} className="bg-blue-600 hover:bg-back-700 text-white flex gap-2 items-center">
          <span>Export PDF</span>
        </Button>
      </div>

      {/* Filter Section */}
      <div className="bg-white p-4 rounded-lg shadow-sm mb-6 flex flex-wrap gap-4">
        <select 
          value={filterStatus} 
          onChange={(e) => setFilterStatus(e.target.value as OrderStatus)}
          className="border rounded-md px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Semua Status</option>
          {Object.values(OrderStatus).map(status => (
            <option key={status} value={status}>{status}</option>
          ))}
        </select>
        <input 
          type="date" 
          value={filterDate}
          onChange={(e) => setFilterDate(e.target.value)}
          className="border rounded-md px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20"><LoadingSpinner /></div>
      ) : (
       <div className="bg-white rounded-lg shadow overflow-x-auto border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tanggal</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase whitespace-nowrap">Aksi</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {ordersResponse?.items.map((order) => (
              <tr key={order.id} className="hover:bg-gray-50">
                <td className="px-4 py-4 text-sm font-medium whitespace-nowrap">#{order.id}</td>
                <td className="px-4 py-4 text-sm whitespace-nowrap">{order.user?.name || 'User'}</td>
                <td className="px-4 py-4 text-sm whitespace-nowrap">
                  {format(new Date(order.created_at), 'dd/MM/yy')}
                </td>
                <td className="px-4 py-4 text-sm font-bold whitespace-nowrap text-blue-600">
                  Rp {order.total_amount.toLocaleString()}
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 rounded-full text-[10px] font-bold border uppercase ${getStatusStyle(order.order_status)}`}>
                    {order.order_status}
                  </span>
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <select 
                    value={order.order_status}
                    onChange={(e) => handleStatusUpdate(order.id, e.target.value as OrderStatus)}
                    className="border text-xs p-1 rounded bg-white outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    {Object.values(OrderStatus).map(status => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      )}


      {/* Modal Input Resi */}
      {isResiModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Input Nomor Resi</h2>
            <p className="text-sm text-gray-600 mb-4">
              Masukkan nomor resi pengiriman untuk Order <strong>#{selectedOrderId}</strong> agar status berubah ke SHIPPED.
            </p>
            <input
              type="text"
              className="w-full border-2 border-gray-200 rounded-lg p-3 mb-6 focus:border-blue-500 outline-none transition-all"
              placeholder="Contoh: JNE123456789"
              value={trackingNumber}
              onChange={(e) => setTrackingNumber(e.target.value)}
              autoFocus
            />
            <div className="flex justify-end gap-3">
              <Button onClick={() => { setIsResiModalOpen(false); setTrackingNumber(''); }} variant="outline">Batal</Button>
              <Button onClick={submitResi} className="bg-blue-600 text-white px-6 hover:bg-blue-700">Kirim Barang</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrderManagementPage;