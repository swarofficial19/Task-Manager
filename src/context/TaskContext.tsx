import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { Task, CreateTaskInput, UpdateTaskInput, DashboardStats, TaskFilters, ViewTab, DisplayMode, ToastMessage, TaskStatus } from '../types/task';
import { taskApi } from '../services/api';

interface TaskContextType {
  tasks: Task[];
  stats: DashboardStats | null;
  categories: string[];
  loading: boolean;
  error: string | null;
  activeView: ViewTab;
  displayMode: DisplayMode;
  filters: TaskFilters;
  theme: 'light' | 'dark';
  toasts: ToastMessage[];

  // Modal States
  isTaskModalOpen: boolean;
  editingTask: Task | null;
  defaultModalStatus: TaskStatus;
  isDeleteModalOpen: boolean;
  deletingTask: Task | null;

  // Actions
  setActiveView: (view: ViewTab) => void;
  setDisplayMode: (mode: DisplayMode) => void;
  setFilters: (update: Partial<TaskFilters> | ((prev: TaskFilters) => TaskFilters)) => void;
  resetFilters: () => void;
  toggleTheme: () => void;
  refreshData: () => Promise<void>;
  
  // CRUD
  createTask: (input: CreateTaskInput) => Promise<Task>;
  updateTask: (id: number, input: UpdateTaskInput) => Promise<Task>;
  updateTaskStatus: (id: number, status: TaskStatus) => Promise<Task>;
  deleteTask: (id: number) => Promise<void>;

  // Modal Openers
  openCreateModal: (status?: TaskStatus) => void;
  openEditModal: (task: Task) => void;
  closeTaskModal: () => void;
  openDeleteModal: (task: Task) => void;
  closeDeleteModal: () => void;

  // Notifications
  addToast: (title: string, message?: string, type?: 'success' | 'error' | 'info') => void;
  removeToast: (id: string) => void;
}

const defaultFilters: TaskFilters = {
  search: '',
  priority: 'all',
  status: 'all',
  category: 'all',
  sortBy: 'due_date',
  order: 'asc',
};

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export const TaskProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [activeView, setActiveView] = useState<ViewTab>('dashboard');
  const [displayMode, setDisplayMode] = useState<DisplayMode>('list');
  const [filters, setFiltersState] = useState<TaskFilters>(defaultFilters);

  // Theme management: sync with document.documentElement.classList
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('taskflow_theme');
      if (saved === 'dark' || saved === 'light') return saved;
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return 'light';
  });

  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Modal states
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [defaultModalStatus, setDefaultModalStatus] = useState<TaskStatus>('Pending');

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletingTask, setDeletingTask] = useState<Task | null>(null);

  // Apply theme class to <html>
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('taskflow_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  const addToast = useCallback((title: string, message?: string, type: 'success' | 'error' | 'info' = 'info') => {
    const id = `${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    setToasts(prev => [...prev, { id, title, message, type }]);

    // Auto dismiss after 4 seconds
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  // Set filters
  const setFilters = (update: Partial<TaskFilters> | ((prev: TaskFilters) => TaskFilters)) => {
    setFiltersState(prev => {
      if (typeof update === 'function') {
        return update(prev);
      }
      return { ...prev, ...update };
    });
  };

  const resetFilters = () => {
    setFiltersState(defaultFilters);
  };

  // Fetch tasks and stats from backend SQLite API
  const refreshData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [tasksData, statsData, catsData] = await Promise.all([
        taskApi.getTasks({
          ...filters,
          view: activeView,
        }),
        taskApi.getStats(),
        taskApi.getCategories(),
      ]);

      setTasks(tasksData);
      setStats(statsData);
      setCategories(catsData);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Could not fetch data from database';
      setError(msg);
      addToast('Error fetching data', msg, 'error');
    } finally {
      setLoading(false);
    }
  }, [activeView, filters, addToast]);

  // Initial and reactive data load
  useEffect(() => {
    refreshData();
  }, [refreshData]);

  // CRUD Operations
  const createTask = async (input: CreateTaskInput): Promise<Task> => {
    try {
      const created = await taskApi.createTask(input);
      addToast('Task Created', `"${created.title}" has been successfully added.`, 'success');
      await refreshData();
      return created;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to create task';
      addToast('Creation Failed', msg, 'error');
      throw err;
    }
  };

  const updateTask = async (id: number, input: UpdateTaskInput): Promise<Task> => {
    try {
      const updated = await taskApi.updateTask(id, input);
      addToast('Task Updated', `"${updated.title}" has been saved.`, 'success');
      await refreshData();
      return updated;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to update task';
      addToast('Update Failed', msg, 'error');
      throw err;
    }
  };

  const updateTaskStatus = async (id: number, status: TaskStatus): Promise<Task> => {
    try {
      // Optimistic update
      setTasks(prev => prev.map(t => (t.id === id ? { ...t, status } : t)));

      const updated = await taskApi.updateTaskStatus(id, status);

      // Trigger celebratory confetti when completed
      if (status === 'Completed') {
        try {
          confetti({
            particleCount: 50,
            spread: 60,
            origin: { y: 0.8 },
            colors: ['#10B981', '#3B82F6', '#6366F1', '#F59E0B']
          });
        } catch {
          // ignore
        }
        addToast('Task Completed! 🎉', `"${updated.title}" is now done.`, 'success');
      } else {
        addToast('Status Changed', `Task moved to ${status}.`, 'info');
      }

      // Refresh to sync stats
      const newStats = await taskApi.getStats();
      setStats(newStats);

      return updated;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to update status';
      addToast('Status Update Failed', msg, 'error');
      await refreshData(); // rollback
      throw err;
    }
  };

  const deleteTask = async (id: number): Promise<void> => {
    try {
      const res = await taskApi.deleteTask(id);
      addToast('Task Deleted', `"${res.deletedTask?.title || 'Task'}" was removed.`, 'info');
      await refreshData();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to delete task';
      addToast('Deletion Failed', msg, 'error');
      throw err;
    }
  };

  // Modal handlers
  const openCreateModal = (status?: TaskStatus) => {
    setEditingTask(null);
    setDefaultModalStatus(status || 'Pending');
    setIsTaskModalOpen(true);
  };

  const openEditModal = (task: Task) => {
    setEditingTask(task);
    setIsTaskModalOpen(true);
  };

  const closeTaskModal = () => {
    setIsTaskModalOpen(false);
    setEditingTask(null);
  };

  const openDeleteModal = (task: Task) => {
    setDeletingTask(task);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setDeletingTask(null);
  };

  return (
    <TaskContext.Provider
      value={{
        tasks,
        stats,
        categories,
        loading,
        error,
        activeView,
        displayMode,
        filters,
        theme,
        toasts,
        isTaskModalOpen,
        editingTask,
        defaultModalStatus,
        isDeleteModalOpen,
        deletingTask,
        setActiveView,
        setDisplayMode,
        setFilters,
        resetFilters,
        toggleTheme,
        refreshData,
        createTask,
        updateTask,
        updateTaskStatus,
        deleteTask,
        openCreateModal,
        openEditModal,
        closeTaskModal,
        openDeleteModal,
        closeDeleteModal,
        addToast,
        removeToast,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};

export const useTasks = (): TaskContextType => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTasks must be used within a TaskProvider');
  }
  return context;
};
