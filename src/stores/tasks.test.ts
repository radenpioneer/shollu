import { describe, it, expect, beforeEach, vi } from 'vitest';
import { $tasks, addTask, updateTask, deleteTask } from './tasks';
import type { Task } from '@/types/task';

describe('Tasks Store', () => {
  beforeEach(() => {
    // Reset tasks to empty array
    $tasks.set([]);
    // Reset Date.now mock
    vi.restoreAllMocks();
  });

  describe('$tasks store', () => {
    it('should have empty array initially', () => {
      expect($tasks.get()).toEqual([]);
    });

    it('should update when set is called', () => {
      const mockTasks: Task[] = [
        {
          id: 1,
          name: 'Test Task',
          type: 'info',
          frequency: 'daily',
          time: '06:00:00',
          enabled: true,
          createdAt: '2024-01-01T00:00:00.000Z',
        },
      ];

      $tasks.set(mockTasks);
      expect($tasks.get()).toEqual(mockTasks);
    });
  });

  describe('addTask action', () => {
    it('should add a new task with generated id and createdAt', () => {
      const mockDate = new Date('2024-01-01T12:00:00.000Z');
      vi.setSystemTime(mockDate);

      addTask({
        name: 'Morning Reminder',
        type: 'info',
        frequency: 'daily',
        time: '06:00:00',
        message: 'Good morning!',
        enabled: true,
      });

      const tasks = $tasks.get();
      expect(tasks).toHaveLength(1);
      expect(tasks[0]?.name).toBe('Morning Reminder');
      expect(tasks[0]?.type).toBe('info');
      expect(tasks[0]?.frequency).toBe('daily');
      expect(tasks[0]?.time).toBe('06:00:00');
      expect(tasks[0]?.message).toBe('Good morning!');
      expect(tasks[0]?.enabled).toBe(true);
      expect(tasks[0]?.id).toBeDefined();
      expect(tasks[0]?.createdAt).toBe('2024-01-01T12:00:00.000Z');
    });

    it('should add multiple tasks', () => {
      addTask({
        name: 'Task 1',
        type: 'info',
        frequency: 'daily',
        time: '06:00:00',
        enabled: true,
      });

      addTask({
        name: 'Task 2',
        type: 'warning',
        frequency: 'weekly',
        time: '12:00:00',
        dayOfWeek: 1,
        enabled: true,
      });

      const tasks = $tasks.get();
      expect(tasks).toHaveLength(2);
      expect(tasks[0]?.name).toBe('Task 1');
      expect(tasks[1]?.name).toBe('Task 2');
    });

    it('should generate unique ids for each task', () => {
      const mockDate1 = new Date('2024-01-01T12:00:00.000Z');
      vi.setSystemTime(mockDate1);

      addTask({
        name: 'Task 1',
        type: 'info',
        frequency: 'daily',
        time: '06:00:00',
        enabled: true,
      });

      // Advance time to ensure different timestamp
      const mockDate2 = new Date('2024-01-01T12:00:01.000Z');
      vi.setSystemTime(mockDate2);

      addTask({
        name: 'Task 2',
        type: 'info',
        frequency: 'daily',
        time: '07:00:00',
        enabled: true,
      });

      const tasks = $tasks.get();
      expect(tasks[0]?.id).not.toBe(tasks[1]?.id);
    });

    it('should handle all task types', () => {
      const taskTypes: Array<Task['type']> = [
        'info',
        'warning',
        'error',
        'command',
        'shutdown',
        'hibernate',
        'multimedia',
      ];

      taskTypes.forEach((type) => {
        addTask({
          name: `${type} task`,
          type,
          frequency: 'daily',
          time: '06:00:00',
          enabled: true,
        });
      });

      const tasks = $tasks.get();
      expect(tasks).toHaveLength(taskTypes.length);
      taskTypes.forEach((type, index) => {
        expect(tasks[index]?.type).toBe(type);
      });
    });

    it('should handle all frequency types', () => {
      const frequencies: Array<Task['frequency']> = [
        'once',
        'daily',
        'weekly',
        'monthly',
        'startup',
      ];

      frequencies.forEach((frequency) => {
        addTask({
          name: `${frequency} task`,
          type: 'info',
          frequency,
          time: '06:00:00',
          enabled: true,
        });
      });

      const tasks = $tasks.get();
      expect(tasks).toHaveLength(frequencies.length);
      frequencies.forEach((frequency, index) => {
        expect(tasks[index]?.frequency).toBe(frequency);
      });
    });

    it('should handle optional fields', () => {
      addTask({
        name: 'Weekly Task',
        type: 'info',
        frequency: 'weekly',
        time: '06:00:00',
        dayOfWeek: 1,
        message: 'Monday reminder',
        enabled: true,
      });

      const tasks = $tasks.get();
      expect(tasks[0]?.dayOfWeek).toBe(1);
      expect(tasks[0]?.message).toBe('Monday reminder');
    });
  });

  describe('updateTask action', () => {
    it('should update existing task', () => {
      addTask({
        name: 'Original Name',
        type: 'info',
        frequency: 'daily',
        time: '06:00:00',
        enabled: true,
      });

      const tasks = $tasks.get();
      const taskId = tasks[0]?.id;

      if (taskId) {
        updateTask(taskId, { name: 'Updated Name' });

        const updatedTasks = $tasks.get();
        expect(updatedTasks[0]?.name).toBe('Updated Name');
      }
    });

    it('should update multiple fields', () => {
      addTask({
        name: 'Task',
        type: 'info',
        frequency: 'daily',
        time: '06:00:00',
        enabled: true,
      });

      const tasks = $tasks.get();
      const taskId = tasks[0]?.id;

      if (taskId) {
        updateTask(taskId, {
          name: 'Updated Task',
          time: '07:00:00',
          enabled: false,
        });

        const updatedTasks = $tasks.get();
        expect(updatedTasks[0]?.name).toBe('Updated Task');
        expect(updatedTasks[0]?.time).toBe('07:00:00');
        expect(updatedTasks[0]?.enabled).toBe(false);
      }
    });

    it('should not affect other tasks', () => {
      const mockDate1 = new Date('2024-01-01T12:00:00.000Z');
      vi.setSystemTime(mockDate1);

      addTask({
        name: 'Task 1',
        type: 'info',
        frequency: 'daily',
        time: '06:00:00',
        enabled: true,
      });

      const mockDate2 = new Date('2024-01-01T12:00:01.000Z');
      vi.setSystemTime(mockDate2);

      addTask({
        name: 'Task 2',
        type: 'info',
        frequency: 'daily',
        time: '07:00:00',
        enabled: true,
      });

      const tasks = $tasks.get();
      const task1Id = tasks[0]?.id;

      if (task1Id) {
        updateTask(task1Id, { name: 'Updated Task 1' });

        const updatedTasks = $tasks.get();
        expect(updatedTasks[0]?.name).toBe('Updated Task 1');
        expect(updatedTasks[1]?.name).toBe('Task 2'); // Should remain unchanged
      }
    });

    it('should preserve other fields when updating', () => {
      addTask({
        name: 'Task',
        type: 'info',
        frequency: 'daily',
        time: '06:00:00',
        message: 'Original message',
        enabled: true,
      });

      const tasks = $tasks.get();
      const taskId = tasks[0]?.id;

      if (taskId) {
        updateTask(taskId, { name: 'Updated Name' });

        const updatedTasks = $tasks.get();
        expect(updatedTasks[0]?.name).toBe('Updated Name');
        expect(updatedTasks[0]?.message).toBe('Original message'); // Should remain unchanged
        expect(updatedTasks[0]?.type).toBe('info'); // Should remain unchanged
      }
    });

    it('should do nothing if task id does not exist', () => {
      addTask({
        name: 'Task',
        type: 'info',
        frequency: 'daily',
        time: '06:00:00',
        enabled: true,
      });

      const tasksBefore = $tasks.get();
      updateTask(99999, { name: 'Updated' });
      const tasksAfter = $tasks.get();

      expect(tasksAfter).toEqual(tasksBefore);
    });
  });

  describe('deleteTask action', () => {
    it('should delete existing task', () => {
      addTask({
        name: 'Task to Delete',
        type: 'info',
        frequency: 'daily',
        time: '06:00:00',
        enabled: true,
      });

      const tasks = $tasks.get();
      const taskId = tasks[0]?.id;

      if (taskId) {
        deleteTask(taskId);

        const updatedTasks = $tasks.get();
        expect(updatedTasks).toHaveLength(0);
      }
    });

    it('should delete correct task from multiple tasks', () => {
      const mockDate1 = new Date('2024-01-01T12:00:00.000Z');
      vi.setSystemTime(mockDate1);

      addTask({
        name: 'Task 1',
        type: 'info',
        frequency: 'daily',
        time: '06:00:00',
        enabled: true,
      });

      const mockDate2 = new Date('2024-01-01T12:00:01.000Z');
      vi.setSystemTime(mockDate2);

      addTask({
        name: 'Task 2',
        type: 'info',
        frequency: 'daily',
        time: '07:00:00',
        enabled: true,
      });

      const mockDate3 = new Date('2024-01-01T12:00:02.000Z');
      vi.setSystemTime(mockDate3);

      addTask({
        name: 'Task 3',
        type: 'info',
        frequency: 'daily',
        time: '08:00:00',
        enabled: true,
      });

      const tasks = $tasks.get();
      const task2Id = tasks[1]?.id;

      if (task2Id) {
        deleteTask(task2Id);

        const updatedTasks = $tasks.get();
        expect(updatedTasks).toHaveLength(2);
        expect(updatedTasks[0]?.name).toBe('Task 1');
        expect(updatedTasks[1]?.name).toBe('Task 3');
      }
    });

    it('should do nothing if task id does not exist', () => {
      addTask({
        name: 'Task',
        type: 'info',
        frequency: 'daily',
        time: '06:00:00',
        enabled: true,
      });

      const tasksBefore = $tasks.get();
      deleteTask(99999);
      const tasksAfter = $tasks.get();

      expect(tasksAfter).toEqual(tasksBefore);
    });

    it('should handle deleting from empty array', () => {
      deleteTask(1);
      expect($tasks.get()).toEqual([]);
    });
  });
});
