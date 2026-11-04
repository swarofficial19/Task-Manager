import React from 'react';
import {
  CheckCircle2,
  Circle,
  Clock,
  Calendar,
  AlertCircle,
  MoreVertical,
  Pencil,
  Trash2,
  Plus
} from 'lucide-react';
import { useTasks } from '../../context/TaskContext';
import { Task, Priority, TaskStatus } from '../../types/task';

export const TaskList: React.FC = () => {
  const { tasks, loading, updateTaskStatus, openEditModal, openDeleteModal, openCreateModal } = useTasks();

  const todayStr = new Date().toISOString().split('T')[0];

  const getPriorityStyle = (priority: Priority) => {
    switch (priority) {
      case 'High':
        return 'text-rose-600 dark:text-rose-400 font-semibold';
      case 'Medium':
        return 'text-amber-600 dark:text-amber-400 font-medium';
      case 'Low':
        return 'text-blue-600 dark:text-blue-400';
    }
  };

  const getStatusStyle = (status: TaskStatus) => {
    switch (status) {
      case 'Completed':
        return 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800';
      case 'In Progress':
        return 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40 border-indigo-200 dark:border-indigo-800';
      case 'Pending':
        return 'text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800/80 border-slate-200 dark:border-slate-700';
    }
  };

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return { text: 'No due date', status: 'none' };
    if (dateStr < todayStr) return { text: `Overdue: ${dateStr}`, status: 'overdue' };
    if (dateStr === todayStr) return { text: `Due Today`, status: 'today' };
    return { text: dateStr, status: 'normal' };
  };

  if (loading && tasks.length === 0) {
    return (
      <div className="space-y-3">
        {[1, 2, 3, 4].map((n) => (
          <div
            key={n}
            className="h-20 rounded-xl bg-slate-100 dark:bg-slate-800/50 animate-pulse border border-slate-200/50 dark:border-slate-800"
          />
        ))}
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <div className="p-12 text-center rounded-xl border border-dashed border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/40">
        <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center">
          <Clock className="w-6 h-6" />
        </div>
        <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1">
          No tasks found
        </h3>
        <p className="text-xs text-slate-500 max-w-sm mx-auto mb-4">
          No tasks match your current view or active filters. Create a new task or adjust your filters.
        </p>
        <button
          onClick={() => openCreateModal()}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add New Task</span>
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-2.5">
      {tasks.map((task: Task) => {
        const isCompleted = task.status === 'Completed';
        const dateInfo = formatDate(task.due_date);
        const createdDate = task.created_at ? task.created_at.split('T')[0] : '';

        return (
          <div
            key={task.id}
            className={`group relative p-4 rounded-xl border transition-all duration-150 ${
              isCompleted
                ? 'bg-slate-50/60 dark:bg-slate-950/40 border-slate-200 dark:border-slate-800/80 opacity-80'
                : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 shadow-xs hover:border-slate-300 dark:hover:border-slate-700'
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              {/* Checkbox & Details */}
              <div className="flex items-start gap-3 min-w-0 flex-1">
                {/* Complete Toggle Button */}
                <button
                  onClick={() => updateTaskStatus(task.id, isCompleted ? 'Pending' : 'Completed')}
                  className={`mt-0.5 shrink-0 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500/30 ${
                    isCompleted
                      ? 'text-emerald-500 hover:text-emerald-600'
                      : 'text-slate-300 dark:text-slate-600 hover:text-emerald-500 dark:hover:text-emerald-400'
                  }`}
                  aria-label={isCompleted ? 'Mark task as pending' : 'Mark task as completed'}
                  title={isCompleted ? 'Mark pending' : 'Mark complete'}
                >
                  {isCompleted ? (
                    <CheckCircle2 className="w-5 h-5 fill-emerald-500/10" />
                  ) : (
                    <Circle className="w-5 h-5 stroke-[1.75]" />
                  )}
                </button>

                <div className="min-w-0 flex-1">
                  {/* Task Title */}
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3
                      onClick={() => openEditModal(task)}
                      className={`text-sm font-semibold cursor-pointer hover:text-blue-600 dark:hover:text-blue-400 transition-colors ${
                        isCompleted
                          ? 'line-through text-slate-400 dark:text-slate-500'
                          : 'text-slate-900 dark:text-white'
                      }`}
                    >
                      {task.title}
                    </h3>

                    {/* Quick status dropdown */}
                    <select
                      value={task.status}
                      onChange={(e) => updateTaskStatus(task.id, e.target.value as TaskStatus)}
                      className={`text-[11px] font-medium px-2 py-0.5 rounded border focus:outline-none cursor-pointer ${getStatusStyle(
                        task.status
                      )}`}
                    >
                      <option value="Pending">Pending</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Completed">Completed</option>
                    </select>
                  </div>

                  {/* Task Description */}
                  {task.description && (
                    <p
                      className={`text-xs mt-1 line-clamp-2 ${
                        isCompleted
                          ? 'text-slate-400 dark:text-slate-600 line-through'
                          : 'text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      {task.description}
                    </p>
                  )}

                  {/* Clean unboxed metadata row */}
                  <div className="flex items-center flex-wrap gap-2 text-xs text-slate-500 dark:text-slate-400 mt-2.5">
                    {/* Priority */}
                    <span className={`text-xs ${getPriorityStyle(task.priority)}`}>
                      {task.priority} Priority
                    </span>

                    <span aria-hidden="true" className="text-slate-300 dark:text-slate-700">·</span>

                    {/* Category */}
                    <span className="font-medium text-slate-700 dark:text-slate-300">
                      {task.category}
                    </span>

                    <span aria-hidden="true" className="text-slate-300 dark:text-slate-700">·</span>

                    {/* Due Date Indicator */}
                    <div className="flex items-center gap-1 font-mono tabular-nums">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      <span
                        className={
                          dateInfo.status === 'overdue' && !isCompleted
                            ? 'text-rose-600 dark:text-rose-400 font-semibold'
                            : dateInfo.status === 'today' && !isCompleted
                            ? 'text-amber-600 dark:text-amber-400 font-semibold'
                            : ''
                        }
                      >
                        {dateInfo.text}
                      </span>
                    </div>

                    {createdDate && (
                      <>
                        <span aria-hidden="true" className="text-slate-300 dark:text-slate-700">·</span>
                        <span className="text-[11px] text-slate-400 font-mono tabular-nums">
                          Added {createdDate}
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-1 shrink-0 pt-0.5">
                <button
                  onClick={() => openEditModal(task)}
                  className="p-1.5 text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                  title="Edit task"
                  aria-label="Edit task"
                >
                  <Pencil className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={() => openDeleteModal(task)}
                  className="p-1.5 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition-colors"
                  title="Delete task"
                  aria-label="Delete task"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
