import React from 'react';
import { Link } from 'react-router-dom';
import { Wrench, Phone, Mail, MapPin, ShieldCheck, Truck, Clock, Bot, Instagram, MessageSquare } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-950 border-t border-slate-800 text-slate-400 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-slate-800">
          
          {/* Column 1: Company Profile */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-white border border-amber-500/40 p-0.5 flex items-center justify-center overflow-hidden shadow-md">
                <img src="/logo.png" alt="Roshani Traders Logo" className="w-full h-full object-contain rounded-lg" />
              </div>
              <span className="font-extrabold text-lg text-white tracking-tight">ROSHANI TRADERS</span>
            </div>
            <p className="text-sm leading-relaxed text-slate-400">
              India's premier B2B wholesale platform for commercial three-wheeler auto parts, body components, electricals, and custom decorative items. Supplying nationwide to retailers and workshops.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <span className="bg-cyan-950 text-cyan-400 text-xs px-3 py-1 rounded-full border border-cyan-800 font-semibold flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5" /> 100% Genuine Wholesale
              </span>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h3 className="text-white text-base font-bold mb-4 flex items-center gap-2">
              Quick Navigation
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/" className="hover:text-cyan-400 transition-colors">Home Page</Link>
              </li>
              <li>
                <Link to="/products" className="hover:text-cyan-400 transition-colors">Products Catalogue</Link>
              </li>
              <li>
                <Link to="/categories" className="hover:text-cyan-400 transition-colors">Product Categories</Link>
              </li>
              <li>
                <Link to="/cart" className="hover:text-amber-400 transition-colors">Shopping Cart & Checkout</Link>
              </li>
              <li>
                <Link to="/ai-assistant" className="hover:text-amber-400 text-amber-400/90 font-medium flex items-center gap-1.5">
                  <Bot className="w-4 h-4" /> AI Auto Parts Assistant
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-cyan-400 transition-colors">About Roshani Traders</Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-cyan-400 transition-colors">Contact & Enquiry</Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Compatible Vehicle Models */}
          <div>
            <h3 className="text-white text-base font-bold mb-4">Supported Models</h3>
            <ul className="space-y-2.5 text-sm">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
                <span>Bajaj RE Compact & Maxima</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
                <span>Piaggio Ape City & Xtra LD</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
                <span>TVS King Deluxe & Duramax</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
                <span>Mahindra Alfa Passengers & Cargo</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
                <span>Universal Three Wheeler Accessories</span>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact Information */}
          <div className="space-y-3">
            <h3 className="text-white text-base font-bold mb-4">Wholesale Support</h3>
            <div className="flex items-start gap-3 text-sm">
              <MapPin className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
              <span>Ajit Glass, Swami Vivekanand Rd, nr. Himalaya hotel, Behram Baug, Jogeshwari West, Mumbai, Maharashtra 400102, India</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Phone className="w-4 h-4 text-cyan-400 shrink-0" />
              <span>+91 98929 87454 / +91 98984 01179</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Mail className="w-4 h-4 text-cyan-400 shrink-0" />
              <a href="mailto:roshanitraders780@gmail.com" className="text-cyan-400 hover:underline">
                roshanitraders780@gmail.com
              </a>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <Clock className="w-4 h-4 text-cyan-400 shrink-0" />
              <span>Mon - Sat: 9:00 AM - 8:00 PM</span>
            </div>
            <div className="pt-2 flex flex-wrap gap-2">
              <a
                href="https://wa.me/918879003738?text=Hello%20Roshani%20Traders%2C%20I%20would%20like%20to%20enquire%20about%20wholesale%20three%20wheeler%20auto%20parts."
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-3.5 py-2 rounded-xl transition-all shadow-md"
              >
                <MessageSquare className="w-4 h-4" /> WhatsApp Chat
              </a>
              <a
                href="https://www.instagram.com/roshanitraders_official?igsi=em9xYXFhZHR3Zzdz"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-gradient-to-r from-pink-600 to-purple-600 hover:brightness-110 text-white text-xs font-bold px-3.5 py-2 rounded-xl transition-all shadow-md"
              >
                <Instagram className="w-4 h-4" /> Instagram
              </a>
            </div>
          </div>
        </div>

        {/* Footer Bottom bar */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} Roshani Traders. All rights reserved. Wholesale Three Wheeler Auto Parts Management System.</p>
          <div className="flex items-center gap-4">
            <Link to="/admin/login" className="hover:text-slate-300 transition-colors">Admin Login</Link>
            <span>•</span>
            <Link to="/privacy" className="hover:text-slate-300 transition-colors">Wholesale Policy</Link>
            <span>•</span>
            <Link to="/terms" className="hover:text-slate-300 transition-colors">Terms of Trade</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
