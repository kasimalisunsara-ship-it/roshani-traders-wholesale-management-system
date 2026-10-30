import React from 'react';

export default function LoadingSpinner({ message = 'Loading wholesale catalogue...' }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[300px] py-12 space-y-4">
      <div className="relative w-12 h-12">
        <div className="w-12 h-12 rounded-full border-4 border-slate-800 border-t-cyan-500 animate-spin"></div>
        <div className="absolute inset-0 rounded-full border-4 border-transparent border-b-amber-500 animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
      </div>
      <p className="text-sm font-medium text-slate-400 animate-pulse">{message}</p>
    </div>
  );
}
