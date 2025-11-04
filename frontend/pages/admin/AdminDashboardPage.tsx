import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AdminDashboardSummary, SalesDataPoint } from '../../types';
import * as adminService from '../../services/adminService';
import { useAuth } from '../../contexts/AuthContext';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import SalesChart from '../../components/admin/SalesChart';
import { DollarSign, ShoppingCart, Archive, AlertTriangle } from 'lucide-react';

const StatCard: React.FC<{ title: string; value: string | number; icon: React.ReactNode; linkTo?: string; colorClass: string }> = 
  ({ title, value, icon, linkTo, colorClass }) => (
  <div className={`p-6 rounded-xl shadow-md bg-white border-l-4 ${colorClass} transition-all duration-300 hover:shadow-xl hover:-translate-y-1`}>
    <div className="flex items-center justify-between mb-2">
      <h3 className="text-md font-semibold text-gray-600">{title}</h3>
      <div className="text-gray-400">{icon}</div>
    </div>
    <p className="text-3xl font-bold text-gray-800">{value}</p>
    {linkTo && <Link to={linkTo} className="text-sm text-blue-600 hover:underline mt-2 inline-block">View All &rarr;</Link>}
  </div>
);


const AdminDashboardPage: React.FC = () => {
  const { token } = useAuth();
  const [summary, setSummary] = useState<AdminDashboardSummary | null>(null);
  const [salesData, setSalesData] = useState<SalesDataPoint[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!token) { setIsLoading(false); return; }
      setIsLoading(true);
      setError(null);
      try {
        const [summaryData, reportData] = await Promise.all([
          adminService.getAdminDashboardSummary(token),
          adminService.getSalesReports(token),
        ]);
        setSummary(summaryData);
        setSalesData(reportData);
      } catch (err: any) {
        setError(err.message || 'Failed to load dashboard data.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [token]);

  if (isLoading) return <div className="min-h-[60vh] flex items-center justify-center"><LoadingSpinner message="Loading admin dashboard..." /></div>;
  if (error) return <div className="text-center text-red-500 py-10">{error}</div>;
  if (!summary) return <div className="text-center text-gray-600 py-10">No summary data available.</div>;

  return (
    <div className="space-y-8 p-4 md:p-6 bg-gray-100 min-h-full">
      <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>

      {/* Key Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Revenue" value={`IDR ${summary.totalRevenue.toLocaleString('id-ID')}`} icon={<DollarSign/>} colorClass="border-green-500" linkTo="/admin/reports" />
        <StatCard title="Total Orders" value={summary.totalOrders} icon={<ShoppingCart/>} colorClass="border-blue-500" linkTo="/admin/orders" />
        <StatCard title="Total Products" value={summary.totalProducts} icon={<Archive/>} colorClass="border-purple-500" linkTo="/admin/products" />
        <StatCard title="Low Stock Items" value={summary.lowStockItemsCount} icon={<AlertTriangle/>} colorClass="border-red-500" linkTo="/admin/products?filter=lowstock" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        <div className="lg:col-span-3">
            <SalesChart data={salesData} title="Monthly Sales Trend" type="line"/>
        </div>
        
        <div className="lg:col-span-2 space-y-6">
            <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-xl font-semibold text-gray-700 mb-4">Best Selling Products</h3>
                {summary.bestSellingProducts.length > 0 ? (
                <ul className="space-y-3">
                    {summary.bestSellingProducts.slice(0,5).map(p => (
                    <li key={p.product_id} className="flex justify-between items-center text-sm p-2 hover:bg-gray-50 rounded">
                        <Link to={`/product/${p.product_id}`} className="text-gray-800 hover:text-blue-600 truncate" title={p.name}>{p.name}</Link>
                        <span className="font-medium text-gray-600 bg-gray-100 px-2 py-0.5 rounded-full">{p.total_sold} sold</span>
                    </li>
                    ))}
                </ul>
                ) : <p className="text-gray-500">No sales data for best sellers yet.</p>}
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-xl font-semibold text-gray-700 mb-4">Quick Actions</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Link to="/admin/products" className="block p-4 text-center bg-black text-white rounded-lg hover:bg-gray-800 transition">Manage Products</Link>
                    <Link to="/admin/orders" className="block p-4 text-center bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">Manage Orders</Link>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardPage;