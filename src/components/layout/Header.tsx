import React from 'react';
import { Plus, Sun, Moon, Menu, CheckSquare2 } from 'lucide-react';
import { useTasks } from '../../context/TaskContext';
import { ViewTab } from '../../types/task';

interface HeaderProps {
  onToggleMobileSidebar: () => void;
}

const viewTitles: Record<ViewTab, string> = {
  dashboard: 'Executive Dashboard',
  all: 'All Tasks',
  my_day: 'My Day',
  upcoming: 'Upcoming Schedule',
  completed: 'Completed Archive',
  overdue: 'Overdue Attention',
  settings: 'System Settings',
};

export const Header: React.FC<HeaderProps> = ({ onToggleMobileSidebar }) => {
  const { activeView, theme, toggleTheme, openCreateModal } = useTasks();

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between gap-4 md:gap-8 px-4 md:px-8 py-3.5 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
      {/* Zone 1: Mobile Hamburger + Brand & Contextual Breadcrumb */}
      <div className="flex items-center gap-3 min-w-0">
        <button
          onClick={onToggleMobileSidebar}
          aria-label="Toggle navigation menu"
          className="p-1.5 -ml-1 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 md:hidden transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center shadow-sm shrink-0">
            <CheckSquare2 className="w-4 h-4 stroke-[2.5]" />
          </div>
          <span className="text-lg font-bold tracking-tight text-slate-900 dark:text-slate-100 whitespace-nowrap">
            TaskFlow
          </span>
        </div>

        <span className="hidden sm:inline-block text-slate-300 dark:text-slate-700 font-normal">/</span>
        <h1 className="hidden sm:block text-sm font-medium text-slate-600 dark:text-slate-300 truncate">
          {viewTitles[activeView]}
        </h1>
      </div>

      {/* Zone 2: Navigation Breadcrumb / Active View Badge on mobile */}
      <div className="sm:hidden text-xs font-medium text-slate-500 dark:text-slate-400 truncate">
        {viewTitles[activeView]}
      </div>

      {/* Zone 3: Actions (Theme Toggle + New Task CTA) */}
      <div className="flex items-center gap-2.5 shrink-0">
        <button
          onClick={toggleTheme}
          aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          className="p-2 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
        </button>

        <button
          onClick={() => openCreateModal()}
          className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 active:scale-[0.98] rounded-lg shadow-sm transition-all whitespace-nowrap shrink-0"
        >
          <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
          <span>New Task</span>
        </button>
      </div>
    </header>
  );
};
