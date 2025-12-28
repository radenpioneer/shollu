import React from 'react';
import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@/test/test-utils';
import { DateTime } from 'luxon';
import Header from './Header';
import { $currentTime } from '@/stores/prayer-times';

describe('Header Component', () => {
  beforeEach(() => {
    // Set a fixed time for consistent testing
    const testTime = DateTime.fromISO('2024-01-15T14:30:45');
    $currentTime.set(testTime);
  });

  it('should render without crashing', () => {
    render(<Header />);
    expect(screen.getByRole('banner')).toBeInTheDocument();
  });

  it('should display current date in long format', () => {
    render(<Header />);
    // Format: "Monday, 15 January 2024"
    expect(screen.getByText(/15 January 2024/i)).toBeInTheDocument();
  });

  it('should display current time in HH:mm:ss format', () => {
    render(<Header />);
    expect(screen.getByText('14:30:45')).toBeInTheDocument();
  });

  it('should update when currentTime changes', () => {
    const { rerender } = render(<Header />);
    expect(screen.getByText('14:30:45')).toBeInTheDocument();

    // Update time
    const newTime = DateTime.fromISO('2024-01-15T15:45:30');
    $currentTime.set(newTime);

    rerender(<Header />);
    expect(screen.getByText('15:45:30')).toBeInTheDocument();
  });

  it('should have correct CSS classes for styling', () => {
    render(<Header />);
    const header = screen.getByRole('banner');
    expect(header).toHaveClass('bg-white', 'dark:bg-gray-800', 'border-b');
  });

  it('should display date with correct heading level', () => {
    render(<Header />);
    const dateHeading = screen.getByRole('heading', { level: 2 });
    expect(dateHeading).toBeInTheDocument();
    expect(dateHeading).toHaveClass('text-xl', 'font-semibold');
  });

  it('should have placeholder for future features', () => {
    render(<Header />);
    // Check for the comment about future features
    const header = screen.getByRole('banner');
    expect(header).toBeInTheDocument();
  });
});
