import React, { useState } from 'react';
import { FileSpreadsheet, Plus } from 'lucide-react';
import { ReportBuilderModal } from '../components/reports/ReportBuilderModal';
import { GlassCard } from '../components/common/GlassCard';
import { useInvestigationStore } from '../store/useInvestigationStore';

export const Reports: React.FC = () => {
  const [isBuilderOpen, setIsBuilderOpen] = useState(false);
  const { investigations } = useInvestigationStore();

  return (
    <div className="space-y-6 pb-12 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white font-mono flex items-center gap-2">
            <FileSpreadsheet className="w-5 h-5 text-cyan-400" /> OSINT Report Center
          </h1>
          <p className="text-xs text-slate-400 font-mono mt-0.5">
            Generate executive summaries, findings timelines, and PDF/HTML report exports.
          </p>
        </div>

        <button
          onClick={() => setIsBuilderOpen(true)}
          className="h-10 px-4 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-mono font-bold flex items-center justify-center gap-2 shadow-glow-cyan transition-colors"
        >
          <Plus className="w-4 h-4" /> Build Custom Report
        </button>
      </div>

      {/* Report Generator Action Card */}
      <GlassCard glow="cyan">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 p-2">
          <div className="space-y-2">
            <h3 className="text-base font-bold text-white font-mono">
              Enterprise Defensive Investigation Report Generator
            </h3>
            <p className="text-xs text-slate-300 max-w-xl leading-relaxed">
              Compile investigation metadata, target profiles, key findings, analyst observations, and evidence inventories into professional PDF documents or printable HTML pages.
            </p>
            <div className="flex items-center gap-4 text-xs font-mono text-cyan-400 pt-1">
              <span>● Classification Header Support</span>
              <span>● PDF Export</span>
              <span>● Print-Ready HTML</span>
            </div>
          </div>

          <button
            onClick={() => setIsBuilderOpen(true)}
            className="px-6 py-3 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-mono font-bold flex items-center gap-2 shadow-glow-cyan shrink-0 transition-transform hover:scale-105"
          >
            <FileSpreadsheet className="w-5 h-5" /> Launch Report Builder
          </button>
        </div>
      </GlassCard>

      {/* Recent Investigations for One-Click Reports */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold text-slate-300 font-mono uppercase tracking-wider">
          Generate Report by Investigation Case ({investigations.length})
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {investigations.map((inv) => (
            <GlassCard key={inv.id} hoverEffect className="flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-mono text-cyan-400 font-bold px-2 py-0.5 rounded bg-cyan-950 border border-cyan-800">
                  {inv.id}
                </span>
                <h4 className="text-sm font-bold text-white font-mono mt-2">{inv.name}</h4>
                <p className="text-xs text-slate-400 mt-1 line-clamp-2">{inv.description}</p>
              </div>

              <div className="pt-3 mt-4 border-t border-slate-800 flex items-center justify-between">
                <span className="text-[10px] font-mono text-slate-500">Analyst: {inv.analystName}</span>
                <button
                  onClick={() => setIsBuilderOpen(true)}
                  className="px-3 py-1.5 rounded bg-slate-800 hover:bg-cyan-600 hover:text-white text-cyan-400 text-xs font-mono font-semibold flex items-center gap-1.5 transition-colors"
                >
                  <FileSpreadsheet className="w-3.5 h-3.5" /> Generate Report
                </button>
              </div>
            </GlassCard>
          ))}
        </div>
      </div>

      <ReportBuilderModal
        isOpen={isBuilderOpen}
        onClose={() => setIsBuilderOpen(false)}
      />
    </div>
  );
};
