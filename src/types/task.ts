export type Priority = 'Low' | 'Medium' | 'High';
export type TaskStatus = 'Pending' | 'In Progress' | 'Completed';

export interface Task {
  id: number;
  title: string;
  description: string | null;
  priority: Priority;
  status: TaskStatus;
  due_date: string | null;
  category: string;
  created_at: string;
  updated_at: string;
}

export interface CreateTaskInput {
  title: string;
  description?: string;
  priority: Priority;
  status: TaskStatus;
  due_date?: string | null;
  category: string;
}

export interface UpdateTaskInput {
  title?: string;
  description?: string;
  priority?: Priority;
  status?: TaskStatus;
  due_date?: string | null;
  category?: string;
}

export interface DashboardStats {
  totalTasks: number;
  completedTasks: number;
  pendingTasks: number;
  inProgressTasks: number;
  overdueTasks: number;
  dueTodayTasks: number;
  completionRate: number;
  priorityCounts: {
    High: number;
    Medium: number;
    Low: number;
  };
  categoryCounts: Array<{ category: string; count: number }>;
  upcomingDeadlines: Task[];
  recentTasks: Task[];
  statusBreakdown: Array<{ name: string; count: number; percentage: number }>;
}

export type ViewTab = 'dashboard' | 'all' | 'my_day' | 'upcoming' | 'completed' | 'overdue' | 'settings';
export type DisplayMode = 'list' | 'kanban';

export interface TaskFilters {
  search: string;
  priority: Priority | 'all';
  status: TaskStatus | 'all';
  category: string | 'all';
  sortBy: 'due_date' | 'priority' | 'created_at' | 'title';
  order: 'asc' | 'desc';
}

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  title: string;
  message?: string;
}
