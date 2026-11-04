import React from 'react';
import {
  Search,
  Filter,
  ArrowUpDown,
  LayoutList,
  Kanban,
  X,
  RotateCcw
} from 'lucide-react';
import { useTasks } from '../../context/TaskContext';
import { Priority, TaskStatus, TaskFilters } from '../../types/task';

export const TaskFilterBar: React.FC = () => {
  const { filters, setFilters, resetFilters, categories, displayMode, setDisplayMode, activeView } = useTasks();

  const isFilteringActive =
    filters.search !== '' ||
    filters.priority !== 'all' ||
    filters.status !== 'all' ||
    filters.category !== 'all' ||
    filters.sortBy !== 'due_date' ||
    filters.order !== 'asc';

  return (
    <div className="space-y-3 p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={filters.search}
            onChange={(e) => setFilters({ search: e.target.value })}
            placeholder="Search tasks by title, description, or category..."
            className="w-full pl-9 pr-8 py-2 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
          />
          {filters.search && (
            <button
              onClick={() => setFilters({ search: '' })}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* View Mode Toggle: List vs Kanban */}
        <div className="flex items-center gap-1 p-1 rounded-lg bg-slate-100 dark:bg-slate-800 self-end sm:self-auto shrink-0">
          <button
            onClick={() => setDisplayMode('list')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
              displayMode === 'list'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs font-semibold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <LayoutList className="w-3.5 h-3.5" />
            <span>List</span>
          </button>
          <button
            onClick={() => setDisplayMode('kanban')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
              displayMode === 'kanban'
                ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs font-semibold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Kanban className="w-3.5 h-3.5" />
            <span>Kanban</span>
          </button>
        </div>
      </div>

      {/* Filter Row */}
      <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100 dark:border-slate-800/80 text-xs">
        <div className="flex items-center gap-1.5 text-slate-400 mr-1">
          <Filter className="w-3.5 h-3.5" />
          <span className="text-[11px] font-medium uppercase tracking-wider">Filters:</span>
        </div>

        {/* Priority Filter */}
        <select
          value={filters.priority}
          onChange={(e) => setFilters({ priority: e.target.value as Priority | 'all' })}
          className="px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-1 focus:ring-blue-500"
        >
          <option value="all">Priority: All</option>
          <option value="High">High Priority</option>
          <option value="Medium">Medium Priority</option>
          <option value="Low">Low Priority</option>
        </select>

        {/* Status Filter (hidden if in Completed view or Kanban) */}
        {activeView !== 'completed' && displayMode !== 'kanban' && (
          <select
            value={filters.status}
            onChange={(e) => setFilters({ status: e.target.value as TaskStatus | 'all' })}
            className="px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="all">Status: All</option>
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>
        )}

        {/* Category Filter */}
        <select
          value={filters.category}
          onChange={(e) => setFilters({ category: e.target.value })}
          className="px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-1 focus:ring-blue-500"
        >
          <option value="all">Category: All</option>
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>

        {/* Sorting controls */}
        <div className="flex items-center gap-1 ml-auto">
          <div className="flex items-center gap-1 text-slate-400 mr-1">
            <ArrowUpDown className="w-3.5 h-3.5" />
            <span className="text-[11px] font-medium uppercase tracking-wider hidden sm:inline">Sort:</span>
          </div>

          <select
            value={filters.sortBy}
            onChange={(e) => setFilters({ sortBy: e.target.value as TaskFilters['sortBy'] })}
            className="px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="due_date">Due Date</option>
            <option value="priority">Priority</option>
            <option value="created_at">Date Created</option>
            <option value="title">Title</option>
          </select>

          <button
            onClick={() => setFilters({ order: filters.order === 'asc' ? 'desc' : 'asc' })}
            className="px-2 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            title={`Sort ${filters.order === 'asc' ? 'Ascending' : 'Descending'}`}
          >
            {filters.order === 'asc' ? '↑ Asc' : '↓ Desc'}
          </button>

          {isFilteringActive && (
            <button
              onClick={resetFilters}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-slate-500 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors ml-1"
              title="Reset all filters"
            >
              <RotateCcw className="w-3 h-3" />
              <span className="hidden sm:inline">Reset</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
