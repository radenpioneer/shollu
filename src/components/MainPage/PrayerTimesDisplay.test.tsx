import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@/test/test-utils';
import PrayerTimesDisplay from './PrayerTimesDisplay';

describe('PrayerTimesDisplay Component', () => {
  it('should render without crashing', () => {
    render(<PrayerTimesDisplay />);
    expect(screen.getByText('Prayer Times')).toBeInTheDocument();
  });

  it('should display heading', () => {
    render(<PrayerTimesDisplay />);
    const heading = screen.getByRole('heading', { name: /prayer times/i });
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveClass('text-2xl', 'font-bold');
  });

  it('should display placeholder message', () => {
    render(<PrayerTimesDisplay />);
    expect(screen.getByText(/Prayer times will be displayed here/i)).toBeInTheDocument();
  });

  it('should have correct container structure', () => {
    render(<PrayerTimesDisplay />);
    const container = screen.getByText('Prayer Times').parentElement;
    expect(container).toHaveClass('space-y-6');
  });

  it('should have styled content card', () => {
    render(<PrayerTimesDisplay />);
    const card = screen.getByText(/Prayer times will be displayed here/i).closest('div');
    expect(card).toHaveClass('bg-white', 'dark:bg-gray-800', 'rounded-lg', 'p-6', 'shadow-sm');
  });

  it('should be accessible', () => {
    render(<PrayerTimesDisplay />);
    expect(screen.getByRole('heading')).toBeInTheDocument();
  });
});
