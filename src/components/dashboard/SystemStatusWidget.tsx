import React, { useEffect, useState } from 'react';
import { Database, HardDrive, Cpu, CheckCircle2 } from 'lucide-react';
import { GlassCard } from '../common/GlassCard';

export const SystemStatusWidget: React.FC = () => {
  const [localStorageUsage, setLocalStorageUsage] = useState<string>('0 KB');

  useEffect(() => {
    let total = 0;
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key) {
        total += (localStorage.getItem(key)?.length || 0) * 2;
      }
    }
    setLocalStorageUsage(`${(total / 1024).toFixed(1)} KB`);
  }, []);

  return (
    <GlassCard className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xs font-bold text-white font-mono uppercase tracking-wider flex items-center gap-2">
          <Cpu className="w-4 h-4 text-emerald-400" /> System & Storage Status
        </h3>
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
          <CheckCircle2 className="w-3 h-3" /> Operational
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="p-3 rounded-lg bg-slate-900/70 border border-slate-800 flex items-center gap-3">
          <div className="p-2 rounded bg-cyan-950 text-cyan-400 border border-cyan-800">
            <HardDrive className="w-4 h-4" />
          </div>
          <div>
            <p className="text-[10px] font-mono text-slate-400">LocalStorage</p>
            <p className="text-xs font-bold font-mono text-white mt-0.5">{localStorageUsage}</p>
          </div>
        </div>

        <div className="p-3 rounded-lg bg-slate-900/70 border border-slate-800 flex items-center gap-3">
          <div className="p-2 rounded bg-emerald-950 text-emerald-400 border border-emerald-800">
            <Database className="w-4 h-4" />
          </div>
          <div>
            <p className="text-[10px] font-mono text-slate-400">IndexedDB</p>
            <p className="text-xs font-bold font-mono text-white mt-0.5">Active Blob Storage</p>
          </div>
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] font-mono text-slate-400 flex items-center justify-between">
        <span>Browser Security API: Enabled</span>
        <span>Ethical OSINT Sandbox</span>
      </div>
    </GlassCard>
  );
};
