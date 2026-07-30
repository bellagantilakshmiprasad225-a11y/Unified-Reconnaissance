import React, { useState } from 'react';
import { UserCheck, Plus, Search, Star } from 'lucide-react';
import { useTargetStore } from '../store/useTargetStore';
import { TargetCard } from '../components/targets/TargetCard';
import { TargetModal } from '../components/targets/TargetModal';
import { EmptyState } from '../components/common/EmptyState';
import { ConfirmDialog } from '../components/common/ConfirmDialog';
import type { TargetProfile } from '../types';
import { useNotificationStore } from '../store/useNotificationStore';
import { useActivityLogStore } from '../store/useActivityLogStore';

export const Targets: React.FC = () => {
  const {
    targets,
    addTarget,
    updateTarget,
    deleteTarget,
    toggleFavoriteTarget,
  } = useTargetStore();

  const { addNotification } = useNotificationStore();
  const { logActivity } = useActivityLogStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [favoriteOnly, setFavoriteOnly] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTarget, setEditingTarget] = useState<TargetProfile | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const filteredTargets = targets.filter((trg) => {
    const matchesQuery =
      trg.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      trg.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      trg.domain.toLowerCase().includes(searchQuery.toLowerCase()) ||
      trg.email.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesFav = !favoriteOnly || trg.isFavorite;

    return matchesQuery && matchesFav;
  });

  const handleSaveModal = (data: Omit<TargetProfile, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (editingTarget) {
      updateTarget(editingTarget.id, data);
      addNotification('Target Updated', `Updated target ${editingTarget.fullName}`, 'info');
      logActivity('Target Updated', `Updated target ${editingTarget.fullName}`, 'Target');
    } else {
      const created = addTarget(data);
      addNotification('Target Created', `Created target profile ${created.fullName}`, 'success');
      logActivity('Target Created', `Created target profile ${created.fullName}`, 'Target');
    }
  };

  const handleConfirmDelete = () => {
    if (!deleteId) return;
    deleteTarget(deleteId);
    addNotification('Target Deleted', `Deleted target profile ${deleteId}`, 'warning');
    logActivity('Target Deleted', `Deleted target profile ${deleteId}`, 'Target');
    setDeleteId(null);
  };

  return (
    <div className="space-y-6 pb-12 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white font-mono flex items-center gap-2">
            <UserCheck className="w-5 h-5 text-emerald-400" /> Target Profile Management
          </h1>
          <p className="text-xs text-slate-400 font-mono mt-0.5">
            Catalog organizations, domains, executive profiles, IP targets, and social footprints.
          </p>
        </div>

        <button
          onClick={() => {
            setEditingTarget(null);
            setIsModalOpen(true);
          }}
          className="h-10 px-4 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-mono font-bold flex items-center justify-center gap-2 shadow-glow-cyan transition-colors"
        >
          <Plus className="w-4 h-4" /> Add Target Profile
        </button>
      </div>

      {/* Filter Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3 p-4 rounded-xl bg-slate-900/80 border border-slate-800">
        <div className="relative flex-1">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search target by name, company, email, or domain..."
            className="w-full h-9 pl-9 pr-3 rounded-lg bg-slate-950 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 font-mono"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
        </div>

        <button
          onClick={() => setFavoriteOnly(!favoriteOnly)}
          className={`h-9 px-3 rounded-lg border text-xs font-mono font-semibold flex items-center gap-2 transition-colors ${
            favoriteOnly
              ? 'bg-amber-500/10 text-amber-400 border-amber-500/40'
              : 'bg-slate-950 text-slate-400 border-slate-700 hover:text-white'
          }`}
        >
          <Star className="w-3.5 h-3.5 fill-current" /> Favorites Only
        </button>
      </div>

      {/* Target Grid */}
      {filteredTargets.length === 0 ? (
        <EmptyState
          title="No targets found"
          description="Add a target profile to start organizing domain parameters, contacts, and images."
          icon={UserCheck}
          actionLabel="Add Target Profile"
          onAction={() => {
            setEditingTarget(null);
            setIsModalOpen(true);
          }}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTargets.map((trg) => (
            <TargetCard
              key={trg.id}
              target={trg}
              onSelect={() => {
                setEditingTarget(trg);
                setIsModalOpen(true);
              }}
              onEdit={(e) => {
                e.stopPropagation();
                setEditingTarget(trg);
                setIsModalOpen(true);
              }}
              onToggleFavorite={(e) => {
                e.stopPropagation();
                toggleFavoriteTarget(trg.id);
              }}
              onDelete={(e) => {
                e.stopPropagation();
                setDeleteId(trg.id);
              }}
            />
          ))}
        </div>
      )}

      {/* Create / Edit Modal */}
      <TargetModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveModal}
        initialData={editingTarget}
      />

      {/* Confirm Delete */}
      <ConfirmDialog
        isOpen={!!deleteId}
        title="Delete Target Profile"
        message="Are you sure you want to delete this target profile? This action cannot be undone."
        confirmLabel="Delete Target"
        isDestructive
        onConfirm={handleConfirmDelete}
        onClose={() => setDeleteId(null)}
      />
    </div>
  );
};
