import React from 'react';

export const LoadingSkeleton: React.FC<{ count?: number }> = ({ count = 3 }) => {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="p-5 rounded-xl bg-slate-900/60 border border-slate-800 animate-pulse flex flex-col space-y-3"
        >
          <div className="h-4 bg-slate-800 rounded w-1/3" />
          <div className="h-3 bg-slate-800/80 rounded w-3/4" />
          <div className="h-3 bg-slate-800/50 rounded w-1/2" />
        </div>
      ))}
    </div>
  );
};
