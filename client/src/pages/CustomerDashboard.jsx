import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import API from '../services/api';
import { 
  Building, 
  FileText, 
  Clock, 
  CheckCircle2, 
  Search,
  User,
  LogOut,
  ShoppingBag,
  PlusCircle,
  RotateCw
} from 'lucide-react';

export default function CustomerDashboard() {
  const { user, logout } = useContext(AuthContext);
  const [quotes, setQuotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchMyQuotes();
  }, []);

  const fetchMyQuotes = async () => {
    try {
      setLoading(true);
      const res = await API.get('/quotes/my-quotes');
      if (res.data.success) {
        setQuotes(res.data.quotes || []);
      }
    } catch (err) {
      console.error('Error fetching customer quotes:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const pendingQuotes = quotes.filter(q => q.status === 'Pending').length;
  const confirmedQuotes = quotes.filter(q => q.status === 'Confirmed' || q.status === 'Processing' || q.status === 'Completed').length;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Welcome Header */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-amber-950/40 p-6 md:p-8 rounded-2xl border border-slate-800 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center space-x-3 mb-2">
              <span className="bg-amber-500/10 text-amber-400 text-xs font-semibold px-3 py-1 rounded-full border border-amber-500/20">
                Verified Wholesale Account
              </span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
              Welcome back, <span className="text-amber-400">{user?.name || 'Customer'}</span>
            </h1>
            <p className="text-slate-400 text-sm mt-1 flex items-center gap-2">
              <Building className="w-4 h-4 text-slate-500" />
              <span className="font-semibold text-slate-300">{user?.businessName}</span> • {user?.city}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              to="/products"
              className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-4 py-2.5 rounded-xl text-sm transition flex items-center gap-2 shadow-lg shadow-amber-500/20"
            >
              <ShoppingBag className="w-4 h-4" />
              Browse Catalogue
            </Link>
            <Link
              to="/quote"
              className="bg-slate-800 hover:bg-slate-700 text-amber-400 border border-amber-500/30 px-4 py-2.5 rounded-xl text-sm font-semibold transition flex items-center gap-2"
            >
              <PlusCircle className="w-4 h-4" />
              Submit Quote
            </Link>
            <Link
              to="/customer/profile"
              className="bg-slate-800 hover:bg-slate-700 text-slate-200 px-4 py-2.5 rounded-xl text-sm font-medium transition flex items-center gap-2 border border-slate-700"
            >
              <User className="w-4 h-4 text-slate-400" />
              Profile
            </Link>
            <button
              onClick={logout}
              className="bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 px-4 py-2.5 rounded-xl text-sm font-medium transition flex items-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>

        {/* Quick Product Search Bar */}
        <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 shadow-md">
          <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row items-center gap-3">
            <div className="relative flex-1 w-full">
              <Search className="w-5 h-5 absolute left-3.5 top-3 text-slate-400" />
              <input
                type="text"
                placeholder="Search Three-Wheeler Parts (e.g. Bumper, Side Mirror, Brake Shoe, Headlight)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-11 pr-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500 transition"
              />
            </div>
            <button
              type="submit"
              className="w-full sm:w-auto bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-6 py-2.5 rounded-xl text-sm transition"
            >
              Quick Search
            </button>
          </form>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-lg flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Total Wholesale Enquiries</p>
              <h3 className="text-3xl font-extrabold text-white mt-1">{quotes.length}</h3>
            </div>
            <div className="bg-amber-500/10 p-3 rounded-xl border border-amber-500/20 text-amber-400">
              <FileText className="w-8 h-8" />
            </div>
          </div>

          <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-lg flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Pending Enquiries</p>
              <h3 className="text-3xl font-extrabold text-amber-400 mt-1">{pendingQuotes}</h3>
            </div>
            <div className="bg-amber-500/10 p-3 rounded-xl border border-amber-500/20 text-amber-400">
              <Clock className="w-8 h-8" />
            </div>
          </div>

          <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-lg flex items-center justify-between">
            <div>
              <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Confirmed / Active Orders</p>
              <h3 className="text-3xl font-extrabold text-emerald-400 mt-1">{confirmedQuotes}</h3>
            </div>
            <div className="bg-emerald-500/10 p-3 rounded-xl border border-emerald-500/20 text-emerald-400">
              <CheckCircle2 className="w-8 h-8" />
            </div>
          </div>
        </div>

        {/* Recent Enquiries / Quotes Table */}
        <div className="bg-slate-900 rounded-2xl border border-slate-800 shadow-xl overflow-hidden">
          <div className="p-6 border-b border-slate-800 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-white">Your Wholesale Quotation Requests</h2>
              <p className="text-slate-400 text-xs mt-0.5">Track live status of bulk quotes submitted to Roshani Traders</p>
            </div>
            <button
              onClick={fetchMyQuotes}
              className="text-xs text-amber-400 hover:text-amber-300 flex items-center gap-1 font-semibold"
            >
              <RotateCw className="w-4 h-4" />
              Refresh
            </button>
          </div>

          {loading ? (
            <div className="p-12 text-center text-slate-400">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-amber-500 border-t-transparent mb-3"></div>
              <p className="text-sm">Loading quotation history...</p>
            </div>
          ) : quotes.length === 0 ? (
            <div className="p-12 text-center text-slate-400 space-y-4">
              <FileText className="w-12 h-12 text-slate-600 mx-auto" />
              <p className="text-base text-slate-300 font-medium">No wholesale quotation requests submitted yet.</p>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                Browse our auto rickshaw parts catalogue and select products fulfilling the Minimum Order Quantity (MOQ) to request custom bulk pricing.
              </p>
              <Link
                to="/products"
                className="inline-block bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-5 py-2.5 rounded-xl text-sm transition"
              >
                Browse Catalogue Now
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-300">
                <thead className="bg-slate-950 text-slate-400 text-xs uppercase tracking-wider border-b border-slate-800">
                  <tr>
                    <th className="py-4 px-6">Quote ID</th>
                    <th className="py-4 px-6">Date</th>
                    <th className="py-4 px-6">Products Requested</th>
                    <th className="py-4 px-6">Estimated Amount</th>
                    <th className="py-4 px-6">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {quotes.map((q) => {
                    let statusBg = 'bg-slate-800 text-slate-300';
                    if (q.status === 'Pending') statusBg = 'bg-amber-500/10 text-amber-400 border border-amber-500/30';
                    if (q.status === 'Confirmed' || q.status === 'Processing') statusBg = 'bg-sky-500/10 text-sky-400 border border-sky-500/30';
                    if (q.status === 'Completed') statusBg = 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30';
                    if (q.status === 'Rejected' || q.status === 'Cancelled') statusBg = 'bg-rose-500/10 text-rose-400 border border-rose-500/30';

                    return (
                      <tr key={q._id} className="hover:bg-slate-850 transition">
                        <td className="py-4 px-6 font-mono font-bold text-amber-400">
                          {q.quoteId || q._id.substring(0, 8)}
                        </td>
                        <td className="py-4 px-6 text-slate-400 text-xs">
                          {new Date(q.createdAt).toLocaleDateString('en-IN', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric'
                          })}
                        </td>
                        <td className="py-4 px-6">
                          <ul className="space-y-1">
                            {q.products?.map((item, idx) => (
                              <li key={idx} className="text-xs">
                                <span className="font-semibold text-white">{item.productName || item.product?.name}</span>
                                <span className="text-slate-400 ml-1.5">(Qty: {item.quantity} • MOQ: {item.moq || item.product?.MOQ})</span>
                              </li>
                            ))}
                          </ul>
                        </td>
                        <td className="py-4 px-6 font-bold text-white">
                          ₹{q.estimatedAmount?.toLocaleString('en-IN')}
                        </td>
                        <td className="py-4 px-6">
                          <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${statusBg}`}>
                            {q.status}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
