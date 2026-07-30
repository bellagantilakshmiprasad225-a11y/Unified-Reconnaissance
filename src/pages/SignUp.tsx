import React, { useState } from 'react';
import { AuthLayout } from '../components/auth/AuthLayout';
import { PasswordField } from '../components/auth/PasswordField';
import { PasswordStrength } from '../components/auth/PasswordStrength';
import { useAuthStore } from '../store/useAuthStore';
import { useNotificationStore } from '../store/useNotificationStore';
import { UserPlus } from 'lucide-react';

interface SignUpProps {
  onNavigateLogin: () => void;
  onSuccess: () => void;
}

export const SignUp: React.FC<SignUpProps> = ({ onNavigateLogin, onSuccess }) => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('Cyber Security Intern');
  const [organization, setOrganization] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [localError, setLocalError] = useState('');

  const { signUp, isLoading, error, clearError } = useAuthStore();
  const { addNotification } = useNotificationStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError('');
    clearError();

    if (!fullName.trim()) {
      setLocalError('Please enter your full name.');
      return;
    }
    if (!email.trim() || !email.includes('@')) {
      setLocalError('Please enter a valid email address.');
      return;
    }
    if (password.length < 8) {
      setLocalError('Password must be at least 8 characters long.');
      return;
    }
    if (password !== confirmPassword) {
      setLocalError('Passwords do not match.');
      return;
    }
    if (!agreeTerms) {
      setLocalError('You must agree to the authorized ethical OSINT usage terms.');
      return;
    }

    try {
      await signUp({
        fullName: fullName.trim(),
        email: email.trim(),
        password,
        role,
        organization: organization.trim() || undefined,
      });
      addNotification('Account Created', 'Registered and signed into your analyst workspace.', 'success');
      onSuccess();
    } catch {
      // Handled in auth store
    }
  };

  return (
    <AuthLayout
      title="Create Account"
      subtitle="Register your analyst workspace to begin defensive OSINT operations."
    >
      <form onSubmit={handleSubmit} className="space-y-3">
        {(localError || error) && (
          <div className="p-3 rounded-lg bg-rose-950/80 border border-rose-800 text-rose-300 text-xs font-mono">
            {localError || error}
          </div>
        )}

        <div>
          <label htmlFor="signup-name" className="block text-xs font-mono text-slate-300 mb-1">
            Full Name <span className="text-cyan-400">*</span>
          </label>
          <input
            id="signup-name"
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Lakshmiprasad"
            required
            className="w-full h-9 px-3 rounded-lg bg-slate-950 border border-slate-700/80 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/80 font-mono transition-all"
          />
        </div>

        <div>
          <label htmlFor="signup-email" className="block text-xs font-mono text-slate-300 mb-1">
            Email Address <span className="text-cyan-400">*</span>
          </label>
          <input
            id="signup-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="analyst@example.com"
            required
            className="w-full h-9 px-3 rounded-lg bg-slate-950 border border-slate-700/80 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/80 font-mono transition-all"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <PasswordField
              id="signup-password"
              label="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Min 8 characters"
              required
            />
            <PasswordStrength password={password} />
          </div>

          <div>
            <PasswordField
              id="signup-confirm-password"
              label="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Re-enter password"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label htmlFor="signup-role" className="block text-xs font-mono text-slate-300 mb-1">
              Role / Designation
            </label>
            <select
              id="signup-role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full h-9 px-3 rounded-lg bg-slate-950 border border-slate-700/80 text-xs text-white focus:outline-none focus:border-cyan-500/80 font-mono"
            >
              <option value="Cyber Security Intern">Cyber Security Intern</option>
              <option value="Security Analyst">Security Analyst</option>
              <option value="SOC Analyst">SOC Analyst</option>
              <option value="Security Researcher">Security Researcher</option>
              <option value="Student">Student</option>
              <option value="Administrator">Administrator</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div>
            <label htmlFor="signup-org" className="block text-xs font-mono text-slate-300 mb-1">
              Organization (Optional)
            </label>
            <input
              id="signup-org"
              type="text"
              value={organization}
              onChange={(e) => setOrganization(e.target.value)}
              placeholder="Cybersecurity Lab"
              className="w-full h-9 px-3 rounded-lg bg-slate-950 border border-slate-700/80 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/80 font-mono transition-all"
            />
          </div>
        </div>

        {/* Ethical Terms Checkbox */}
        <div className="pt-2">
          <label className="flex items-start gap-2 cursor-pointer text-[11px] font-mono text-slate-300 leading-tight">
            <input
              type="checkbox"
              checked={agreeTerms}
              onChange={(e) => setAgreeTerms(e.target.checked)}
              className="mt-0.5 rounded bg-slate-950 border-slate-700 text-cyan-500 focus:ring-0"
            />
            <span>
              I agree to use this platform only for authorized cybersecurity assessments, defensive security, OSINT research, and educational purposes.
            </span>
          </label>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full h-10 mt-3 rounded-lg bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-white text-xs font-mono font-bold flex items-center justify-center gap-2 shadow-glow-cyan transition-all"
        >
          {isLoading ? (
            'Creating Account...'
          ) : (
            <>
              <UserPlus className="w-4 h-4" /> Create Account
            </>
          )}
        </button>

        <div className="pt-2 text-center text-xs font-mono text-slate-400">
          Already have an account?{' '}
          <button
            type="button"
            onClick={onNavigateLogin}
            className="text-cyan-400 font-bold hover:underline hover:text-cyan-300"
          >
            Sign In
          </button>
        </div>
      </form>
    </AuthLayout>
  );
};
