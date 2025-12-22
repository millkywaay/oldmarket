import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";
import AdminNavbar from "./AdminNavbar";

const AdminLayout: React.FC = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-100 overflow-hidden">

      {/* ===== SIDEBAR DESKTOP ===== */}
      <div className="hidden lg:block">
        <AdminSidebar
          isCollapsed={isCollapsed}
          setIsCollapsed={setIsCollapsed}
        />
      </div>

      {/* ===== SIDEBAR MOBILE (INI YANG KAMU TANYA) ===== */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setIsMobileOpen(false)}
          />

          {/* Sidebar */}
          <div className="relative w-64 h-full bg-gray-200 shadow-xl">
            <AdminSidebar
              isCollapsed={false}
              setIsCollapsed={() => setIsMobileOpen(false)}
            />
          </div>
        </div>
      )}

      {/* ===== MAIN AREA ===== */}
      <div
        className={`
          transition-all duration-300
          ${isCollapsed ? "lg:ml-20" : "lg:ml-64"}
        `}
      >
        <AdminNavbar
          onMenuClick={() => setIsMobileOpen(true)}
          isCollapsed={isCollapsed}
        />

        <main className="p-6 lg:pt-20 overflow-y-auto h-screen">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
