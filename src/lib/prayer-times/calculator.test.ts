import { describe, it, expect } from 'vitest';
import { DateTime } from 'luxon';
import { calculatePrayerTimes, calculatePrayerTimesForDays } from './calculator';
import type { Location } from '@/types/prayer';

describe('Prayer Time Calculator', () => {
  const jakartaLocation: Location = {
    name: 'Jakarta',
    latitude: -6.2088,
    longitude: 106.8456,
    timezone: 'Asia/Jakarta',
    country: 'Indonesia',
  };

  const testDate = DateTime.fromISO('2024-06-21', { zone: 'Asia/Jakarta' }); // Summer solstice

  describe('calculatePrayerTimes', () => {
    it('should calculate all six prayer times', () => {
      const times = calculatePrayerTimes({
        date: testDate,
        location: jakartaLocation,
        method: 'MWL',
        asrMethod: 'Standard',
      });

      expect(times.date).toBe('2024-06-21');
      expect(times.fajr).toMatch(/^\d{2}:\d{2}:\d{2}$/);
      expect(times.sunrise).toMatch(/^\d{2}:\d{2}:\d{2}$/);
      expect(times.dhuhr).toMatch(/^\d{2}:\d{2}:\d{2}$/);
      expect(times.asr).toMatch(/^\d{2}:\d{2}:\d{2}$/);
      expect(times.maghrib).toMatch(/^\d{2}:\d{2}:\d{2}$/);
      expect(times.isha).toMatch(/^\d{2}:\d{2}:\d{2}$/);
    });

    it('should have Fajr before Sunrise', () => {
      const times = calculatePrayerTimes({
        date: testDate,
        location: jakartaLocation,
        method: 'MWL',
        asrMethod: 'Standard',
      });

      expect(times.fajr < times.sunrise).toBe(true);
    });

    it('should have Sunrise before Dhuhr', () => {
      const times = calculatePrayerTimes({
        date: testDate,
        location: jakartaLocation,
        method: 'MWL',
        asrMethod: 'Standard',
      });

      expect(times.sunrise < times.dhuhr).toBe(true);
    });

    it('should have Dhuhr before Asr', () => {
      const times = calculatePrayerTimes({
        date: testDate,
        location: jakartaLocation,
        method: 'MWL',
        asrMethod: 'Standard',
      });

      expect(times.dhuhr < times.asr).toBe(true);
    });

    it('should have Asr before Maghrib', () => {
      const times = calculatePrayerTimes({
        date: testDate,
        location: jakartaLocation,
        method: 'MWL',
        asrMethod: 'Standard',
      });

      expect(times.asr < times.maghrib).toBe(true);
    });

    it('should have Maghrib before Isha', () => {
      const times = calculatePrayerTimes({
        date: testDate,
        location: jakartaLocation,
        method: 'MWL',
        asrMethod: 'Standard',
      });

      expect(times.maghrib < times.isha).toBe(true);
    });

    it('should calculate different times for different methods', () => {
      const timesMWL = calculatePrayerTimes({
        date: testDate,
        location: jakartaLocation,
        method: 'MWL',
        asrMethod: 'Standard',
      });

      const timesISNA = calculatePrayerTimes({
        date: testDate,
        location: jakartaLocation,
        method: 'ISNA',
        asrMethod: 'Standard',
      });

      // Fajr should be different (different angles)
      expect(timesMWL.fajr).not.toBe(timesISNA.fajr);
      // Isha should be different (different angles)
      expect(timesMWL.isha).not.toBe(timesISNA.isha);
      // Dhuhr should be the same (solar noon)
      expect(timesMWL.dhuhr).toBe(timesISNA.dhuhr);
    });

    it('should calculate different Asr times for Standard vs Hanafi', () => {
      const timesStandard = calculatePrayerTimes({
        date: testDate,
        location: jakartaLocation,
        method: 'MWL',
        asrMethod: 'Standard',
      });

      const timesHanafi = calculatePrayerTimes({
        date: testDate,
        location: jakartaLocation,
        method: 'MWL',
        asrMethod: 'Hanafi',
      });

      // Hanafi Asr should be later than Standard
      expect(timesHanafi.asr > timesStandard.asr).toBe(true);
    });

    it('should apply manual adjustments correctly', () => {
      const timesBase = calculatePrayerTimes({
        date: testDate,
        location: jakartaLocation,
        method: 'MWL',
        asrMethod: 'Standard',
      });

      const timesAdjusted = calculatePrayerTimes({
        date: testDate,
        location: jakartaLocation,
        method: 'MWL',
        asrMethod: 'Standard',
        adjustments: {
          fajr: 2,
          dhuhr: -1,
          asr: 3,
        },
      });

      // Fajr should be 2 minutes later
      expect(timesAdjusted.fajr > timesBase.fajr).toBe(true);
      // Dhuhr should be 1 minute earlier
      expect(timesAdjusted.dhuhr < timesBase.dhuhr).toBe(true);
      // Asr should be 3 minutes later
      expect(timesAdjusted.asr > timesBase.asr).toBe(true);
    });

    it('should handle Makkah method (Isha = Maghrib + 90 minutes)', () => {
      const times = calculatePrayerTimes({
        date: testDate,
        location: jakartaLocation,
        method: 'Makkah',
        asrMethod: 'Standard',
      });

      // Parse times
      const [maghribH, maghribM] = times.maghrib.split(':').map(Number);
      const [ishaH, ishaM] = times.isha.split(':').map(Number);

      const maghribMinutes = maghribH * 60 + maghribM;
      const ishaMinutes = ishaH * 60 + ishaM;

      // Isha should be 90 minutes after Maghrib
      expect(ishaMinutes - maghribMinutes).toBe(90);
    });

    it('should handle altitude parameter', () => {
      const timesSeaLevel = calculatePrayerTimes({
        date: testDate,
        location: jakartaLocation,
        method: 'MWL',
        asrMethod: 'Standard',
        altitude: 0,
      });

      const timesHighAltitude = calculatePrayerTimes({
        date: testDate,
        location: jakartaLocation,
        method: 'MWL',
        asrMethod: 'Standard',
        altitude: 1000,
      });

      // Sunrise should be earlier at higher altitude
      expect(timesHighAltitude.sunrise < timesSeaLevel.sunrise).toBe(true);
      // Maghrib should be later at higher altitude
      expect(timesHighAltitude.maghrib > timesSeaLevel.maghrib).toBe(true);
    });
  });

  describe('calculatePrayerTimesForDays', () => {
    it('should calculate times for multiple days', () => {
      const times = calculatePrayerTimesForDays(
        {
          date: testDate,
          location: jakartaLocation,
          method: 'MWL',
          asrMethod: 'Standard',
        },
        3
      );

      expect(times).toHaveLength(3);
      expect(times[0]?.date).toBe('2024-06-21');
      expect(times[1]?.date).toBe('2024-06-22');
      expect(times[2]?.date).toBe('2024-06-23');
    });

    it('should calculate different times for different days', () => {
      const times = calculatePrayerTimesForDays(
        {
          date: testDate,
          location: jakartaLocation,
          method: 'MWL',
          asrMethod: 'Standard',
        },
        2
      );

      // Times should be slightly different each day
      expect(times[0]?.fajr).not.toBe(times[1]?.fajr);
    });

    it('should default to 1 day if days parameter not provided', () => {
      const times = calculatePrayerTimesForDays({
        date: testDate,
        location: jakartaLocation,
        method: 'MWL',
        asrMethod: 'Standard',
      });

      expect(times).toHaveLength(1);
    });
  });

  describe('Real-world validation', () => {
    it('should calculate reasonable times for Jakarta', () => {
      const times = calculatePrayerTimes({
        date: testDate,
        location: jakartaLocation,
        method: 'MWL',
        asrMethod: 'Standard',
      });

      // Fajr should be around 4-5 AM
      expect(times.fajr.startsWith('04:') || times.fajr.startsWith('05:')).toBe(true);
      // Dhuhr should be around 11 AM - 12 PM
      expect(times.dhuhr.startsWith('11:') || times.dhuhr.startsWith('12:')).toBe(true);
      // Maghrib should be around 5-6 PM
      expect(times.maghrib.startsWith('17:') || times.maghrib.startsWith('18:')).toBe(true);
    });
  });
});
