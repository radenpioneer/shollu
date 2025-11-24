import { describe, it, expect, beforeEach } from 'vitest';
import { $currentView, navigateTo } from '@/stores/ui';
import { $settings, updateSettings } from '@/stores/settings';
import { $tasks, addTask } from '@/stores/tasks';
import { $prayerTimes } from '@/stores/prayer-times';
import { defaultSettings } from '@/types/settings';

describe('State Management Integration Tests', () => {
  beforeEach(() => {
    // Reset all stores
    $currentView.set('main');
    $settings.set(defaultSettings);
    $tasks.set([]);
    $prayerTimes.set({
      date: '',
      fajr: '',
      sunrise: '',
      dhuhr: '',
      asr: '',
      maghrib: '',
      isha: '',
    });
  });

  describe('Cross-store interactions', () => {
    it('should maintain independent state across stores', () => {
      // Update multiple stores
      navigateTo('settings');
      updateSettings({ theme: 'dark' });
      addTask({
        name: 'Test Task',
        type: 'info',
        frequency: 'daily',
        time: '06:00:00',
        enabled: true,
      });

      // Verify each store maintains its state
      expect($currentView.get()).toBe('settings');
      expect($settings.get().theme).toBe('dark');
      expect($tasks.get()).toHaveLength(1);
    });

    it('should handle concurrent updates to different stores', () => {
      // Simulate concurrent updates
      navigateTo('schedule');
      updateSettings({ language: 'id' });
      addTask({
        name: 'Task 1',
        type: 'info',
        frequency: 'daily',
        time: '06:00:00',
        enabled: true,
      });
      updateSettings({ calculationMethod: 'ISNA' });
      navigateTo('tasks');

      // Verify all updates were applied
      expect($currentView.get()).toBe('tasks');
      expect($settings.get().language).toBe('id');
      expect($settings.get().calculationMethod).toBe('ISNA');
      expect($tasks.get()).toHaveLength(1);
    });
  });

  describe('Settings and Prayer Times interaction', () => {
    it('should update settings without affecting prayer times', () => {
      // Set prayer times
      $prayerTimes.set({
        date: '2024-01-15',
        fajr: '05:30:00',
        sunrise: '06:45:00',
        dhuhr: '12:15:00',
        asr: '15:30:00',
        maghrib: '18:00:00',
        isha: '19:15:00',
      });

      // Update settings
      updateSettings({ calculationMethod: 'ISNA' });

      // Prayer times should remain unchanged
      const times = $prayerTimes.get();
      expect(times.fajr).toBe('05:30:00');
      expect(times.dhuhr).toBe('12:15:00');
    });

    it('should update location settings independently', () => {
      updateSettings({
        location: {
          name: 'Mecca',
          latitude: 21.4225,
          longitude: 39.8262,
          timezone: 'Asia/Riyadh',
          country: 'Saudi Arabia',
        },
      });

      const settings = $settings.get();
      expect(settings.location.name).toBe('Mecca');
      expect(settings.calculationMethod).toBe('MWL'); // Should remain default
    });
  });

  describe('Tasks and Navigation interaction', () => {
    it('should maintain tasks when navigating between views', () => {
      // Add tasks
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

      // Navigate through views
      navigateTo('schedule');
      navigateTo('settings');
      navigateTo('tasks');

      // Tasks should still be there
      expect($tasks.get()).toHaveLength(2);
      expect($tasks.get()[0]?.name).toBe('Task 1');
      expect($tasks.get()[1]?.name).toBe('Task 2');
    });

    it('should allow task operations while on different views', () => {
      // Add task while on main view
      navigateTo('main');
      addTask({
        name: 'Task 1',
        type: 'info',
        frequency: 'daily',
        time: '06:00:00',
        enabled: true,
      });

      // Navigate to settings and add another task
      navigateTo('settings');
      addTask({
        name: 'Task 2',
        type: 'info',
        frequency: 'daily',
        time: '07:00:00',
        enabled: true,
      });

      // Both tasks should exist
      expect($tasks.get()).toHaveLength(2);
    });
  });

  describe('Complex state scenarios', () => {
    it('should handle full application state update', () => {
      // Update all stores
      navigateTo('settings');

      updateSettings({
        theme: 'dark',
        language: 'id',
        calculationMethod: 'ISNA',
        location: {
          name: 'Bandung',
          latitude: -6.9175,
          longitude: 107.6191,
          timezone: 'Asia/Jakarta',
          country: 'Indonesia',
        },
      });

      addTask({
        name: 'Morning Prayer',
        type: 'info',
        frequency: 'daily',
        time: '05:00:00',
        message: 'Time for Fajr',
        enabled: true,
      });

      $prayerTimes.set({
        date: '2024-01-15',
        fajr: '04:45:00',
        sunrise: '06:00:00',
        dhuhr: '12:10:00',
        asr: '15:25:00',
        maghrib: '18:15:00',
        isha: '19:30:00',
      });

      // Verify all states
      expect($currentView.get()).toBe('settings');
      expect($settings.get().theme).toBe('dark');
      expect($settings.get().language).toBe('id');
      expect($settings.get().location.name).toBe('Bandung');
      expect($tasks.get()).toHaveLength(1);
      expect($prayerTimes.get().fajr).toBe('04:45:00');
    });

    it('should handle state reset scenario', () => {
      // Set up complex state
      navigateTo('tasks');
      updateSettings({ theme: 'dark' });
      addTask({
        name: 'Task 1',
        type: 'info',
        frequency: 'daily',
        time: '06:00:00',
        enabled: true,
      });

      // Reset to defaults
      $currentView.set('main');
      $settings.set(defaultSettings);
      $tasks.set([]);

      // Verify reset
      expect($currentView.get()).toBe('main');
      expect($settings.get().theme).toBe('system');
      expect($tasks.get()).toHaveLength(0);
    });

    it('should handle multiple rapid state changes', () => {
      // Rapid updates
      for (let i = 0; i < 10; i++) {
        navigateTo(i % 2 === 0 ? 'main' : 'settings');
        updateSettings({ adzanVolume: 50 + i });
        addTask({
          name: `Task ${i}`,
          type: 'info',
          frequency: 'daily',
          time: '06:00:00',
          enabled: true,
        });
      }

      // Verify final state
      expect($currentView.get()).toBe('settings');
      expect($settings.get().adzanVolume).toBe(59);
      expect($tasks.get()).toHaveLength(10);
    });
  });

  describe('Store persistence simulation', () => {
    it('should maintain state across simulated page reloads', () => {
      // Set up state
      updateSettings({ theme: 'dark', language: 'id' });
      addTask({
        name: 'Persistent Task',
        type: 'info',
        frequency: 'daily',
        time: '06:00:00',
        enabled: true,
      });

      // Capture state
      const savedSettings = $settings.get();
      const savedTasks = $tasks.get();

      // Simulate reload by resetting
      $settings.set(defaultSettings);
      $tasks.set([]);

      // Restore state
      $settings.set(savedSettings);
      $tasks.set(savedTasks);

      // Verify restoration
      expect($settings.get().theme).toBe('dark');
      expect($settings.get().language).toBe('id');
      expect($tasks.get()).toHaveLength(1);
      expect($tasks.get()[0]?.name).toBe('Persistent Task');
    });
  });
});
