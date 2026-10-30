import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { ToastContext } from '../../context/ToastContext';
import API from '../../services/api';
import { ShieldCheck, Lock, Mail, ArrowRight } from 'lucide-react';

export default function AdminLogin() {
  const [email, setEmail] = useState('admin@roshanitraders.com');
  const [password, setPassword] = useState('Admin@123456');
  const [loading, setLoading] = useState(false);

  const { login } = useContext(AuthContext);
  const { showSuccess, showError } = useContext(ToastContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      showError('Please enter admin credentials.');
      return;
    }

    setLoading(true);

    try {
      const res = await API.post('/auth/admin-login', { email, password });
      if (res.data.success) {
        login(res.data.token, res.data.user);
        showSuccess('Admin authentication successful!');
        navigate('/admin/dashboard');
      }
    } catch (err) {
      showError(err.response?.data?.message || 'Admin login failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <div className="max-w-md w-full glass-panel p-8 rounded-3xl border border-slate-800 space-y-6 shadow-2xl">
        <div className="text-center space-y-2">
          <div className="w-14 h-14 bg-gradient-to-tr from-cyan-600 to-blue-600 rounded-2xl flex items-center justify-center mx-auto shadow-lg shadow-cyan-600/30">
            <ShieldCheck className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-extrabold text-white">Administrator Access Portal</h1>
          <p className="text-xs text-slate-400">Roshani Traders – Wholesale Management System</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="space-y-1">
            <label className="font-bold text-slate-300">Admin Email</label>
            <div className="relative flex items-center">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-900 text-white pl-10 pr-3 py-3 rounded-xl border border-slate-800 focus:border-cyan-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="font-bold text-slate-300">Password</label>
            <div className="relative flex items-center">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-900 text-white pl-10 pr-3 py-3 rounded-xl border border-slate-800 focus:border-cyan-500 focus:outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:brightness-110 text-white font-extrabold py-3.5 px-4 rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-cyan-600/20 disabled:opacity-50 transition-all"
          >
            {loading ? 'Authenticating Admin...' : 'Log In to Admin Dashboard'} <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800 text-[11px] text-slate-400 space-y-1">
          <p className="font-bold text-white">Default Admin Credentials:</p>
          <p>Email: <code className="text-cyan-400">admin@roshanitraders.com</code></p>
          <p>Password: <code className="text-cyan-400">Admin@123456</code></p>
        </div>
      </div>
    </div>
  );
}
