import { Task, CreateTaskInput, UpdateTaskInput, DashboardStats, TaskFilters, TaskStatus } from '../types/task';

// Support VITE_API_BASE_URL environment variable, falling back to relative '/api'
const API_BASE = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/$/, '') + '/api';

class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE}${endpoint}`;
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  try {
    const res = await fetch(url, { ...options, headers });
    
    if (!res.ok) {
      let errorMsg = `HTTP Error ${res.status}`;
      try {
        const body = await res.json();
        if (body.error) errorMsg = body.error;
      } catch {
        // use default HTTP error
      }
      throw new ApiError(res.status, errorMsg);
    }

    return await res.json();
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new Error(error instanceof Error ? error.message : 'Network communication error');
  }
}

export const taskApi = {
  // Retrieve all tasks with query options
  getTasks: async (filters?: Partial<TaskFilters & { view?: string }>): Promise<Task[]> => {
    const params = new URLSearchParams();
    if (filters) {
      if (filters.search) params.append('search', filters.search);
      if (filters.priority && filters.priority !== 'all') params.append('priority', filters.priority);
      if (filters.status && filters.status !== 'all') params.append('status', filters.status);
      if (filters.category && filters.category !== 'all') params.append('category', filters.category);
      if (filters.view && filters.view !== 'all' && filters.view !== 'dashboard' && filters.view !== 'settings') {
        params.append('view', filters.view);
      }
      if (filters.sortBy) params.append('sortBy', filters.sortBy);
      if (filters.order) params.append('order', filters.order);
    }

    const query = params.toString() ? `?${params.toString()}` : '';
    return request<Task[]>(`/tasks${query}`);
  },

  // Retrieve single task by ID
  getTaskById: async (id: number): Promise<Task> => {
    return request<Task>(`/tasks/${id}`);
  },

  // Create a new task
  createTask: async (input: CreateTaskInput): Promise<Task> => {
    return request<Task>('/tasks', {
      method: 'POST',
      body: JSON.stringify(input),
    });
  },

  // Update existing task
  updateTask: async (id: number, input: UpdateTaskInput): Promise<Task> => {
    return request<Task>(`/tasks/${id}`, {
      method: 'PUT',
      body: JSON.stringify(input),
    });
  },

  // Quick patch status (for Kanban move or completion toggle)
  updateTaskStatus: async (id: number, status: TaskStatus): Promise<Task> => {
    return request<Task>(`/tasks/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  },

  // Delete task
  deleteTask: async (id: number): Promise<{ success: boolean; message: string; deletedTask: Task }> => {
    return request<{ success: boolean; message: string; deletedTask: Task }>(`/tasks/${id}`, {
      method: 'DELETE',
    });
  },

  // Get dashboard statistics
  getStats: async (): Promise<DashboardStats> => {
    return request<DashboardStats>('/stats');
  },

  // Get distinct categories
  getCategories: async (): Promise<string[]> => {
    return request<string[]>('/categories');
  },
};
