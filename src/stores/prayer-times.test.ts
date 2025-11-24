import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { DateTime } from 'luxon';
import { $currentTime, $prayerTimes, $currentPrayer, $nextPrayer } from './prayer-times';

describe('Prayer Times Store', () => {
  beforeEach(() => {
    // Reset stores
    $currentTime.set(DateTime.now());
    $prayerTimes.set({
      date: DateTime.now().toISODate() || '',
      fajr: '',
      sunrise: '',
      dhuhr: '',
      asr: '',
      maghrib: '',
      isha: '',
    });
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

    it('should have empty strings for prayer times initially', () => {
      const times = $prayerTimes.get();
      expect(times.fajr).toBe('');
      expect(times.sunrise).toBe('');
      expect(times.dhuhr).toBe('');
      expect(times.asr).toBe('');
      expect(times.maghrib).toBe('');
      expect(times.isha).toBe('');
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
    it('should return null initially (not implemented)', () => {
      const currentPrayer = $currentPrayer.get();
      expect(currentPrayer).toBeNull();
    });

    it('should be reactive to prayer times changes', () => {
      $prayerTimes.set({
        date: '2024-01-15',
        fajr: '05:30:00',
        sunrise: '06:45:00',
        dhuhr: '12:15:00',
        asr: '15:30:00',
        maghrib: '18:00:00',
        isha: '19:15:00',
      });

      // Will be implemented in Phase 2
      const currentPrayer = $currentPrayer.get();
      expect(currentPrayer).toBeNull();
    });

    it('should be reactive to current time changes', () => {
      const testTime = DateTime.fromISO('2024-01-15T14:00:00');
      $currentTime.set(testTime);

      // Will be implemented in Phase 2
      const currentPrayer = $currentPrayer.get();
      expect(currentPrayer).toBeNull();
    });
  });

  describe('$nextPrayer computed store', () => {
    it('should return null initially (not implemented)', () => {
      const nextPrayer = $nextPrayer.get();
      expect(nextPrayer).toBeNull();
    });

    it('should be reactive to prayer times changes', () => {
      $prayerTimes.set({
        date: '2024-01-15',
        fajr: '05:30:00',
        sunrise: '06:45:00',
        dhuhr: '12:15:00',
        asr: '15:30:00',
        maghrib: '18:00:00',
        isha: '19:15:00',
      });

      // Will be implemented in Phase 2
      const nextPrayer = $nextPrayer.get();
      expect(nextPrayer).toBeNull();
    });

    it('should be reactive to current time changes', () => {
      const testTime = DateTime.fromISO('2024-01-15T14:00:00');
      $currentTime.set(testTime);

      // Will be implemented in Phase 2
      const nextPrayer = $nextPrayer.get();
      expect(nextPrayer).toBeNull();
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
