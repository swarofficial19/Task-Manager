import React, { useState } from 'react';
import { AlertTriangle, Trash2, X } from 'lucide-react';
import { useTasks } from '../../context/TaskContext';

export const DeleteConfirmModal: React.FC = () => {
  const { isDeleteModalOpen, deletingTask, closeDeleteModal, deleteTask } = useTasks();
  const [isDeleting, setIsDeleting] = useState(false);

  if (!isDeleteModalOpen || !deletingTask) return null;

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteTask(deletingTask.id);
      closeDeleteModal();
    } catch {
      // error handled in context toast
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
      <div
        className="w-full max-w-md rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150"
        role="alertdialog"
        aria-modal="true"
      >
        <div className="p-6">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0 border border-rose-200 dark:border-rose-900/40">
              <AlertTriangle className="w-5 h-5" />
            </div>

            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Delete Task
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Are you sure you want to delete this task? This action cannot be undone and will permanently remove it from the SQLite database.
              </p>

              <div className="mt-3 p-3 rounded-lg border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 text-xs">
                <span className="font-semibold text-slate-800 dark:text-slate-200 block truncate">
                  {deletingTask.title}
                </span>
                <span className="text-[11px] text-slate-400 mt-0.5 block">
                  Category: {deletingTask.category} · Priority: {deletingTask.priority}
                </span>
              </div>
            </div>

            <button
              onClick={closeDeleteModal}
              className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-md"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center justify-end gap-2.5 mt-6 pt-4 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={closeDeleteModal}
              disabled={isDeleting}
              className="px-4 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleDelete}
              disabled={isDeleting}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 active:scale-[0.98] rounded-lg shadow-xs transition-all disabled:opacity-50"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>{isDeleting ? 'Deleting...' : 'Delete Permanently'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
