import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import HomePage from "./pages/HomePage";
import AllProductsPage from "./pages/AllProductsPage";
import ProductDetailPage from "./pages/ProductDetailPage";
import ShoppingCartPage from "./pages/ShoppingCartPage";
import CheckoutPage from "./pages/CheckoutPage";
import OrderConfirmationPage from "./pages/OrderConfirmationPage";
import UserProfilePage from "./pages/UserProfilePage";
import UserLoginPage from "./pages/UserLoginPage";
import UserRegistrationPage from "./pages/UserRegistrationPage";
import InitialChoicePage from "./pages/InitialChoicePage";
import NewArrivalPage from "./pages/NewArrivalPage";
import TopSellingPage from "./pages/TopSellingPage";
import YourRecommendationsPage from "./pages/YourRecommendationsPage";
import AdminDashboardPage from "./pages/admin/AdminDashboardPage";
import AdminProductManagementPage from "./pages/admin/AdminProductManagementPage";
import AdminOrderManagementPage from "./pages/admin/AdminOrderManagementPage";
import AdminSalesReportsPage from "./pages/admin/AdminSalesReportsPage";

import ProtectedRoute from "./components/common/ProtectedRoute";
import { UserRole } from "./types";
import AdminLayout from "./components/layout/AdminLayout";
import CustomerLayout from "./components/layout/CustomerLayout";

const App: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <main className="flex-grow">
        <Routes>
          {/* ================= CUSTOMER ================= */}
          <Route element={<CustomerLayout />}>
            <Route path="/" element={<InitialChoicePage />} />
            <Route path="/home" element={<HomePage />} />
            <Route path="/login" element={<UserLoginPage />} />
            <Route path="/register" element={<UserRegistrationPage />} />
            <Route path="/products" element={<AllProductsPage />} />
            <Route path="/new-arrival" element={<NewArrivalPage />} />
            <Route path="/top-selling" element={<TopSellingPage />} />
            <Route path="/product/:productId" element={<ProductDetailPage />} />

            {/* USER ONLY */}
            <Route element={<ProtectedRoute roles={[UserRole.USER]} />}>
              <Route path="/cart" element={<ShoppingCartPage />} />
              <Route path="/checkout" element={<CheckoutPage />} />
              <Route
                path="/recommendations"
                element={<YourRecommendationsPage />}
              />
              <Route
                path="/order-confirmation/:orderId"
                element={<OrderConfirmationPage />}
              />
              <Route path="/profile" element={<UserProfilePage />} />
            </Route>
          </Route>

          {/* ================= ADMIN ================= */}
          <Route element={<ProtectedRoute roles={[UserRole.ADMIN]} />}>
            <Route element={<AdminLayout />}>
              <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
              <Route
                path="/admin/products"
                element={<AdminProductManagementPage />}
              />
              <Route
                path="/admin/orders"
                element={<AdminOrderManagementPage />}
              />
              <Route
                path="/admin/reports"
                element={<AdminSalesReportsPage />}
              />
            </Route>
          </Route>

          <Route path="*" element={<Navigate to="/home" replace />} />
        </Routes>
      </main>
    </div>
  );
};

export default App;
