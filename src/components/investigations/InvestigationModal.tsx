import React, { useState, useEffect } from 'react';
import { X, FolderLock, Save } from 'lucide-react';
import type { Investigation, PriorityLevel, InvestigationStatus } from '../../types';
import { TagInput } from '../common/TagInput';

interface InvestigationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Omit<Investigation, 'id' | 'createdAt' | 'updatedAt'>) => void;
  initialData?: Investigation | null;
}

export const InvestigationModal: React.FC<InvestigationModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData,
}) => {
  const [name, setName] = useState('');
  const [analystName, setAnalystName] = useState('Lakshmiprasad');
  const [priority, setPriority] = useState<PriorityLevel>('Medium');
  const [status, setStatus] = useState<InvestigationStatus>('In Progress');
  const [description, setDescription] = useState('');
  const [notes, setNotes] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
      setAnalystName(initialData.analystName);
      setPriority(initialData.priority);
      setStatus(initialData.status);
      setDescription(initialData.description);
      setNotes(initialData.notes);
      setTags(initialData.tags || []);
    } else {
      setName('');
      setAnalystName('Lakshmiprasad');
      setPriority('Medium');
      setStatus('In Progress');
      setDescription('');
      setNotes('');
      setTags(['OSINT']);
    }
    setError('');
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Investigation name is required.');
      return;
    }
    onSave({
      name: name.trim(),
      analystName: analystName.trim() || 'Lakshmiprasad',
      date: new Date().toISOString().split('T')[0],
      priority,
      status,
      description: description.trim(),
      notes: notes.trim(),
      tags,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="bg-slate-900 border border-slate-700/80 rounded-xl max-w-lg w-full p-6 shadow-2xl relative text-slate-100 max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        <h3 className="text-lg font-bold font-mono mb-4 flex items-center gap-2">
          <FolderLock className="w-5 h-5 text-cyan-400" />
          {initialData ? 'Edit Investigation' : 'New Investigation Workspace'}
        </h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-mono text-slate-400 mb-1">Investigation Name *</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Executive Exposure Review"
              className="w-full h-10 px-3 rounded bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-cyan-500 font-mono"
            />
            {error && <p className="text-[11px] text-rose-400 font-mono mt-1">{error}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono text-slate-400 mb-1">Priority</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as PriorityLevel)}
                className="w-full h-10 px-3 rounded bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-cyan-500 font-mono"
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                <option value="Critical">Critical</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-400 mb-1">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as InvestigationStatus)}
                className="w-full h-10 px-3 rounded bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-cyan-500 font-mono"
              >
                <option value="New">New</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
                <option value="Archived">Archived</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono text-slate-400 mb-1">Analyst Name</label>
            <input
              type="text"
              value={analystName}
              onChange={(e) => setAnalystName(e.target.value)}
              className="w-full h-10 px-3 rounded bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-cyan-500 font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-slate-400 mb-1">Scope / Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Detail the investigation scope, objective, and parameters..."
              className="w-full p-3 rounded bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-cyan-500 font-mono h-20 resize-none"
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-slate-400 mb-1">Tags</label>
            <TagInput tags={tags} onChange={setTags} />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold rounded bg-slate-800 hover:bg-slate-700 text-slate-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-xs font-semibold rounded bg-cyan-600 hover:bg-cyan-500 text-white flex items-center gap-1.5 shadow-glow-cyan"
            >
              <Save className="w-4 h-4" /> Save Investigation
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
