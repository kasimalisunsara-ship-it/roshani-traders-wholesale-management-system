import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';

export default function Breadcrumbs({ items }) {
  const location = useLocation();

  if (!items) {
    const pathnames = location.pathname.split('/').filter((x) => x);
    items = [
      { label: 'Home', path: '/' },
      ...pathnames.map((name, index) => {
        const routeTo = `/${pathnames.slice(0, index + 1).join('/')}`;
        const formattedName = name.charAt(0).toUpperCase() + name.slice(1).replace('-', ' ');
        return { label: formattedName, path: routeTo };
      })
    ];
  }

  return (
    <nav className="flex items-center text-xs text-slate-400 py-3 mb-6 border-b border-slate-800/60 overflow-x-auto">
      <Link to="/" className="flex items-center gap-1 hover:text-cyan-400 shrink-0">
        <Home className="w-3.5 h-3.5" />
        <span>Home</span>
      </Link>
      {items.map((item, idx) => (
        <React.Fragment key={idx}>
          <ChevronRight className="w-3.5 h-3.5 mx-2 text-slate-600 shrink-0" />
          {idx === items.length - 1 ? (
            <span className="text-cyan-400 font-semibold truncate shrink-0">{item.label}</span>
          ) : (
            <Link to={item.path} className="hover:text-cyan-400 transition-colors shrink-0">
              {item.label}
            </Link>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
}
