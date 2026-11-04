import React from 'react';
import { Calendar, AlertCircle, CheckCircle2, ArrowRight } from 'lucide-react';
import { useTasks } from '../../context/TaskContext';
import { Task } from '../../types/task';

export const UpcomingDeadlines: React.FC = () => {
  const { stats, updateTaskStatus, openEditModal, setActiveView } = useTasks();
  const deadlines = stats?.upcomingDeadlines ?? [];

  const todayStr = new Date().toISOString().split('T')[0];

  const getDueBadge = (dueDate: string | null) => {
    if (!dueDate) return { text: 'No date', color: 'text-slate-400' };
    if (dueDate < todayStr) return { text: 'Overdue', color: 'text-rose-600 dark:text-rose-400 font-semibold' };
    if (dueDate === todayStr) return { text: 'Due Today', color: 'text-amber-600 dark:text-amber-400 font-semibold' };
    
    // Days difference
    const diffTime = new Date(dueDate).getTime() - new Date(todayStr).getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    if (diffDays === 1) return { text: 'Tomorrow', color: 'text-blue-600 dark:text-blue-400 font-medium' };
    return { text: `In ${diffDays} days`, color: 'text-slate-600 dark:text-slate-400' };
  };

  return (
    <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs flex flex-col justify-between">
      <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100 dark:border-slate-800/80">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-amber-500" />
          <h3 className="text-xs font-semibold text-slate-900 dark:text-white uppercase tracking-wider">
            Upcoming Deadlines
          </h3>
        </div>
        <button
          onClick={() => setActiveView('upcoming')}
          className="text-xs text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 font-medium"
        >
          <span>View all</span>
          <ArrowRight className="w-3 h-3" />
        </button>
      </div>

      <div className="space-y-2 flex-1">
        {deadlines.length === 0 ? (
          <div className="py-6 text-center text-xs text-slate-500">
            No upcoming pending deadlines. All caught up!
          </div>
        ) : (
          deadlines.map((task: Task) => {
            const dueInfo = getDueBadge(task.due_date);
            const isOverdue = task.due_date && task.due_date < todayStr;

            return (
              <div
                key={task.id}
                className="group flex items-center justify-between gap-3 p-2.5 rounded-lg border border-slate-100 dark:border-slate-800/60 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <button
                    onClick={() => updateTaskStatus(task.id, 'Completed')}
                    title="Mark complete"
                    className="text-slate-300 dark:text-slate-600 hover:text-emerald-500 dark:hover:text-emerald-400 transition-colors shrink-0"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                  </button>

                  <div className="min-w-0">
                    <button
                      onClick={() => openEditModal(task)}
                      className="text-xs font-medium text-slate-900 dark:text-slate-100 hover:text-blue-600 dark:hover:text-blue-400 truncate block text-left"
                    >
                      {task.title}
                    </button>
                    <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-0.5">
                      <span>{task.category}</span>
                      <span aria-hidden="true">·</span>
                      <span className={task.priority === 'High' ? 'text-rose-500 font-medium' : ''}>
                        {task.priority} Priority
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 text-right">
                  {isOverdue && <AlertCircle className="w-3.5 h-3.5 text-rose-500 shrink-0" />}
                  <div className="text-right">
                    <div className={`text-xs font-mono tabular-nums ${dueInfo.color}`}>
                      {dueInfo.text}
                    </div>
                    {task.due_date && (
                      <div className="text-[10px] text-slate-400 font-mono tabular-nums">
                        {task.due_date}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
