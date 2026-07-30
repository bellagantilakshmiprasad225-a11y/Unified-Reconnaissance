import React, { useState } from 'react';
import { AuthLayout } from '../components/auth/AuthLayout';
import { ArrowLeft, Mail, Info } from 'lucide-react';
import { authService } from '../services/auth/authService';

interface ForgotPasswordProps {
  onNavigateLogin: () => void;
}

export const ForgotPassword: React.FC<ForgotPasswordProps> = ({ onNavigateLogin }) => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setLoading(true);
    try {
      await authService.resetPassword(email);
      setSubmitted(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Reset Password"
      subtitle="Enter your email to receive password recovery instructions."
    >
      {submitted ? (
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-cyan-950/60 border border-cyan-800/80 text-cyan-300 text-xs font-mono space-y-2">
            <div className="flex items-center gap-2 font-bold text-sm">
              <Mail className="w-4 h-4 text-cyan-400" /> Password Recovery Request Processed
            </div>
            <p className="text-slate-300">
              If an account with <strong>{email}</strong> exists, recovery instructions have been sent.
            </p>
          </div>

          <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-[11px] font-mono text-slate-400 flex items-start gap-2">
            <Info className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <span>
              Note: Local demo authentication mode does not dispatch live SMTP emails. Use demo account credentials (demo@unifiedrecon.local / Demo@12345) for local testing.
            </span>
          </div>

          <button
            onClick={onNavigateLogin}
            className="w-full py-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono font-bold flex items-center justify-center gap-2 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Login
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="forgot-email" className="block text-xs font-mono text-slate-300 mb-1">
              Registered Analyst Email Address <span className="text-cyan-400">*</span>
            </label>
            <input
              id="forgot-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="analyst@example.com"
              required
              className="w-full h-10 px-3 rounded-lg bg-slate-950 border border-slate-700/80 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/80 font-mono transition-all"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full h-10 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-mono font-bold flex items-center justify-center gap-2 shadow-glow-cyan transition-all"
          >
            {loading ? 'Processing...' : 'Send Reset Link'}
          </button>

          <button
            type="button"
            onClick={onNavigateLogin}
            className="w-full py-2 text-xs font-mono text-slate-400 hover:text-slate-200 flex items-center justify-center gap-1.5 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Return to Sign In
          </button>
        </form>
      )}
    </AuthLayout>
  );
};
