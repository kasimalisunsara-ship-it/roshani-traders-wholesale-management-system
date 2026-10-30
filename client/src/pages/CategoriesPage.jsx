import React, { useState, useEffect } from 'react';
import API from '../services/api';
import CategoryCard from '../components/CategoryCard';
import Breadcrumbs from '../components/Breadcrumbs';
import LoadingSpinner from '../components/LoadingSpinner';
import { Layers } from 'lucide-react';

export default function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await API.get('/categories');
        if (res.data.success) {
          setCategories(res.data.categories);
        }
      } catch (err) {
        console.error('Failed to fetch categories:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <Breadcrumbs items={[{ label: 'Categories', path: '/categories' }]} />

      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 bg-slate-800 text-cyan-400 px-3.5 py-1.5 rounded-full text-xs font-bold border border-slate-700">
          <Layers className="w-4 h-4 text-cyan-400" />
          <span>EXPLORE BY PRODUCT CATEGORY</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white">Three Wheeler Auto Parts Categories</h1>
        <p className="text-slate-300 text-sm leading-relaxed">
          Select a specialized category below to view wholesale inventory, model fitments, and bulk pricing options.
        </p>
      </div>

      {loading ? (
        <LoadingSpinner message="Fetching categories..." />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat) => (
            <CategoryCard key={cat._id} category={cat} />
          ))}
        </div>
      )}
    </div>
  );
}
