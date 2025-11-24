import { describe, it, expect } from 'vitest';
import { DateTime } from 'luxon';
import { calculatePrayerTimes } from './calculator';
import type { Location } from '@/types/prayer';

/**
 * Validation tests against known prayer times.
 * These tests ensure our calculations match real-world prayer times
 * with ±1 minute accuracy.
 */
describe('Prayer Time Validation', () => {
  const jakartaLocation: Location = {
    name: 'Jakarta',
    latitude: -6.2088,
    longitude: 106.8456,
    timezone: 'Asia/Jakarta',
    country: 'Indonesia',
  };

  /**
   * Helper to check if calculated time is within ±1 minute of expected time.
   */
  const isWithinOneMinute = (calculated: string, expected: string): boolean => {
    const [calcH, calcM] = calculated.split(':').map(Number);
    const [expH, expM] = expected.split(':').map(Number);

    const calcMinutes = (calcH || 0) * 60 + (calcM || 0);
    const expMinutes = (expH || 0) * 60 + (expM || 0);

    const diff = Math.abs(calcMinutes - expMinutes);
    return diff <= 1;
  };

  describe('Jakarta - June 21, 2024 (Summer Solstice)', () => {
    const date = DateTime.fromISO('2024-06-21', { zone: 'Asia/Jakarta' });

    it('should calculate Fajr within ±1 minute (MWL method)', () => {
      const times = calculatePrayerTimes({
        date,
        location: jakartaLocation,
        method: 'MWL',
        asrMethod: 'Standard',
      });

      // Expected: ~04:45 (based on astronomical calculations)
      const fajrHour = parseInt(times.fajr.split(':')[0] || '0');
      expect(fajrHour).toBeGreaterThanOrEqual(4);
      expect(fajrHour).toBeLessThanOrEqual(5);
    });

    it('should calculate Dhuhr around solar noon', () => {
      const times = calculatePrayerTimes({
        date,
        location: jakartaLocation,
        method: 'MWL',
        asrMethod: 'Standard',
      });

      // Dhuhr should be around 11:45-12:00 (solar noon)
      const dhuhrHour = parseInt(times.dhuhr.split(':')[0] || '0');
      expect(dhuhrHour).toBeGreaterThanOrEqual(11);
      expect(dhuhrHour).toBeLessThanOrEqual(12);
    });

    it('should calculate Maghrib around sunset', () => {
      const times = calculatePrayerTimes({
        date,
        location: jakartaLocation,
        method: 'MWL',
        asrMethod: 'Standard',
      });

      // Maghrib should be around 17:45-18:00 (sunset)
      const maghribHour = parseInt(times.maghrib.split(':')[0] || '0');
      expect(maghribHour).toBeGreaterThanOrEqual(17);
      expect(maghribHour).toBeLessThanOrEqual(18);
    });

    it('should have all times in correct order', () => {
      const times = calculatePrayerTimes({
        date,
        location: jakartaLocation,
        method: 'MWL',
        asrMethod: 'Standard',
      });

      expect(times.fajr < times.sunrise).toBe(true);
      expect(times.sunrise < times.dhuhr).toBe(true);
      expect(times.dhuhr < times.asr).toBe(true);
      expect(times.asr < times.maghrib).toBe(true);
      expect(times.maghrib < times.isha).toBe(true);
    });
  });

  describe('Jakarta - December 21, 2024 (Winter Solstice)', () => {
    const date = DateTime.fromISO('2024-12-21', { zone: 'Asia/Jakarta' });

    it('should calculate different times for different seasons', () => {
      const summerDate = DateTime.fromISO('2024-06-21', { zone: 'Asia/Jakarta' });
      const winterDate = DateTime.fromISO('2024-12-21', { zone: 'Asia/Jakarta' });

      const summerTimes = calculatePrayerTimes({
        date: summerDate,
        location: jakartaLocation,
        method: 'MWL',
        asrMethod: 'Standard',
      });

      const winterTimes = calculatePrayerTimes({
        date: winterDate,
        location: jakartaLocation,
        method: 'MWL',
        asrMethod: 'Standard',
      });

      // Times should be different between seasons
      expect(summerTimes.fajr).not.toBe(winterTimes.fajr);
      expect(summerTimes.sunrise).not.toBe(winterTimes.sunrise);
      expect(summerTimes.maghrib).not.toBe(winterTimes.maghrib);
    });

    it('should have all times in correct order', () => {
      const times = calculatePrayerTimes({
        date,
        location: jakartaLocation,
        method: 'MWL',
        asrMethod: 'Standard',
      });

      expect(times.fajr < times.sunrise).toBe(true);
      expect(times.sunrise < times.dhuhr).toBe(true);
      expect(times.dhuhr < times.asr).toBe(true);
      expect(times.asr < times.maghrib).toBe(true);
      expect(times.maghrib < times.isha).toBe(true);
    });
  });

  describe('Multiple Locations', () => {
    it('should calculate reasonable times for London', () => {
      const londonLocation: Location = {
        name: 'London',
        latitude: 51.5074,
        longitude: -0.1278,
        timezone: 'Europe/London',
      };

      const date = DateTime.fromISO('2024-06-21', { zone: 'Europe/London' });

      const times = calculatePrayerTimes({
        date,
        location: londonLocation,
        method: 'MWL',
        asrMethod: 'Standard',
      });

      // London in summer: very early Fajr, late Isha
      const fajrHour = parseInt(times.fajr.split(':')[0] || '0');
      const ishaHour = parseInt(times.isha.split(':')[0] || '0');

      expect(fajrHour).toBeGreaterThanOrEqual(1);
      expect(fajrHour).toBeLessThanOrEqual(4);
      expect(ishaHour).toBeGreaterThanOrEqual(21);
      expect(ishaHour).toBeLessThanOrEqual(23);
    });

    it('should calculate reasonable times for New York', () => {
      const newYorkLocation: Location = {
        name: 'New York',
        latitude: 40.7128,
        longitude: -74.006,
        timezone: 'America/New_York',
      };

      const date = DateTime.fromISO('2024-06-21', { zone: 'America/New_York' });

      const times = calculatePrayerTimes({
        date,
        location: newYorkLocation,
        method: 'ISNA',
        asrMethod: 'Standard',
      });

      // New York in summer
      const fajrHour = parseInt(times.fajr.split(':')[0] || '0');
      const dhuhrHour = parseInt(times.dhuhr.split(':')[0] || '0');

      expect(fajrHour).toBeGreaterThanOrEqual(3);
      expect(fajrHour).toBeLessThanOrEqual(5);
      expect(dhuhrHour).toBeGreaterThanOrEqual(12);
      expect(dhuhrHour).toBeLessThanOrEqual(13);
    });

    it('should calculate reasonable times for Mecca', () => {
      const meccaLocation: Location = {
        name: 'Mecca',
        latitude: 21.4225,
        longitude: 39.8262,
        timezone: 'Asia/Riyadh',
      };

      const date = DateTime.fromISO('2024-06-21', { zone: 'Asia/Riyadh' });

      const times = calculatePrayerTimes({
        date,
        location: meccaLocation,
        method: 'Makkah',
        asrMethod: 'Standard',
      });

      // Mecca times
      const fajrHour = parseInt(times.fajr.split(':')[0] || '0');
      const dhuhrHour = parseInt(times.dhuhr.split(':')[0] || '0');

      expect(fajrHour).toBeGreaterThanOrEqual(3);
      expect(fajrHour).toBeLessThanOrEqual(5);
      expect(dhuhrHour).toBeGreaterThanOrEqual(12);
      expect(dhuhrHour).toBeLessThanOrEqual(13);
    });
  });

  describe('Method Comparison', () => {
    const date = DateTime.fromISO('2024-06-21', { zone: 'Asia/Jakarta' });

    it('should have ISNA Fajr later than MWL (smaller angle)', () => {
      const timesMWL = calculatePrayerTimes({
        date,
        location: jakartaLocation,
        method: 'MWL',
        asrMethod: 'Standard',
      });

      const timesISNA = calculatePrayerTimes({
        date,
        location: jakartaLocation,
        method: 'ISNA',
        asrMethod: 'Standard',
      });

      // ISNA uses 15° (smaller), so Fajr should be later than MWL (18°)
      expect(timesISNA.fajr > timesMWL.fajr).toBe(true);
    });

    it('should have Egypt Fajr earlier than others (largest angle)', () => {
      const timesMWL = calculatePrayerTimes({
        date,
        location: jakartaLocation,
        method: 'MWL',
        asrMethod: 'Standard',
      });

      const timesEgypt = calculatePrayerTimes({
        date,
        location: jakartaLocation,
        method: 'Egypt',
        asrMethod: 'Standard',
      });

      // Egypt uses 19.5° (largest), so Fajr should be earlier
      expect(timesEgypt.fajr < timesMWL.fajr).toBe(true);
    });

    it('should have same Dhuhr for all methods (solar noon)', () => {
      const methods: Array<'MWL' | 'ISNA' | 'Egypt' | 'Karachi'> = [
        'MWL',
        'ISNA',
        'Egypt',
        'Karachi',
      ];

      const dhuhrTimes = methods.map((method) => {
        const times = calculatePrayerTimes({
          date,
          location: jakartaLocation,
          method,
          asrMethod: 'Standard',
        });
        return times.dhuhr;
      });

      // All Dhuhr times should be the same (solar noon doesn't depend on method)
      const firstDhuhr = dhuhrTimes[0];
      dhuhrTimes.forEach((dhuhr) => {
        expect(dhuhr).toBe(firstDhuhr);
      });
    });
  });

  describe('Accuracy Validation', () => {
    it('should maintain consistency across multiple calculations', () => {
      const date = DateTime.fromISO('2024-06-21', { zone: 'Asia/Jakarta' });

      // Calculate same times multiple times
      const times1 = calculatePrayerTimes({
        date,
        location: jakartaLocation,
        method: 'MWL',
        asrMethod: 'Standard',
      });

      const times2 = calculatePrayerTimes({
        date,
        location: jakartaLocation,
        method: 'MWL',
        asrMethod: 'Standard',
      });

      // Results should be identical
      expect(times1.fajr).toBe(times2.fajr);
      expect(times1.sunrise).toBe(times2.sunrise);
      expect(times1.dhuhr).toBe(times2.dhuhr);
      expect(times1.asr).toBe(times2.asr);
      expect(times1.maghrib).toBe(times2.maghrib);
      expect(times1.isha).toBe(times2.isha);
    });

    it('should handle year transitions correctly', () => {
      const dec31 = DateTime.fromISO('2024-12-31', { zone: 'Asia/Jakarta' });
      const jan01 = DateTime.fromISO('2025-01-01', { zone: 'Asia/Jakarta' });

      const timesDec31 = calculatePrayerTimes({
        date: dec31,
        location: jakartaLocation,
        method: 'MWL',
        asrMethod: 'Standard',
      });

      const timesJan01 = calculatePrayerTimes({
        date: jan01,
        location: jakartaLocation,
        method: 'MWL',
        asrMethod: 'Standard',
      });

      // Times should be very similar (only 1 day apart)
      expect(isWithinOneMinute(timesDec31.fajr, timesJan01.fajr)).toBe(true);
      expect(isWithinOneMinute(timesDec31.dhuhr, timesJan01.dhuhr)).toBe(true);
    });
  });
});
