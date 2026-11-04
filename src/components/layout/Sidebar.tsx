import React from 'react';
import {
  LayoutDashboard,
  CheckSquare,
  Sun,
  Calendar,
  CheckCircle2,
  AlertCircle,
  Settings,
  X,
  Layers,
  Database
} from 'lucide-react';
import { useTasks } from '../../context/TaskContext';
import { ViewTab } from '../../types/task';

interface SidebarProps {
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ mobileOpen, onCloseMobile }) => {
  const { activeView, setActiveView, stats, categories, filters, setFilters } = useTasks();

  const navItems: Array<{ id: ViewTab; label: string; icon: React.ComponentType<{ className?: string }>; count?: number; countColor?: string }> = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
    },
    {
      id: 'all',
      label: 'All Tasks',
      icon: CheckSquare,
      count: stats?.totalTasks,
    },
    {
      id: 'my_day',
      label: 'My Day',
      icon: Sun,
      count: stats?.dueTodayTasks,
      countColor: 'text-amber-600 dark:text-amber-400',
    },
    {
      id: 'upcoming',
      label: 'Upcoming',
      icon: Calendar,
      count: (stats?.pendingTasks || 0) + (stats?.inProgressTasks || 0),
    },
    {
      id: 'completed',
      label: 'Completed',
      icon: CheckCircle2,
      count: stats?.completedTasks,
      countColor: 'text-emerald-600 dark:text-emerald-400',
    },
    {
      id: 'overdue',
      label: 'Overdue',
      icon: AlertCircle,
      count: stats?.overdueTasks,
      countColor: stats && stats.overdueTasks > 0 ? 'text-rose-600 dark:text-rose-400 font-bold' : undefined,
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: Settings,
    },
  ];

  const handleSelectView = (view: ViewTab) => {
    setActiveView(view);
    onCloseMobile();
  };

  const handleSelectCategory = (cat: string) => {
    if (activeView === 'dashboard' || activeView === 'settings') {
      setActiveView('all');
    }
    setFilters({ category: filters.category === cat ? 'all' : cat });
    onCloseMobile();
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-xs md:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed md:sticky top-0 left-0 z-40 md:z-20 h-screen w-64 bg-slate-50 dark:bg-slate-950 border-r border-slate-200 dark:border-slate-800 flex flex-col justify-between transition-transform duration-200 ease-in-out md:translate-x-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col flex-1 overflow-y-auto px-3.5 py-4">
          {/* Header on mobile */}
          <div className="flex items-center justify-between px-2 pb-3 mb-2 md:hidden border-b border-slate-200 dark:border-slate-800">
            <span className="text-sm font-bold tracking-tight text-slate-900 dark:text-slate-100">
              Navigation
            </span>
            <button
              onClick={onCloseMobile}
              aria-label="Close menu"
              className="p-1 text-slate-500 hover:text-slate-900 dark:hover:text-white rounded-md"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <div className="space-y-1">
            <div className="px-2.5 py-1 text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
              Workspaces
            </div>

            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeView === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => handleSelectView(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-blue-600 text-white font-semibold shadow-xs'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-200/60 dark:hover:bg-slate-800/60'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-500 dark:text-slate-400'}`} />
                    <span className="truncate">{item.label}</span>
                  </div>

                  {item.count !== undefined && (
                    <span
                      className={`text-[11px] font-mono tabular-nums px-1.5 py-0.5 rounded ${
                        isActive
                          ? 'bg-white/20 text-white'
                          : item.countColor || 'text-slate-500 dark:text-slate-400'
                      }`}
                    >
                      {item.count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Categories Section */}
          {categories.length > 0 && (
            <div className="mt-6 pt-4 border-t border-slate-200 dark:border-slate-800/80">
              <div className="flex items-center justify-between px-2.5 py-1 mb-1">
                <span className="text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                  Categories
                </span>
                {filters.category !== 'all' && (
                  <button
                    onClick={() => setFilters({ category: 'all' })}
                    className="text-[11px] text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    Clear
                  </button>
                )}
              </div>

              <div className="space-y-0.5">
                {categories.map((cat) => {
                  const isSelected = filters.category === cat;
                  return (
                    <button
                      key={cat}
                      onClick={() => handleSelectCategory(cat)}
                      className={`w-full flex items-center justify-between px-3 py-1.5 rounded-md text-xs transition-colors ${
                        isSelected
                          ? 'bg-slate-200 dark:bg-slate-800 font-semibold text-blue-600 dark:text-blue-400'
                          : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900'
                      }`}
                    >
                      <div className="flex items-center gap-2 truncate">
                        <Layers className="w-3 h-3 text-slate-400" />
                        <span className="truncate">{cat}</span>
                      </div>
                      {isSelected && (
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-600 dark:bg-blue-400" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Database status footer (Zero fake telemetry, real persistence info) */}
        <div className="p-3 border-t border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/40">
          <div className="flex items-center gap-2 px-2 py-1.5 text-xs text-slate-500 dark:text-slate-400">
            <Database className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span className="truncate">SQLite Persistent Storage</span>
          </div>
        </div>
      </aside>
    </>
  );
};
