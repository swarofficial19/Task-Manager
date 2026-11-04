import React from 'react';
import { PieChart, BarChart3, Tag } from 'lucide-react';
import { useTasks } from '../../context/TaskContext';

export const CompletionChart: React.FC = () => {
  const { stats } = useTasks();

  const total = stats?.totalTasks ?? 0;
  const completed = stats?.completedTasks ?? 0;
  const inProgress = stats?.inProgressTasks ?? 0;
  const pending = stats?.pendingTasks ?? 0;
  const completionRate = stats?.completionRate ?? 0;

  const priorityCounts = stats?.priorityCounts ?? { High: 0, Medium: 0, Low: 0 };
  const categories = stats?.categoryCounts ?? [];

  // SVG Gauge calculations
  const radius = 38;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (completionRate / 100) * circumference;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      {/* 1. Circular Completion Gauge & Status Metrics */}
      <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs flex flex-col justify-between">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800/80">
          <div className="flex items-center gap-2">
            <PieChart className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <h3 className="text-xs font-semibold text-slate-900 dark:text-white uppercase tracking-wider">
              Completion Rate
            </h3>
          </div>
          <span className="text-[11px] font-mono tabular-nums text-slate-500 dark:text-slate-400">
            {completed}/{total} tasks
          </span>
        </div>

        <div className="flex items-center justify-center gap-6 py-4">
          <div className="relative flex items-center justify-center">
            <svg className="w-28 h-28 transform -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r={radius}
                className="text-slate-100 dark:text-slate-800"
                strokeWidth="10"
                stroke="currentColor"
                fill="transparent"
              />
              <circle
                cx="50"
                cy="50"
                r={radius}
                className="text-emerald-500 transition-all duration-700 ease-out"
                strokeWidth="10"
                strokeDasharray={circumference}
                strokeDashoffset={isNaN(strokeDashoffset) ? circumference : strokeDashoffset}
                strokeLinecap="round"
                stroke="currentColor"
                fill="transparent"
              />
            </svg>
            <div className="absolute flex flex-col items-center">
              <span className="text-2xl font-bold font-mono tabular-nums text-slate-900 dark:text-white">
                {completionRate}%
              </span>
              <span className="text-[10px] text-slate-500 uppercase tracking-wider">Done</span>
            </div>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-xs bg-emerald-500 shrink-0" />
                <span className="text-slate-600 dark:text-slate-400">Completed</span>
              </div>
              <span className="font-mono font-semibold tabular-nums text-slate-900 dark:text-slate-100">
                {completed}
              </span>
            </div>
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-xs bg-indigo-500 shrink-0" />
                <span className="text-slate-600 dark:text-slate-400">In Progress</span>
              </div>
              <span className="font-mono font-semibold tabular-nums text-slate-900 dark:text-slate-100">
                {inProgress}
              </span>
            </div>
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-xs bg-amber-400 shrink-0" />
                <span className="text-slate-600 dark:text-slate-400">Pending</span>
              </div>
              <span className="font-mono font-semibold tabular-nums text-slate-900 dark:text-slate-100">
                {pending}
              </span>
            </div>
          </div>
        </div>

        <div className="pt-3 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-500 text-center">
          {total === 0
            ? 'No tasks in database yet'
            : completed === total
            ? 'All tasks fully completed!'
            : `${total - completed} task${total - completed > 1 ? 's' : ''} remaining`}
        </div>
      </div>

      {/* 2. Priority Breakdown Visual */}
      <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs flex flex-col justify-between">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800/80">
          <div className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            <h3 className="text-xs font-semibold text-slate-900 dark:text-white uppercase tracking-wider">
              Priority Spectrum
            </h3>
          </div>
          <span className="text-[11px] font-mono tabular-nums text-slate-500 dark:text-slate-400">
            Severity Focus
          </span>
        </div>

        <div className="space-y-3.5 my-auto py-2">
          {/* High Priority */}
          <div>
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="font-medium text-rose-600 dark:text-rose-400 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-rose-500" />
                High Priority
              </span>
              <span className="font-mono tabular-nums font-semibold text-slate-800 dark:text-slate-200">
                {priorityCounts.High} ({total > 0 ? Math.round((priorityCounts.High / total) * 100) : 0}%)
              </span>
            </div>
            <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
              <div
                className="h-full bg-rose-500 rounded-full transition-all duration-500"
                style={{ width: `${total > 0 ? (priorityCounts.High / total) * 100 : 0}%` }}
              />
            </div>
          </div>

          {/* Medium Priority */}
          <div>
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="font-medium text-amber-600 dark:text-amber-400 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-500" />
                Medium Priority
              </span>
              <span className="font-mono tabular-nums font-semibold text-slate-800 dark:text-slate-200">
                {priorityCounts.Medium} ({total > 0 ? Math.round((priorityCounts.Medium / total) * 100) : 0}%)
              </span>
            </div>
            <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
              <div
                className="h-full bg-amber-500 rounded-full transition-all duration-500"
                style={{ width: `${total > 0 ? (priorityCounts.Medium / total) * 100 : 0}%` }}
              />
            </div>
          </div>

          {/* Low Priority */}
          <div>
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="font-medium text-blue-600 dark:text-blue-400 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-blue-500" />
                Low Priority
              </span>
              <span className="font-mono tabular-nums font-semibold text-slate-800 dark:text-slate-200">
                {priorityCounts.Low} ({total > 0 ? Math.round((priorityCounts.Low / total) * 100) : 0}%)
              </span>
            </div>
            <div className="w-full h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
              <div
                className="h-full bg-blue-500 rounded-full transition-all duration-500"
                style={{ width: `${total > 0 ? (priorityCounts.Low / total) * 100 : 0}%` }}
              />
            </div>
          </div>
        </div>

        <div className="pt-3 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-500 text-center">
          {priorityCounts.High > 0
            ? `${priorityCounts.High} critical items require urgent focus`
            : 'No high priority bottlenecks'}
        </div>
      </div>

      {/* 3. Top Categories Breakdown */}
      <div className="p-5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs flex flex-col justify-between">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800/80">
          <div className="flex items-center gap-2">
            <Tag className="w-4 h-4 text-teal-600 dark:text-teal-400" />
            <h3 className="text-xs font-semibold text-slate-900 dark:text-white uppercase tracking-wider">
              Category Distribution
            </h3>
          </div>
          <span className="text-[11px] font-mono tabular-nums text-slate-500 dark:text-slate-400">
            {categories.length} active
          </span>
        </div>

        <div className="space-y-2.5 my-auto py-2">
          {categories.length === 0 ? (
            <p className="text-xs text-slate-400 text-center py-4">No categories recorded yet</p>
          ) : (
            categories.slice(0, 4).map((cat) => {
              const pct = total > 0 ? Math.round((cat.count / total) * 100) : 0;
              return (
                <div key={cat.category} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-700 dark:text-slate-300 truncate max-w-[140px] font-medium">
                      {cat.category}
                    </span>
                    <span className="font-mono tabular-nums text-slate-500 dark:text-slate-400">
                      {cat.count} ({pct}%)
                    </span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                    <div
                      className="h-full bg-teal-500 rounded-full transition-all duration-500"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })
          )}
        </div>

        <div className="pt-3 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-500 text-center truncate">
          Categorized for clear workload separation
        </div>
      </div>
    </div>
  );
};
