
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { UserRole } from '../../types';
import LoadingSpinner from './LoadingSpinner';

interface ProtectedRouteProps {
  children: JSX.Element;
  roles?: UserRole[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, roles }) => {
  const { user, token, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <LoadingSpinner message="Authenticating..." />;
  }

  if (!token || !user) {
    // Not logged in, redirect to initial choice page or login page
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  if (roles && !roles.includes(user.role)) {
    // Role not authorized, redirect to home or an unauthorized page
    // If admin role is required and user is customer, redirect to home.
    // If customer role is required and user is admin, maybe redirect to admin dashboard.
    if (user.role === UserRole.ADMIN && roles.includes(UserRole.CUSTOMER)) {
        // Admin trying to access customer-only page, redirect to admin dashboard
        return <Navigate to="/admin/dashboard" state={{ from: location }} replace />;
    }
    // Customer trying to access admin-only page, or general mismatch
    return <Navigate to="/home" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;
