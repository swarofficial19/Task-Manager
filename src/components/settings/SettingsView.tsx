import React, { useState } from 'react';
import {
  Sun,
  Moon,
  Database,
  Download,
  Info,
  ShieldCheck,
  RefreshCw,
  Server,
  Layers
} from 'lucide-react';
import { useTasks } from '../../context/TaskContext';

export const SettingsView: React.FC = () => {
  const { theme, toggleTheme, stats, tasks, refreshData, addToast } = useTasks();
  const [isExporting, setIsExporting] = useState(false);

  // Real Export Tasks as JSON
  const handleExportData = () => {
    setIsExporting(true);
    try {
      const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(tasks, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute('href', dataStr);
      downloadAnchor.setAttribute('download', `taskflow_backup_${new Date().toISOString().split('T')[0]}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
      addToast('Backup Exported', `${tasks.length} tasks exported successfully to JSON.`, 'success');
    } catch {
      addToast('Export Failed', 'Could not export tasks', 'error');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="max-w-4xl space-y-6">
      {/* 1. Theme Configuration */}
      <div className="p-6 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1">
          Interface Theme
        </h3>
        <p className="text-xs text-slate-500 mb-4">
          Choose your preferred visual presentation. Defaults to system preference.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button
            onClick={() => theme === 'dark' && toggleTheme()}
            className={`p-4 rounded-xl border flex items-center gap-3.5 transition-all text-left ${
              theme === 'light'
                ? 'border-blue-600 ring-2 ring-blue-500/20 bg-blue-50/20 dark:bg-blue-950/20'
                : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'
            }`}
          >
            <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 border border-amber-200">
              <Sun className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-bold text-slate-900 dark:text-white block">
                Light Theme
              </span>
              <span className="text-[11px] text-slate-500">
                Crisp high-contrast neutral daylight mode
              </span>
            </div>
          </button>

          <button
            onClick={() => theme === 'light' && toggleTheme()}
            className={`p-4 rounded-xl border flex items-center gap-3.5 transition-all text-left ${
              theme === 'dark'
                ? 'border-blue-500 ring-2 ring-blue-500/20 bg-blue-50/20 dark:bg-blue-950/20'
                : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'
            }`}
          >
            <div className="w-10 h-10 rounded-lg bg-slate-800 text-slate-300 flex items-center justify-center shrink-0 border border-slate-700">
              <Moon className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-bold text-slate-900 dark:text-white block">
                Dark Theme
              </span>
              <span className="text-[11px] text-slate-500">
                Deep slate aesthetic optimized for low-light focus
              </span>
            </div>
          </button>
        </div>
      </div>

      {/* 2. Database & Storage Architecture */}
      <div className="p-6 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
        <div className="flex items-center gap-2 mb-1">
          <Database className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            Persistent Database Architecture
          </h3>
        </div>
        <p className="text-xs text-slate-500 mb-4">
          TaskFlow uses an ACID-compliant embedded SQLite engine configured with Write-Ahead Logging (WAL).
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs mb-4">
          <div className="p-3 rounded-lg border border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/60">
            <span className="text-slate-400 block text-[11px]">Database Engine</span>
            <span className="font-semibold text-slate-800 dark:text-slate-200 font-mono mt-0.5 block">
              SQLite 3 (better-sqlite3)
            </span>
          </div>

          <div className="p-3 rounded-lg border border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/60">
            <span className="text-slate-400 block text-[11px]">Storage Target</span>
            <span className="font-semibold text-slate-800 dark:text-slate-200 font-mono mt-0.5 block truncate">
              /data/tasks.db (Persistent)
            </span>
          </div>

          <div className="p-3 rounded-lg border border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/60">
            <span className="text-slate-400 block text-[11px]">Current Records</span>
            <span className="font-semibold text-slate-800 dark:text-slate-200 font-mono tabular-nums mt-0.5 block">
              {stats?.totalTasks ?? 0} active tasks
            </span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
          <button
            onClick={handleExportData}
            disabled={isExporting}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Tasks (JSON)</span>
          </button>

          <button
            onClick={() => refreshData()}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white rounded-lg transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Sync Live Database</span>
          </button>
        </div>
      </div>

      {/* 3. System & API Information */}
      <div className="p-6 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
        <div className="flex items-center gap-2 mb-1">
          <Server className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            Application Specs & API Contracts
          </h3>
        </div>
        <p className="text-xs text-slate-500 mb-4">
          Clean separation between client presentation and RESTful service layer.
        </p>

        <div className="space-y-2 text-xs">
          <div className="flex items-center justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
            <span className="text-slate-500">Frontend Stack</span>
            <span className="font-medium text-slate-800 dark:text-slate-200 font-mono">React 19 + TypeScript + Tailwind CSS</span>
          </div>
          <div className="flex items-center justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
            <span className="text-slate-500">Backend Server</span>
            <span className="font-medium text-slate-800 dark:text-slate-200 font-mono">Node.js + Express REST APIs</span>
          </div>
          <div className="flex items-center justify-between py-1.5 border-b border-slate-100 dark:border-slate-800">
            <span className="text-slate-500">API Standard</span>
            <span className="font-medium text-slate-800 dark:text-slate-200 font-mono">RESTful JSON (/api/tasks, /api/stats)</span>
          </div>
          <div className="flex items-center justify-between py-1.5">
            <span className="text-slate-500">Data Guarantee</span>
            <span className="font-medium text-emerald-600 dark:text-emerald-400 flex items-center gap-1 font-mono">
              <ShieldCheck className="w-3.5 h-3.5" />
              Non-volatile SQLite storage
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
