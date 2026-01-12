import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import * as adminService from "../../services/adminService";
import { useAuth } from "../../contexts/AuthContext";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import {
  DollarSign,
  ShoppingCart,
  Package,
  AlertTriangle,
  Clock,
  Award,
  ChevronRight,
  User,
} from "lucide-react";

const AdminDashboardPage: React.FC = () => {
  const { token } = useAuth();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState("month");

  useEffect(() => {
    const fetchDashboard = async () => {
      setLoading(true);
      try {
        const res = await adminService.getDashboardSummary(token!, timeRange);
        setData(res);
      } catch (err) {
        console.error("Dashboard Error:", err);
      } finally {
        setLoading(false);
      }
    };
    if (token) fetchDashboard();
  }, [token, timeRange]);

  if (loading || !data) return <LoadingSpinner />;

  return (
    <div className="p-6 bg-[#F8F9FB] min-h-screen space-y-8">
      {/* Header & Filter */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-extrabold text-[#1A1C21]">
          Dashboard Overview
        </h1>
        <select
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
          className="bg-white border border-gray-200 text-sm font-semibold rounded-lg px-4 py-2 shadow-sm outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="day">Hari Ini</option>
          <option value="week">7 Hari Terakhir</option>
          <option value="month">30 Hari Terakhir</option>
          <option value="year">Tahun Ini</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        {/* Revenue Card dibuat col-span-2 agar angka besar muat */}
        <div className="lg:col-span-2">
          <StatCard
            title="Revenue"
            value={`Rp ${data.totalRevenue.toLocaleString("id-ID")}`}
            icon={<DollarSign size={28} />}
            color="text-emerald-600"
            bg="bg-emerald-50"
          />
        </div>

        <StatCard
          title="Orders"
          value={data.totalOrders}
          icon={<ShoppingCart size={24} />}
          color="text-blue-600"
          bg="bg-blue-50"
        />
        <StatCard
          title="Products"
          value={data.totalProducts}
          icon={<Package size={24} />}
          color="text-violet-600"
          bg="bg-violet-50"
        />
        <StatCard
          title="Low Stock"
          value={data.lowStockCount}
          icon={<AlertTriangle size={24} />}
          color={data.lowStockCount > 0 ? "text-red-600" : "text-gray-400"}
          bg={data.lowStockCount > 0 ? "bg-red-50" : "bg-gray-100"}
          isAlert={data.lowStockCount > 0}
          linkTo="/admin/products"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-50 flex justify-between items-center">
            <h3 className="font-bold text-gray-800 flex items-center gap-2">
              <Clock size={18} className="text-blue-500" /> Recent Orders
            </h3>
            <Link
              to="/admin/orders"
              className="text-sm text-blue-600 font-semibold hover:underline"
            >
              View All
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[600px]">
              {/* min-w-[600px] memastikan tabel tetap memiliki lebar minimum saat layar mengecil */}
              <thead className="bg-gray-50/50 text-gray-400 font-medium">
                <tr>
                  <th className="px-6 py-4 text-left">Customer</th>
                  <th className="px-6 py-4 text-left">Date</th>
                  <th className="px-6 py-4 text-right">Amount</th>
                  <th className="px-6 py-4 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {data.recentOrders?.map((order: any) => (
                  <tr
                    key={order.id}
                    className="hover:bg-gray-50/50 transition-colors"
                  >
                    <td className="px-6 py-4 font-semibold text-gray-700 flex items-center gap-2 whitespace-nowrap">
                      <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                        <User size={14} />
                      </div>
                      {order.customer}
                    </td>
                    <td className="px-6 py-4 text-gray-500 whitespace-nowrap">
                      {new Date(order.date).toLocaleDateString("id-ID")}
                    </td>
                    <td className="px-6 py-4 text-right font-bold text-gray-800 whitespace-nowrap">
                      Rp {order.amount.toLocaleString("id-ID")}
                    </td>
                    <td className="px-6 py-4 text-center whitespace-nowrap">
                      <span
                        className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${
                          order.status === "COMPLETED"
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-orange-100 text-orange-700"
                        }`}
                      >
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h3 className="font-bold text-gray-800 mb-6 flex items-center gap-2">
            <Award size={18} className="text-orange-500" /> Best Sellers
          </h3>
          <div className="space-y-6">
            {data.bestSellingProducts?.map((product: any, i: number) => (
              <div key={i} className="flex items-center gap-4 group">
                <div className="w-12 h-12 rounded-lg bg-gray-100 overflow-hidden border border-gray-50 flex-shrink-0">
                  {product.image ? (
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-300">
                      <Package size={20} />
                    </div>
                  )}
                </div>
                <div className="flex-grow min-w-0">
                  <h4 className="text-sm font-bold text-gray-800 truncate">
                    {product.name}
                  </h4>
                  <p className="text-xs text-gray-400 font-medium">
                    {product.total_sold} terjual
                  </p>
                </div>
                <ChevronRight
                  size={16}
                  className="text-gray-300 group-hover:text-blue-500 transition-colors"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, icon, color, bg, isAlert, linkTo }: any) => (
  <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 relative overflow-hidden h-full transition-transform hover:-translate-y-1">
    {isAlert && (
      <div className="absolute top-4 right-4">
        <span className="relative flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-red-600"></span>
        </span>
      </div>
    )}

    <div className="flex items-center gap-5">
      <div className={`p-4 rounded-2xl ${bg} ${color}`}>{icon}</div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-gray-400 truncate">{title}</p>
        <h3
          className={`text-2xl font-black truncate ${
            isAlert ? "text-red-600" : "text-gray-800"
          }`}
        >
          {value}
        </h3>
        {linkTo && (
          <Link
            to={linkTo}
            className="text-[10px] font-bold uppercase mt-1 block text-blue-500 hover:underline"
          >
            Manage &rarr;
          </Link>
        )}
      </div>
    </div>
  </div>
);

export default AdminDashboardPage;
