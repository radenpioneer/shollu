import React from 'react';
import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@/test/test-utils';
import userEvent from '@testing-library/user-event';
import Sidebar from './Sidebar';
import { $currentView } from '@/stores/ui';

describe('Sidebar Component', () => {
  beforeEach(() => {
    // Reset to main view
    $currentView.set('main');
  });

  it('should render without crashing', () => {
    render(<Sidebar />);
    expect(screen.getByRole('complementary')).toBeInTheDocument();
  });

  it('should display application title', () => {
    render(<Sidebar />);
    expect(screen.getByText('Shollu')).toBeInTheDocument();
  });

  it('should display application subtitle', () => {
    render(<Sidebar />);
    expect(screen.getByText('Prayer Reminder')).toBeInTheDocument();
  });

  it('should render all navigation menu items', () => {
    render(<Sidebar />);

    expect(screen.getByText('Prayer Times')).toBeInTheDocument();
    expect(screen.getByText('Schedule')).toBeInTheDocument();
    expect(screen.getByText('Tasks')).toBeInTheDocument();
    expect(screen.getByText('Date Converter')).toBeInTheDocument();
    expect(screen.getByText('Settings')).toBeInTheDocument();
    expect(screen.getByText('About')).toBeInTheDocument();
  });

  it('should render all menu items as buttons', () => {
    render(<Sidebar />);

    const buttons = screen.getAllByRole('button');
    expect(buttons).toHaveLength(6);
  });

  it('should highlight active menu item (main)', () => {
    $currentView.set('main');
    render(<Sidebar />);

    const mainButton = screen.getByText('Prayer Times').closest('button');
    expect(mainButton).toHaveClass('bg-primary-50', 'text-primary-700');
  });

  it('should highlight active menu item (settings)', () => {
    $currentView.set('settings');
    render(<Sidebar />);

    const settingsButton = screen.getByText('Settings').closest('button');
    expect(settingsButton).toHaveClass('bg-primary-50', 'text-primary-700');
  });

  it('should navigate to schedule view when clicked', async () => {
    const user = userEvent.setup();
    render(<Sidebar />);

    const scheduleButton = screen.getByText('Schedule');
    await user.click(scheduleButton);

    expect($currentView.get()).toBe('schedule');
  });

  it('should navigate to tasks view when clicked', async () => {
    const user = userEvent.setup();
    render(<Sidebar />);

    const tasksButton = screen.getByText('Tasks');
    await user.click(tasksButton);

    expect($currentView.get()).toBe('tasks');
  });

  it('should navigate to settings view when clicked', async () => {
    const user = userEvent.setup();
    render(<Sidebar />);

    const settingsButton = screen.getByText('Settings');
    await user.click(settingsButton);

    expect($currentView.get()).toBe('settings');
  });

  it('should navigate to converter view when clicked', async () => {
    const user = userEvent.setup();
    render(<Sidebar />);

    const converterButton = screen.getByText('Date Converter');
    await user.click(converterButton);

    expect($currentView.get()).toBe('converter');
  });

  it('should navigate to about view when clicked', async () => {
    const user = userEvent.setup();
    render(<Sidebar />);

    const aboutButton = screen.getByText('About');
    await user.click(aboutButton);

    expect($currentView.get()).toBe('about');
  });

  it('should update active state when view changes', () => {
    const { rerender } = render(<Sidebar />);

    // Initially main is active
    let mainButton = screen.getByText('Prayer Times').closest('button');
    expect(mainButton).toHaveClass('bg-primary-50');

    // Change to settings
    $currentView.set('settings');
    rerender(<Sidebar />);

    mainButton = screen.getByText('Prayer Times').closest('button');
    const settingsButton = screen.getByText('Settings').closest('button');

    expect(mainButton).not.toHaveClass('bg-primary-50');
    expect(settingsButton).toHaveClass('bg-primary-50');
  });

  it('should have correct CSS classes for sidebar', () => {
    render(<Sidebar />);
    const sidebar = screen.getByRole('complementary');
    expect(sidebar).toHaveClass('w-64', 'bg-white', 'dark:bg-gray-800', 'border-r');
  });

  it('should render icons for each menu item', () => {
    render(<Sidebar />);

    // Each button should have an icon (svg element)
    const buttons = screen.getAllByRole('button');
    buttons.forEach((button) => {
      const svg = button.querySelector('svg');
      expect(svg).toBeInTheDocument();
    });
  });

  it('should have navigation element', () => {
    render(<Sidebar />);
    expect(screen.getByRole('navigation')).toBeInTheDocument();
  });
});
