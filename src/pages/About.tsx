import React from 'react';
import { Shield, Info, AlertTriangle, Code } from 'lucide-react';
import { GlassCard } from '../components/common/GlassCard';

export const About: React.FC = () => {
  return (
    <div className="space-y-6 pb-12 animate-fade-in max-w-4xl">
      {/* Header Banner */}
      <GlassCard glow="cyan" className="p-8">
        <div className="flex items-center gap-4 mb-4">
          <div className="p-3.5 rounded-xl bg-cyan-600/20 border border-cyan-500/40 text-cyan-400">
            <Shield className="w-8 h-8 animate-pulse" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-white font-mono tracking-tight">
              Unified Reconnaissance Dashboard
            </h1>
            <p className="text-xs font-mono text-cyan-400 mt-0.5">
              Enterprise OSINT & Investigation Platform v1.0
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6 pt-6 border-t border-slate-800 font-mono text-xs text-slate-300">
          <div>
            <span className="text-slate-500 block text-[10px] uppercase">Author:</span>
            <span className="text-white font-bold text-sm">Lakshmiprasad</span>
          </div>
          <div>
            <span className="text-slate-500 block text-[10px] uppercase">Role:</span>
            <span className="text-cyan-400 font-bold text-sm">Cyber Security Intern</span>
          </div>
        </div>
      </GlassCard>

      {/* Description */}
      <GlassCard>
        <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider mb-3 flex items-center gap-2">
          <Info className="w-4 h-4 text-cyan-400" /> Platform Overview
        </h3>
        <p className="text-xs text-slate-300 leading-relaxed font-mono">
          Unified Reconnaissance Dashboard is an enterprise-grade OSINT platform designed for authorized cybersecurity assessments, security research, and educational purposes. It centralizes publicly available information, organizes digital investigations, manages local evidence files in IndexedDB, and generates professional reports while following strict ethical and legal guidelines.
        </p>
      </GlassCard>

      {/* Safety Notice */}
      <GlassCard className="border-amber-500/30 bg-amber-950/20">
        <h3 className="text-sm font-bold text-amber-300 font-mono uppercase tracking-wider mb-2 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-400" /> Ethical & Safety Guidelines
        </h3>
        <ul className="space-y-1.5 text-xs font-mono text-slate-300 list-disc list-inside">
          <li>100% Defensive OSINT focus: Strictly works with user-provided data and official public search links.</li>
          <li>No automated credential harvesting, brute-forcing, password attacks, or exploit frameworks.</li>
          <li>No unauthorized network port scanning or protected-content scraping.</li>
          <li>Local-first privacy: Investigation records and uploaded evidence files remain local in browser storage.</li>
        </ul>
      </GlassCard>

      {/* Tech Stack */}
      <GlassCard>
        <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider mb-4 flex items-center gap-2">
          <Code className="w-4 h-4 text-cyan-400" /> Technology Architecture
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-xs">
          <div className="p-3 rounded bg-slate-900 border border-slate-800">
            <span className="text-[10px] text-slate-400 block">Frontend</span>
            <span className="text-white font-bold">React + TypeScript</span>
          </div>
          <div className="p-3 rounded bg-slate-900 border border-slate-800">
            <span className="text-[10px] text-slate-400 block">Build & Styling</span>
            <span className="text-white font-bold">Vite + Tailwind CSS</span>
          </div>
          <div className="p-3 rounded bg-slate-900 border border-slate-800">
            <span className="text-[10px] text-slate-400 block">State Engine</span>
            <span className="text-white font-bold">Zustand + Storage</span>
          </div>
          <div className="p-3 rounded bg-slate-900 border border-slate-800">
            <span className="text-[10px] text-slate-400 block">Blob Storage</span>
            <span className="text-white font-bold">IndexedDB (idb)</span>
          </div>
        </div>
      </GlassCard>
    </div>
  );
};
