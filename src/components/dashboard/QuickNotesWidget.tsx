import React, { useState } from 'react';
import { StickyNote, Save, Check } from 'lucide-react';
import { GlassCard } from '../common/GlassCard';
import { useNotesStore } from '../../store/useNotesStore';

export const QuickNotesWidget: React.FC = () => {
  const { notes, addNote } = useNotesStore();
  const [content, setContent] = useState('');
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    if (!content.trim()) return;
    addNote({
      title: `Quick Note - ${new Date().toLocaleTimeString()}`,
      content: content.trim(),
      entityType: 'general',
      tags: ['QuickNote'],
    });
    setContent('');
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <GlassCard className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-xs font-bold text-white font-mono uppercase tracking-wider flex items-center gap-2">
          <StickyNote className="w-4 h-4 text-amber-400" /> Quick Notepad
        </h3>
        <span className="text-[10px] text-slate-400 font-mono">Autosave enabled</span>
      </div>

      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Type quick scratchpad notes, IP lists, or findings..."
        className="flex-1 w-full p-3 rounded-lg bg-slate-900/80 border border-slate-800 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-500/80 font-mono resize-none mb-3 min-h-[100px]"
      />

      <div className="flex items-center justify-between pt-1">
        <span className="text-[10px] font-mono text-slate-400">
          Saved notes: {notes.length}
        </span>
        <button
          onClick={handleSave}
          disabled={!content.trim()}
          className="px-3 py-1.5 rounded bg-amber-600 hover:bg-amber-500 disabled:opacity-50 text-white text-xs font-mono font-semibold flex items-center gap-1.5 transition-colors"
        >
          {saved ? (
            <>
              <Check className="w-3.5 h-3.5 text-white" /> Saved
            </>
          ) : (
            <>
              <Save className="w-3.5 h-3.5" /> Save Note
            </>
          )}
        </button>
      </div>
    </GlassCard>
  );
};
