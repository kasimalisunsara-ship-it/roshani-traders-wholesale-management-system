import React, { useContext } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import FloatingAIChat from './components/FloatingAIChat';

// Customer Pages
import Home from './pages/Home';
import About from './pages/About';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import CategoriesPage from './pages/CategoriesPage';
import SearchPage from './pages/SearchPage';
import { CartPage } from './pages/CartPage';
import SignupPage from './pages/SignupPage';
import LoginPage from './pages/LoginPage';
import CustomerDashboard from './pages/CustomerDashboard';
import ProfilePage from './pages/ProfilePage';
import ContactPage from './pages/ContactPage';
import AIAssistantPage from './pages/AIAssistantPage';
import LiveTrackingPage from './pages/LiveTrackingPage';

// Admin Pages
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminProducts from './pages/admin/AdminProducts';
import AddEditProductPage from './pages/admin/AddEditProductPage';
import AdminCategories from './pages/admin/AdminCategories';
import AdminOrders from './pages/admin/AdminOrders';
import AdminUsers from './pages/admin/AdminUsers';
import AdminEnquiries from './pages/admin/AdminEnquiries';
import AdminContent from './pages/admin/AdminContent';
import AdminCatalogueImport from './pages/admin/AdminCatalogueImport';

import { AuthContext } from './context/AuthContext';

// Protected Route Component for Customer Dashboard & Profile
const CustomerProtectedRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);
  if (loading) return null;
  if (!user) return <Navigate to="/login" replace />;
  return children;
};

// Protected Route Component for Admin Panel
const AdminProtectedRoute = ({ children }) => {
  const { user, loading, isAdmin } = useContext(AuthContext);
  if (loading) return null;
  if (!user || !isAdmin) return <Navigate to="/admin/login" replace />;
  return children;
};

export default function App() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <div className="flex flex-col min-h-screen bg-slate-950 text-slate-100">
      {!isAdminRoute && <Navbar />}

      <div className="flex-1">
        <Routes>
          {/* Public Customer Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/:id" element={<ProductDetail />} />
          <Route path="/categories" element={<CategoriesPage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/quote" element={<CartPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/login" element={<LoginPage />} />
          
          {/* Customer Dashboard & Profile */}
          <Route
            path="/customer/dashboard"
            element={
              <CustomerProtectedRoute>
                <CustomerDashboard />
              </CustomerProtectedRoute>
            }
          />
          <Route
            path="/customer/profile"
            element={
              <CustomerProtectedRoute>
                <ProfilePage />
              </CustomerProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <CustomerProtectedRoute>
                <ProfilePage />
              </CustomerProtectedRoute>
            }
          />

          <Route path="/contact" element={<ContactPage />} />
          <Route path="/ai-assistant" element={<AIAssistantPage />} />
          <Route path="/track" element={<LiveTrackingPage />} />
          <Route path="/track/:code" element={<LiveTrackingPage />} />

          {/* Secure Admin Routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route
            path="/admin"
            element={
              <AdminProtectedRoute>
                <AdminDashboard />
              </AdminProtectedRoute>
            }
          />
          <Route
            path="/admin/dashboard"
            element={
              <AdminProtectedRoute>
                <AdminDashboard />
              </AdminProtectedRoute>
            }
          />
          <Route
            path="/admin/products"
            element={
              <AdminProtectedRoute>
                <AdminProducts />
              </AdminProtectedRoute>
            }
          />
          <Route
            path="/admin/products/add"
            element={
              <AdminProtectedRoute>
                <AddEditProductPage />
              </AdminProtectedRoute>
            }
          />
          <Route
            path="/admin/products/edit/:id"
            element={
              <AdminProtectedRoute>
                <AddEditProductPage />
              </AdminProtectedRoute>
            }
          />
          <Route
            path="/admin/categories"
            element={
              <AdminProtectedRoute>
                <AdminCategories />
              </AdminProtectedRoute>
            }
          />
          <Route
            path="/admin/orders"
            element={
              <AdminProtectedRoute>
                <AdminOrders />
              </AdminProtectedRoute>
            }
          />
          <Route
            path="/admin/customers"
            element={
              <AdminProtectedRoute>
                <AdminUsers />
              </AdminProtectedRoute>
            }
          />
          <Route
            path="/admin/users"
            element={
              <AdminProtectedRoute>
                <AdminUsers />
              </AdminProtectedRoute>
            }
          />
          <Route
            path="/admin/enquiries"
            element={
              <AdminProtectedRoute>
                <AdminEnquiries />
              </AdminProtectedRoute>
            }
          />
          <Route
            path="/admin/content"
            element={
              <AdminProtectedRoute>
                <AdminContent />
              </AdminProtectedRoute>
            }
          />
          <Route
            path="/admin/catalogue-import"
            element={
              <AdminProtectedRoute>
                <AdminCatalogueImport />
              </AdminProtectedRoute>
            }
          />

          {/* Fallback Route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>

      {!isAdminRoute && <FloatingAIChat />}
      {!isAdminRoute && <Footer />}
    </div>
  );
}
