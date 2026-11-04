import React from 'react';
import {
  CheckCircle2,
  Clock,
  AlertCircle,
  CalendarCheck,
  ListTodo,
  TrendingUp,
  PlayCircle
} from 'lucide-react';
import { useTasks } from '../../context/TaskContext';
import { ViewTab } from '../../types/task';

export const StatCards: React.FC = () => {
  const { stats, setActiveView } = useTasks();

  const total = stats?.totalTasks ?? 0;
  const completed = stats?.completedTasks ?? 0;
  const pending = stats?.pendingTasks ?? 0;
  const inProgress = stats?.inProgressTasks ?? 0;
  const overdue = stats?.overdueTasks ?? 0;
  const dueToday = stats?.dueTodayTasks ?? 0;
  const completionRate = stats?.completionRate ?? 0;

  const cards: Array<{
    label: string;
    value: number;
    subtext: string;
    icon: React.ComponentType<{ className?: string }>;
    accentColor: string;
    bgColor: string;
    borderColor: string;
    view?: ViewTab;
  }> = [
    {
      label: 'Total Tasks',
      value: total,
      subtext: 'All active & archived',
      icon: ListTodo,
      accentColor: 'text-blue-600 dark:text-blue-400',
      bgColor: 'bg-blue-50/50 dark:bg-blue-950/20',
      borderColor: 'border-blue-200 dark:border-blue-900/40',
      view: 'all',
    },
    {
      label: 'Completed',
      value: completed,
      subtext: `${completionRate}% overall rate`,
      icon: CheckCircle2,
      accentColor: 'text-emerald-600 dark:text-emerald-400',
      bgColor: 'bg-emerald-50/50 dark:bg-emerald-950/20',
      borderColor: 'border-emerald-200 dark:border-emerald-900/40',
      view: 'completed',
    },
    {
      label: 'In Progress',
      value: inProgress,
      subtext: 'Currently active',
      icon: PlayCircle,
      accentColor: 'text-indigo-600 dark:text-indigo-400',
      bgColor: 'bg-indigo-50/50 dark:bg-indigo-950/20',
      borderColor: 'border-indigo-200 dark:border-indigo-900/40',
      view: 'all',
    },
    {
      label: 'Pending',
      value: pending,
      subtext: 'Awaiting start',
      icon: Clock,
      accentColor: 'text-slate-600 dark:text-slate-400',
      bgColor: 'bg-slate-50/60 dark:bg-slate-900/30',
      borderColor: 'border-slate-200 dark:border-slate-800',
      view: 'upcoming',
    },
    {
      label: 'Due Today',
      value: dueToday,
      subtext: dueToday > 0 ? 'Action required today' : 'Up to date today',
      icon: CalendarCheck,
      accentColor: 'text-amber-600 dark:text-amber-400',
      bgColor: 'bg-amber-50/50 dark:bg-amber-950/20',
      borderColor: 'border-amber-200 dark:border-amber-900/40',
      view: 'my_day',
    },
    {
      label: 'Overdue',
      value: overdue,
      subtext: overdue > 0 ? 'Requires immediate action' : 'Zero overdue items',
      icon: AlertCircle,
      accentColor: overdue > 0 ? 'text-rose-600 dark:text-rose-400' : 'text-slate-500 dark:text-slate-400',
      bgColor: overdue > 0 ? 'bg-rose-50/60 dark:bg-rose-950/30' : 'bg-slate-50/60 dark:bg-slate-900/30',
      borderColor: overdue > 0 ? 'border-rose-300 dark:border-rose-900/60' : 'border-slate-200 dark:border-slate-800',
      view: 'overdue',
    },
  ];

  return (
    <div className="space-y-4">
      {/* Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <button
              key={card.label}
              onClick={() => card.view && setActiveView(card.view)}
              className={`p-4 rounded-xl border ${card.borderColor} ${card.bgColor} text-left transition-all hover:scale-[1.01] hover:shadow-xs group cursor-pointer focus-visible:outline-2 focus-visible:outline-blue-600`}
            >
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-xs font-semibold text-slate-600 dark:text-slate-400 truncate">
                  {card.label}
                </span>
                <Icon className={`w-4 h-4 ${card.accentColor} shrink-0`} />
              </div>

              <div className="text-2xl font-bold font-mono tabular-nums text-slate-900 dark:text-white">
                {card.value}
              </div>

              <div className="mt-1 text-[11px] text-slate-500 dark:text-slate-400 truncate">
                {card.subtext}
              </div>
            </button>
          );
        })}
      </div>

      {/* Progress completion bar */}
      <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
              Task Completion Velocity
            </span>
          </div>
          <span className="text-xs font-mono font-bold tabular-nums text-slate-900 dark:text-slate-100">
            {completed} of {total} completed ({completionRate}%)
          </span>
        </div>

        <div className="w-full h-2.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden flex">
          <div
            className="h-full bg-emerald-500 transition-all duration-500 ease-out"
            style={{ width: `${total > 0 ? (completed / total) * 100 : 0}%` }}
            title={`Completed: ${completed}`}
          />
          <div
            className="h-full bg-indigo-500 transition-all duration-500 ease-out"
            style={{ width: `${total > 0 ? (inProgress / total) * 100 : 0}%` }}
            title={`In Progress: ${inProgress}`}
          />
          <div
            className="h-full bg-amber-400 transition-all duration-500 ease-out"
            style={{ width: `${total > 0 ? (pending / total) * 100 : 0}%` }}
            title={`Pending: ${pending}`}
          />
        </div>

        <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 mt-2">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              Completed ({completed})
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-indigo-500" />
              In Progress ({inProgress})
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-400" />
              Pending ({pending})
            </span>
          </div>
          <span>Persistent in SQLite</span>
        </div>
      </div>
    </div>
  );
};
