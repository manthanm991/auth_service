import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';

import { useAuth } from '../hooks/useAuth';
import { ROUTES } from '../utils/constants';
import LoadingSpinner from '../../components/common/LoadingSpinner';

// Private Route Component - Requires authentication
export const PrivateRoute = () => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return <LoadingSpinner fullScreen text="Checking authentication..." />;
  }
  
  return isAuthenticated ? <Outlet /> : <Navigate to={ROUTES.LOGIN} replace />;
};

// Public Route Component - For login/signup pages when user is already authenticated
export const PublicRoute = () => {
  const { isAuthenticated, user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <LoadingSpinner fullScreen text="Loading..." />;
  }

  // If user is not authenticated, show the public route
  if (!isAuthenticated) {
    return <Outlet />;
  }

  // If user is authenticated and trying to access auth pages, redirect
  const authRoutes = [ROUTES.LOGIN, ROUTES.SIGNUP, ROUTES.FORGOT_PASSWORD];
  if (authRoutes.includes(location.pathname)) {
    const redirectPath = user?.isAdmin ? ROUTES.DASHBOARD : ROUTES.HOME;
    return <Navigate to={redirectPath} replace />;
  }

  // For other public routes, allow access
  return <Outlet />;
};

// Admin Route Component - Requires admin privileges
export const AdminRoute = () => {
  const { isAuthenticated, user, loading } = useAuth();
  
  if (loading) {
    return <LoadingSpinner fullScreen text="Verifying permissions..." />;
  }
  
  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }
  
  if (!user?.isAdmin) {
    return <Navigate to={ROUTES.UNAUTHORIZED} replace />;
  }
  
  return <Outlet />;
};

// Role-based Route Component - Generic role checker
export const RoleBasedRoute = ({ allowedRoles = [], fallbackPath = ROUTES.UNAUTHORIZED }) => {
  const { isAuthenticated, user, loading } = useAuth();
  
  if (loading) {
    return <LoadingSpinner fullScreen text="Checking permissions..." />;
  }
  
  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }
  
  if (!user || !allowedRoles.some(role => user[role])) {
    return <Navigate to={fallbackPath} replace />;
  }
  
  return <Outlet />;
};