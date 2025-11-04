import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import HomePage from './pages/HomePage';
import AllProductsPage from './pages/AllProductsPage';
import ProductDetailPage from './pages/ProductDetailPage';
import ShoppingCartPage from './pages/ShoppingCartPage';
import CheckoutPage from './pages/CheckoutPage';
import OrderConfirmationPage from './pages/OrderConfirmationPage';
import UserProfilePage from './pages/UserProfilePage';
import UserLoginPage from './pages/UserLoginPage';
import UserRegistrationPage from './pages/UserRegistrationPage';
import InitialChoicePage from './pages/InitialChoicePage';
import NewArrivalPage from './pages/NewArrivalPage';
import TopSellingPage from './pages/TopSellingPage';
import YourRecommendationsPage from './pages/YourRecommendationsPage';

import AdminLoginPage from './pages/admin/AdminLoginPage';
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import AdminProductManagementPage from './pages/admin/AdminProductManagementPage';
import AdminOrderManagementPage from './pages/admin/AdminOrderManagementPage';
import AdminSalesReportsPage from './pages/admin/AdminSalesReportsPage';

import ProtectedRoute from './components/common/ProtectedRoute';
import { UserRole } from './types';

const App: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar />
      <main className="flex-grow">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<InitialChoicePage />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/login" element={<UserLoginPage />} />
          <Route path="/register" element={<UserRegistrationPage />} />
          <Route path="/products" element={<AllProductsPage />} />
          <Route path="/new-arrival" element={<NewArrivalPage />} />
          <Route path="/top-selling" element={<TopSellingPage />} />
          <Route path="/product/:productId" element={<ProductDetailPage />} />
          
          {/* User Protected Routes */}
          <Route 
            path="/cart" 
            element={
              <ProtectedRoute roles={[UserRole.USER]}>
                <ShoppingCartPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/checkout" 
            element={
              <ProtectedRoute roles={[UserRole.USER]}>
                <CheckoutPage />
              </ProtectedRoute>
            } 
          />
           <Route 
            path="/recommendations" 
            element={
              <ProtectedRoute roles={[UserRole.USER]}>
                <YourRecommendationsPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/order-confirmation/:orderId" 
            element={
              <ProtectedRoute roles={[UserRole.USER, UserRole.ADMIN]}>
                <OrderConfirmationPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/profile" 
            element={
              <ProtectedRoute roles={[UserRole.USER, UserRole.ADMIN]}>
                <UserProfilePage />
              </ProtectedRoute>
            } 
          />

          {/* Admin Routes */}
          <Route path="/admin/login" element={<AdminLoginPage />} />
          <Route 
            path="/admin/dashboard" 
            element={
              <ProtectedRoute roles={[UserRole.ADMIN]}>
                <AdminDashboardPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/products" 
            element={
              <ProtectedRoute roles={[UserRole.ADMIN]}>
                <AdminProductManagementPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/orders" 
            element={
              <ProtectedRoute roles={[UserRole.ADMIN]}>
                <AdminOrderManagementPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/reports" 
            element={
              <ProtectedRoute roles={[UserRole.ADMIN]}>
                <AdminSalesReportsPage />
              </ProtectedRoute>
            } 
          />
          
          <Route path="*" element={<Navigate to="/home" replace />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
};

export default App;