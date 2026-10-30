import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../services/api';
import ProductCard from '../components/ProductCard';
import CategoryCard from '../components/CategoryCard';
import LoadingSpinner from '../components/LoadingSpinner';
import {
  Wrench,
  ShieldCheck,
  Truck,
  Bot,
  ShoppingBag,
  Package,
  Award,
  ChevronRight,
  Sparkles,
  CheckCircle2,
  Zap
} from 'lucide-react';

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [popularProducts, setPopularProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [prodRes, catRes] = await Promise.all([
          API.get('/products?limit=8'),
          API.get('/categories')
        ]);

        if (prodRes.data.success) {
          setFeaturedProducts(prodRes.data.products.slice(0, 4));
          setPopularProducts(prodRes.data.products.slice(4, 8));
        }
        if (catRes.data.success) {
          setCategories(catRes.data.categories);
        }
      } catch (err) {
        console.error('Failed to load home data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="space-y-16 pb-16">
      {/* 1. Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 border-b border-slate-800">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-amber-500/10 blur-[120px] rounded-full pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-4xl mx-auto space-y-6">
            
            {/* Top Badge */}
            <div className="inline-flex items-center gap-2 bg-slate-900/90 text-amber-400 border border-amber-500/30 px-4 py-1.5 rounded-full text-xs font-bold shadow-lg backdrop-blur-md">
              <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
              <span>WHOLESALE AUTO RICKSHAW SPARE PARTS PLATFORM</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-none">
              Roshani Traders – <span className="bg-gradient-to-r from-amber-400 via-amber-200 to-emerald-400 bg-clip-text text-transparent">Three Wheeler Auto Parts</span> Wholesale
            </h1>

            {/* Subtitle */}
            <p className="text-slate-300 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
              Direct B2B supply hub for genuine spare parts, cylinder blocks, brake shoes, bumpers, side mirrors & custom chrome accessories for <strong className="text-white">Bajaj RE, Piaggio Ape, TVS King & Mahindra Alfa</strong>.
            </p>

            {/* Hero CTAs */}
            <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
              <Link
                to="/products"
                className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold px-6 py-3.5 rounded-2xl text-sm shadow-xl shadow-amber-500/20 transition-all hover:scale-105 flex items-center gap-2"
              >
                <Package className="w-4 h-4" />
                Browse Auto Parts Catalog
              </Link>
              <Link
                to="/cart"
                className="bg-slate-800 hover:bg-slate-700 text-white font-bold px-6 py-3.5 rounded-2xl text-sm border border-slate-700 transition-all flex items-center gap-2"
              >
                <ShoppingBag className="w-4 h-4 text-amber-400" />
                View Shopping Cart
              </Link>
              <Link
                to="/ai-assistant"
                className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:brightness-110 text-white font-extrabold px-6 py-3.5 rounded-2xl text-sm shadow-xl shadow-emerald-500/20 transition-all hover:scale-105 flex items-center gap-2"
              >
                <Bot className="w-4 h-4 text-white" />
                AI Parts Assistant
              </Link>
            </div>

            {/* Stats Bar */}
            <div className="pt-10 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
              <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800 text-center">
                <span className="block text-2xl font-extrabold text-amber-400">10+</span>
                <span className="text-xs text-slate-400">Part Categories</span>
              </div>
              <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800 text-center">
                <span className="block text-2xl font-extrabold text-emerald-400">100%</span>
                <span className="text-xs text-slate-400">Genuine OEM Parts</span>
              </div>
              <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800 text-center">
                <span className="block text-2xl font-extrabold text-amber-400">500+</span>
                <span className="text-xs text-slate-400">Wholesale Shops</span>
              </div>
              <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800 text-center">
                <span className="block text-2xl font-extrabold text-blue-400">Fast</span>
                <span className="text-xs text-slate-400">Transport Dispatch</span>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. Roshani Traders Overview */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div className="space-y-5">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-400 bg-amber-950/60 px-3 py-1 rounded-md border border-amber-800/40">
              WHOLESALE AUTO PARTS DISTRIBUTOR
            </span>
            <h2 className="text-3xl font-extrabold text-white leading-tight">
              Trusted Supplier for Three-Wheeler Auto Rickshaw Spare Parts
            </h2>
            <p className="text-slate-300 text-sm leading-relaxed">
              At Roshani Traders, we specialize exclusively in three-wheeler auto rickshaw replacement parts. Whether you operate an auto spares retail store, commercial repair shop, or fleet service center, we provide factory-direct wholesale rates, MOQ options, and quick dispatch.
            </p>
            
            <div className="space-y-3 pt-2">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-white">Bajaj RE, TVS King & Piaggio Ape Compatibility</h4>
                  <p className="text-xs text-slate-400">Precision OEM dimensions engineered for standard commercial auto rickshaws.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-white">Add to Cart & Direct Checkout</h4>
                  <p className="text-xs text-slate-400">Seamless ordering with Cash on Delivery, Wholesale Credit, or UPI options.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-white">AI Parts Assistant</h4>
                  <p className="text-xs text-slate-400">Real-time answers for part compatibility, pricing, and stock.</p>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <Link
                to="/about"
                className="inline-flex items-center gap-2 text-amber-400 font-bold text-sm hover:text-amber-300 transition-colors"
              >
                Learn More About Roshani Traders <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Wholesale Highlights Visual Box */}
          <div className="bg-slate-900 p-8 rounded-3xl border border-slate-800 space-y-6 shadow-2xl">
            <h3 className="text-xl font-bold text-white border-b border-slate-800 pb-3">
              Why Shops Choose Roshani Traders
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
                <ShieldCheck className="w-6 h-6 text-amber-400" />
                <h4 className="text-sm font-bold text-white">Strict Quality Standard</h4>
                <p className="text-xs text-slate-400">Built for heavy commercial load and stop-and-go city driving.</p>
              </div>

              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
                <Truck className="w-6 h-6 text-emerald-400" />
                <h4 className="text-sm font-bold text-white">Express Transport Dispatch</h4>
                <p className="text-xs text-slate-400">Daily transport godown shipments to major Indian markets.</p>
              </div>

              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
                <Award className="w-6 h-6 text-blue-400" />
                <h4 className="text-sm font-bold text-white">Transparent MOQs</h4>
                <p className="text-xs text-slate-400">Flexible minimum quantity packs suited for auto spares shops.</p>
              </div>

              <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
                <Bot className="w-6 h-6 text-amber-400" />
                <h4 className="text-sm font-bold text-white">24/7 AI Assistant</h4>
                <p className="text-xs text-slate-400">Check compatibility and specifications anytime.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Product Categories Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-amber-400">AUTO RICKSHAW CATEGORIES</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">Shop by Part Category</h2>
          </div>
          <Link
            to="/categories"
            className="text-xs font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1 self-start sm:self-auto"
          >
            View All Categories ({categories.length}) <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <LoadingSpinner message="Fetching categories..." />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.slice(0, 8).map((category) => (
              <CategoryCard key={category._id} category={category} />
            ))}
          </div>
        )}
      </section>

      {/* 4. Featured Auto Parts */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">HIGH DEMAND STOCK</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">Featured Auto Rickshaw Parts</h2>
          </div>
          <Link
            to="/products"
            className="text-xs font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1 self-start sm:self-auto"
          >
            Full Product Catalog <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <LoadingSpinner message="Loading products..." />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* 5. AI Assistant Banner CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden bg-slate-900 rounded-3xl p-8 sm:p-12 border border-amber-500/30">
          <div className="relative z-10 max-w-2xl space-y-4">
            <div className="inline-flex items-center gap-2 bg-amber-500/20 text-amber-300 px-3.5 py-1 rounded-full text-xs font-extrabold border border-amber-500/40">
              <Bot className="w-4 h-4" /> AI AUTO PARTS ASSISTANT
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
              Need Help Finding the Right Bajaj RE or TVS King Part?
            </h2>
            <p className="text-slate-300 text-sm leading-relaxed">
              Ask our AI Assistant queries like <em className="text-amber-300">“Show cylinder blocks for Bajaj RE 4-stroke”</em> or <em className="text-amber-300">“Which brake shoe fits Piaggio Ape?”</em> to get instant recommendations.
            </p>
            <div className="pt-2 flex flex-wrap gap-4">
              <Link
                to="/ai-assistant"
                className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold px-6 py-3 rounded-xl text-sm shadow-lg shadow-amber-500/20 transition-all hover:scale-105 flex items-center gap-2"
              >
                Launch AI Assistant <Sparkles className="w-4 h-4 text-slate-950" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Popular Products */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-400">TOP SELLERS</span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">Popular Auto Parts & Accessories</h2>
        </div>

        {loading ? (
          <LoadingSpinner />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {popularProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
