import React, { useState } from 'react';
import { X, FileSpreadsheet, Download, Printer } from 'lucide-react';
import type { Investigation, ReportSection } from '../../types';
import { generateReportPDF } from '../../lib/pdfGenerator';
import { useInvestigationStore } from '../../store/useInvestigationStore';
import { useEvidenceStore } from '../../store/useEvidenceStore';
import { useSettingsStore } from '../../store/useSettingsStore';

interface ReportBuilderModalProps {
  isOpen: boolean;
  onClose: () => void;
  investigation?: Investigation;
}

export const ReportBuilderModal: React.FC<ReportBuilderModalProps> = ({
  isOpen,
  onClose,
  investigation,
}) => {
  const { settings } = useSettingsStore();
  const { evidenceList } = useEvidenceStore();
  const { findings } = useInvestigationStore();

  const [title, setTitle] = useState(
    investigation ? `${investigation.name} - OSINT Report` : 'Enterprise OSINT Investigation Report'
  );
  const [classification, setClassification] = useState<
    'Unclassified' | 'Confidential' | 'Secret' | 'RESTRICTED OSINT'
  >('Confidential');

  const [sections, setSections] = useState<ReportSection>({
    executiveSummary: investigation
      ? `This report summarizes the defensive OSINT investigation for ${investigation.name}. Assessment conducted by analyst ${settings.analystName}.`
      : 'Executive summary of publicly accessible reconnaissance assets and threat posture assessment.',
    targetDetails: 'Primary corporate infrastructure domain and secondary public assets cataloged.',
    timeline: 'Investigation initiated. Public WHOIS, DNS records, and document metadata audited.',
    findings: findings.length > 0 ? findings.map((f) => `- [${f.severity}] ${f.title}: ${f.description}`).join('\n') : 'No high-risk vulnerabilities identified.',
    evidenceList: evidenceList.length > 0 ? evidenceList.map((e) => `- ${e.fileName} (${e.fileType})`).join('\n') : 'No physical evidence files attached.',
    analystNotes: investigation?.notes || 'Analyst observation: all public endpoints comply with defensive guidelines.',
    recommendations: '1. Enforce DMARC p=reject policy.\n2. Scrub document EXIF headers before public hosting.\n3. Conduct quarterly OSINT footprint reviews.',
    conclusion: 'Investigation completed. Defensive posture verified.',
  });

  if (!isOpen) return null;

  const handleExportPDF = () => {
    generateReportPDF({
      reportTitle: title,
      classification,
      analystName: settings.analystName,
      investigation,
      sections,
    });
  };

  const handlePrintHTML = () => {
    const printWin = window.open('', '_blank');
    if (!printWin) return;
    printWin.document.write(`
      <html>
        <head>
          <title>${title}</title>
          <style>
            body { font-family: monospace; padding: 40px; color: #0f172a; background: #fff; }
            h1 { color: #1e40af; border-bottom: 2px solid #1e40af; padding-bottom: 8px; }
            .badge { font-weight: bold; color: #dc2626; border: 1px solid #dc2626; padding: 2px 6px; }
            .section { margin-bottom: 24px; }
            .section-title { font-weight: bold; color: #0284c7; margin-bottom: 6px; font-size: 14px; text-transform: uppercase; }
            pre { background: #f8fafc; padding: 12px; border: 1px solid #e2e8f0; font-size: 12px; }
          </style>
        </head>
        <body>
          <div style="display:flex; justify-content:space-between; align-items:center;">
            <h1>UNIFIED RECONNAISSANCE REPORT</h1>
            <span class="badge">CLASSIFICATION: ${classification}</span>
          </div>
          <p><strong>Title:</strong> ${title}</p>
          <p><strong>Analyst:</strong> ${settings.analystName} (${settings.analystRole})</p>
          <p><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
          <hr/>
          ${Object.entries(sections).map(([k, v]) => `
            <div class="section">
              <div class="section-title">${k.replace(/([A-Z])/g, ' $1')}</div>
              <pre>${v}</pre>
            </div>
          `).join('')}
        </body>
      </html>
    `);
    printWin.document.close();
    printWin.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="bg-slate-900 border border-slate-700/80 rounded-xl max-w-3xl w-full p-6 shadow-2xl relative text-slate-100 max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        <h3 className="text-lg font-bold font-mono mb-4 flex items-center gap-2">
          <FileSpreadsheet className="w-5 h-5 text-cyan-400" /> Professional Report Generator
        </h3>

        <div className="space-y-4 mb-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono text-slate-400 mb-1">Report Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full h-9 px-3 rounded bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-cyan-500 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-400 mb-1">Classification Label</label>
              <select
                value={classification}
                onChange={(e) => setClassification(e.target.value as any)}
                className="w-full h-9 px-3 rounded bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-cyan-500 font-mono"
              >
                <option value="Unclassified">Unclassified</option>
                <option value="Confidential">Confidential</option>
                <option value="Secret">Secret</option>
                <option value="RESTRICTED OSINT">RESTRICTED OSINT</option>
              </select>
            </div>
          </div>

          {/* Section Editors */}
          {Object.entries(sections).map(([key, val]) => (
            <div key={key}>
              <label className="block text-xs font-mono text-cyan-400 capitalize mb-1">
                {key.replace(/([A-Z])/g, ' $1')}
              </label>
              <textarea
                value={val}
                onChange={(e) => setSections({ ...sections, [key]: e.target.value })}
                className="w-full p-2.5 rounded bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-cyan-500 font-mono h-16 resize-none"
              />
            </div>
          ))}
        </div>

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold rounded bg-slate-800 hover:bg-slate-700 text-slate-300"
          >
            Cancel
          </button>
          <button
            onClick={handlePrintHTML}
            className="px-4 py-2 text-xs font-semibold rounded bg-slate-700 hover:bg-slate-600 text-white flex items-center gap-1.5"
          >
            <Printer className="w-4 h-4" /> Print HTML Report
          </button>
          <button
            onClick={handleExportPDF}
            className="px-4 py-2 text-xs font-semibold rounded bg-cyan-600 hover:bg-cyan-500 text-white flex items-center gap-1.5 shadow-glow-cyan"
          >
            <Download className="w-4 h-4" /> Export PDF Report
          </button>
        </div>
      </div>
    </div>
  );
};
