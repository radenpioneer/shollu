import { describe, it, expect, beforeEach } from 'vitest';
import { $currentView, $sidebarOpen, navigateTo, toggleSidebar, type View } from './ui';

describe('UI Store', () => {
  beforeEach(() => {
    // Reset stores to initial state
    $currentView.set('main');
    $sidebarOpen.set(true);
  });

  describe('$currentView store', () => {
    it('should have initial value of "main"', () => {
      expect($currentView.get()).toBe('main');
    });

    it('should update when set is called', () => {
      $currentView.set('settings');
      expect($currentView.get()).toBe('settings');
    });

    it('should accept all valid view types', () => {
      const views: View[] = ['main', 'schedule', 'tasks', 'settings', 'converter', 'about'];

      views.forEach((view) => {
        $currentView.set(view);
        expect($currentView.get()).toBe(view);
      });
    });
  });

  describe('$sidebarOpen store', () => {
    it('should have initial value of true', () => {
      expect($sidebarOpen.get()).toBe(true);
    });

    it('should update when set is called', () => {
      $sidebarOpen.set(false);
      expect($sidebarOpen.get()).toBe(false);
    });
  });

  describe('navigateTo action', () => {
    it('should update currentView to the specified view', () => {
      navigateTo('settings');
      expect($currentView.get()).toBe('settings');
    });

    it('should navigate to all valid views', () => {
      const views: View[] = ['main', 'schedule', 'tasks', 'settings', 'converter', 'about'];

      views.forEach((view) => {
        navigateTo(view);
        expect($currentView.get()).toBe(view);
      });
    });

    it('should overwrite previous navigation', () => {
      navigateTo('schedule');
      expect($currentView.get()).toBe('schedule');

      navigateTo('tasks');
      expect($currentView.get()).toBe('tasks');
    });
  });

  describe('toggleSidebar action', () => {
    it('should toggle sidebar from true to false', () => {
      $sidebarOpen.set(true);
      toggleSidebar();
      expect($sidebarOpen.get()).toBe(false);
    });

    it('should toggle sidebar from false to true', () => {
      $sidebarOpen.set(false);
      toggleSidebar();
      expect($sidebarOpen.get()).toBe(true);
    });

    it('should toggle multiple times correctly', () => {
      $sidebarOpen.set(true);

      toggleSidebar();
      expect($sidebarOpen.get()).toBe(false);

      toggleSidebar();
      expect($sidebarOpen.get()).toBe(true);

      toggleSidebar();
      expect($sidebarOpen.get()).toBe(false);
    });
  });
});
