import React, { useState } from 'react';
import { Plus, Search, FolderLock } from 'lucide-react';
import { useInvestigationStore } from '../store/useInvestigationStore';
import { InvestigationCard } from '../components/investigations/InvestigationCard';
import { InvestigationModal } from '../components/investigations/InvestigationModal';
import { ReportBuilderModal } from '../components/reports/ReportBuilderModal';
import { EmptyState } from '../components/common/EmptyState';
import { ConfirmDialog } from '../components/common/ConfirmDialog';
import type { Investigation } from '../types';
import { useNotificationStore } from '../store/useNotificationStore';
import { useActivityLogStore } from '../store/useActivityLogStore';

export const Investigations: React.FC = () => {
  const {
    investigations,
    addInvestigation,
    updateInvestigation,
    deleteInvestigation,
    duplicateInvestigation,
  } = useInvestigationStore();

  const { addNotification } = useNotificationStore();
  const { logActivity } = useActivityLogStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [priorityFilter, setPriorityFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingInv, setEditingInv] = useState<Investigation | null>(null);

  const [isReportOpen, setIsReportOpen] = useState(false);
  const [reportInv, setReportInv] = useState<Investigation | undefined>(undefined);

  const [deleteId, setDeleteId] = useState<string | null>(null);

  const filteredInvestigations = investigations.filter((inv) => {
    const matchesQuery =
      inv.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inv.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inv.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesPriority = priorityFilter === 'ALL' || inv.priority === priorityFilter;
    const matchesStatus = statusFilter === 'ALL' || inv.status === statusFilter;

    return matchesQuery && matchesPriority && matchesStatus;
  });

  const handleSaveModal = (data: Omit<Investigation, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (editingInv) {
      updateInvestigation(editingInv.id, data);
      addNotification('Investigation Updated', `Updated ${editingInv.id}: ${data.name}`, 'info');
      logActivity('Investigation Updated', `Updated investigation ${editingInv.id}`, 'Investigation');
    } else {
      const created = addInvestigation(data);
      addNotification('Investigation Created', `Created ${created.id}: ${created.name}`, 'success');
      logActivity('Investigation Created', `Created new investigation ${created.id}`, 'Investigation');
    }
  };

  const handleConfirmDelete = () => {
    if (!deleteId) return;
    deleteInvestigation(deleteId);
    addNotification('Investigation Deleted', `Deleted investigation ${deleteId}`, 'warning');
    logActivity('Investigation Deleted', `Deleted investigation ${deleteId}`, 'Investigation');
    setDeleteId(null);
  };

  return (
    <div className="space-y-6 pb-12 animate-fade-in">
      {/* Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white font-mono flex items-center gap-2">
            <FolderLock className="w-5 h-5 text-cyan-400" /> Investigation Workspace
          </h1>
          <p className="text-xs text-slate-400 font-mono mt-0.5">
            Organize digital investigation cases, priority levels, status, and findings.
          </p>
        </div>

        <button
          onClick={() => {
            setEditingInv(null);
            setIsModalOpen(true);
          }}
          className="h-10 px-4 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-mono font-bold flex items-center justify-center gap-2 shadow-glow-cyan transition-colors"
        >
          <Plus className="w-4 h-4" /> Create Investigation
        </button>
      </div>

      {/* Filter Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3 p-4 rounded-xl bg-slate-900/80 border border-slate-800">
        <div className="relative flex-1">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by case name, ID, or #tag..."
            className="w-full h-9 pl-9 pr-3 rounded-lg bg-slate-950 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 font-mono"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="h-9 px-3 rounded-lg bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-cyan-500 font-mono"
          >
            <option value="ALL">All Priorities</option>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
            <option value="Critical">Critical</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="h-9 px-3 rounded-lg bg-slate-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-cyan-500 font-mono"
          >
            <option value="ALL">All Statuses</option>
            <option value="New">New</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
            <option value="Archived">Archived</option>
          </select>
        </div>
      </div>

      {/* Investigation Cards Grid */}
      {filteredInvestigations.length === 0 ? (
        <EmptyState
          title="No investigations found"
          description="Create a new investigation case to start gathering evidence, targets, and notes."
          icon={FolderLock}
          actionLabel="Create Investigation"
          onAction={() => {
            setEditingInv(null);
            setIsModalOpen(true);
          }}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredInvestigations.map((inv) => (
            <InvestigationCard
              key={inv.id}
              investigation={inv}
              onSelect={() => {
                setReportInv(inv);
                setIsReportOpen(true);
              }}
              onEdit={(e) => {
                e.stopPropagation();
                setEditingInv(inv);
                setIsModalOpen(true);
              }}
              onDuplicate={(e) => {
                e.stopPropagation();
                duplicateInvestigation(inv.id);
                addNotification('Investigation Duplicated', `Duplicated case ${inv.id}`, 'info');
              }}
              onDelete={(e) => {
                e.stopPropagation();
                setDeleteId(inv.id);
              }}
            />
          ))}
        </div>
      )}

      {/* Create / Edit Modal */}
      <InvestigationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveModal}
        initialData={editingInv}
      />

      {/* Report Builder Modal */}
      <ReportBuilderModal
        isOpen={isReportOpen}
        onClose={() => setIsReportOpen(false)}
        investigation={reportInv}
      />

      {/* Confirm Delete Modal */}
      <ConfirmDialog
        isOpen={!!deleteId}
        title="Delete Investigation"
        message="Are you sure you want to delete this investigation? Associated local notes and findings will be permanently removed."
        confirmLabel="Delete Case"
        isDestructive
        onConfirm={handleConfirmDelete}
        onClose={() => setDeleteId(null)}
      />
    </div>
  );
};
