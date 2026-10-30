import React, { useState, useEffect, useContext } from 'react';
import AdminSidebar from '../../components/AdminSidebar';
import LoadingSpinner from '../../components/LoadingSpinner';
import { ToastContext } from '../../context/ToastContext';
import API from '../../services/api';
import { Users, Search, CheckCircle, XCircle, Building, Phone, Mail } from 'lucide-react';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const { showSuccess, showError } = useContext(ToastContext);

  const fetchUsers = async () => {
    try {
      const res = await API.get('/users');
      if (res.data.success) {
        setUsers(res.data.users);
      }
    } catch (err) {
      console.error('Failed to load users:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleToggleStatus = async (userId, currentStatus) => {
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
    try {
      const res = await API.put(`/users/${userId}/status`, { status: newStatus });
      if (res.data.success) {
        showSuccess(`User status changed to ${newStatus}`);
        fetchUsers();
      }
    } catch (err) {
      showError('Failed to update status.');
    }
  };

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.businessName.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-100">
      <AdminSidebar />

      <main className="flex-1 p-8 space-y-6 overflow-y-auto">
        <div className="border-b border-slate-800 pb-6">
          <h1 className="text-3xl font-extrabold text-white">Wholesale Customers Management</h1>
          <p className="text-xs text-slate-400 mt-1">Manage registered buyers, shop accounts & quotation history</p>
        </div>

        {/* Search */}
        <div className="max-w-md">
          <div className="relative flex items-center">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by customer name, shop name, or email..."
              className="w-full bg-slate-900 text-white text-xs pl-10 pr-3 py-2.5 rounded-xl border border-slate-800 focus:border-cyan-500 focus:outline-none"
            />
          </div>
        </div>

        {loading ? (
          <LoadingSpinner message="Fetching customer accounts..." />
        ) : (
          <div className="glass-panel rounded-3xl border border-slate-800 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-900 text-slate-400 uppercase font-bold text-[10px] tracking-wider border-b border-slate-800">
                  <tr>
                    <th className="p-4">Customer Name</th>
                    <th className="p-4">Business / Shop Name</th>
                    <th className="p-4">Mobile & Email</th>
                    <th className="p-4">City / Address</th>
                    <th className="p-4">Reg Date</th>
                    <th className="p-4">Quotes Submitted</th>
                    <th className="p-4">Account Status</th>
                    <th className="p-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {filteredUsers.map((u) => (
                    <tr key={u._id} className="hover:bg-slate-900/50">
                      <td className="p-4 font-bold text-white">{u.name}</td>
                      <td className="p-4 text-cyan-400 font-semibold">{u.businessName}</td>
                      <td className="p-4 text-slate-300">
                        <div>{u.mobile}</div>
                        <div className="text-[11px] text-slate-400">{u.email}</div>
                      </td>
                      <td className="p-4 text-slate-300">
                        <div>{u.city}</div>
                        <div className="text-[10px] text-slate-500 truncate max-w-xs">{u.address}</div>
                      </td>
                      <td className="p-4 text-slate-400 text-[11px]">
                        {u.createdAt ? new Date(u.createdAt).toLocaleDateString('en-IN') : 'N/A'}
                      </td>
                      <td className="p-4 font-extrabold text-amber-400">
                        {u.quoteCount || 0} Quotes
                      </td>
                      <td className="p-4">
                        {u.status === 'active' ? (
                          <span className="bg-emerald-950 text-emerald-300 px-2 py-0.5 rounded text-[10px] font-bold border border-emerald-500/40">Active</span>
                        ) : (
                          <span className="bg-rose-950 text-rose-300 px-2 py-0.5 rounded text-[10px] font-bold border border-rose-500/40">Deactivated</span>
                        )}
                      </td>
                      <td className="p-4 text-right">
                        <button
                          onClick={() => handleToggleStatus(u._id, u.status)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
                            u.status === 'active'
                              ? 'bg-rose-950 hover:bg-rose-900 text-rose-300 border border-rose-800'
                              : 'bg-emerald-950 hover:bg-emerald-900 text-emerald-300 border border-emerald-800'
                          }`}
                        >
                          {u.status === 'active' ? 'Deactivate' : 'Activate'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
