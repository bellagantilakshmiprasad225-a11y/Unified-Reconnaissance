import React, { useState } from 'react';
import { FileCheck, Search, Download } from 'lucide-react';
import { useEvidenceStore } from '../store/useEvidenceStore';
import { EvidenceCard } from '../components/evidence/EvidenceCard';
import { FileUploader } from '../components/evidence/FileUploader';
import { EmptyState } from '../components/common/EmptyState';
import { ConfirmDialog } from '../components/common/ConfirmDialog';
import { getEvidenceFile } from '../lib/indexedDB';
import type { Evidence as EvidenceType } from '../types';
import { useNotificationStore } from '../store/useNotificationStore';
import { useActivityLogStore } from '../store/useActivityLogStore';

export const Evidence: React.FC = () => {
  const { evidenceList, deleteEvidence } = useEvidenceStore();
  const { addNotification } = useNotificationStore();
  const { logActivity } = useActivityLogStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [fileTypeFilter, setFileTypeFilter] = useState('ALL');
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const [previewItem, setPreviewItem] = useState<EvidenceType | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const filteredEvidence = evidenceList.filter((item) => {
    const matchesQuery =
      item.fileName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesType =
      fileTypeFilter === 'ALL' ||
      (fileTypeFilter === 'IMAGE' && item.fileType.startsWith('image/')) ||
      (fileTypeFilter === 'PDF' && item.fileType.includes('pdf')) ||
      (fileTypeFilter === 'DOC' && (item.fileType.includes('document') || item.fileType.includes('text')));

    return matchesQuery && matchesType;
  });

  const handlePreview = async (item: EvidenceType) => {
    setPreviewItem(item);
    const stored = await getEvidenceFile(item.id);
    if (stored?.blob) {
      const url = URL.createObjectURL(stored.blob);
      setPreviewUrl(url);
    } else {
      setPreviewUrl(null);
    }
  };

  const handleDownload = async (item: EvidenceType) => {
    const stored = await getEvidenceFile(item.id);
    if (stored?.blob) {
      const url = URL.createObjectURL(stored.blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = item.fileName;
      a.click();
      URL.revokeObjectURL(url);
      addNotification('File Downloaded', `Downloaded evidence file: ${item.fileName}`, 'info');
    }
  };

  const handleConfirmDelete = async () => {
    if (!deleteId) return;
    await deleteEvidence(deleteId);
    addNotification('Evidence Deleted', `Deleted evidence item ${deleteId}`, 'warning');
    logActivity('Evidence Deleted', `Deleted evidence item ${deleteId}`, 'Evidence');
    setDeleteId(null);
  };

  return (
    <div className="space-y-6 pb-12 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-white font-mono flex items-center gap-2">
          <FileCheck className="w-5 h-5 text-cyan-400" /> Evidence Manager
        </h1>
        <p className="text-xs text-slate-400 font-mono mt-0.5">
          IndexedDB client-side evidence repository for PNG, JPG, WEBP, PDF, DOCX, TXT, CSV files.
        </p>
      </div>

      {/* Upload Box */}
      <FileUploader />

      {/* Filter Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3 p-4 rounded-xl bg-slate-900/80 border border-slate-800">
        <div className="relative flex-1">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search evidence file name, notes, or tags..."
            className="w-full h-9 pl-9 pr-3 rounded-lg bg-slate-950 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 font-mono"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
        </div>

        <select
          value={fileTypeFilter}
          onChange={(e) => setFileTypeFilter(e.target.value)}
          className="h-9 px-3 rounded-lg bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-cyan-500 font-mono"
        >
          <option value="ALL">All File Types</option>
          <option value="IMAGE">Images (PNG, JPG, WEBP)</option>
          <option value="PDF">PDF Documents</option>
          <option value="DOC">Text & Documents</option>
        </select>
      </div>

      {/* Evidence Grid */}
      {filteredEvidence.length === 0 ? (
        <EmptyState
          title="No evidence items uploaded"
          description="Upload investigation files above to populate your IndexedDB repository."
          icon={FileCheck}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredEvidence.map((item) => (
            <EvidenceCard
              key={item.id}
              evidence={item}
              onPreview={() => handlePreview(item)}
              onDownload={(e) => {
                e.stopPropagation();
                handleDownload(item);
              }}
              onDelete={(e) => {
                e.stopPropagation();
                setDeleteId(item.id);
              }}
            />
          ))}
        </div>
      )}

      {/* Preview Modal */}
      {previewItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="bg-slate-900 border border-slate-700 rounded-xl max-w-2xl w-full p-6 shadow-2xl relative text-slate-100 max-h-[85vh] overflow-y-auto">
            <button
              onClick={() => {
                setPreviewItem(null);
                setPreviewUrl(null);
              }}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              ✕
            </button>
            <h3 className="text-sm font-bold font-mono text-cyan-400 mb-2 truncate">
              {previewItem.fileName}
            </h3>
            <p className="text-xs text-slate-400 mb-4 font-mono">{previewItem.description}</p>

            {previewUrl ? (
              previewItem.fileType.startsWith('image/') ? (
                <img src={previewUrl} alt="Preview" className="max-h-96 mx-auto rounded border border-slate-800 object-contain" />
              ) : (
                <div className="p-6 bg-slate-950 rounded border border-slate-800 text-center font-mono text-xs text-slate-400">
                  Binary document stored in IndexedDB. Click download to view full file.
                </div>
              )
            ) : (
              <div className="p-6 bg-slate-950 rounded border border-slate-800 text-center font-mono text-xs text-slate-500">
                Metadata preview available. File blob in IndexedDB.
              </div>
            )}

            <div className="flex justify-end gap-3 mt-4 pt-3 border-t border-slate-800">
              <button
                onClick={() => handleDownload(previewItem)}
                className="px-4 py-2 rounded bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-mono font-bold flex items-center gap-1.5"
              >
                <Download className="w-4 h-4" /> Download File
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirm Delete */}
      <ConfirmDialog
        isOpen={!!deleteId}
        title="Delete Evidence File"
        message="Are you sure you want to delete this evidence item from IndexedDB?"
        confirmLabel="Delete File"
        isDestructive
        onConfirm={handleConfirmDelete}
        onClose={() => setDeleteId(null)}
      />
    </div>
  );
};
