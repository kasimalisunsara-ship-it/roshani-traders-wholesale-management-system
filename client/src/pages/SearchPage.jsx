import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import API from '../services/api';
import ProductCard from '../components/ProductCard';
import Breadcrumbs from '../components/Breadcrumbs';
import SearchBar from '../components/SearchBar';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import { Search, Sparkles } from 'lucide-react';

export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get('q') || '');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  const quickSearches = [
    'Stop Mono',
    'Dera Patty Inco',
    'Bumper',
    'Majgad',
    'Monogram Morris',
    'Premium Spoiler',
    'Dashboard',
    'Side Mirror',
    'Brake Shoe',
    'Bajaj RE'
  ];

  useEffect(() => {
    const q = searchParams.get('q');
    if (q) {
      setQuery(q);
      executeSearch(q);
    }
  }, [searchParams]);

  const executeSearch = async (searchTerm) => {
    if (!searchTerm.trim()) return;
    setLoading(true);
    try {
      const res = await API.get(`/products?search=${encodeURIComponent(searchTerm)}`);
      if (res.data.success) {
        setProducts(res.data.products);
      }
    } catch (err) {
      console.error('Search query failed:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (term) => {
    setQuery(term);
    setSearchParams(term ? { q: term } : {});
    executeSearch(term);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <Breadcrumbs items={[{ label: 'Search', path: '/search' }]} />

      <div className="max-w-3xl mx-auto text-center space-y-4">
        <h1 className="text-3xl font-extrabold text-white">Catalogue Search Engine</h1>
        <p className="text-slate-300 text-sm">Search by part name, brand, vehicle model or product specification.</p>

        <SearchBar
          onSearch={handleSearchSubmit}
          placeholder="Type Bumper, Side Mirror, Brake Shoe, Headlight..."
        />

        {/* Quick Tag Chips */}
        <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
          <span className="text-xs text-slate-400 font-semibold flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Popular:
          </span>
          {quickSearches.map((tag) => (
            <button
              key={tag}
              onClick={() => handleSearchSubmit(tag)}
              className="bg-slate-800 hover:bg-slate-700 text-cyan-300 hover:text-white text-xs px-3 py-1 rounded-full border border-slate-700 transition-colors"
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* Search Results Display */}
      {loading ? (
        <LoadingSpinner message={`Searching database for "${query}"...`} />
      ) : query && products.length === 0 ? (
        <EmptyState
          title={`No Results for "${query}"`}
          message="Could not find matching parts in the current catalogue. Try searching with a broader keyword."
        />
      ) : query ? (
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-slate-400">
            Found <span className="text-cyan-400">{products.length}</span> results for "<span className="text-white">{query}</span>"
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center text-slate-500 text-xs py-12">
          Enter a search keyword above to browse live catalogue inventory.
        </div>
      )}
    </div>
  );
}
