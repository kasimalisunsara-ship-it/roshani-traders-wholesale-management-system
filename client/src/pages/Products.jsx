import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import API from '../services/api';
import ProductCard from '../components/ProductCard';
import Breadcrumbs from '../components/Breadcrumbs';
import SearchBar from '../components/SearchBar';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import { Filter, SlidersHorizontal, RefreshCw, X, ChevronLeft, ChevronRight } from 'lucide-react';

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filter States
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '');
  const [selectedBrand, setSelectedBrand] = useState(searchParams.get('brand') || '');
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [minPrice, setMinPrice] = useState(searchParams.get('minPrice') || '');
  const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || '');
  const [availabilityOnly, setAvailabilityOnly] = useState(searchParams.get('availability') === 'true');
  const [sortOption, setSortOption] = useState(searchParams.get('sort') || 'newest');
  const [currentPage, setCurrentPage] = useState(parseInt(searchParams.get('page')) || 1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Load Categories once
  useEffect(() => {
    const fetchCats = async () => {
      try {
        const res = await API.get('/categories');
        if (res.data.success) {
          setCategories(res.data.categories);
          const rawCat = searchParams.get('category');
          if (rawCat) {
            const matched = res.data.categories.find(
              c => c._id === rawCat || c.name.toLowerCase() === rawCat.toLowerCase()
            );
            if (matched) setSelectedCategory(matched._id);
          }
        }
      } catch (err) {
        console.error('Failed to load categories:', err);
      }
    };
    fetchCats();
  }, []);

  // Fetch Products whenever filters change
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (selectedCategory) params.append('category', selectedCategory);
        if (selectedBrand) params.append('brand', selectedBrand);
        if (searchQuery) params.append('search', searchQuery);
        if (minPrice) params.append('minPrice', minPrice);
        if (maxPrice) params.append('maxPrice', maxPrice);
        if (availabilityOnly) params.append('availability', 'true');
        if (sortOption) params.append('sort', sortOption);
        params.append('page', currentPage);
        params.append('limit', '12');

        const res = await API.get(`/products?${params.toString()}`);
        if (res.data.success) {
          setProducts(res.data.products || []);
          setTotalPages(res.data.pages || 1);
          setTotalCount(res.data.total || 0);
          if (res.data.brands) setBrands(res.data.brands || []);
        }
      } catch (err) {
        console.error('Failed to load products:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [selectedCategory, selectedBrand, searchQuery, minPrice, maxPrice, availabilityOnly, sortOption, currentPage]);

  const handleResetFilters = () => {
    setSelectedCategory('');
    setSelectedBrand('');
    setSearchQuery('');
    setMinPrice('');
    setMaxPrice('');
    setAvailabilityOnly(false);
    setSortOption('newest');
    setCurrentPage(1);
    setSearchParams({});
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <Breadcrumbs items={[{ label: 'Products Catalogue', path: '/products' }]} />

      {/* Title & Top Search Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white">Wholesale Parts Catalogue</h1>
          <p className="text-xs text-slate-400 mt-1">
            Showing <strong className="text-cyan-400">{totalCount}</strong> verified auto parts & accessories
          </p>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="flex-1 md:w-80">
            <SearchBar
              onSearch={(term) => {
                setSearchQuery(term);
                setCurrentPage(1);
              }}
              placeholder="Search Bumper, Side Mirror, Brake Shoe..."
            />
          </div>
          <button
            onClick={() => setMobileFilterOpen(true)}
            className="lg:hidden p-3 bg-slate-800 text-white rounded-xl border border-slate-700 flex items-center gap-2 text-xs font-bold"
          >
            <Filter className="w-4 h-4 text-cyan-400" />
            Filters
          </button>
        </div>
      </div>

      {/* Main Grid: Sidebar + Product Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Desktop Filter Sidebar */}
        <div className="hidden lg:block space-y-6 glass-panel p-6 rounded-2xl border border-slate-800 h-fit sticky top-28">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <h3 className="font-extrabold text-white text-base flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-cyan-400" /> Filter Catalogue
            </h3>
            <button
              onClick={handleResetFilters}
              className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-1"
            >
              <RefreshCw className="w-3 h-3" /> Reset
            </button>
          </div>

          {/* Category Filter */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase text-slate-400 tracking-wider">Category</label>
            <select
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full bg-slate-900 text-white text-xs p-3 rounded-xl border border-slate-800 focus:border-cyan-500 focus:outline-none"
            >
              <option value="">All Categories</option>
              {categories.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Brand Filter */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase text-slate-400 tracking-wider">Brand</label>
            <select
              value={selectedBrand}
              onChange={(e) => {
                setSelectedBrand(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full bg-slate-900 text-white text-xs p-3 rounded-xl border border-slate-800 focus:border-cyan-500 focus:outline-none"
            >
              <option value="">All Brands</option>
              {brands.map((b, idx) => (
                <option key={idx} value={b}>
                  {b}
                </option>
              ))}
            </select>
          </div>

          {/* Price Range Filter */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase text-slate-400 tracking-wider">Price Range (₹)</label>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="number"
                placeholder="Min ₹"
                value={minPrice}
                onChange={(e) => {
                  setMinPrice(e.target.value);
                  setCurrentPage(1);
                }}
                className="bg-slate-900 text-white text-xs p-2.5 rounded-xl border border-slate-800 focus:border-cyan-500 focus:outline-none"
              />
              <input
                type="number"
                placeholder="Max ₹"
                value={maxPrice}
                onChange={(e) => {
                  setMaxPrice(e.target.value);
                  setCurrentPage(1);
                }}
                className="bg-slate-900 text-white text-xs p-2.5 rounded-xl border border-slate-800 focus:border-cyan-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Availability Toggle */}
          <div className="pt-2 flex items-center justify-between border-t border-slate-800">
            <span className="text-xs font-medium text-slate-300">In Stock Only</span>
            <input
              type="checkbox"
              checked={availabilityOnly}
              onChange={(e) => {
                setAvailabilityOnly(e.target.checked);
                setCurrentPage(1);
              }}
              className="w-4 h-4 accent-cyan-500 rounded cursor-pointer"
            />
          </div>
        </div>

        {/* Product Display Grid Section */}
        <div className="lg:col-span-3 space-y-6">
          {/* Sorting Bar */}
          <div className="glass-card p-4 rounded-2xl border border-slate-800 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-400">
            <span>
              Page <strong className="text-white">{currentPage}</strong> of <strong className="text-white">{totalPages}</strong>
            </span>
            
            <div className="flex items-center gap-2">
              <label htmlFor="sort" className="font-semibold text-slate-300">Sort By:</label>
              <select
                id="sort"
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
                className="bg-slate-900 text-white text-xs p-2 rounded-xl border border-slate-800 focus:border-cyan-500 focus:outline-none font-medium"
              >
                <option value="newest">Newest Arrival</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="name-asc">Product Name (A-Z)</option>
              </select>
            </div>
          </div>

          {/* Products Grid */}
          {loading ? (
            <LoadingSpinner message="Fetching matching wholesale products..." />
          ) : products.length === 0 ? (
            <EmptyState
              title="No Products Match Your Criteria"
              message="Try broadening your category filter or search keywords."
              action={
                <button
                  onClick={handleResetFilters}
                  className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold px-5 py-2.5 rounded-xl text-xs"
                >
                  Clear All Filters
                </button>
              }
            />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-6">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="p-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl border border-slate-800 disabled:opacity-40"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => setCurrentPage(p)}
                  className={`w-9 h-9 text-xs font-bold rounded-xl transition-colors ${
                    p === currentPage
                      ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                      : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800'
                  }`}
                >
                  {p}
                </button>
              ))}

              <button
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="p-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl border border-slate-800 disabled:opacity-40"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
