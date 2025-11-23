import { atom } from 'nanostores';
import { Task } from '@/types/task';

/**
 * Global store for scheduled tasks.
 * Contains all user-created tasks for notifications, commands, etc.
 */
export const $tasks = atom<Task[]>([]);

/**
 * Adds a new task to the task list.
 * Generates ID and timestamp automatically.
 * 
 * @param task - Task data without id and createdAt
 * 
 * @example
 * ```ts
 * addTask({
 *   name: 'Morning Reminder',
 *   type: 'info',
 *   frequency: 'daily',
 *   time: '06:00:00',
 *   message: 'Good morning!',
 *   enabled: true
 * });
 * ```
 */
export const addTask = (task: Omit<Task, 'id' | 'createdAt'>): void => {
  const tasks = $tasks.get();
  const newTask: Task = {
    ...task,
    id: Date.now(),
    createdAt: new Date().toISOString(),
  };
  $tasks.set([...tasks, newTask]);
};

/**
 * Updates an existing task with partial values.
 * 
 * @param id - Task ID to update
 * @param updates - Partial task object with fields to update
 * 
 * @example
 * ```ts
 * updateTask(123456, { enabled: false, time: '07:00:00' });
 * ```
 */
export const updateTask = (id: number, updates: Partial<Task>): void => {
  const tasks = $tasks.get();
  $tasks.set(tasks.map((task) => (task.id === id ? { ...task, ...updates } : task)));
};

/**
 * Deletes a task from the task list.
 * 
 * @param id - Task ID to delete
 * 
 * @example
 * ```ts
 * deleteTask(123456);
 * ```
 */
export const deleteTask = (id: number): void => {
  const tasks = $tasks.get();
  $tasks.set(tasks.filter((task) => task.id !== id));
};
