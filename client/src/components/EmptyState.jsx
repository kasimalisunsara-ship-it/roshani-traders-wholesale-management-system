import React from 'react';
import { PackageSearch } from 'lucide-react';

export default function EmptyState({ title = 'No Products Found', message = 'Try adjusting your search keywords or filter options to locate matching items.', action }) {
  return (
    <div className="glass-card rounded-2xl p-12 text-center max-w-lg mx-auto my-8 space-y-4">
      <div className="w-16 h-16 bg-slate-800/80 rounded-2xl flex items-center justify-center mx-auto text-slate-400">
        <PackageSearch className="w-8 h-8 text-cyan-400" />
      </div>
      <h3 className="text-xl font-bold text-white">{title}</h3>
      <p className="text-sm text-slate-400 leading-relaxed">{message}</p>
      {action && <div className="pt-2">{action}</div>}
    </div>
  );
}
