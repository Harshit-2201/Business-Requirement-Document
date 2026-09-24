import React from 'react';

export const SkeletonCard: React.FC = () => {
  return (
    <div className="p-4 rounded-2xl border border-slate-800 bg-slate-900/60 animate-pulse">
      <div className="flex items-center gap-3.5">
        <div className="w-10 h-10 rounded-xl bg-slate-800 shrink-0" />
        <div className="flex-1 space-y-2">
          <div className="w-2/3 h-4 bg-slate-800 rounded" />
          <div className="w-1/3 h-3 bg-slate-800/60 rounded" />
        </div>
      </div>
      <div className="mt-4 pt-3 border-t border-slate-800/60 flex items-center justify-between">
        <div className="w-32 h-6 bg-slate-800/80 rounded" />
        <div className="flex gap-2">
          <div className="w-7 h-7 bg-slate-800 rounded" />
          <div className="w-7 h-7 bg-slate-800 rounded" />
        </div>
      </div>
    </div>
  );
};
