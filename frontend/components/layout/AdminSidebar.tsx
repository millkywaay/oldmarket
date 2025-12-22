import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  BarChart3,
  LogOut,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

interface SidebarProps {
  isCollapsed: boolean;
  setIsCollapsed: (value: boolean) => void;
}

const AdminSidebar: React.FC<SidebarProps> = ({
  isCollapsed,
  setIsCollapsed,
}) => {
  const location = useLocation();

  const menuItems = [
    { path: "/admin/dashboard", icon: <LayoutDashboard size={20} />, label: "Dashboard" },
    { path: "/admin/products", icon: <Package size={20} />, label: "Product" },
    { path: "/admin/orders", icon: <ShoppingCart size={20} />, label: "Orders" },
    { path: "/admin/reports", icon: <BarChart3 size={20} />, label: "Reports" },
  ];

  return (
    <aside
      className={`
        bg-gray-200 text-gray-700
        flex flex-col
        fixed top-0 left-0 z-30
        h-screen
        transition-all duration-300
        ${isCollapsed ? "w-20" : "w-64"}
      `}
    >
      {/* Header */}
      <div className="p-4 flex items-center justify-between">
        {!isCollapsed && (
          <h2 className="text-lg font-bold truncate">OLDMARKET.JKT</h2>
        )}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-1 rounded hover:bg-gray-300 transition"
        >
          {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>

      {/* Menu */}
      <nav className="flex-grow p-4 space-y-2">
        {menuItems.map((item) => {
          const active = location.pathname === item.path;

          return (
            <Link
              key={item.path}
              to={item.path}
              className={`
                flex items-center gap-3 p-3 rounded-lg transition
                ${active ? "bg-gray-300 text-black font-semibold" : "hover:bg-gray-300"}
              `}
            >
              {item.icon}
              {!isCollapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="p-2">
        <Link
          to="/home"
          className="flex items-center gap-3 p-3 rounded-lg text-red-600 hover:bg-red-100 transition"
        >
          <LogOut size={20} />
          {!isCollapsed && <span>Logout</span>}
        </Link>
      </div>
    </aside>
  );
};

export default AdminSidebar;
