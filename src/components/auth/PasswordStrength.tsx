import React from 'react';

interface PasswordStrengthProps {
  password: string;
}

export const PasswordStrength: React.FC<PasswordStrengthProps> = ({ password }) => {
  if (!password) return null;

  let score = 0;
  if (password.length >= 8) score += 1;
  if (/[A-Z]/.test(password)) score += 1;
  if (/[a-z]/.test(password)) score += 1;
  if (/[0-9]/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password)) score += 1;

  let label = 'Weak';
  let color = 'bg-rose-500';
  let textColor = 'text-rose-400';
  let percent = '33%';

  if (score >= 4) {
    label = 'Strong';
    color = 'bg-emerald-500';
    textColor = 'text-emerald-400';
    percent = '100%';
  } else if (score >= 2) {
    label = 'Medium';
    color = 'bg-amber-500';
    textColor = 'text-amber-400';
    percent = '66%';
  }

  return (
    <div className="space-y-1.5 mt-2">
      <div className="flex items-center justify-between text-[11px] font-mono">
        <span className="text-slate-400">Password Strength:</span>
        <span className={`font-bold ${textColor}`}>{label}</span>
      </div>
      <div className="w-full h-1.5 rounded-full bg-slate-950 overflow-hidden border border-slate-800">
        <div
          className={`h-full ${color} transition-all duration-300`}
          style={{ width: percent }}
        />
      </div>
      <div className="text-[10px] text-slate-500 font-mono space-y-0.5 pt-0.5">
        <p className={password.length >= 8 ? 'text-emerald-400' : ''}>• Min 8 characters</p>
        <p className={/[A-Z]/.test(password) && /[a-z]/.test(password) ? 'text-emerald-400' : ''}>
          • Uppercase & lowercase letters
        </p>
        <p className={/[0-9]/.test(password) ? 'text-emerald-400' : ''}>• At least one number</p>
      </div>
    </div>
  );
};
