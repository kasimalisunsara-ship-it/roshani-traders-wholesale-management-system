import React, { useContext, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';
import {
  Wrench,
  Search,
  ShoppingBag,
  User,
  Bot,
  LogOut,
  Menu,
  X,
  ShieldCheck,
  Package,
  Layers,
  PhoneCall,
  Info,
  MessageSquare,
  Truck
} from 'lucide-react';

export default function Navbar() {
  const { user, logout, isAdmin } = useContext(AuthContext);
  const { cartCount } = useContext(CartContext);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <header className="sticky top-0 z-40 w-full bg-slate-950/95 backdrop-blur-md border-b border-slate-800">
      {/* Top Banner Notice */}
      <div className="bg-gradient-to-r from-slate-900 via-amber-950/60 to-slate-900 text-amber-200 text-[11px] py-1 px-4 text-center border-b border-amber-900/30 flex items-center justify-center gap-2">
        <span className="bg-amber-500 text-slate-950 px-2 py-0.5 rounded font-black text-[9px] uppercase tracking-wider">
          THREE WHEELER AUTO PARTS
        </span>
        <span className="truncate">India's #1 Wholesale Hub for Bajaj RE, TVS King, Piaggio Ape & Mahindra Alfa Parts</span>
      </div>

      <div className="max-w-7xl mx-auto px-3 sm:px-6">
        <div className="flex items-center justify-between h-16 sm:h-18 gap-2">
          
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-2.5 shrink-0 group">
            <div className="w-10 h-10 rounded-xl bg-white border border-amber-500/40 p-0.5 shadow-md shadow-amber-500/10 group-hover:scale-105 transition-transform flex items-center justify-center overflow-hidden">
              <img src="/logo.png" alt="Roshani Traders Logo" className="w-full h-full object-contain rounded-lg" />
            </div>
            <div className="hidden min-[360px]:block">
              <span className="font-extrabold text-base sm:text-xl tracking-tight text-white group-hover:text-amber-400 transition-colors block leading-none">
                ROSHANI TRADERS
              </span>
              <p className="text-[9px] sm:text-[10px] font-bold text-amber-400 tracking-wider uppercase mt-0.5">
                3-Wheeler Auto Parts Wholesale
              </p>
            </div>
          </Link>

          {/* Desktop & Tablet Navigation Links - ALWAYS VISIBLE from lg screens */}
          <nav className="hidden lg:flex items-center gap-1 text-xs">
            <Link
              to="/"
              className={`px-2.5 py-1.5 rounded-lg font-semibold transition-colors ${
                isActive('/') ? 'bg-amber-500/15 text-amber-400 font-bold' : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              Home
            </Link>
            <Link
              to="/products"
              className={`px-2.5 py-1.5 rounded-lg font-semibold transition-colors ${
                isActive('/products') ? 'bg-amber-500/15 text-amber-400 font-bold' : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              Parts Catalog
            </Link>
            <Link
              to="/categories"
              className={`px-2.5 py-1.5 rounded-lg font-semibold transition-colors ${
                isActive('/categories') ? 'bg-amber-500/15 text-amber-400 font-bold' : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              Categories
            </Link>
            <Link
              to="/about"
              className={`px-2.5 py-1.5 rounded-lg font-semibold transition-colors ${
                isActive('/about') ? 'bg-amber-500/15 text-amber-400 font-bold' : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              About
            </Link>
            <Link
              to="/contact"
              className={`px-2.5 py-1.5 rounded-lg font-semibold transition-colors ${
                isActive('/contact') ? 'bg-amber-500/15 text-amber-400 font-bold' : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              Contact
            </Link>
            <Link
              to="/track"
              className={`px-2.5 py-1.5 rounded-lg font-bold flex items-center gap-1 transition-colors ${
                isActive('/track') ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40' : 'text-cyan-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Truck className="w-3.5 h-3.5" />
              <span>Live Tracking</span>
            </Link>
            <Link
              to="/ai-assistant"
              className={`px-2.5 py-1.5 rounded-lg font-bold flex items-center gap-1 transition-all ${
                isActive('/ai-assistant')
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                  : 'bg-amber-500/10 text-amber-400 border border-amber-500/30 hover:bg-amber-500 hover:text-slate-950'
              }`}
            >
              <Bot className="w-3.5 h-3.5" />
              <span>AI Assistant</span>
            </Link>
          </nav>

          {/* Right Action Icons & Auth */}
          <div className="hidden lg:flex items-center gap-2 text-xs shrink-0">
            <Link
              to="/search"
              className="p-1.5 text-slate-400 hover:text-amber-400 hover:bg-slate-800/60 rounded-xl transition-colors"
              title="Search Auto Parts"
            >
              <Search className="w-4 h-4" />
            </Link>

            {/* WhatsApp Chat */}
            <a
              href="https://wa.me/918879003738?text=Hello%20Roshani%20Traders%2C%20I%20would%20like%20to%20enquire%20about%20auto%20rickshaw%20wholesale%20parts."
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 bg-emerald-600/20 hover:bg-emerald-600 text-emerald-400 hover:text-white px-2 py-1.5 rounded-xl border border-emerald-500/30 font-bold transition-all"
              title="Chat on WhatsApp"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>WhatsApp</span>
            </a>

            {/* Cart Button */}
            <Link
              to="/cart"
              className="relative flex items-center gap-1.5 bg-slate-800/90 hover:bg-slate-800 text-slate-200 hover:text-white px-2.5 py-1.5 rounded-xl border border-slate-700/80 transition-all font-semibold"
            >
              <ShoppingBag className="w-4 h-4 text-amber-400" />
              <span>Cart</span>
              {cartCount > 0 && (
                <span className="bg-amber-500 text-slate-950 font-black text-[11px] px-1.5 py-0.2 rounded-full min-w-[18px] text-center">
                  {cartCount}
                </span>
              )}
            </Link>

            {user ? (
              <div className="flex items-center gap-1.5 pl-2 border-l border-slate-800">
                {isAdmin ? (
                  <Link
                    to="/admin"
                    className="flex items-center gap-1 bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 px-2.5 py-1.5 rounded-xl font-bold hover:brightness-110 shadow-md shadow-amber-500/20"
                  >
                    <ShieldCheck className="w-4 h-4" />
                    Admin
                  </Link>
                ) : (
                  <Link
                    to="/profile"
                    className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-white px-2.5 py-1.5 rounded-xl font-semibold border border-slate-700"
                  >
                    <User className="w-3.5 h-3.5 text-amber-400" />
                    <span>{user.name.split(' ')[0]}</span>
                  </Link>
                )}
                <button
                  onClick={logout}
                  className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-950/30 rounded-xl transition-colors"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 pl-1.5 border-l border-slate-800">
                <Link
                  to="/login"
                  className="text-slate-300 hover:text-white px-2 py-1.5 font-semibold hover:bg-slate-800/60 rounded-xl transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="bg-amber-500 hover:bg-amber-400 text-slate-950 px-2.5 py-1.5 rounded-xl font-extrabold shadow-md shadow-amber-500/20 transition-all hover:scale-105"
                >
                  Wholesale Signup
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle Button */}
          <div className="lg:hidden flex items-center gap-2">
            <Link
              to="/cart"
              className="relative p-2 text-slate-300 hover:text-amber-400 bg-slate-800 rounded-xl"
            >
              <ShoppingBag className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-amber-500 text-slate-950 text-[10px] font-black w-4 h-4 rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-300 hover:text-white bg-slate-800 rounded-xl"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-slate-950/98 border-b border-slate-800 px-4 pt-2 pb-6 space-y-3 text-xs">
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-200 hover:bg-slate-900"
          >
            <Wrench className="w-4 h-4 text-amber-400" />
            Home
          </Link>
          <Link
            to="/products"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-200 hover:bg-slate-900"
          >
            <Package className="w-4 h-4 text-amber-400" />
            Auto Parts Catalogue
          </Link>
          <Link
            to="/categories"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-200 hover:bg-slate-900"
          >
            <Layers className="w-4 h-4 text-amber-400" />
            Product Categories
          </Link>
          <Link
            to="/cart"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-200 hover:bg-slate-900"
          >
            <ShoppingBag className="w-4 h-4 text-amber-400" />
            Cart ({cartCount})
          </Link>
          <Link
            to="/ai-assistant"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-amber-400 bg-amber-950/40 font-bold border border-amber-500/30"
          >
            <Bot className="w-4 h-4 text-amber-400" />
            AI Parts Assistant
          </Link>

          <div className="pt-4 border-t border-slate-800 space-y-2">
            {user ? (
              <>
                {isAdmin ? (
                  <Link
                    to="/admin"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full flex items-center justify-center gap-2 bg-amber-500 text-slate-950 py-2.5 rounded-xl font-bold"
                  >
                    <ShieldCheck className="w-4 h-4" />
                    Admin Panel
                  </Link>
                ) : (
                  <Link
                    to="/profile"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full flex items-center justify-center gap-2 bg-slate-800 text-white py-2.5 rounded-xl font-medium"
                  >
                    <User className="w-4 h-4 text-amber-400" />
                    My Account ({user.name})
                  </Link>
                )}
                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center justify-center gap-2 text-rose-400 bg-rose-950/30 py-2.5 rounded-xl font-medium"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </>
            ) : (
              <div className="grid grid-cols-2 gap-2 pt-2">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-center bg-slate-800 text-white py-2.5 rounded-xl font-medium"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-center bg-amber-500 text-slate-950 font-bold py-2.5 rounded-xl"
                >
                  Signup
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
