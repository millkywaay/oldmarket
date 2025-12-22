import React from "react";
import { User, Menu } from "lucide-react";

interface AdminNavbarProps {
  onMenuClick: () => void;
  isCollapsed: boolean;
}

const AdminNavbar: React.FC<AdminNavbarProps> = ({
  onMenuClick,
  isCollapsed,
}) => {
  return (
    <nav
      className={`
        bg-white border-b border-gray-200 h-16
        flex items-center justify-between px-6
        z-40
        relative
        lg:fixed lg:top-0 lg:right-0
        ${isCollapsed ? "lg:left-20" : "lg:left-64"}
        transition-all duration-300
      `}
    >
      {/* Left */}
      <div className="flex items-center">
        <button
          onClick={onMenuClick}
          className="p-2 mr-4 lg:hidden hover:bg-gray-100 rounded"
        >
          <Menu size={24} />
        </button>
      </div>

      {/* Right */}
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2 cursor-pointer p-2 hover:bg-gray-100 rounded-lg">
          <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white">
            <User size={18} />
          </div>
          <span className="text-sm font-medium text-gray-700 hidden sm:block">
            Admin
          </span>
        </div>
      </div>
    </nav>
  );
};

export default AdminNavbar;
