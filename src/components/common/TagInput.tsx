import React, { useState } from 'react';
import { X, Plus } from 'lucide-react';

interface TagInputProps {
  tags: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string;
}

export const TagInput: React.FC<TagInputProps> = ({
  tags,
  onChange,
  placeholder = 'Add tag and press Enter...',
}) => {
  const [inputValue, setInputValue] = useState('');

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const val = inputValue.trim().replace(/^,/, '');
      if (val && !tags.includes(val)) {
        onChange([...tags, val]);
        setInputValue('');
      }
    }
  };

  const removeTag = (tagToRemove: string) => {
    onChange(tags.filter((t) => t !== tagToRemove));
  };

  return (
    <div className="flex flex-wrap items-center gap-1.5 p-2 rounded-lg bg-slate-900/60 border border-slate-700/80 focus-within:border-cyan-500/80 transition-colors">
      {tags.map((tag) => (
        <span
          key={tag}
          className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-mono bg-cyan-950/60 text-cyan-300 border border-cyan-700/50"
        >
          #{tag}
          <button
            type="button"
            onClick={() => removeTag(tag)}
            className="hover:text-rose-400 focus:outline-none"
          >
            <X className="w-3 h-3" />
          </button>
        </span>
      ))}
      <div className="flex items-center gap-1 flex-1 min-w-[120px]">
        <Plus className="w-3.5 h-3.5 text-slate-500" />
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={tags.length === 0 ? placeholder : ''}
          className="bg-transparent border-none text-xs text-slate-200 placeholder-slate-500 focus:outline-none w-full font-mono"
        />
      </div>
    </div>
  );
};
