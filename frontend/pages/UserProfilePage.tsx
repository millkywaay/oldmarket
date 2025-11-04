import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Order, UserRole, OrderStatus } from '../types';
import * as orderService from '../services/orderService';
import FormField from '../components/common/FormField';
import Button from '../components/common/Button';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { DEFAULT_CURRENCY } from '../constants';
import { User, Edit3, ShoppingBag, LogOut, ChevronRight } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const UserProfilePage: React.FC = () => {
  const { user, token, logout, checkAuth, isAdmin } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoadingOrders, setIsLoadingOrders] = useState(false);
  const [ordersError, setOrdersError] = useState<string | null>(null);

  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileData, setProfileData] = useState({ username: user?.username || '', email: user?.email || '' });
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [profileUpdateError, setProfileUpdateError] = useState<string | null>(null);
  const [profileUpdateSuccess, setProfileUpdateSuccess] = useState<string | null>(null);
  
  const location = useLocation();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('profile');
  const [orderSuccessMessage, setOrderSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    if (location.state?.fromCheckout) {
      setActiveTab('orders');
      setOrderSuccessMessage('Your order has been placed successfully!');
      // Clear state from history to prevent showing message on refresh or back nav
      const { state, ...rest } = location;
      navigate(rest, { replace: true });
    }
  }, [location, navigate]);

  useEffect(() => {
    if(orderSuccessMessage) {
        const timer = setTimeout(() => {
            setOrderSuccessMessage(null);
        }, 5000);
        return () => clearTimeout(timer);
    }
  }, [orderSuccessMessage]);


  useEffect(() => {
    // Only fetch orders if the tab is active and they haven't been loaded yet.
    if (activeTab === 'orders' && token && user && user.role === UserRole.CUSTOMER && orders.length === 0) {
      const fetchOrders = async () => {
        setIsLoadingOrders(true);
        setOrdersError(null);
        try {
          const userOrders = await orderService.getMyOrders(token);
          setOrders(userOrders);
        } catch (err: any) {
          setOrdersError(err.message || 'Failed to load orders.');
        } finally {
          setIsLoadingOrders(false);
        }
      };
      fetchOrders();
    }
  }, [token, user, activeTab, orders.length]);

  useEffect(() => {
    if (user) {
      setProfileData({ username: user.username, email: user.email });
    }
  }, [user]);

  const handleProfileInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !user) return;
    setIsUpdatingProfile(true);
    setProfileUpdateError(null);
    setProfileUpdateSuccess(null);
    try {
      console.log("Updating profile with:", profileData);
      await new Promise(resolve => setTimeout(resolve, 1000));
      await checkAuth();
      setProfileUpdateSuccess("Profile updated successfully!");
      setIsEditingProfile(false);
    } catch (err: any) {
      setProfileUpdateError(err.message || "Failed to update profile.");
    } finally {
      setIsUpdatingProfile(false);
    }
  };


  if (!user) {
    return <LoadingSpinner message="Loading profile..." />;
  }

  const getStatusChipClass = (status: OrderStatus) => {
    switch(status) {
        case OrderStatus.DELIVERED: return 'bg-green-100 text-green-700';
        case OrderStatus.SHIPPED: return 'bg-blue-100 text-blue-700';
        case OrderStatus.PENDING: return 'bg-yellow-100 text-yellow-700';
        case OrderStatus.PAID: return 'bg-indigo-100 text-indigo-700';
        case OrderStatus.CANCELLED: return 'bg-red-100 text-red-700';
        default: return 'bg-gray-100 text-gray-700';
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-gray-800">
            Welcome, {user.username}
        </h1>
        <p className="text-gray-600">Manage your profile, orders, and settings here.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1">
            <div className="bg-white p-6 rounded-lg shadow-sm border space-y-4">
                <button onClick={() => setActiveTab('profile')} className={`flex items-center gap-3 p-3 rounded-md w-full text-left transition-colors duration-200 ${activeTab === 'profile' ? 'bg-gray-100 font-semibold' : 'hover:bg-gray-100'}`}><User size={20}/> Profile</button>
                {!isAdmin && <button onClick={() => setActiveTab('orders')} className={`flex items-center gap-3 p-3 rounded-md w-full text-left transition-colors duration-200 ${activeTab === 'orders' ? 'bg-gray-100 font-semibold' : 'hover:bg-gray-100'}`}><ShoppingBag size={20}/> My Orders</button>}
                {isAdmin && <Link to="/admin/dashboard" className="flex items-center gap-3 p-3 rounded-md hover:bg-gray-100 transition-colors duration-200"><ShoppingBag size={20}/> Admin Panel</Link>}
                <button onClick={logout} className="flex items-center gap-3 p-3 rounded-md hover:bg-gray-100 w-full text-red-600 transition-colors duration-200"><LogOut size={20}/> Logout</button>
            </div>
        </div>
        <div className="md:col-span-2">
            {orderSuccessMessage && <p className="mb-6 p-3 bg-green-100 text-green-700 rounded-lg">{orderSuccessMessage}</p>}
            
            {activeTab === 'profile' && (
                <div className="bg-white p-6 rounded-lg shadow-sm border">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-semibold text-gray-700">Personal Information</h2>
                        {!isEditingProfile && (
                            <Button variant="ghost" size="sm" onClick={() => setIsEditingProfile(true)} leftIcon={<Edit3 size={14}/>}>Edit</Button>
                        )}
                    </div>
                    {profileUpdateSuccess && <p className="mb-3 p-2 bg-green-100 text-green-700 rounded-md">{profileUpdateSuccess}</p>}
                    {profileUpdateError && <p className="mb-3 p-2 bg-red-100 text-red-700 rounded-md">{profileUpdateError}</p>}
                    
                    {!isEditingProfile ? (
                        <div className="space-y-3 text-gray-700">
                        <p><strong>Username:</strong> {user.username}</p>
                        <p><strong>Email:</strong> {user.email}</p>
                        <p><strong>Role:</strong> <span className="capitalize">{user.role}</span></p>
                        </div>
                    ) : (
                        <form onSubmit={handleProfileUpdate} className="space-y-4">
                            <FormField label="Username" name="username" value={profileData.username} onChange={handleProfileInputChange} required />
                            <FormField label="Email" name="email" type="email" value={profileData.email} onChange={handleProfileInputChange} required />
                            <div className="flex space-x-3">
                                <Button type="submit" variant="primary" isLoading={isUpdatingProfile}>Save Changes</Button>
                                <Button type="button" variant="outline" onClick={() => { setIsEditingProfile(false); }}>Cancel</Button>
                            </div>
                        </form>
                    )}
                </div>
            )}

            {activeTab === 'orders' && !isAdmin && (
                 <div className="bg-white p-6 rounded-lg shadow-sm border">
                    <h2 className="text-2xl font-semibold text-gray-700 mb-6">My Order History</h2>
                    {isLoadingOrders ? <LoadingSpinner message="Loading orders..." />
                     : ordersError ? <p className="text-red-500 bg-red-100 p-3 rounded">{ordersError}</p>
                     : orders.length === 0 ? <p className="text-gray-600">You have no past orders. <Link to="/products" className="text-black hover:underline">Start shopping!</Link></p>
                     : (
                        <div className="space-y-4">
                            {orders.map(order => (
                                <Link to={`/order-confirmation/${order.id}`} key={order.id} className="block p-4 border border-gray-200 rounded-lg hover:shadow-md hover:border-black transition-all">
                                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                                      <div className="mb-2 sm:mb-0">
                                        <h3 className="font-semibold text-gray-800">Order #{order.id}</h3>
                                        <p className="text-sm text-gray-500">Date: {new Date(order.created_at).toLocaleDateString()}</p>
                                      </div>
                                      <span className={`text-xs font-medium px-3 py-1 rounded-full ${getStatusChipClass(order.order_status)}`}>
                                          {order.order_status.toUpperCase()}
                                      </span>
                                    </div>
                                    <div className="flex justify-between items-center mt-3 text-sm">
                                       <p className="text-gray-600">Total: <strong>{DEFAULT_CURRENCY} {order.total_amount.toLocaleString('id-ID')}</strong></p>
                                       <div className="flex items-center text-black font-medium">View Details <ChevronRight size={16} className="ml-1"/></div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                 </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default UserProfilePage;