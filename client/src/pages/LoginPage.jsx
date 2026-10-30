import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { ToastContext } from '../context/ToastContext';
import API from '../services/api';
import Breadcrumbs from '../components/Breadcrumbs';
import { Mail, Lock, LogIn, ShieldCheck, UserCheck, ArrowRight, Building } from 'lucide-react';

export default function LoginPage() {
  const [searchParams] = useSearchParams();
  const initialMode = searchParams.get('type') === 'admin' ? 'admin' : 'customer';
  
  // 'customer' = 2nd login page / tab (Customer Wholesale), 'admin' = 1st login page / tab (Admin Portal)
  const [loginType, setLoginType] = useState(initialMode);

  // Customer Form State
  const [customerEmail, setCustomerEmail] = useState('customer@autocenter.com');
  const [customerPassword, setCustomerPassword] = useState('Customer@123456');

  // Admin Form State
  const [adminEmail, setAdminEmail] = useState('admin@roshanitraders.com');
  const [adminPassword, setAdminPassword] = useState('Admin@123456');

  const [loading, setLoading] = useState(false);

  const { login } = useContext(AuthContext);
  const { showSuccess, showError } = useContext(ToastContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (searchParams.get('type') === 'admin') {
      setLoginType('admin');
    }
  }, [searchParams]);

  // Handle Customer Wholesale Login Submission
  const handleCustomerSubmit = async (e) => {
    e.preventDefault();
    if (!customerEmail || !customerPassword) {
      showError('Please enter email and password.');
      return;
    }

    setLoading(true);
    try {
      const res = await API.post('/auth/login', {
        email: customerEmail,
        password: customerPassword
      });
      if (res.data.success) {
        login(res.data.token, res.data.user);
        showSuccess(`Welcome back, ${res.data.user.name}!`);
        if (res.data.user.role === 'admin') {
          navigate('/admin/dashboard');
        } else {
          navigate('/customer/dashboard');
        }
      }
    } catch (err) {
      showError(err.response?.data?.message || 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  // Handle Admin Portal Login Submission
  const handleAdminSubmit = async (e) => {
    e.preventDefault();
    if (!adminEmail || !adminPassword) {
      showError('Please enter admin credentials.');
      return;
    }

    setLoading(true);
    try {
      const res = await API.post('/auth/admin-login', {
        email: adminEmail,
        password: adminPassword
      });
      if (res.data.success) {
        login(res.data.token, res.data.user);
        showSuccess('Admin authentication successful!');
        navigate('/admin/dashboard');
      }
    } catch (err) {
      showError(err.response?.data?.message || 'Admin login failed. Invalid admin credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-10 space-y-6">
      <Breadcrumbs items={[{ label: 'System Portal Login', path: '/login' }]} />

      {/* Login Portal Selector Container */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
        
        {/* Header Title */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-bold px-3 py-1 rounded-full mb-1">
            <Building className="w-3.5 h-3.5" /> ROSHANI TRADERS B2B SYSTEM
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">Select Login Portal</h1>
          <p className="text-xs text-slate-400">Choose your account type to proceed into the system</p>
        </div>

        {/* Dual Portal Switcher Tabs */}
        <div className="grid grid-cols-2 p-1.5 bg-slate-950 rounded-2xl border border-slate-800 text-xs font-extrabold">
          <button
            type="button"
            onClick={() => setLoginType('admin')}
            className={`py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-all ${
              loginType === 'admin'
                ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 shadow-lg shadow-amber-500/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Admin Portal</span>
          </button>

          <button
            type="button"
            onClick={() => setLoginType('customer')}
            className={`py-3 px-4 rounded-xl flex items-center justify-center gap-2 transition-all ${
              loginType === 'customer'
                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/20'
                : 'text-slate-400 hover:text-white hover:bg-slate-900'
            }`}
          >
            <UserCheck className="w-4 h-4" />
            <span>Customer Login</span>
          </button>
        </div>

        {/* Form 1: Admin Portal Login */}
        {loginType === 'admin' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-2xl flex items-center gap-3">
              <ShieldCheck className="w-6 h-6 text-amber-400 shrink-0" />
              <div>
                <h3 className="font-bold text-white text-sm">Administrator Access Portal</h3>
                <p className="text-xs text-slate-400">Restricted login for Roshani Traders management staff</p>
              </div>
            </div>

            <form onSubmit={handleAdminSubmit} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-slate-300">Admin Email Address</label>
                <div className="relative flex items-center">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5" />
                  <input
                    type="email"
                    value={adminEmail}
                    onChange={(e) => setAdminEmail(e.target.value)}
                    placeholder="admin@roshanitraders.com"
                    className="w-full bg-slate-950 text-white pl-10 pr-3 py-3 rounded-xl border border-slate-800 focus:border-amber-500 focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-300">Admin Password</label>
                <div className="relative flex items-center">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5" />
                  <input
                    type="password"
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-slate-950 text-white pl-10 pr-3 py-3 rounded-xl border border-slate-800 focus:border-amber-500 focus:outline-none"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-amber-500 hover:bg-amber-600 text-slate-950 font-extrabold py-3.5 px-4 rounded-xl text-xs shadow-lg shadow-amber-500/20 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
              >
                {loading ? 'Authenticating Admin...' : 'Log In to Admin Dashboard'} <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 text-xs text-slate-400 space-y-1">
              <p className="font-bold text-white">Default Admin Credentials:</p>
              <p>Email: <code className="text-amber-400 font-mono">admin@roshanitraders.com</code></p>
              <p>Password: <code className="text-amber-400 font-mono">Admin@123456</code></p>
            </div>
          </div>
        )}

        {/* Form 2: Customer Wholesale Login */}
        {loginType === 'customer' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="p-4 bg-cyan-500/10 border border-cyan-500/20 rounded-2xl flex items-center gap-3">
              <UserCheck className="w-6 h-6 text-cyan-400 shrink-0" />
              <div>
                <h3 className="font-bold text-white text-sm">Customer Wholesale Login</h3>
                <p className="text-xs text-slate-400">For auto rickshaw spare part dealers & shop owners</p>
              </div>
            </div>

            <form onSubmit={handleCustomerSubmit} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-slate-300">Customer Email Address</label>
                <div className="relative flex items-center">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5" />
                  <input
                    type="email"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    placeholder="customer@autocenter.com"
                    className="w-full bg-slate-950 text-white pl-10 pr-3 py-3 rounded-xl border border-slate-800 focus:border-cyan-500 focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-slate-300">Password</label>
                <div className="relative flex items-center">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5" />
                  <input
                    type="password"
                    value={customerPassword}
                    onChange={(e) => setCustomerPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-slate-950 text-white pl-10 pr-3 py-3 rounded-xl border border-slate-800 focus:border-cyan-500 focus:outline-none"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-extrabold py-3.5 px-4 rounded-xl text-xs shadow-lg shadow-cyan-500/20 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
              >
                {loading ? 'Logging in...' : 'Sign In to Customer Dashboard'} <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            <div className="p-3.5 bg-slate-950 rounded-xl border border-slate-800 text-xs text-slate-400 space-y-1">
              <p className="font-bold text-white">Sample Customer Credentials:</p>
              <p>Email: <code className="text-cyan-400 font-mono">customer@autocenter.com</code></p>
              <p>Password: <code className="text-cyan-400 font-mono">Customer@123456</code></p>
            </div>

            <div className="text-center text-xs text-slate-400 pt-2 border-t border-slate-800">
              New wholesale buyer?{' '}
              <Link to="/signup" className="text-cyan-400 font-bold hover:underline">
                Register Wholesale Account
              </Link>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
