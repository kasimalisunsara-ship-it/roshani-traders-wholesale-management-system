import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AdminSidebar from '../../components/AdminSidebar';
import LoadingSpinner from '../../components/LoadingSpinner';
import API from '../../services/api';
import {
  Package,
  Layers,
  Users,
  FileText,
  CheckCircle2,
  Clock,
  MessageSquare,
  TrendingUp,
  Award,
  CheckCircle,
  XCircle,
  Plus,
  ShoppingBag,
  FolderTree,
  UserCheck,
  Inbox,
  ClipboardList
} from 'lucide-react';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalCategories: 0,
    registeredCustomers: 0,
    totalQuotes: 0,
    pendingQuotes: 0,
    confirmedOrders: 0,
    completedOrders: 0,
    availableProducts: 0,
    unavailableProducts: 0,
    totalEnquiries: 0
  });
  const [recentQuotes, setRecentQuotes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const [prodRes, catRes, userRes, quoteRes, enqRes] = await Promise.all([
          API.get('/products?admin=true&limit=500'),
          API.get('/categories'),
          API.get('/users'),
          API.get('/quotes'),
          API.get('/enquiries')
        ]);

        const products = prodRes.data.products || [];
        const categories = catRes.data.categories || [];
        const users = userRes.data.users || [];
        const quotes = quoteRes.data.quotes || [];
        const enquiries = enqRes.data.enquiries || [];

        const available = products.filter(p => p.status === 'active' && p.availability).length;
        const unavailable = products.length - available;

        setStats({
          totalProducts: prodRes.data.total || products.length,
          totalCategories: categories.length,
          registeredCustomers: users.length,
          totalQuotes: quotes.length,
          pendingQuotes: quotes.filter(q => q.status === 'Pending').length,
          confirmedOrders: quotes.filter(q => q.status === 'Confirmed' || q.status === 'Processing').length,
          completedOrders: quotes.filter(q => q.status === 'Completed').length,
          availableProducts: available,
          unavailableProducts: unavailable,
          totalEnquiries: enquiries.length
        });

        setRecentQuotes(quotes.slice(0, 6));
      } catch (err) {
        console.error('Failed to load dashboard metrics:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-100">
      <AdminSidebar activeTab="dashboard" />

      <main className="flex-1 p-6 md:p-8 space-y-8 overflow-y-auto">
        
        {/* Title Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
          <div>
            <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">B2B Wholesale Portal</span>
            <h1 className="text-2xl md:text-3xl font-extrabold text-white">ROSHANI TRADERS ADMIN DASHBOARD</h1>
            <p className="text-xs text-slate-400 mt-0.5">Overview of spare parts inventory, wholesale buyers & quotation requests</p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Link
              to="/admin/products/add"
              className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-4 py-2.5 rounded-xl text-xs flex items-center gap-1.5 shadow-lg shadow-amber-500/20"
            >
              <Plus className="w-4 h-4" /> Add Product
            </Link>
          </div>
        </div>

        {loading ? (
          <LoadingSpinner message="Calculating dashboard statistics..." />
        ) : (
          <>
            {/* Metric Statistics Cards (Prompt Section 10) */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-3 gap-4">
              
              <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 shadow-md flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Total Products</p>
                  <h3 className="text-2xl font-extrabold text-white mt-1">{stats.totalProducts}</h3>
                </div>
                <div className="bg-amber-500/10 p-3 rounded-xl border border-amber-500/20 text-amber-400">
                  <Package className="w-6 h-6" />
                </div>
              </div>

              <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 shadow-md flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Categories</p>
                  <h3 className="text-2xl font-extrabold text-white mt-1">{stats.totalCategories}</h3>
                </div>
                <div className="bg-cyan-500/10 p-3 rounded-xl border border-cyan-500/20 text-cyan-400">
                  <Layers className="w-6 h-6" />
                </div>
              </div>

              <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 shadow-md flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Customers</p>
                  <h3 className="text-2xl font-extrabold text-white mt-1">{stats.registeredCustomers}</h3>
                </div>
                <div className="bg-emerald-500/10 p-3 rounded-xl border border-emerald-500/20 text-emerald-400">
                  <Users className="w-6 h-6" />
                </div>
              </div>

              <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 shadow-md flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Total Enquiries / Quotes</p>
                  <h3 className="text-2xl font-extrabold text-white mt-1">{stats.totalQuotes}</h3>
                </div>
                <div className="bg-sky-500/10 p-3 rounded-xl border border-sky-500/20 text-sky-400">
                  <FileText className="w-6 h-6" />
                </div>
              </div>

              <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 shadow-md flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Pending Enquiries</p>
                  <h3 className="text-2xl font-extrabold text-amber-400 mt-1">{stats.pendingQuotes}</h3>
                </div>
                <div className="bg-amber-500/10 p-3 rounded-xl border border-amber-500/20 text-amber-400">
                  <Clock className="w-6 h-6 animate-pulse" />
                </div>
              </div>

              <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 shadow-md flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Confirmed Orders</p>
                  <h3 className="text-2xl font-extrabold text-sky-400 mt-1">{stats.confirmedOrders}</h3>
                </div>
                <div className="bg-sky-500/10 p-3 rounded-xl border border-sky-500/20 text-sky-400">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
              </div>

              <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 shadow-md flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Completed Orders</p>
                  <h3 className="text-2xl font-extrabold text-emerald-400 mt-1">{stats.completedOrders}</h3>
                </div>
                <div className="bg-emerald-500/10 p-3 rounded-xl border border-emerald-500/20 text-emerald-400">
                  <CheckCircle className="w-6 h-6" />
                </div>
              </div>

              <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 shadow-md flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Available Products</p>
                  <h3 className="text-2xl font-extrabold text-emerald-400 mt-1">{stats.availableProducts}</h3>
                </div>
                <div className="bg-emerald-500/10 p-3 rounded-xl border border-emerald-500/20 text-emerald-400">
                  <CheckCircle className="w-6 h-6" />
                </div>
              </div>

              <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 shadow-md flex items-center justify-between">
                <div>
                  <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Unavailable Products</p>
                  <h3 className="text-2xl font-extrabold text-rose-400 mt-1">{stats.unavailableProducts}</h3>
                </div>
                <div className="bg-rose-500/10 p-3 rounded-xl border border-rose-500/20 text-rose-400">
                  <XCircle className="w-6 h-6" />
                </div>
              </div>

            </div>

            {/* Quick Action Buttons (Prompt Section 10) */}
            <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-lg space-y-4">
              <h2 className="text-base font-bold text-white uppercase tracking-wider border-b border-slate-800 pb-3">
                Quick Administrative Actions
              </h2>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                <Link
                  to="/admin/products/add"
                  className="bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 p-4 rounded-xl font-bold text-xs flex flex-col items-center justify-center gap-2 text-center transition"
                >
                  <Plus className="w-5 h-5" />
                  [Add Product]
                </Link>

                <Link
                  to="/admin/products"
                  className="bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 p-4 rounded-xl font-bold text-xs flex flex-col items-center justify-center gap-2 text-center transition"
                >
                  <ShoppingBag className="w-5 h-5 text-amber-400" />
                  [Manage Products]
                </Link>

                <Link
                  to="/admin/categories"
                  className="bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 p-4 rounded-xl font-bold text-xs flex flex-col items-center justify-center gap-2 text-center transition"
                >
                  <FolderTree className="w-5 h-5 text-cyan-400" />
                  [Manage Categories]
                </Link>

                <Link
                  to="/admin/customers"
                  className="bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 p-4 rounded-xl font-bold text-xs flex flex-col items-center justify-center gap-2 text-center transition"
                >
                  <UserCheck className="w-5 h-5 text-emerald-400" />
                  [Manage Customers]
                </Link>

                <Link
                  to="/admin/enquiries"
                  className="bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 p-4 rounded-xl font-bold text-xs flex flex-col items-center justify-center gap-2 text-center transition"
                >
                  <Inbox className="w-5 h-5 text-sky-400" />
                  [View Enquiries]
                </Link>

                <Link
                  to="/admin/orders"
                  className="bg-slate-800 hover:bg-slate-700 text-white border border-slate-700 p-4 rounded-xl font-bold text-xs flex flex-col items-center justify-center gap-2 text-center transition"
                >
                  <ClipboardList className="w-5 h-5 text-teal-400" />
                  [Manage Orders]
                </Link>
              </div>
            </div>

            {/* Recent Wholesale Quotations Table */}
            <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
              <div className="p-5 border-b border-slate-800 flex items-center justify-between">
                <h3 className="font-extrabold text-white text-base">Recent Wholesale Quotations</h3>
                <Link to="/admin/orders" className="text-xs text-amber-400 hover:text-amber-300 font-semibold">
                  View All Orders →
                </Link>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-slate-950 text-slate-400 uppercase font-bold text-[10px] tracking-wider border-b border-slate-800">
                    <tr>
                      <th className="p-4">Quote ID</th>
                      <th className="p-4">Wholesale Customer</th>
                      <th className="p-4">Business / Shop</th>
                      <th className="p-4">Items Count</th>
                      <th className="p-4">Estimated Amount</th>
                      <th className="p-4">Status</th>
                      <th className="p-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {recentQuotes.map((q) => (
                      <tr key={q._id} className="hover:bg-slate-850">
                        <td className="p-4 font-mono font-bold text-amber-400">{q.quoteId}</td>
                        <td className="p-4 text-white font-medium">{q.user?.name || 'Customer'}</td>
                        <td className="p-4 text-slate-300">{q.user?.businessName || 'N/A'}</td>
                        <td className="p-4 font-semibold">{q.products?.length || 0} Parts</td>
                        <td className="p-4 font-extrabold text-white">₹{q.estimatedAmount?.toLocaleString()}</td>
                        <td className="p-4">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                            q.status === 'Confirmed'
                              ? 'bg-emerald-950 text-emerald-400 border-emerald-500/30'
                              : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                          }`}>
                            {q.status}
                          </span>
                        </td>
                        <td className="p-4 text-right">
                          <Link
                            to="/admin/orders"
                            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-bold transition shadow-sm inline-flex items-center gap-1"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" /> Manage / Accept
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </>
        )}

      </main>
    </div>
  );
}
