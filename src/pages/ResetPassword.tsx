import React, { useState } from 'react';
import { AuthLayout } from '../components/auth/AuthLayout';
import { PasswordField } from '../components/auth/PasswordField';
import { PasswordStrength } from '../components/auth/PasswordStrength';
import { CheckCircle2, Lock } from 'lucide-react';
import { useNotificationStore } from '../store/useNotificationStore';

interface ResetPasswordProps {
  onNavigateLogin: () => void;
}

export const ResetPassword: React.FC<ResetPasswordProps> = ({ onNavigateLogin }) => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const { addNotification } = useNotificationStore();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (newPassword.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setSubmitted(true);
    addNotification('Password Reset', 'Your password has been reset successfully.', 'success');
  };

  return (
    <AuthLayout
      title="Create New Password"
      subtitle="Set a strong replacement password for your analyst account."
    >
      {submitted ? (
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-emerald-950/60 border border-emerald-800/80 text-emerald-300 text-xs font-mono space-y-2">
            <div className="flex items-center gap-2 font-bold text-sm">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" /> Password Reset Successfully
            </div>
            <p className="text-slate-300">
              Your account password has been updated. You may now log in with your new password.
            </p>
          </div>

          <button
            onClick={onNavigateLogin}
            className="w-full py-2.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-mono font-bold flex items-center justify-center gap-2 shadow-glow-cyan transition-colors"
          >
            Sign In Now
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 rounded-lg bg-rose-950/80 border border-rose-800 text-rose-300 text-xs font-mono">
              {error}
            </div>
          )}

          <div>
            <PasswordField
              id="reset-new-password"
              label="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter new password"
              required
            />
            <PasswordStrength password={newPassword} />
          </div>

          <PasswordField
            id="reset-confirm-password"
            label="Confirm New Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Re-enter new password"
            required
          />

          <button
            type="submit"
            className="w-full h-10 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-mono font-bold flex items-center justify-center gap-2 shadow-glow-cyan transition-all"
          >
            <Lock className="w-4 h-4" /> Reset Password
          </button>
        </form>
      )}
    </AuthLayout>
  );
};
