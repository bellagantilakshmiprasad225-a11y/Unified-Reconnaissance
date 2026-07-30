import React, { useState, useEffect } from 'react';
import { X, UserCheck, Camera, Upload, Save } from 'lucide-react';
import type { TargetProfile } from '../../types';
import { TagInput } from '../common/TagInput';
import { WebcamCapture } from '../common/WebcamCapture';

interface TargetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: Omit<TargetProfile, 'id' | 'createdAt' | 'updatedAt'>) => void;
  initialData?: TargetProfile | null;
}

export const TargetModal: React.FC<TargetModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData,
}) => {
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [company, setCompany] = useState('');
  const [organization, setOrganization] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [website, setWebsite] = useState('');
  const [domain, setDomain] = useState('');
  const [ipAddress, setIpAddress] = useState('');
  const [country, setCountry] = useState('');
  const [city, setCity] = useState('');
  const [address, setAddress] = useState('');
  const [notes, setNotes] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [isFavorite, setIsFavorite] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | undefined>(undefined);
  const [showWebcam, setShowWebcam] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (initialData) {
      setFullName(initialData.fullName);
      setUsername(initialData.username || '');
      setCompany(initialData.company || '');
      setOrganization(initialData.organization || '');
      setJobTitle(initialData.jobTitle || '');
      setEmail(initialData.email || '');
      setPhone(initialData.phone || '');
      setWebsite(initialData.website || '');
      setDomain(initialData.domain || '');
      setIpAddress(initialData.ipAddress || '');
      setCountry(initialData.country || '');
      setCity(initialData.city || '');
      setAddress(initialData.address || '');
      setNotes(initialData.notes || '');
      setTags(initialData.tags || []);
      setIsFavorite(initialData.isFavorite || false);
      setAvatarUrl(initialData.avatarUrl);
    } else {
      setFullName('');
      setUsername('');
      setCompany('');
      setOrganization('');
      setJobTitle('');
      setEmail('');
      setPhone('');
      setWebsite('');
      setDomain('');
      setIpAddress('');
      setCountry('');
      setCity('');
      setAddress('');
      setNotes('');
      setTags(['Target']);
      setIsFavorite(false);
      setAvatarUrl(undefined);
    }
    setError('');
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setAvatarUrl(url);
    }
  };

  const handleWebcamCapture = (blob: Blob) => {
    const url = URL.createObjectURL(blob);
    setAvatarUrl(url);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) {
      setError('Target Full Name / Entity Name is required.');
      return;
    }

    onSave({
      fullName: fullName.trim(),
      username: username.trim(),
      company: company.trim(),
      organization: organization.trim(),
      jobTitle: jobTitle.trim(),
      email: email.trim(),
      phone: phone.trim(),
      website: website.trim(),
      domain: domain.trim(),
      ipAddress: ipAddress.trim(),
      country: country.trim(),
      city: city.trim(),
      address: address.trim(),
      socialLinks: {
        linkedin: username ? `https://linkedin.com/in/${username}` : undefined,
        github: username ? `https://github.com/${username}` : undefined,
      },
      notes: notes.trim(),
      tags,
      isFavorite,
      avatarUrl,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="bg-slate-900 border border-slate-700/80 rounded-xl max-w-2xl w-full p-6 shadow-2xl relative text-slate-100 max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        <h3 className="text-lg font-bold font-mono mb-4 flex items-center gap-2">
          <UserCheck className="w-5 h-5 text-cyan-400" />
          {initialData ? 'Edit Target Profile' : 'New Target Profile'}
        </h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Avatar Section */}
          <div className="flex items-center gap-4 p-3 rounded-lg bg-slate-950/60 border border-slate-800">
            {avatarUrl ? (
              <img src={avatarUrl} alt="Avatar" className="w-16 h-16 rounded-full object-cover border-2 border-cyan-500" />
            ) : (
              <div className="w-16 h-16 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-800 flex items-center justify-center font-mono text-xl font-bold">
                TRG
              </div>
            )}
            <div className="space-y-2">
              <span className="text-xs font-mono text-slate-400 block">Profile Image / Avatar</span>
              <div className="flex items-center gap-2">
                <label className="py-1 px-3 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono font-medium flex items-center gap-1.5 cursor-pointer border border-slate-700">
                  <Upload className="w-3.5 h-3.5" /> Upload File
                  <input type="file" accept="image/*" onChange={handleAvatarUpload} className="hidden" />
                </label>
                <button
                  type="button"
                  onClick={() => setShowWebcam(true)}
                  className="py-1 px-3 rounded bg-cyan-950 hover:bg-cyan-900 text-cyan-300 text-xs font-mono font-medium flex items-center gap-1.5 border border-cyan-800"
                >
                  <Camera className="w-3.5 h-3.5" /> Use Webcam
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono text-slate-400 mb-1">Full Name / Target Title *</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Apex Tech Corp HQ or John Smith"
                className="w-full h-9 px-3 rounded bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-cyan-500 font-mono"
              />
              {error && <p className="text-[11px] text-rose-400 font-mono mt-1">{error}</p>}
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-400 mb-1">Username / Handle</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="apex_sec_ops"
                className="w-full h-9 px-3 rounded bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-cyan-500 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-400 mb-1">Company</label>
              <input
                type="text"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder="Apex Technologies Group"
                className="w-full h-9 px-3 rounded bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-cyan-500 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-400 mb-1">Job Title</label>
              <input
                type="text"
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
                placeholder="Infrastructure Manager"
                className="w-full h-9 px-3 rounded bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-cyan-500 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-400 mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="security@apextech.example.com"
                className="w-full h-9 px-3 rounded bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-cyan-500 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-400 mb-1">Phone</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+1-800-555-0199"
                className="w-full h-9 px-3 rounded bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-cyan-500 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-400 mb-1">Domain</label>
              <input
                type="text"
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
                placeholder="apextech.example.com"
                className="w-full h-9 px-3 rounded bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-cyan-500 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-400 mb-1">IP Address</label>
              <input
                type="text"
                value={ipAddress}
                onChange={(e) => setIpAddress(e.target.value)}
                placeholder="104.21.55.12"
                className="w-full h-9 px-3 rounded bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-cyan-500 font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono text-slate-400 mb-1">Notes</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Internal target profile observations..."
              className="w-full p-2.5 rounded bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-cyan-500 font-mono h-16 resize-none"
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
              <Save className="w-4 h-4" /> Save Target Profile
            </button>
          </div>
        </form>
      </div>

      {showWebcam && (
        <WebcamCapture
          onCapture={handleWebcamCapture}
          onClose={() => setShowWebcam(false)}
        />
      )}
    </div>
  );
};
