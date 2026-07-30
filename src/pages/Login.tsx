import React, { useState } from 'react';
import { AuthLayout } from '../components/auth/AuthLayout';
import { PasswordField } from '../components/auth/PasswordField';
import { useAuthStore } from '../store/useAuthStore';
import { useNotificationStore } from '../store/useNotificationStore';
import { Shield, Sparkles, ArrowRight } from 'lucide-react';

interface LoginProps {
  onNavigateSignUp: () => void;
  onNavigateForgotPassword: () => void;
  onSuccess: () => void;
}

export const Login: React.FC<LoginProps> = ({
  onNavigateSignUp,
  onNavigateForgotPassword,
  onSuccess,
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);

  const { signIn, isLoading, error, clearError } = useAuthStore();
  const { addNotification } = useNotificationStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();

    if (!email.trim()) {
      return;
    }
    if (!password) {
      return;
    }

    try {
      await signIn({
        email: email.trim(),
        password,
        rememberMe,
      });
      addNotification('Welcome back!', 'Authenticated into Unified Reconnaissance Dashboard.', 'success');
      onSuccess();
    } catch {
      // Error is set in store
    }
  };

  const fillDemoCredentials = () => {
    setEmail('demo@unifiedrecon.local');
    setPassword('Demo@12345');
    clearError();
  };

  return (
    <AuthLayout
      title="Sign In to Workspace"
      subtitle="Enter your analyst credentials to access defensive OSINT tools and cases."
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 rounded-lg bg-rose-950/80 border border-rose-800 text-rose-300 text-xs font-mono">
            {error}
          </div>
        )}

        <div>
          <label htmlFor="login-email" className="block text-xs font-mono text-slate-300 mb-1">
            Analyst Email Address <span className="text-cyan-400">*</span>
          </label>
          <input
            id="login-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="analyst@example.com"
            required
            className="w-full h-10 px-3 rounded-lg bg-slate-950 border border-slate-700/80 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/80 font-mono transition-all"
          />
        </div>

        <PasswordField
          id="login-password"
          label="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter your password"
          required
        />

        <div className="flex items-center justify-between text-xs font-mono">
          <label className="flex items-center gap-2 cursor-pointer text-slate-300">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="rounded bg-slate-950 border-slate-700 text-cyan-500 focus:ring-0"
            />
            <span>Remember me</span>
          </label>

          <button
            type="button"
            onClick={onNavigateForgotPassword}
            className="text-cyan-400 hover:underline hover:text-cyan-300 transition-colors"
          >
            Forgot Password?
          </button>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full h-10 rounded-lg bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-white text-xs font-mono font-bold flex items-center justify-center gap-2 shadow-glow-cyan transition-all"
        >
          {isLoading ? 'Signing in...' : 'Sign In'}
          {!isLoading && <ArrowRight className="w-4 h-4" />}
        </button>

        {/* Demo Mode Notice & Quick Fill Button */}
        <div className="mt-4 p-3 rounded-xl bg-cyan-950/40 border border-cyan-800/60 space-y-2">
          <div className="flex items-center justify-between text-[11px] font-mono">
            <span className="text-cyan-300 font-bold flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-cyan-400" /> Demo Authentication Account
            </span>
            <span className="text-[9px] px-1.5 py-0.5 rounded bg-cyan-900/60 text-cyan-300">
              Local Mode
            </span>
          </div>
          <p className="text-[10px] text-slate-400 font-mono leading-tight">
            Use the sample analyst credentials for local testing and presentation.
          </p>
          <button
            type="button"
            onClick={fillDemoCredentials}
            className="w-full py-1.5 rounded bg-slate-900 hover:bg-slate-800 border border-cyan-700/50 text-cyan-300 text-xs font-mono font-semibold flex items-center justify-center gap-1.5 transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Fill Demo Credentials (demo@unifiedrecon.local)
          </button>
        </div>

        <div className="pt-2 text-center text-xs font-mono text-slate-400">
          Don't have an account?{' '}
          <button
            type="button"
            onClick={onNavigateSignUp}
            className="text-cyan-400 font-bold hover:underline hover:text-cyan-300"
          >
            Create Account
          </button>
        </div>
      </form>
    </AuthLayout>
  );
};
