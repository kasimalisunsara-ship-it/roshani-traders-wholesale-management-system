import React from 'react';
import Breadcrumbs from '../components/Breadcrumbs';
import { Wrench, ShieldCheck, Truck, Users, Award, CheckCircle2, Building, PackageCheck } from 'lucide-react';

export default function About() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      <Breadcrumbs items={[{ label: 'About Us', path: '/about' }]} />

      {/* Header Banner */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="text-xs font-bold uppercase tracking-wider text-cyan-400 bg-cyan-950/80 px-3 py-1 rounded-md border border-cyan-800">
          ROSHANI TRADERS COMPANY PROFILE
        </span>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white">
          Empowering Three-Wheeler Auto Parts Retailers Worldwide
        </h1>
        <p className="text-slate-300 text-base leading-relaxed">
          Roshani Traders is a premier B2B wholesale distributor headquartered in Delhi NCR, specializing exclusively in replacement spare parts and decorative accessories for passenger and commercial three-wheelers.
        </p>
      </div>

      {/* Image & Mission Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
        <div className="relative rounded-3xl overflow-hidden glass-card border border-slate-800">
          <img
            src="/auto_rickshaw.jpg"
            alt="Modified Three-Wheeler Auto Rickshaw Spare Parts Supplier"
            className="w-full h-[400px] object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent"></div>
          <div className="absolute bottom-6 left-6 right-6">
            <span className="bg-amber-500 text-slate-950 font-bold text-xs px-3 py-1 rounded-md">
              ESTABLISHED SUPPLIER
            </span>
            <h3 className="text-xl font-extrabold text-white mt-2">
              Over 500+ Verified Wholesale Buyers & Workshop Partners
            </h3>
          </div>
        </div>

        <div className="space-y-6">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
            Our Business Vision & Commitment
          </h2>
          <p className="text-slate-300 text-sm leading-relaxed">
            The commercial three-wheeler sector (auto-rickshaws, cargo loaders, delivery vehicles) relies heavily on zero-downtime operations. When a Bajaj RE or Piaggio Ape breaks down, operators need durable, precision-engineered spare parts delivered immediately.
          </p>
          <p className="text-slate-300 text-sm leading-relaxed">
            We bridge the gap between OEM quality manufacturing and regional retail stockists by maintaining a massive ready-stock inventory with transparent wholesale pricing.
          </p>

          <div className="grid grid-cols-2 gap-4 pt-2">
            <div className="bg-slate-900/80 p-4 rounded-2xl border border-slate-800">
              <span className="text-2xl font-extrabold text-cyan-400">10,000+</span>
              <span className="text-xs text-slate-400 block mt-1">Units Shipped Monthly</span>
            </div>
            <div className="bg-slate-900/80 p-4 rounded-2xl border border-slate-800">
              <span className="text-2xl font-extrabold text-amber-400">100%</span>
              <span className="text-xs text-slate-400 block mt-1">Fitment Guarantee</span>
            </div>
          </div>
        </div>
      </div>

      {/* Product Range Breakdown */}
      <div className="glass-panel p-8 sm:p-12 rounded-3xl border border-slate-800 space-y-8">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">Our Comprehensive Product Range</h2>
          <p className="text-sm text-slate-400 mt-2">Engineered specifically for Bajaj RE, Piaggio Ape, TVS King, and Mahindra Alfa</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 space-y-3">
            <Wrench className="w-8 h-8 text-cyan-400" />
            <h3 className="text-lg font-bold text-white">Body & Mechanical Parts</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Heavy gauge steel front & rear bumpers, mudguards, shock absorbers, steering bushes, and suspension pins.
            </p>
          </div>

          <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 space-y-3">
            <ShieldCheck className="w-8 h-8 text-amber-400" />
            <h3 className="text-lg font-bold text-white">Braking & Engine Systems</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Non-asbestos ceramic brake shoe sets, brake drums, clutch plates, air filter cartridges, and rubber mounts.
            </p>
          </div>

          <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 space-y-3">
            <Award className="w-8 h-8 text-emerald-400" />
            <h3 className="text-lg font-bold text-white">Electricals & Accessories</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Halogen headlights, LED tail light pairs, side indicator lamps, ignition switches, chrome grills, and rain canopies.
            </p>
          </div>
        </div>
      </div>

      {/* Why Wholesalers Choose Us */}
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-white text-center">Why Wholesalers Choose Roshani Traders</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="glass-card p-6 rounded-2xl border border-slate-800 text-center space-y-3">
            <div className="w-12 h-12 bg-cyan-950 text-cyan-400 rounded-full flex items-center justify-center mx-auto">
              <Building className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-white text-sm">Factory Direct Sourcing</h4>
            <p className="text-xs text-slate-400">No middleman markups. Direct manufacturer contract rates.</p>
          </div>

          <div className="glass-card p-6 rounded-2xl border border-slate-800 text-center space-y-3">
            <div className="w-12 h-12 bg-amber-950 text-amber-400 rounded-full flex items-center justify-center mx-auto">
              <PackageCheck className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-white text-sm">Clear MOQ Policy</h4>
            <p className="text-xs text-slate-400">Fair minimum quantity requirements tailored for retail shop buyers.</p>
          </div>

          <div className="glass-card p-6 rounded-2xl border border-slate-800 text-center space-y-3">
            <div className="w-12 h-12 bg-emerald-950 text-emerald-400 rounded-full flex items-center justify-center mx-auto">
              <Truck className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-white text-sm">Fast Transport Network</h4>
            <p className="text-xs text-slate-400">Same-day dispatch for confirmed bulk quotation orders.</p>
          </div>

          <div className="glass-card p-6 rounded-2xl border border-slate-800 text-center space-y-3">
            <div className="w-12 h-12 bg-sky-950 text-sky-400 rounded-full flex items-center justify-center mx-auto">
              <Users className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-white text-sm">AI Assistant Support</h4>
            <p className="text-xs text-slate-400">Real-time catalog search and AI quotation generation.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
