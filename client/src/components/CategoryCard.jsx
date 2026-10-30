import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Layers } from 'lucide-react';
import { handleImageError } from '../utils/placeholder';

export default function CategoryCard({ category }) {
  return (
    <Link
      to={`/products?category=${category._id}`}
      className="glass-card rounded-2xl overflow-hidden group relative flex flex-col justify-end h-56 p-6 border border-slate-800"
    >
      {/* Background Image overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src={category.image || 'https://images.unsplash.com/photo-1486006920555-c77dce18193b?auto=format&fit=crop&w=600&q=80'}
          alt={category.name}
          onError={handleImageError}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-40 group-hover:opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-transparent"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-cyan-400 bg-cyan-950/80 px-2.5 py-1 rounded-md border border-cyan-800/50 backdrop-blur-sm">
            {category.productCount || 0} Products
          </span>
          <div className="w-8 h-8 rounded-full bg-slate-800/80 text-cyan-400 flex items-center justify-center group-hover:bg-cyan-500 group-hover:text-slate-950 transition-colors">
            <ArrowRight className="w-4 h-4" />
          </div>
        </div>

        <h3 className="text-xl font-extrabold text-white group-hover:text-cyan-400 transition-colors">
          {category.name}
        </h3>

        <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
          {category.description || 'Browse premium three-wheeler wholesale inventory.'}
        </p>
      </div>
    </Link>
  );
}
