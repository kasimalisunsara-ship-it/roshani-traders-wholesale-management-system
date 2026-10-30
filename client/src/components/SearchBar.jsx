import React, { useState } from 'react';
import { Search, X } from 'lucide-react';

export default function SearchBar({ onSearch, placeholder = 'Search Bumper, Side Mirror, Brake Shoe...' }) {
  const [term, setTerm] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSearch) onSearch(term);
  };

  const handleClear = () => {
    setTerm('');
    if (onSearch) onSearch('');
  };

  return (
    <form onSubmit={handleSubmit} className="relative w-full">
      <div className="relative flex items-center">
        <Search className="w-5 h-5 text-slate-400 absolute left-4 pointer-events-none" />
        <input
          type="text"
          value={term}
          onChange={(e) => setTerm(e.target.value)}
          placeholder={placeholder}
          className="w-full bg-slate-900/90 text-white pl-12 pr-10 py-3.5 rounded-2xl border border-slate-700/80 focus:border-cyan-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/20 text-sm placeholder-slate-400 shadow-inner"
        />
        {term && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-3 p-1 text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </form>
  );
}
