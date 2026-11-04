import React, { useState } from 'react';
import {
  Plus,
  Calendar,
  AlertCircle,
  Pencil,
  Trash2,
  ArrowRight,
  ArrowLeft,
  Check,
  CheckCircle2
} from 'lucide-react';
import { useTasks } from '../../context/TaskContext';
import { Task, TaskStatus, Priority } from '../../types/task';

export const KanbanBoard: React.FC = () => {
  const { tasks, updateTaskStatus, openEditModal, openDeleteModal, openCreateModal } = useTasks();
  const [draggedTaskId, setDraggedTaskId] = useState<number | null>(null);
  const [dragOverColumn, setDragOverColumn] = useState<TaskStatus | null>(null);

  const todayStr = new Date().toISOString().split('T')[0];

  const columns: Array<{ status: TaskStatus; title: string; color: string; border: string; bg: string; dotColor: string }> = [
    {
      status: 'Pending',
      title: 'Pending',
      color: 'text-slate-700 dark:text-slate-300',
      border: 'border-slate-200 dark:border-slate-800',
      bg: 'bg-slate-50/50 dark:bg-slate-900/30',
      dotColor: 'bg-amber-400',
    },
    {
      status: 'In Progress',
      title: 'In Progress',
      color: 'text-indigo-700 dark:text-indigo-300',
      border: 'border-indigo-200 dark:border-indigo-900/50',
      bg: 'bg-indigo-50/30 dark:bg-indigo-950/20',
      dotColor: 'bg-indigo-500',
    },
    {
      status: 'Completed',
      title: 'Completed',
      color: 'text-emerald-700 dark:text-emerald-300',
      border: 'border-emerald-200 dark:border-emerald-900/50',
      bg: 'bg-emerald-50/30 dark:bg-emerald-950/20',
      dotColor: 'bg-emerald-500',
    },
  ];

  const getPriorityStyle = (priority: Priority) => {
    switch (priority) {
      case 'High':
        return 'text-rose-600 dark:text-rose-400 font-semibold';
      case 'Medium':
        return 'text-amber-600 dark:text-amber-400 font-medium';
      case 'Low':
        return 'text-blue-600 dark:text-blue-400';
    }
  };

  // Drag and drop handlers
  const handleDragStart = (e: React.DragEvent, id: number) => {
    setDraggedTaskId(id);
    e.dataTransfer.setData('text/plain', String(id));
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent, status: TaskStatus) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (dragOverColumn !== status) {
      setDragOverColumn(status);
    }
  };

  const handleDragLeave = () => {
    setDragOverColumn(null);
  };

  const handleDrop = async (e: React.DragEvent, targetStatus: TaskStatus) => {
    e.preventDefault();
    setDragOverColumn(null);
    const rawId = e.dataTransfer.getData('text/plain');
    const id = parseInt(rawId, 10);

    if (!isNaN(id)) {
      const task = tasks.find(t => t.id === id);
      if (task && task.status !== targetStatus) {
        await updateTaskStatus(id, targetStatus);
      }
    }
    setDraggedTaskId(null);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
      {columns.map((col) => {
        const columnTasks = tasks.filter((t) => t.status === col.status);
        const isDragOver = dragOverColumn === col.status;

        return (
          <div
            key={col.status}
            onDragOver={(e) => handleDragOver(e, col.status)}
            onDragLeave={handleDragLeave}
            onDrop={(e) => handleDrop(e, col.status)}
            className={`rounded-xl border ${col.border} ${col.bg} p-3.5 flex flex-col transition-all min-h-[500px] ${
              isDragOver ? 'ring-2 ring-blue-500/50 bg-blue-50/20 dark:bg-blue-950/20' : ''
            }`}
          >
            {/* Column Header */}
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-200/80 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <span className={`w-2.5 h-2.5 rounded-full ${col.dotColor}`} />
                <h3 className={`text-xs font-bold uppercase tracking-wider ${col.color}`}>
                  {col.title}
                </h3>
                <span className="text-xs font-mono font-semibold tabular-nums px-1.5 py-0.5 rounded-sm bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                  {columnTasks.length}
                </span>
              </div>

              <button
                onClick={() => openCreateModal(col.status)}
                className="p-1 text-slate-400 hover:text-slate-800 dark:hover:text-white rounded hover:bg-white/80 dark:hover:bg-slate-800 transition-colors"
                title={`Add task to ${col.title}`}
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            {/* Column Tasks */}
            <div className="space-y-3 flex-1">
              {columnTasks.length === 0 ? (
                <div className="h-32 flex flex-col items-center justify-center border border-dashed border-slate-200 dark:border-slate-800 rounded-lg text-slate-400 text-xs">
                  <span>No tasks in {col.title}</span>
                  <button
                    onClick={() => openCreateModal(col.status)}
                    className="mt-2 text-[11px] text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                  >
                    <Plus className="w-3 h-3" />
                    <span>Create one</span>
                  </button>
                </div>
              ) : (
                columnTasks.map((task) => {
                  const isOverdue = task.due_date && task.due_date < todayStr && task.status !== 'Completed';
                  const isDueToday = task.due_date === todayStr && task.status !== 'Completed';
                  const isDragging = draggedTaskId === task.id;

                  return (
                    <div
                      key={task.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, task.id)}
                      className={`p-3.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xs hover:shadow-sm transition-all cursor-grab active:cursor-grabbing ${
                        isDragging ? 'opacity-40 scale-[0.98]' : ''
                      }`}
                    >
                      {/* Card Header: Category & Priority */}
                      <div className="flex items-center justify-between gap-2 text-xs mb-2">
                        <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 truncate">
                          {task.category}
                        </span>
                        <span className={`text-[11px] ${getPriorityStyle(task.priority)}`}>
                          {task.priority}
                        </span>
                      </div>

                      {/* Card Title */}
                      <h4
                        onClick={() => openEditModal(task)}
                        className={`text-xs font-semibold hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer ${
                          task.status === 'Completed'
                            ? 'line-through text-slate-400 dark:text-slate-500'
                            : 'text-slate-900 dark:text-white'
                        }`}
                      >
                        {task.title}
                      </h4>

                      {/* Card Description */}
                      {task.description && (
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                          {task.description}
                        </p>
                      )}

                      {/* Due Date Indicator */}
                      {task.due_date && (
                        <div className="flex items-center gap-1.5 text-[11px] font-mono tabular-nums mt-3 pt-2 border-t border-slate-100 dark:border-slate-800/80">
                          {isOverdue ? (
                            <AlertCircle className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                          ) : (
                            <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          )}
                          <span
                            className={
                              isOverdue
                                ? 'text-rose-600 dark:text-rose-400 font-semibold'
                                : isDueToday
                                ? 'text-amber-600 dark:text-amber-400 font-semibold'
                                : 'text-slate-500 dark:text-slate-400'
                            }
                          >
                            {isOverdue ? `Overdue: ${task.due_date}` : isDueToday ? 'Due Today' : task.due_date}
                          </span>
                        </div>
                      )}

                      {/* Quick Move and Edit Controls */}
                      <div className="flex items-center justify-between gap-1 pt-2.5 mt-2 border-t border-slate-100 dark:border-slate-800/60">
                        {/* Quick status move shortcuts */}
                        <div className="flex items-center gap-1">
                          {col.status !== 'Pending' && (
                            <button
                              onClick={() => updateTaskStatus(task.id, 'Pending')}
                              className="px-1.5 py-1 text-[10px] text-slate-500 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded transition-colors"
                              title="Move to Pending"
                            >
                              <ArrowLeft className="w-3 h-3" />
                            </button>
                          )}

                          {col.status === 'Pending' && (
                            <button
                              onClick={() => updateTaskStatus(task.id, 'In Progress')}
                              className="flex items-center gap-1 px-2 py-0.5 text-[10px] font-medium text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 rounded transition-colors"
                              title="Start task"
                            >
                              <span>Start</span>
                              <ArrowRight className="w-2.5 h-2.5" />
                            </button>
                          )}

                          {col.status === 'In Progress' && (
                            <button
                              onClick={() => updateTaskStatus(task.id, 'Completed')}
                              className="flex items-center gap-1 px-2 py-0.5 text-[10px] font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 rounded transition-colors"
                              title="Mark as Completed"
                            >
                              <Check className="w-2.5 h-2.5" />
                              <span>Done</span>
                            </button>
                          )}

                          {col.status === 'Completed' && (
                            <button
                              onClick={() => updateTaskStatus(task.id, 'In Progress')}
                              className="flex items-center gap-1 px-2 py-0.5 text-[10px] text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded transition-colors"
                              title="Re-open into In Progress"
                            >
                              <ArrowLeft className="w-2.5 h-2.5" />
                              <span>Reopen</span>
                            </button>
                          )}
                        </div>

                        {/* Edit & Delete Action Buttons */}
                        <div className="flex items-center gap-0.5">
                          <button
                            onClick={() => openEditModal(task)}
                            className="p-1 text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 rounded transition-colors"
                            title="Edit task"
                          >
                            <Pencil className="w-3 h-3" />
                          </button>
                          <button
                            onClick={() => openDeleteModal(task)}
                            className="p-1 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 rounded transition-colors"
                            title="Delete task"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
