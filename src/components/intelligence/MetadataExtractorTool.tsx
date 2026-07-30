import React, { useState } from 'react';
import { FileText, Upload, ShieldCheck } from 'lucide-react';
import { GlassCard } from '../common/GlassCard';
import { extractFileMetadata, type FileMetadataResult } from '../../lib/metadataExtractor';
import { formatBytes } from '../../lib/utils';
import { useActivityLogStore } from '../../store/useActivityLogStore';

export const MetadataExtractorTool: React.FC = () => {
  const [metadataResult, setMetadataResult] = useState<FileMetadataResult | null>(null);
  const { logActivity } = useActivityLogStore();

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const res = await extractFileMetadata(file);
      setMetadataResult(res);
      logActivity('Metadata Extracted', `Extracted client-side metadata from file: ${file.name}`, 'Evidence');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      <GlassCard>
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 rounded-lg bg-indigo-950 text-indigo-400 border border-indigo-800">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white font-mono">Document & Image Local Metadata Extractor</h3>
            <p className="text-xs text-slate-400">
              Inspect file creation dates, modification history, dimensions, and headers locally in your browser.
            </p>
          </div>
        </div>

        <div className="border-2 border-dashed border-slate-700/80 rounded-xl p-6 flex flex-col items-center justify-center text-center bg-slate-900/50">
          <Upload className="w-10 h-10 text-slate-400 mb-3" />
          <p className="text-xs text-slate-300 font-mono mb-3">
            Select local PDF, DOCX, TXT, CSV, PNG, JPG, or WEBP file
          </p>
          <label className="py-2 px-4 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-mono font-bold cursor-pointer transition-colors shadow-glow-blue">
            Choose File
            <input type="file" onChange={handleFileSelect} className="hidden" />
          </label>
        </div>

        <div className="mt-4 p-3 rounded-lg bg-slate-950/60 border border-slate-800 text-[11px] font-mono text-slate-400 flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>Files are parsed 100% locally in client browser memory. No data is sent to external servers.</span>
        </div>
      </GlassCard>

      {metadataResult && (
        <GlassCard>
          <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
            <h4 className="text-xs font-bold text-white font-mono uppercase tracking-wider">
              Extracted File Attributes: {metadataResult.fileName}
            </h4>
            <span className="text-xs font-mono text-cyan-400 font-bold">
              {formatBytes(metadataResult.fileSize)}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
            {Object.entries(metadataResult.detectedAttributes).map(([key, val]) => (
              <div key={key} className="p-2.5 rounded bg-slate-900 border border-slate-800 font-mono text-xs">
                <span className="text-slate-400 block text-[10px] uppercase">{key}</span>
                <span className="text-slate-200 font-semibold">{String(val)}</span>
              </div>
            ))}
          </div>

          {metadataResult.summaryText && (
            <div className="mt-4 pt-3 border-t border-slate-800">
              <span className="text-xs font-mono text-slate-400 uppercase tracking-wider block mb-2">
                Header Text Sample:
              </span>
              <pre className="p-3 rounded bg-slate-950 text-[11px] font-mono text-slate-300 overflow-x-auto border border-slate-800 max-h-36">
                {metadataResult.summaryText}
              </pre>
            </div>
          )}
        </GlassCard>
      )}
    </div>
  );
};
