import React, { useState } from 'react';
import { Eye, EyeOff, Lock } from 'lucide-react';

interface PasswordFieldProps {
  id?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  label?: string;
  required?: boolean;
  className?: string;
}

export const PasswordField: React.FC<PasswordFieldProps> = ({
  id = 'password',
  value,
  onChange,
  placeholder = 'Enter password',
  label = 'Password',
  required = true,
  className = '',
}) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className={className}>
      {label && (
        <label htmlFor={id} className="block text-xs font-mono text-slate-300 mb-1">
          {label} {required && <span className="text-cyan-400">*</span>}
        </label>
      )}
      <div className="relative">
        <input
          id={id}
          type={showPassword ? 'text' : 'password'}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          className="w-full h-10 pl-10 pr-10 rounded-lg bg-slate-950 border border-slate-700/80 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/80 font-mono transition-all"
        />
        <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3 pointer-events-none" />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-3 text-slate-500 hover:text-slate-300 transition-colors"
          title={showPassword ? 'Hide password' : 'Show password'}
        >
          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </button>
      </div>
    </div>
  );
};
