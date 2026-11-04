import React from 'react';
import { Clock, ArrowRight, CheckCircle2, CircleDashed } from 'lucide-react';
import { useTasks } from '../../context/TaskContext';
import { Task } from '../../types/task';

export const RecentTasks: React.FC = () => {
  const { stats, updateTaskStatus, openEditModal, setActiveView } = useTasks();
  const recent = stats?.recentTasks ?? [];

  return (
    <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs flex flex-col justify-between">
      <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100 dark:border-slate-800/80">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-blue-500" />
          <h3 className="text-xs font-semibold text-slate-900 dark:text-white uppercase tracking-wider">
            Recent Activity
          </h3>
        </div>
        <button
          onClick={() => setActiveView('all')}
          className="text-xs text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 font-medium"
        >
          <span>View all</span>
          <ArrowRight className="w-3 h-3" />
        </button>
      </div>

      <div className="space-y-2 flex-1">
        {recent.length === 0 ? (
          <div className="py-6 text-center text-xs text-slate-500">
            No activity logged yet.
          </div>
        ) : (
          recent.map((task: Task) => {
            const isCompleted = task.status === 'Completed';

            return (
              <div
                key={task.id}
                className="group flex items-center justify-between gap-3 p-2.5 rounded-lg border border-slate-100 dark:border-slate-800/60 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <button
                    onClick={() => updateTaskStatus(task.id, isCompleted ? 'Pending' : 'Completed')}
                    title={isCompleted ? 'Mark pending' : 'Mark complete'}
                    className={`transition-colors shrink-0 ${
                      isCompleted
                        ? 'text-emerald-500'
                        : 'text-slate-300 dark:text-slate-600 hover:text-emerald-500'
                    }`}
                  >
                    {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : <CircleDashed className="w-4 h-4" />}
                  </button>

                  <div className="min-w-0">
                    <button
                      onClick={() => openEditModal(task)}
                      className={`text-xs font-medium truncate block text-left ${
                        isCompleted
                          ? 'line-through text-slate-400 dark:text-slate-500'
                          : 'text-slate-900 dark:text-slate-100 hover:text-blue-600 dark:hover:text-blue-400'
                      }`}
                    >
                      {task.title}
                    </button>
                    <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-0.5">
                      <span>{task.category}</span>
                      <span aria-hidden="true">·</span>
                      <span className={task.status === 'Completed' ? 'text-emerald-600 dark:text-emerald-400' : ''}>
                        {task.status}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className={`text-[11px] font-mono tabular-nums ${
                    task.priority === 'High'
                      ? 'text-rose-500 font-semibold'
                      : task.priority === 'Medium'
                      ? 'text-amber-500'
                      : 'text-slate-400'
                  }`}>
                    {task.priority}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
