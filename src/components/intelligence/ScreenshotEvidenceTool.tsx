import React, { useState } from 'react';
import { Camera, FileCheck, Check, Upload } from 'lucide-react';
import { GlassCard } from '../common/GlassCard';
import { useEvidenceStore } from '../../store/useEvidenceStore';
import { useInvestigationStore } from '../../store/useInvestigationStore';
import { TagInput } from '../common/TagInput';
import { useNotificationStore } from '../../store/useNotificationStore';
import { useActivityLogStore } from '../../store/useActivityLogStore';

export const ScreenshotEvidenceTool: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState<string[]>(['Screenshot', 'WebEvidence']);
  const [investigationId, setInvestigationId] = useState('');
  const [saved, setSaved] = useState(false);

  const { addEvidence } = useEvidenceStore();
  const { investigations } = useInvestigationStore();
  const { addNotification } = useNotificationStore();
  const { logActivity } = useActivityLogStore();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSelectedFile(file);
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
  };

  const handleSaveEvidence = async () => {
    if (!selectedFile) return;

    await addEvidence(
      {
        fileName: selectedFile.name,
        fileSize: selectedFile.size,
        fileType: selectedFile.type || 'image/png',
        description: description || 'Website screenshot evidence captured by analyst',
        tags,
        investigationId: investigationId || undefined,
      },
      selectedFile
    );

    addNotification('Evidence Saved', `Screenshot ${selectedFile.name} attached to evidence inventory.`, 'success');
    logActivity('Evidence Uploaded', `Website screenshot saved: ${selectedFile.name}`, 'Evidence');

    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      setSelectedFile(null);
      setPreviewUrl(null);
      setDescription('');
    }, 2000);
  };

  return (
    <div className="space-y-6">
      <GlassCard>
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 rounded-lg bg-cyan-950 text-cyan-400 border border-cyan-800">
            <Camera className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white font-mono">Website Screenshot Evidence Workflow</h3>
            <p className="text-xs text-slate-400">
              Upload local website screenshots, add analyst observations, and attach directly to investigations.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* File Upload / Preview */}
          <div className="space-y-4">
            <div className="border-2 border-dashed border-slate-700/80 rounded-xl p-6 flex flex-col items-center justify-center text-center bg-slate-900/50 min-h-[200px]">
              {previewUrl ? (
                <div className="space-y-2 w-full">
                  <img src={previewUrl} alt="Screenshot Preview" className="max-h-48 mx-auto rounded-lg border border-slate-700 object-contain" />
                  <p className="text-xs font-mono text-cyan-300 truncate">{selectedFile?.name}</p>
                </div>
              ) : (
                <div className="space-y-3">
                  <Upload className="w-10 h-10 text-slate-400 mx-auto" />
                  <p className="text-xs text-slate-300 font-mono">Upload website screenshot file</p>
                </div>
              )}
            </div>

            <label className="w-full py-2.5 px-4 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono font-semibold flex items-center justify-center gap-2 cursor-pointer border border-slate-700 transition-colors">
              <Upload className="w-4 h-4" /> Select Screenshot Image
              <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
            </label>
          </div>

          {/* Metadata Form */}
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-mono text-slate-400 mb-1">Attach to Investigation</label>
              <select
                value={investigationId}
                onChange={(e) => setInvestigationId(e.target.value)}
                className="w-full h-9 px-3 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-cyan-500 font-mono"
              >
                <option value="">-- Unassigned Evidence --</option>
                {investigations.map((inv) => (
                  <option key={inv.id} value={inv.id}>
                    {inv.id} - {inv.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-400 mb-1">Analyst Observations / Notes</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe visible headers, domain names, or unlinked text..."
                className="w-full p-2.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-cyan-500 font-mono h-20 resize-none"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-400 mb-1">Tags</label>
              <TagInput tags={tags} onChange={setTags} />
            </div>

            <button
              onClick={handleSaveEvidence}
              disabled={!selectedFile}
              className="w-full py-2.5 px-4 rounded-lg bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-white text-xs font-mono font-bold flex items-center justify-center gap-2 transition-colors shadow-glow-cyan"
            >
              {saved ? (
                <>
                  <Check className="w-4 h-4 text-white" /> Saved to Evidence Store
                </>
              ) : (
                <>
                  <FileCheck className="w-4 h-4" /> Save Evidence File
                </>
              )}
            </button>
          </div>
        </div>
      </GlassCard>
    </div>
  );
};
