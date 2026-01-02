import React, { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { Order } from "../types";
import * as orderService from "../services/orderService";
import * as addressService from "../services/addressService";
import LoadingSpinner from "../components/common/LoadingSpinner";
import { User, ShoppingBag, LogOut, MapPin } from "lucide-react";
import ProfileTab from "../components/profile/ProfileTab";
import OrdersTab from "../components/profile/OrdersTab";
import AddressTab from "../components/profile/AddressTab";

const UserProfilePage: React.FC = () => {
  const { user, token, logout, checkAuth} = useAuth();
  const [activeTab, setActiveTab] = useState("profile");
  const [orders, setOrders] = useState<Order[]>([]);
  const [addresses, setAddresses] = useState<any[]>([]);

  const fetchOrders = async () => {
    if (!token || !user) return;
    try {
      const data = await orderService.getMyOrders(token);
      setOrders(data);
    } catch (err) { console.error(err); }
  };

  const fetchAddresses = async () => {
    try {
      const data = await addressService.getMyAddresses();
      setAddresses(data);
    } catch (err) { console.error(err); }
  };

  useEffect(() => {
    if (activeTab === 'orders') fetchOrders();
    if (activeTab === 'addresses') fetchAddresses();
  }, [activeTab]);

  if (!user) return <LoadingSpinner message="Loading profile..." />;

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar */}
        <div className="w-full md:w-64 space-y-2">
           <button onClick={() => setActiveTab("profile")} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === "profile" ? "bg-black text-white" : "hover:bg-gray-100"}`}>
             <User size={18}/> Profil
           </button>
           <button onClick={() => setActiveTab("addresses")} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === "addresses" ? "bg-black text-white" : "hover:bg-gray-100"}`}>
             <MapPin size={18}/> Alamat
           </button>
           <button onClick={() => setActiveTab("orders")} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeTab === "orders" ? "bg-black text-white" : "hover:bg-gray-100"}`}>
             <ShoppingBag size={18}/> Pesanan
           </button>
           <button onClick={logout} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 mt-4">
             <LogOut size={18}/> Logout
           </button>
        </div>

        {/* Content */}
        <div className="flex-1">
          {activeTab === "profile" && <ProfileTab user={user} checkAuth={checkAuth} />}
          {activeTab === "orders" && <OrdersTab orders={orders} />}
          {activeTab === "addresses" && <AddressTab addresses={addresses} fetchAddresses={fetchAddresses} />}
        </div>
      </div>
    </div>
  );
};

export default UserProfilePage;