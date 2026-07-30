import React, { useState } from 'react';
import { Upload, FileCheck } from 'lucide-react';
import { GlassCard } from '../common/GlassCard';
import { useEvidenceStore } from '../../store/useEvidenceStore';
import { useInvestigationStore } from '../../store/useInvestigationStore';
import { TagInput } from '../common/TagInput';
import { useNotificationStore } from '../../store/useNotificationStore';
import { useActivityLogStore } from '../../store/useActivityLogStore';

interface FileUploaderProps {
  onSuccess?: () => void;
}

export const FileUploader: React.FC<FileUploaderProps> = ({ onSuccess }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState<string[]>(['OSINT', 'Evidence']);
  const [investigationId, setInvestigationId] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  const { addEvidence } = useEvidenceStore();
  const { investigations } = useInvestigationStore();
  const { addNotification } = useNotificationStore();
  const { logActivity } = useActivityLogStore();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setSelectedFile(file);
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setIsUploading(true);
    try {
      await addEvidence(
        {
          fileName: selectedFile.name,
          fileSize: selectedFile.size,
          fileType: selectedFile.type || 'application/octet-stream',
          description: description || 'Investigation evidence item',
          tags,
          investigationId: investigationId || undefined,
        },
        selectedFile
      );

      addNotification('Evidence Uploaded', `File ${selectedFile.name} stored in IndexedDB repository.`, 'success');
      logActivity('Evidence Uploaded', `Uploaded file ${selectedFile.name} (${(selectedFile.size / 1024).toFixed(1)} KB)`, 'Evidence');

      setSelectedFile(null);
      setDescription('');
      if (onSuccess) onSuccess();
    } catch (err) {
      console.error(err);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <GlassCard>
      <h3 className="text-sm font-bold text-white font-mono mb-3 uppercase tracking-wider flex items-center gap-2">
        <Upload className="w-4 h-4 text-cyan-400" /> Evidence Storage Uploader (IndexedDB)
      </h3>

      <div className="space-y-4">
        <div className="border-2 border-dashed border-slate-700/80 rounded-xl p-5 flex flex-col items-center justify-center text-center bg-slate-900/50">
          <Upload className="w-8 h-8 text-slate-400 mb-2" />
          <p className="text-xs text-slate-300 font-mono">
            {selectedFile ? selectedFile.name : 'Select PNG, JPG, WEBP, PDF, DOCX, TXT, CSV evidence'}
          </p>
          <label className="mt-3 py-1.5 px-4 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono font-medium cursor-pointer border border-slate-700">
            Browse File
            <input
              type="file"
              onChange={handleFileChange}
              accept=".png,.jpg,.jpeg,.webp,.pdf,.docx,.txt,.csv"
              className="hidden"
            />
          </label>
        </div>

        {selectedFile && (
          <div className="space-y-3 pt-2">
            <div>
              <label className="block text-xs font-mono text-slate-400 mb-1">Attach to Investigation</label>
              <select
                value={investigationId}
                onChange={(e) => setInvestigationId(e.target.value)}
                className="w-full h-9 px-3 rounded bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-cyan-500 font-mono"
              >
                <option value="">-- Unassigned --</option>
                {investigations.map((inv) => (
                  <option key={inv.id} value={inv.id}>
                    {inv.id} - {inv.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-400 mb-1">Description</label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Brief description of evidence..."
                className="w-full h-9 px-3 rounded bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-cyan-500 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-400 mb-1">Tags</label>
              <TagInput tags={tags} onChange={setTags} />
            </div>

            <button
              onClick={handleUpload}
              disabled={isUploading}
              className="w-full py-2 px-4 rounded bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-mono font-bold flex items-center justify-center gap-2 shadow-glow-cyan"
            >
              <FileCheck className="w-4 h-4" /> Save Evidence File
            </button>
          </div>
        )}
      </div>
    </GlassCard>
  );
};
