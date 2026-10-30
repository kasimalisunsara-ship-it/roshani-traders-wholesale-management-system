import React, { useContext } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import {
  LayoutDashboard,
  Package,
  Layers,
  FileText,
  MessageSquare,
  Users,
  FileCode,
  Store,
  LogOut,
  ShieldCheck,
  Bot,
  Database
} from 'lucide-react';

export default function AdminSidebar() {
  const location = useLocation();
  const { logout, user } = useContext(AuthContext);
  const navigate = useNavigate();

  const navItems = [
    { label: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { label: 'Products', path: '/admin/products', icon: Package },
    { label: 'Add Product', path: '/admin/products/add', icon: Package },
    { label: 'Categories', path: '/admin/categories', icon: Layers },
    { label: 'Customers', path: '/admin/customers', icon: Users },
    { label: 'Orders', path: '/admin/orders', icon: FileText },
    { label: 'Enquiries', path: '/admin/enquiries', icon: MessageSquare },
    { label: 'Content', path: '/admin/content', icon: FileCode },
    { label: 'Catalogue Import', path: '/admin/catalogue-import', icon: Database }
  ];

  return (
    <aside className="w-64 bg-slate-950 border-r border-slate-800 shrink-0 flex flex-col justify-between min-h-screen">
      <div>
        {/* Brand Admin Banner */}
        <div className="p-6 border-b border-slate-800/80">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-white border border-amber-500/40 p-0.5 flex items-center justify-center overflow-hidden shrink-0 shadow-md">
              <img src="/logo.png" alt="Roshani Traders Logo" className="w-full h-full object-contain rounded-lg" />
            </div>
            <div>
              <h2 className="font-extrabold text-white text-base tracking-tight">ADMIN PANEL</h2>
              <p className="text-[11px] text-cyan-400 font-semibold uppercase tracking-wider">Roshani Traders</p>
            </div>
          </div>
        </div>

        {/* User Card */}
        <div className="p-4 mx-3 my-3 bg-slate-900/80 rounded-xl border border-slate-800 text-xs">
          <p className="text-slate-400">Logged in as Administrator</p>
          <p className="font-bold text-white truncate">{user?.email || 'admin@roshanitraders.com'}</p>
        </div>

        {/* Navigation Menu */}
        <nav className="px-3 py-2 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  active
                    ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-md shadow-cyan-600/20'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900'
                }`}
              >
                <Icon className={`w-4 h-4 ${active ? 'text-white' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom Actions */}
      <div className="p-4 border-t border-slate-800 space-y-2">
        <Link
          to="/"
          className="w-full flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-semibold py-2.5 rounded-xl border border-slate-800 transition-colors"
        >
          <Store className="w-4 h-4 text-cyan-400" />
          Customer Website View
        </Link>
        <button
          onClick={() => {
            logout();
            navigate('/admin/login');
          }}
          className="w-full flex items-center justify-center gap-2 bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 text-xs font-semibold py-2.5 rounded-xl border border-rose-900/50 transition-colors"
        >
          <LogOut className="w-4 h-4 text-rose-400" />
          Logout Admin
        </button>
      </div>
    </aside>
  );
}
