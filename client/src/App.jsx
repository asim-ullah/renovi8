import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './LandingPage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import CustomerLayout from './components/layouts/CustomerLayout';
import AdminLayout from './components/layouts/AdminLayout';

import CustomerDashboardHome from './pages/dashboard/DashboardHome';
import ServicesPage from './pages/dashboard/ServicesPage';
import CategoryProductsPage from './pages/dashboard/CategoryProductsPage';
import ProductDetailPage from './pages/dashboard/ProductDetailPage';
import OrdersPage from './pages/dashboard/OrdersPage';
import OrderDetailsPage from './pages/dashboard/OrderDetailsPage';
import ProfilePage from './pages/dashboard/ProfilePage';
import SettingsPage from './pages/dashboard/SettingsPage';
import ReviewPage from './pages/dashboard/ReviewPage';

import AdminDashboardHome from './pages/admin/DashboardHome';
import AdminProductsPage from './pages/admin/ProductsPage';
import AdminOrdersPage from './pages/admin/OrdersPage';
import AdminCategoriesPage from './pages/admin/CategoriesPage';
import AdminWorkersPage from './pages/admin/WorkersPage';
import AdminUsersPage from './pages/admin/UsersPage';

function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Customer Routes */}
      <Route path="/dashboard" element={<CustomerLayout><CustomerDashboardHome /></CustomerLayout>} />
      <Route path="/dashboard/services" element={<CustomerLayout><ServicesPage /></CustomerLayout>} />
      <Route path="/dashboard/services/:catId" element={<CustomerLayout><CategoryProductsPage /></CustomerLayout>} />
      <Route path="/dashboard/products/:productId" element={<CustomerLayout><ProductDetailPage /></CustomerLayout>} />
      <Route path="/dashboard/orders" element={<CustomerLayout><OrdersPage /></CustomerLayout>} />
      <Route path="/dashboard/orders/:orderId" element={<CustomerLayout><OrderDetailsPage /></CustomerLayout>} />
      <Route path="/dashboard/orders/:orderId/review" element={<CustomerLayout><ReviewPage /></CustomerLayout>} />
      <Route path="/dashboard/profile" element={<CustomerLayout><ProfilePage /></CustomerLayout>} />
      <Route path="/dashboard/settings" element={<CustomerLayout><SettingsPage /></CustomerLayout>} />
      
      {/* Admin Routes */}
      <Route path="/admin" element={<AdminLayout><AdminDashboardHome /></AdminLayout>} />
      <Route path="/admin/products" element={<AdminLayout><AdminProductsPage /></AdminLayout>} />
      <Route path="/admin/categories" element={<AdminLayout><AdminCategoriesPage /></AdminLayout>} />
      <Route path="/admin/orders" element={<AdminLayout><AdminOrdersPage /></AdminLayout>} />
      <Route path="/admin/workers" element={<AdminLayout><AdminWorkersPage /></AdminLayout>} />
      <Route path="/admin/users" element={<AdminLayout><AdminUsersPage /></AdminLayout>} />
      <Route path="/admin/analytics" element={<AdminLayout><AdminDashboardHome /></AdminLayout>} />

      {/* Redirects */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default App;
