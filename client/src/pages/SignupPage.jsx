import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { ToastContext } from '../context/ToastContext';
import API from '../services/api';
import Breadcrumbs from '../components/Breadcrumbs';
import { User, Building, Phone, Mail, Lock, MapPin, ShieldCheck } from 'lucide-react';

export default function SignupPage() {
  const [formData, setFormData] = useState({
    name: '',
    businessName: '',
    mobile: '',
    email: '',
    password: '',
    confirmPassword: '',
    address: '',
    city: ''
  });
  const [loading, setLoading] = useState(false);

  const { login } = useContext(AuthContext);
  const { showSuccess, showError } = useContext(ToastContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, businessName, mobile, email, password, confirmPassword, address, city } = formData;

    if (!name || !businessName || !mobile || !email || !password || !confirmPassword || !address || !city) {
      showError('Please fill in all mandatory wholesale signup fields.');
      return;
    }

    if (password.length < 6) {
      showError('Password must be at least 6 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      showError('Confirm password does not match password.');
      return;
    }

    setLoading(true);

    try {
      const res = await API.post('/auth/register', formData);
      if (res.data.success) {
        login(res.data.token, res.data.user);
        showSuccess('Wholesale Account registered successfully!');
        navigate('/customer/dashboard');
      }
    } catch (err) {
      showError(err.response?.data?.message || 'Registration failed. Duplicate email or invalid details.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-8 space-y-6">
      <Breadcrumbs items={[{ label: 'Wholesale Signup', path: '/signup' }]} />

      <div className="glass-panel p-8 rounded-3xl border border-slate-800 space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 bg-cyan-950 text-cyan-400 rounded-2xl flex items-center justify-center mx-auto border border-cyan-800">
            <Building className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-extrabold text-white">Wholesale Customer Registration</h1>
          <p className="text-xs text-slate-400">
            Create your B2B account to request instant quotations and track wholesale order history.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          
          {/* Full Name */}
          <div className="space-y-1">
            <label className="font-bold text-slate-300">Full Name *</label>
            <div className="relative flex items-center">
              <User className="w-4 h-4 text-slate-400 absolute left-3.5" />
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="E.g., Rajesh Kumar"
                className="w-full bg-slate-900 text-white pl-10 pr-3 py-3 rounded-xl border border-slate-800 focus:border-cyan-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Business Name */}
          <div className="space-y-1">
            <label className="font-bold text-slate-300">Business / Shop Name *</label>
            <div className="relative flex items-center">
              <Building className="w-4 h-4 text-slate-400 absolute left-3.5" />
              <input
                type="text"
                name="businessName"
                value={formData.businessName}
                onChange={handleChange}
                placeholder="E.g., Metro Auto Spares & Accessories"
                className="w-full bg-slate-900 text-white pl-10 pr-3 py-3 rounded-xl border border-slate-800 focus:border-cyan-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Mobile & Email Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="font-bold text-slate-300">Mobile Number *</label>
              <div className="relative flex items-center">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3.5" />
                <input
                  type="text"
                  name="mobile"
                  value={formData.mobile}
                  onChange={handleChange}
                  placeholder="+91 98765 43210"
                  className="w-full bg-slate-900 text-white pl-10 pr-3 py-3 rounded-xl border border-slate-800 focus:border-cyan-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-300">Email Address *</label>
              <div className="relative flex items-center">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="owner@autocenter.com"
                  className="w-full bg-slate-900 text-white pl-10 pr-3 py-3 rounded-xl border border-slate-800 focus:border-cyan-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Password & Confirm Password Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="font-bold text-slate-300">Password (Min. 6 chars) *</label>
              <div className="relative flex items-center">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5" />
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full bg-slate-900 text-white pl-10 pr-3 py-3 rounded-xl border border-slate-800 focus:border-cyan-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-300">Confirm Password *</label>
              <div className="relative flex items-center">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5" />
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full bg-slate-900 text-white pl-10 pr-3 py-3 rounded-xl border border-slate-800 focus:border-cyan-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Address & City Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="font-bold text-slate-300">Shop / Business Address *</label>
              <div className="relative flex items-center">
                <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5" />
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Shop No. 14, Main Market"
                  className="w-full bg-slate-900 text-white pl-10 pr-3 py-3 rounded-xl border border-slate-800 focus:border-cyan-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="font-bold text-slate-300">City / District *</label>
              <div className="relative flex items-center">
                <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5" />
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="Jaipur, Delhi, etc."
                  className="w-full bg-slate-900 text-white pl-10 pr-3 py-3 rounded-xl border border-slate-800 focus:border-cyan-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-extrabold py-3.5 px-4 rounded-xl text-xs shadow-lg shadow-cyan-500/20 disabled:opacity-50 transition-all"
          >
            {loading ? 'Creating Account...' : 'Register Wholesale Account'}
          </button>
        </form>

        <div className="text-center text-xs text-slate-400 pt-2 border-t border-slate-800">
          Already registered?{' '}
          <Link to="/login" className="text-cyan-400 font-bold hover:underline">
            Login Here
          </Link>
        </div>
      </div>
    </div>
  );
}
