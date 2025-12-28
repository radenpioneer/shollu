import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@/test/test-utils';
import userEvent from '@testing-library/user-event';
import App from '@/App';
import { $currentView } from '@/stores/ui';

describe('Navigation Integration Tests', () => {
  beforeEach(() => {
    $currentView.set('main');
  });

  it('should navigate through all views using sidebar', async () => {
    const user = userEvent.setup();
    render(<App />);

    // Start at main view - check for prayer names
    expect(screen.getByText('Fajr')).toBeInTheDocument();

    // Navigate to Schedule
    await user.click(screen.getByText('Schedule'));
    expect(screen.getByText(/Schedule for yesterday, today, and tomorrow/i)).toBeInTheDocument();
    expect(screen.queryByText('Fajr')).not.toBeInTheDocument();

    // Navigate to Tasks
    await user.click(screen.getByText('Tasks'));
    expect(screen.getByText(/Your scheduled tasks will be displayed here/i)).toBeInTheDocument();
    expect(screen.queryByText(/Schedule for yesterday/i)).not.toBeInTheDocument();

    // Navigate to Date Converter
    await user.click(screen.getByText('Date Converter'));
    expect(screen.getByText(/Hijri ↔ Gregorian date converter/i)).toBeInTheDocument();
    expect(screen.queryByText(/Your scheduled tasks/i)).not.toBeInTheDocument();

    // Navigate to Settings
    await user.click(screen.getByText('Settings'));
    expect(screen.getByText(/Application settings will be displayed here/i)).toBeInTheDocument();
    expect(screen.queryByText(/Hijri ↔ Gregorian/i)).not.toBeInTheDocument();

    // Navigate to About
    await user.click(screen.getByText('About'));
    expect(screen.getByText('Shollu v4.0.0')).toBeInTheDocument();
    expect(screen.queryByText(/Application settings/i)).not.toBeInTheDocument();

    // Navigate back to Prayer Times
    await user.click(screen.getByText('Prayer Times'));
    expect(screen.getByText('Fajr')).toBeInTheDocument();
    expect(screen.queryByText('Shollu v4.0.0')).not.toBeInTheDocument();
  });

  it('should maintain sidebar and header across navigation', async () => {
    const user = userEvent.setup();
    render(<App />);

    // Check initial state
    expect(screen.getByText('Shollu')).toBeInTheDocument();
    expect(screen.getByText('Prayer Reminder')).toBeInTheDocument();
    expect(screen.getByRole('banner')).toBeInTheDocument();

    // Navigate to different views
    await user.click(screen.getByText('Settings'));
    expect(screen.getByText('Shollu')).toBeInTheDocument();
    expect(screen.getByRole('banner')).toBeInTheDocument();

    await user.click(screen.getByText('About'));
    expect(screen.getByText('Shollu')).toBeInTheDocument();
    expect(screen.getByRole('banner')).toBeInTheDocument();

    await user.click(screen.getByText('Schedule'));
    expect(screen.getByText('Shollu')).toBeInTheDocument();
    expect(screen.getByRole('banner')).toBeInTheDocument();
  });

  it('should highlight active menu item correctly', async () => {
    const user = userEvent.setup();
    render(<App />);

    // Check Prayer Times is active initially
    const allPrayerTimesElements = screen.getAllByText('Prayer Times');
    let prayerTimesButton = allPrayerTimesElements
      .find((el) => el.closest('button'))
      ?.closest('button');
    expect(prayerTimesButton).toHaveClass('bg-primary-50', 'text-primary-700');

    // Navigate to Settings
    const allSettingsElements = screen.getAllByText('Settings');
    const settingsNavButton = allSettingsElements.find((el) => el.closest('button'));
    if (settingsNavButton) {
      await user.click(settingsNavButton);
    }

    const prayerTimesElements2 = screen.getAllByText('Prayer Times');
    prayerTimesButton = prayerTimesElements2.find((el) => el.closest('button'))?.closest('button');
    const settingsButton = allSettingsElements
      .find((el) => el.closest('button'))
      ?.closest('button');

    expect(prayerTimesButton).not.toHaveClass('bg-primary-50');
    expect(settingsButton).toHaveClass('bg-primary-50', 'text-primary-700');

    // Navigate to Tasks
    await user.click(screen.getByText('Tasks'));

    const tasksButton = screen.getByText('Tasks').closest('button');

    expect(settingsButton).not.toHaveClass('bg-primary-50');
    expect(tasksButton).toHaveClass('bg-primary-50', 'text-primary-700');
  });

  it('should sync store state with UI', async () => {
    const user = userEvent.setup();
    render(<App />);

    // Initial state
    expect($currentView.get()).toBe('main');

    // Navigate via UI
    await user.click(screen.getByText('Schedule'));
    expect($currentView.get()).toBe('schedule');

    await user.click(screen.getByText('Tasks'));
    expect($currentView.get()).toBe('tasks');

    await user.click(screen.getByText('Settings'));
    expect($currentView.get()).toBe('settings');

    await user.click(screen.getByText('Date Converter'));
    expect($currentView.get()).toBe('converter');

    await user.click(screen.getByText('About'));
    expect($currentView.get()).toBe('about');
  });

  it('should handle rapid navigation clicks', async () => {
    const user = userEvent.setup();
    render(<App />);

    // Rapidly click through views
    await user.click(screen.getByText('Schedule'));
    await user.click(screen.getByText('Tasks'));
    await user.click(screen.getByText('Settings'));
    await user.click(screen.getByText('About'));
    await user.click(screen.getByText('Prayer Times'));

    // Should end up at Prayer Times - check for prayer names
    expect(screen.getByText('Fajr')).toBeInTheDocument();
    expect($currentView.get()).toBe('main');
  });

  it('should render correct view when store is updated programmatically', () => {
    const { rerender } = render(<App />);

    // Update store directly
    $currentView.set('settings');
    rerender(<App />);
    expect(screen.getByText(/Application settings will be displayed here/i)).toBeInTheDocument();

    $currentView.set('about');
    rerender(<App />);
    expect(screen.getByText('Shollu v4.0.0')).toBeInTheDocument();

    $currentView.set('main');
    rerender(<App />);
    expect(screen.getByText('Fajr')).toBeInTheDocument();
  });
});
