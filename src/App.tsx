import React, { useState } from 'react';
import { TaskProvider, useTasks } from './context/TaskContext';
import { Header } from './components/layout/Header';
import { Sidebar } from './components/layout/Sidebar';
import { StatCards } from './components/dashboard/StatCards';
import { CompletionChart } from './components/dashboard/CompletionChart';
import { UpcomingDeadlines } from './components/dashboard/UpcomingDeadlines';
import { RecentTasks } from './components/dashboard/RecentTasks';
import { TaskFilterBar } from './components/tasks/TaskFilterBar';
import { TaskList } from './components/tasks/TaskList';
import { KanbanBoard } from './components/tasks/KanbanBoard';
import { TaskModal } from './components/tasks/TaskModal';
import { DeleteConfirmModal } from './components/tasks/DeleteConfirmModal';
import { SettingsView } from './components/settings/SettingsView';
import { ToastContainer } from './components/common/ToastContainer';
import { Plus, Sparkles, AlertCircle } from 'lucide-react';

const MainContent: React.FC = () => {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const { activeView, displayMode, openCreateModal, error } = useTasks();

  return (
    <div className="min-h-screen bg-slate-100/70 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col md:flex-row antialiased transition-colors selection:bg-blue-600 selection:text-white">
      {/* Sidebar Navigation */}
      <Sidebar
        mobileOpen={mobileSidebarOpen}
        onCloseMobile={() => setMobileSidebarOpen(false)}
      />

      {/* Main Viewport Container */}
      <div className="flex-1 flex flex-col min-w-0">
        <Header onToggleMobileSidebar={() => setMobileSidebarOpen(prev => !prev)} />

        <main className="flex-1 p-4 md:p-8 max-w-7xl w-full mx-auto space-y-6">
          {/* Server Error Alert Banner if connection issue */}
          {error && (
            <div className="p-4 rounded-xl border border-rose-200 dark:border-rose-900/60 bg-rose-50 dark:bg-rose-950/40 text-rose-800 dark:text-rose-200 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>Backend communication: {error}</span>
              </div>
            </div>
          )}

          {/* VIEW: DASHBOARD */}
          {activeView === 'dashboard' && (
            <div className="space-y-6 animate-in fade-in duration-150">
              {/* Dashboard Welcome Header with Quick Action */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2 border-b border-slate-200/80 dark:border-slate-800">
                <div>
                  <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                    Dashboard Overview
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Real-time operational summary computed directly from persistent SQLite storage
                  </p>
                </div>

                <button
                  onClick={() => openCreateModal()}
                  className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 active:scale-[0.98] rounded-lg shadow-xs transition-all whitespace-nowrap"
                >
                  <Plus className="w-4 h-4 stroke-[2.5]" />
                  <span>Create Task</span>
                </button>
              </div>

              {/* 1. Summary Cards */}
              <StatCards />

              {/* 2. Visual Task Completion and Priority Chart */}
              <CompletionChart />

              {/* 3. Deadlines & Recent Activity Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <UpcomingDeadlines />
                <RecentTasks />
              </div>
            </div>
          )}

          {/* VIEW: TASKS (All, My Day, Upcoming, Completed, Overdue) */}
          {activeView !== 'dashboard' && activeView !== 'settings' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              {/* View Header */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-2 border-b border-slate-200/80 dark:border-slate-800">
                <div>
                  <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white capitalize">
                    {activeView.replace('_', ' ')}
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    {activeView === 'my_day'
                      ? 'Tasks scheduled for execution today'
                      : activeView === 'upcoming'
                      ? 'Future scheduled commitments and deliverables'
                      : activeView === 'completed'
                      ? 'Archived record of successfully resolved tasks'
                      : activeView === 'overdue'
                      ? 'Tasks past their deadline requiring immediate resolution'
                      : 'Full backlog of tasks with multi-parameter filtering'}
                  </p>
                </div>

                <button
                  onClick={() => openCreateModal()}
                  className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 active:scale-[0.98] rounded-lg shadow-xs transition-all whitespace-nowrap"
                >
                  <Plus className="w-4 h-4 stroke-[2.5]" />
                  <span>New Task</span>
                </button>
              </div>

              {/* Filter and View Mode Toolbar */}
              <TaskFilterBar />

              {/* Task Rendering: List or Kanban */}
              {displayMode === 'list' ? <TaskList /> : <KanbanBoard />}
            </div>
          )}

          {/* VIEW: SETTINGS */}
          {activeView === 'settings' && (
            <div className="space-y-4 animate-in fade-in duration-150">
              <div className="pb-2 border-b border-slate-200/80 dark:border-slate-800">
                <h2 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                  System Settings
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Configure display preferences and inspect SQLite database integrity
                </p>
              </div>

              <SettingsView />
            </div>
          )}
        </main>
      </div>

      {/* Modals & Floating Notifications */}
      <TaskModal />
      <DeleteConfirmModal />
      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <TaskProvider>
      <MainContent />
    </TaskProvider>
  );
}
