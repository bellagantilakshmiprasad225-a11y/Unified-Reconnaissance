import React from 'react';
import { Shield, Lock, Search, Database } from 'lucide-react';

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({ children, title, subtitle }) => {
  return (
    <div className="min-h-screen bg-soc-darker text-slate-100 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden font-sans">
      {/* Background SOC glowing gradients */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-4xl w-full mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-center glass-panel rounded-2xl p-6 sm:p-10 border border-slate-800 shadow-2xl relative z-10">
        {/* Left Column: Enterprise Branding & OSINT Info */}
        <div className="space-y-6 md:pr-6 md:border-r md:border-slate-800/80">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-cyan-600/20 border border-cyan-500/40 text-cyan-400">
              <Shield className="w-8 h-8 animate-pulse" />
            </div>
            <div>
              <h1 className="text-xl font-bold font-mono text-white tracking-tight">
                UNIFIED RECON
              </h1>
              <p className="text-[10px] text-cyan-400 font-mono uppercase tracking-wider">
                Enterprise OSINT Platform
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <h2 className="text-lg font-bold font-mono text-white leading-tight">
              Enterprise OSINT & Digital Investigation Workspace
            </h2>
            <p className="text-xs text-slate-400 leading-relaxed font-mono">
              Secure workspace for authorized cybersecurity assessments, defensive security research, digital investigations, and security awareness demonstrations.
            </p>
          </div>

          <div className="space-y-2 pt-2 border-t border-slate-800/60 font-mono text-xs text-slate-300">
            <div className="flex items-center gap-2 text-cyan-400">
              <Lock className="w-4 h-4 shrink-0" />
              <span>Client-Side Local Data Privacy</span>
            </div>
            <div className="flex items-center gap-2 text-emerald-400">
              <Search className="w-4 h-4 shrink-0" />
              <span>15+ Defensive OSINT Intelligence Modules</span>
            </div>
            <div className="flex items-center gap-2 text-amber-400">
              <Database className="w-4 h-4 shrink-0" />
              <span>IndexedDB Local Blob Storage</span>
            </div>
          </div>

          <div className="pt-2 text-[10px] text-slate-500 font-mono">
            Author: Lakshmiprasad • Cyber Security Intern
          </div>
        </div>

        {/* Right Column: Form Container */}
        <div className="space-y-6">
          <div>
            <h3 className="text-xl font-bold font-mono text-white tracking-tight">{title}</h3>
            <p className="text-xs text-slate-400 font-mono mt-1">{subtitle}</p>
          </div>

          {children}
        </div>
      </div>
    </div>
  );
};
