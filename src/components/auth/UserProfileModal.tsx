import React, { useState } from 'react';
import { X, User, Lock, Save, Upload, ShieldCheck, Check } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import { PasswordField } from './PasswordField';
import { PasswordStrength } from './PasswordStrength';
import { useNotificationStore } from '../../store/useNotificationStore';

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({ isOpen, onClose }) => {
  const { user, updateProfile, changePassword } = useAuthStore();
  const { addNotification } = useNotificationStore();

  const [fullName, setFullName] = useState(user?.fullName || '');
  const [role, setRole] = useState(user?.role || '');
  const [organization, setOrganization] = useState(user?.organization || '');
  const [profileImage, setProfileImage] = useState(user?.profileImage || '');

  const [activeTab, setActiveTab] = useState<'profile' | 'security'>('profile');

  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [profileSaved, setProfileSaved] = useState(false);
  const [passwordSaved, setPasswordSaved] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen || !user) return null;

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await updateProfile({
        fullName,
        role,
        organization,
        profileImage,
      });
      setProfileSaved(true);
      addNotification('Profile Updated', 'Your profile details have been saved successfully.', 'success');
      setTimeout(() => setProfileSaved(false), 2000);
    } catch (err: any) {
      setError(err.message || 'Failed to update profile.');
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (newPassword !== confirmPassword) {
      setError('New passwords do not match.');
      return;
    }
    if (newPassword.length < 8) {
      setError('New password must be at least 8 characters long.');
      return;
    }

    try {
      await changePassword(oldPassword, newPassword);
      setPasswordSaved(true);
      addNotification('Password Changed', 'Your password has been updated.', 'success');
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => setPasswordSaved(false), 2000);
    } catch (err: any) {
      setError(err.message || 'Failed to change password.');
    }
  };

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setProfileImage(url);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="bg-slate-900 border border-slate-700/80 rounded-xl max-w-lg w-full p-6 shadow-2xl relative text-slate-100 max-h-[90vh] overflow-y-auto font-sans">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-full bg-cyan-950 text-cyan-400 border-2 border-cyan-500/60 flex items-center justify-center font-mono text-lg font-bold">
            {user.fullName.slice(0, 2).toUpperCase()}
          </div>
          <div>
            <h3 className="text-base font-bold font-mono text-white">{user.fullName}</h3>
            <p className="text-xs text-cyan-400 font-mono">{user.email}</p>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-slate-800 mb-4">
          <button
            onClick={() => { setActiveTab('profile'); setError(''); }}
            className={`pb-2 px-4 text-xs font-mono font-bold flex items-center gap-2 border-b-2 transition-colors ${
              activeTab === 'profile'
                ? 'border-cyan-500 text-cyan-400'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <User className="w-4 h-4" /> Analyst Profile
          </button>
          <button
            onClick={() => { setActiveTab('security'); setError(''); }}
            className={`pb-2 px-4 text-xs font-mono font-bold flex items-center gap-2 border-b-2 transition-colors ${
              activeTab === 'security'
                ? 'border-cyan-500 text-cyan-400'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <Lock className="w-4 h-4" /> Password & Security
          </button>
        </div>

        {error && (
          <div className="p-3 mb-4 rounded-lg bg-rose-950/80 border border-rose-800 text-rose-300 text-xs font-mono">
            {error}
          </div>
        )}

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <form onSubmit={handleProfileSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-mono text-slate-400 mb-1">Full Name</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                className="w-full h-9 px-3 rounded bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-cyan-500 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-400 mb-1">Role / Designation</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full h-9 px-3 rounded bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-cyan-500 font-mono"
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
              <label className="block text-xs font-mono text-slate-400 mb-1">Organization / Institution</label>
              <input
                type="text"
                value={organization}
                onChange={(e) => setOrganization(e.target.value)}
                className="w-full h-9 px-3 rounded bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-cyan-500 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-400 mb-1">Profile Image Avatar</label>
              <div className="flex items-center gap-3">
                <label className="py-1.5 px-3 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono font-medium flex items-center gap-1.5 cursor-pointer border border-slate-700">
                  <Upload className="w-3.5 h-3.5" /> Upload Photo
                  <input type="file" accept="image/*" onChange={handleAvatarUpload} className="hidden" />
                </label>
                {profileImage && (
                  <span className="text-[10px] text-emerald-400 font-mono flex items-center gap-1">
                    <Check className="w-3 h-3" /> Image Loaded
                  </span>
                )}
              </div>
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
                {profileSaved ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
                {profileSaved ? 'Profile Saved' : 'Save Changes'}
              </button>
            </div>
          </form>
        )}

        {/* Security Tab */}
        {activeTab === 'security' && (
          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <PasswordField
              id="oldPassword"
              label="Current Password"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              placeholder="Enter current password"
            />

            <div>
              <PasswordField
                id="newPassword"
                label="New Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter new password"
              />
              <PasswordStrength password={newPassword} />
            </div>

            <PasswordField
              id="confirmPassword"
              label="Confirm New Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Re-enter new password"
            />

            <div className="p-3 rounded bg-slate-950/60 border border-slate-800 text-[11px] font-mono text-slate-400 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Passwords are handled securely locally. Plaintext credentials are never logged.</span>
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
                {passwordSaved ? <Check className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
                {passwordSaved ? 'Password Changed' : 'Update Password'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
