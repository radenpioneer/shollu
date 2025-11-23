export type TaskType =
  | 'info'
  | 'warning'
  | 'error'
  | 'command'
  | 'shutdown'
  | 'hibernate'
  | 'multimedia';

export type TaskFrequency = 'once' | 'daily' | 'weekly' | 'monthly' | 'startup';

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

export interface TaskExecution {
  taskId: number;
  executedAt: string;
  success: boolean;
  error?: string;
}
