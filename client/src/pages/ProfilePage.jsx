import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { ToastContext } from '../context/ToastContext';
import API from '../services/api';
import Breadcrumbs from '../components/Breadcrumbs';
import LoadingSpinner from '../components/LoadingSpinner';
import {
  User,
  Building,
  Phone,
  Mail,
  MapPin,
  FileText,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Edit2,
  Save,
  Package,
  Navigation
} from 'lucide-react';

export default function ProfilePage() {
  const { user, updateUserProfile } = useContext(AuthContext);
  const { showSuccess, showError } = useContext(ToastContext);

  const [quotes, setQuotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    name: user?.name || '',
    businessName: user?.businessName || '',
    mobile: user?.mobile || '',
    address: user?.address || '',
    city: user?.city || ''
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        businessName: user.businessName || '',
        mobile: user.mobile || '',
        address: user.address || '',
        city: user.city || ''
      });
    }

    const fetchMyQuotes = async () => {
      try {
        const res = await API.get('/quotes/my-quotes');
        if (res.data.success) {
          setQuotes(res.data.quotes);
        }
      } catch (err) {
        console.error('Failed to load user quotes:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchMyQuotes();
  }, [user]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await API.put('/auth/profile', formData);
      if (res.data.success) {
        updateUserProfile(res.data.user);
        showSuccess('Profile information updated successfully!');
        setEditing(false);
      }
    } catch (err) {
      showError(err.response?.data?.message || 'Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Confirmed':
        return <span className="bg-emerald-950 text-emerald-300 text-xs px-2.5 py-1 rounded-md border border-emerald-500/40 font-bold flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5" /> Confirmed</span>;
      case 'Completed':
        return <span className="bg-cyan-950 text-cyan-300 text-xs px-2.5 py-1 rounded-md border border-cyan-500/40 font-bold flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5" /> Completed</span>;
      case 'Processing':
        return <span className="bg-blue-950 text-blue-300 text-xs px-2.5 py-1 rounded-md border border-blue-500/40 font-bold flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> Processing</span>;
      case 'Rejected':
      case 'Cancelled':
        return <span className="bg-rose-950 text-rose-300 text-xs px-2.5 py-1 rounded-md border border-rose-500/40 font-bold flex items-center gap-1"><XCircle className="w-3.5 h-3.5" /> {status}</span>;
      default:
        return <span className="bg-amber-950 text-amber-300 text-xs px-2.5 py-1 rounded-md border border-amber-500/40 font-bold flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> Pending Review</span>;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <Breadcrumbs items={[{ label: 'Wholesale Customer Profile', path: '/profile' }]} />

      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">MY B2B ACCOUNT PROFILE</span>
          <h1 className="text-3xl font-extrabold text-white">{user?.name}</h1>
          <p className="text-xs text-slate-400 mt-0.5">{user?.businessName} • {user?.email}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Business Profile Editor */}
        <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="font-extrabold text-white text-base flex items-center gap-2">
              <Building className="w-5 h-5 text-amber-400" /> Shop / Business Info
            </h3>
            <button
              onClick={() => setEditing(!editing)}
              className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-1"
            >
              <Edit2 className="w-3.5 h-3.5" /> {editing ? 'Cancel' : 'Edit Info'}
            </button>
          </div>

          <form onSubmit={handleUpdate} className="space-y-4 text-xs">
            <div className="space-y-1">
              <label className="text-slate-400 font-bold">Email Address (Read-only)</label>
              <input
                type="text"
                disabled
                value={user?.email || ''}
                className="w-full bg-slate-950 text-slate-400 p-3 rounded-xl border border-slate-800 opacity-80 cursor-not-allowed"
              />
            </div>

            <div className="space-y-1">
              <label className="text-slate-400 font-bold">Account Registration Date</label>
              <input
                type="text"
                disabled
                value={user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' }) : 'Verified Dealer'}
                className="w-full bg-slate-950 text-slate-400 p-3 rounded-xl border border-slate-800 opacity-80 cursor-not-allowed"
              />
            </div>

            <div className="space-y-1">
              <label className="text-slate-400 font-bold">Contact Name</label>
              <input
                type="text"
                disabled={!editing}
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-slate-900 text-white p-3 rounded-xl border border-slate-800 disabled:opacity-70 focus:border-cyan-500 focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-slate-400 font-bold">Business / Shop Name</label>
              <input
                type="text"
                disabled={!editing}
                value={formData.businessName}
                onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                className="w-full bg-slate-900 text-white p-3 rounded-xl border border-slate-800 disabled:opacity-70 focus:border-cyan-500 focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-slate-400 font-bold">Mobile Phone</label>
              <input
                type="text"
                disabled={!editing}
                value={formData.mobile}
                onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                className="w-full bg-slate-900 text-white p-3 rounded-xl border border-slate-800 disabled:opacity-70 focus:border-cyan-500 focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-slate-400 font-bold">Shop Address</label>
              <input
                type="text"
                disabled={!editing}
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full bg-slate-900 text-white p-3 rounded-xl border border-slate-800 disabled:opacity-70 focus:border-cyan-500 focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-slate-400 font-bold">City / Market Location</label>
              <input
                type="text"
                disabled={!editing}
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                className="w-full bg-slate-900 text-white p-3 rounded-xl border border-slate-800 disabled:opacity-70 focus:border-cyan-500 focus:outline-none"
              />
            </div>

            {editing && (
              <button
                type="submit"
                disabled={saving}
                className="w-full bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold py-3 rounded-xl text-xs flex items-center justify-center gap-2 shadow-md shadow-cyan-500/20"
              >
                <Save className="w-4 h-4" /> {saving ? 'Saving...' : 'Save Profile Changes'}
              </button>
            )}
          </form>
        </div>

        {/* Right Column: Previous Quote Requests Table */}
        <div className="lg:col-span-2 space-y-6">
          <div className="glass-panel rounded-3xl border border-slate-800 overflow-hidden">
            <div className="p-5 border-b border-slate-800 flex items-center justify-between">
              <h3 className="font-extrabold text-white text-base flex items-center gap-2">
                <FileText className="w-5 h-5 text-amber-400" /> Wholesale Order History ({quotes.length})
              </h3>
            </div>

            {loading ? (
              <LoadingSpinner message="Fetching quotation history..." />
            ) : quotes.length === 0 ? (
              <div className="p-8 text-center text-slate-400 text-xs space-y-3">
                <Package className="w-8 h-8 text-slate-600 mx-auto" />
                <p>You haven't submitted any bulk quote requests yet.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-900 text-slate-400 uppercase font-bold text-[10px] tracking-wider border-b border-slate-800">
                    <tr>
                      <th className="p-4">Quote ID</th>
                      <th className="p-4">Date</th>
                      <th className="p-4">Requested Products</th>
                      <th className="p-4">Estimated Amount</th>
                      <th className="p-4">Status</th>
                      <th className="p-4 text-right">Live Tracking</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800">
                    {quotes.map((q) => {
                      const totalQty = q.products.reduce((acc, p) => acc + p.quantity, 0);

                      return (
                        <tr key={q._id} className="hover:bg-slate-900/50 transition-colors">
                          <td className="p-4 font-bold text-cyan-400">{q.quoteId}</td>
                          <td className="p-4 text-slate-300">
                            {new Date(q.createdAt).toLocaleDateString()}
                          </td>
                          <td className="p-4">
                            <div className="space-y-1">
                              {q.products.map((p, idx) => (
                                <div key={idx} className="text-white font-medium">
                                  {p.productName || p.product?.name} <span className="text-slate-400 font-bold">x {p.quantity} Pcs</span>
                                </div>
                              ))}
                              <span className="text-[10px] text-amber-400 block font-bold">Total: {totalQty} Units</span>
                            </div>
                          </td>
                          <td className="p-4 font-extrabold text-amber-400">
                            ₹{q.estimatedAmount.toLocaleString()}
                          </td>
                          <td className="p-4">
                            {getStatusBadge(q.status)}
                          </td>
                          <td className="p-4 text-right">
                            <Link
                              to={`/track/${q.trackingNumber || q.quoteId}`}
                              className="inline-flex items-center gap-1 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 px-3 py-1.5 rounded-lg text-xs font-bold transition shadow-sm"
                            >
                              <Navigation className="w-3.5 h-3.5" /> Track Live
                            </Link>
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
    </div>
  );
}
