/**
 * Types of scheduled tasks.
 * Determines what action the task performs when triggered.
 */
export type TaskType =
  | 'info'
  | 'warning'
  | 'error'
  | 'command'
  | 'shutdown'
  | 'hibernate'
  | 'multimedia';

/**
 * Task execution frequency options.
 */
export type TaskFrequency = 'once' | 'daily' | 'weekly' | 'monthly' | 'startup';

/**
 * Scheduled task configuration.
 * Tasks can trigger notifications, commands, or system actions at specified times.
 */
export interface Task {
  id: number;
  name: string;
  type: TaskType;
  frequency: TaskFrequency;
  time: string; // HH:mm:ss
  dayOfWeek?: number; // 1-7 (Monday-Sunday)
  dayOfMonth?: number; // 1-31
  month?: number; // 1-12
  message?: string;
  command?: string;
  mediaFile?: string;
  enabled: boolean;
  createdAt: string;
  lastExecuted?: string;
}

/**
 * Record of a task execution.
 * Tracks when tasks were executed and whether they succeeded.
 */
export interface TaskExecution {
  taskId: number;
  executedAt: string;
  success: boolean;
  error?: string;
}
