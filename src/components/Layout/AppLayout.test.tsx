import React from 'react';
import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@/test/test-utils';
import AppLayout from './AppLayout';
import { $currentView } from '@/stores/ui';

describe('AppLayout Component', () => {
  beforeEach(() => {
    // Reset to main view
    $currentView.set('main');
  });

  it('should render without crashing', () => {
    render(<AppLayout />);
    expect(screen.getByRole('complementary')).toBeInTheDocument(); // Sidebar
    expect(screen.getByRole('banner')).toBeInTheDocument(); // Header
    expect(screen.getByRole('main')).toBeInTheDocument(); // Main content
  });

  it('should render Sidebar component', () => {
    render(<AppLayout />);
    expect(screen.getByText('Shollu')).toBeInTheDocument();
    expect(screen.getByText('Prayer Reminder')).toBeInTheDocument();
  });

  it('should render Header component', () => {
    render(<AppLayout />);
    expect(screen.getByRole('banner')).toBeInTheDocument();
  });

  it('should render MainPage by default', () => {
    $currentView.set('main');
    render(<AppLayout />);
    expect(screen.getAllByText('Prayer Times').length).toBeGreaterThan(0);
    expect(screen.getByText(/Prayer times will be displayed here/i)).toBeInTheDocument();
  });

  it('should render ScheduleView when view is schedule', () => {
    $currentView.set('schedule');
    render(<AppLayout />);
    expect(screen.getByText('Prayer Schedule')).toBeInTheDocument();
    expect(screen.getByText(/Schedule for yesterday, today, and tomorrow/i)).toBeInTheDocument();
  });

  it('should render TaskList when view is tasks', () => {
    $currentView.set('tasks');
    render(<AppLayout />);
    expect(screen.getByText('Scheduled Tasks')).toBeInTheDocument();
    expect(screen.getByText(/Your scheduled tasks will be displayed here/i)).toBeInTheDocument();
  });

  it('should render SettingsPanel when view is settings', () => {
    $currentView.set('settings');
    render(<AppLayout />);
    expect(screen.getAllByText('Settings').length).toBeGreaterThan(0);
    expect(screen.getByText(/Application settings will be displayed here/i)).toBeInTheDocument();
  });

  it('should render DateConverter when view is converter', () => {
    $currentView.set('converter');
    render(<AppLayout />);
    expect(screen.getAllByText('Date Converter').length).toBeGreaterThan(0);
    expect(screen.getByText(/Hijri ↔ Gregorian date converter/i)).toBeInTheDocument();
  });

  it('should render AboutDialog when view is about', () => {
    $currentView.set('about');
    render(<AppLayout />);
    expect(screen.getByText('About Shollu')).toBeInTheDocument();
    expect(screen.getByText('Shollu v4.0.0')).toBeInTheDocument();
  });

  it('should switch views correctly', () => {
    const { rerender } = render(<AppLayout />);

    // Start with main
    expect(screen.getByText(/Prayer times will be displayed here/i)).toBeInTheDocument();

    // Switch to settings
    $currentView.set('settings');
    rerender(<AppLayout />);
    expect(screen.getByText(/Application settings will be displayed here/i)).toBeInTheDocument();
    expect(screen.queryByText(/Prayer times will be displayed here/i)).not.toBeInTheDocument();

    // Switch to about
    $currentView.set('about');
    rerender(<AppLayout />);
    expect(screen.getByText('Shollu v4.0.0')).toBeInTheDocument();
    expect(
      screen.queryByText(/Application settings will be displayed here/i)
    ).not.toBeInTheDocument();
  });

  it('should have correct layout structure', () => {
    render(<AppLayout />);

    const container = screen.getByRole('complementary').parentElement;
    expect(container).toHaveClass('flex', 'h-screen', 'bg-gray-50', 'dark:bg-gray-900');
  });

  it('should have main content area with correct classes', () => {
    render(<AppLayout />);
    const main = screen.getByRole('main');
    expect(main).toHaveClass('flex-1', 'overflow-y-auto', 'p-6');
  });

  it('should render only one view at a time', () => {
    $currentView.set('main');
    render(<AppLayout />);

    // Should have main view
    expect(screen.getByText(/Prayer times will be displayed here/i)).toBeInTheDocument();

    // Should not have other views
    expect(screen.queryByText(/Schedule for yesterday/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Your scheduled tasks/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Application settings/i)).not.toBeInTheDocument();
  });

  it('should maintain sidebar and header across view changes', () => {
    const { rerender } = render(<AppLayout />);

    // Check sidebar and header are present
    expect(screen.getByText('Shollu')).toBeInTheDocument();
    expect(screen.getByRole('banner')).toBeInTheDocument();

    // Change view
    $currentView.set('settings');
    rerender(<AppLayout />);

    // Sidebar and header should still be present
    expect(screen.getByText('Shollu')).toBeInTheDocument();
    expect(screen.getByRole('banner')).toBeInTheDocument();
  });
});
