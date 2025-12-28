import React from 'react';
import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@/test/test-utils';
import { DateTime } from 'luxon';
import PrayerTimesDisplay from './PrayerTimesDisplay';
import { $prayerTimes, $currentTime } from '@/stores/prayer-times';

describe('PrayerTimesDisplay Component', () => {
  beforeEach(() => {
    // Set up test prayer times
    $prayerTimes.set({
      date: '2024-01-15',
      fajr: '05:30:00',
      sunrise: '06:45:00',
      dhuhr: '12:15:00',
      asr: '15:30:00',
      maghrib: '18:00:00',
      isha: '19:15:00',
    });
    $currentTime.set(DateTime.fromISO('2024-01-15T10:00:00'));
  });

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

  it('should display all 6 prayer times', () => {
    render(<PrayerTimesDisplay />);
    expect(screen.getByText('Fajr')).toBeInTheDocument();
    expect(screen.getByText('Sunrise')).toBeInTheDocument();
    expect(screen.getByText('Dhuhr')).toBeInTheDocument();
    expect(screen.getByText('Asr')).toBeInTheDocument();
    expect(screen.getByText('Maghrib')).toBeInTheDocument();
    expect(screen.getByText('Isha')).toBeInTheDocument();
  });

  it('should display formatted prayer times (HH:mm)', () => {
    render(<PrayerTimesDisplay />);
    expect(screen.getByText('05:30')).toBeInTheDocument(); // Fajr
    expect(screen.getAllByText('12:15').length).toBeGreaterThan(0); // Dhuhr (appears in card and next prayer)
    expect(screen.getByText('19:15')).toBeInTheDocument(); // Isha
  });

  it('should display next prayer card', () => {
    render(<PrayerTimesDisplay />);
    expect(screen.getByText('Next Prayer')).toBeInTheDocument();
    // At 10:00, next prayer should be Dhuhr at 12:15
    expect(screen.getByText('dhuhr')).toBeInTheDocument();
  });

  it('should display calculation method info', () => {
    render(<PrayerTimesDisplay />);
    expect(screen.getByText(/Calculation Method:/i)).toBeInTheDocument();
    expect(screen.getByText(/Asr:/i)).toBeInTheDocument();
  });

  it('should be accessible', () => {
    render(<PrayerTimesDisplay />);
    expect(screen.getByRole('heading')).toBeInTheDocument();
  });
});
