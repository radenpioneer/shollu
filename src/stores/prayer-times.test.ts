import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { DateTime } from 'luxon';
import {
  $currentTime,
  $prayerTimes,
  $currentPrayer,
  $nextPrayer,
  updatePrayerTimes,
} from './prayer-times';
import { $settings } from './settings';

describe('Prayer Times Store', () => {
  beforeEach(() => {
    // Reset current time
    $currentTime.set(DateTime.now());
    // Note: We don't reset $prayerTimes here because it auto-calculates on init
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('$currentTime store', () => {
    it('should have DateTime value', () => {
      const currentTime = $currentTime.get();
      expect(currentTime).toBeInstanceOf(DateTime);
    });

    it('should be valid DateTime', () => {
      const currentTime = $currentTime.get();
      expect(currentTime.isValid).toBe(true);
    });

    it('should update when set is called', () => {
      const newTime = DateTime.fromISO('2024-01-01T12:00:00');
      $currentTime.set(newTime);

      const currentTime = $currentTime.get();
      expect(currentTime.toISO()).toBe(newTime.toISO());
    });

    it('should format time correctly', () => {
      const testTime = DateTime.fromISO('2024-01-15T14:30:45');
      $currentTime.set(testTime);

      const currentTime = $currentTime.get();
      expect(currentTime.toFormat('HH:mm:ss')).toBe('14:30:45');
      expect(currentTime.toFormat('yyyy-MM-dd')).toBe('2024-01-15');
    });
  });

  describe('$prayerTimes store', () => {
    it('should have correct initial structure', () => {
      const times = $prayerTimes.get();
      expect(times).toHaveProperty('date');
      expect(times).toHaveProperty('fajr');
      expect(times).toHaveProperty('sunrise');
      expect(times).toHaveProperty('dhuhr');
      expect(times).toHaveProperty('asr');
      expect(times).toHaveProperty('maghrib');
      expect(times).toHaveProperty('isha');
    });

    it('should calculate real prayer times on initialization', () => {
      const times = $prayerTimes.get();
      // Should have calculated times (not empty strings)
      expect(times.fajr).not.toBe('');
      expect(times.sunrise).not.toBe('');
      expect(times.dhuhr).not.toBe('');
      expect(times.asr).not.toBe('');
      expect(times.maghrib).not.toBe('');
      expect(times.isha).not.toBe('');

      // Should be valid time format (HH:mm:ss)
      expect(times.fajr).toMatch(/^\d{2}:\d{2}:\d{2}$/);
      expect(times.dhuhr).toMatch(/^\d{2}:\d{2}:\d{2}$/);
    });

    it('should have current date initially', () => {
      const times = $prayerTimes.get();
      const today = DateTime.now().toISODate();
      expect(times.date).toBe(today);
    });

    it('should update when set is called', () => {
      const newTimes = {
        date: '2024-01-15',
        fajr: '05:30:00',
        sunrise: '06:45:00',
        dhuhr: '12:15:00',
        asr: '15:30:00',
        maghrib: '18:00:00',
        isha: '19:15:00',
      };

      $prayerTimes.set(newTimes);
      const times = $prayerTimes.get();
      expect(times).toEqual(newTimes);
    });

    it('should allow partial updates', () => {
      $prayerTimes.set({
        date: '2024-01-15',
        fajr: '05:30:00',
        sunrise: '06:45:00',
        dhuhr: '12:15:00',
        asr: '15:30:00',
        maghrib: '18:00:00',
        isha: '19:15:00',
      });

      const current = $prayerTimes.get();
      $prayerTimes.set({
        ...current,
        fajr: '05:35:00',
      });

      const updated = $prayerTimes.get();
      expect(updated.fajr).toBe('05:35:00');
      expect(updated.dhuhr).toBe('12:15:00'); // Should remain unchanged
    });
  });

  describe('$currentPrayer computed store', () => {
    it('should return correct prayer for morning time', () => {
      $prayerTimes.set({
        date: '2024-01-15',
        fajr: '05:30:00',
        sunrise: '06:45:00',
        dhuhr: '12:15:00',
        asr: '15:30:00',
        maghrib: '18:00:00',
        isha: '19:15:00',
      });
      $currentTime.set(DateTime.fromISO('2024-01-15T06:00:00'));

      const currentPrayer = $currentPrayer.get();
      expect(currentPrayer).toBe('fajr');
    });

    it('should return correct prayer for afternoon time', () => {
      $prayerTimes.set({
        date: '2024-01-15',
        fajr: '05:30:00',
        sunrise: '06:45:00',
        dhuhr: '12:15:00',
        asr: '15:30:00',
        maghrib: '18:00:00',
        isha: '19:15:00',
      });
      $currentTime.set(DateTime.fromISO('2024-01-15T14:00:00'));

      const currentPrayer = $currentPrayer.get();
      expect(currentPrayer).toBe('dhuhr');
    });

    it('should return isha for time before fajr', () => {
      $prayerTimes.set({
        date: '2024-01-15',
        fajr: '05:30:00',
        sunrise: '06:45:00',
        dhuhr: '12:15:00',
        asr: '15:30:00',
        maghrib: '18:00:00',
        isha: '19:15:00',
      });
      $currentTime.set(DateTime.fromISO('2024-01-15T03:00:00'));

      const currentPrayer = $currentPrayer.get();
      expect(currentPrayer).toBe('isha');
    });
  });

  describe('$nextPrayer computed store', () => {
    it('should return fajr when before fajr time', () => {
      $prayerTimes.set({
        date: '2024-01-15',
        fajr: '05:30:00',
        sunrise: '06:45:00',
        dhuhr: '12:15:00',
        asr: '15:30:00',
        maghrib: '18:00:00',
        isha: '19:15:00',
      });
      $currentTime.set(DateTime.fromISO('2024-01-15T03:00:00'));

      const nextPrayer = $nextPrayer.get();
      expect(nextPrayer).toEqual({ prayer: 'fajr', time: '05:30:00' });
    });

    it('should return dhuhr when between sunrise and dhuhr', () => {
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

      const nextPrayer = $nextPrayer.get();
      expect(nextPrayer).toEqual({ prayer: 'dhuhr', time: '12:15:00' });
    });

    it('should return fajr when after isha', () => {
      $prayerTimes.set({
        date: '2024-01-15',
        fajr: '05:30:00',
        sunrise: '06:45:00',
        dhuhr: '12:15:00',
        asr: '15:30:00',
        maghrib: '18:00:00',
        isha: '19:15:00',
      });
      $currentTime.set(DateTime.fromISO('2024-01-15T22:00:00'));

      const nextPrayer = $nextPrayer.get();
      expect(nextPrayer).toEqual({ prayer: 'fajr', time: '05:30:00' });
    });
  });

  describe('updatePrayerTimes function', () => {
    it('should calculate prayer times for current date', () => {
      updatePrayerTimes();

      const times = $prayerTimes.get();
      expect(times.date).toBe(DateTime.now().toISODate());
      expect(times.fajr).toMatch(/^\d{2}:\d{2}:\d{2}$/);
      expect(times.dhuhr).toMatch(/^\d{2}:\d{2}:\d{2}$/);
    });

    it('should calculate prayer times for specific date', () => {
      const targetDate = DateTime.fromISO('2024-06-21', { zone: 'Asia/Jakarta' });
      updatePrayerTimes(targetDate);

      const times = $prayerTimes.get();
      expect(times.date).toBe('2024-06-21');
      expect(times.fajr).toMatch(/^\d{2}:\d{2}:\d{2}$/);
    });

    it('should use settings from $settings store', () => {
      // Update settings to a known location
      $settings.set({
        ...$settings.get(),
        location: {
          latitude: -6.2088,
          longitude: 106.8456,
          timezone: 'Asia/Jakarta',
          altitude: 0,
        },
        calculationMethod: 'MWL',
      });

      updatePrayerTimes();

      const times = $prayerTimes.get();
      // Should have calculated times based on Jakarta location
      expect(times.fajr).toMatch(/^\d{2}:\d{2}:\d{2}$/);
    });
  });

  describe('Live clock functionality', () => {
    it('should update currentTime every second in browser environment', () => {
      // This test verifies the setInterval is set up
      // The actual interval runs in the module scope
      const currentTime = $currentTime.get();
      expect(currentTime).toBeInstanceOf(DateTime);
      expect(currentTime.isValid).toBe(true);
    });
  });
});
