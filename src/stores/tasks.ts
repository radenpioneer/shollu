import { atom } from 'nanostores';
import { Task } from '@/types/task';

export const $tasks = atom<Task[]>([]);

export function addTask(task: Omit<Task, 'id' | 'createdAt'>) {
  // Will implement with DB later
  const tasks = $tasks.get();
  const newTask: Task = {
    ...task,
    id: Date.now(),
    createdAt: new Date().toISOString(),
  };
  $tasks.set([...tasks, newTask]);
}

export function updateTask(id: number, updates: Partial<Task>) {
  // Will implement with DB later
  const tasks = $tasks.get();
  $tasks.set(tasks.map((task) => (task.id === id ? { ...task, ...updates } : task)));
}

export function deleteTask(id: number) {
  // Will implement with DB later
  const tasks = $tasks.get();
  $tasks.set(tasks.filter((task) => task.id !== id));
}
