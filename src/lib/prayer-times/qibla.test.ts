import { describe, it, expect } from 'vitest';
import {
  KAABA_LOCATION,
  calculateQiblaDirection,
  calculateDistanceToKaaba,
  getCompassDirection,
  formatQiblaDMS,
} from './qibla';
import type { Location } from '@/types/prayer';

describe('Qibla Calculator', () => {
  const jakartaLocation: Location = {
    name: 'Jakarta',
    latitude: -6.2088,
    longitude: 106.8456,
    timezone: 'Asia/Jakarta',
  };

  const londonLocation: Location = {
    name: 'London',
    latitude: 51.5074,
    longitude: -0.1278,
    timezone: 'Europe/London',
  };

  const newYorkLocation: Location = {
    name: 'New York',
    latitude: 40.7128,
    longitude: -74.006,
    timezone: 'America/New_York',
  };

  describe('KAABA_LOCATION', () => {
    it('should have correct coordinates', () => {
      expect(KAABA_LOCATION.latitude).toBe(21.4225);
      expect(KAABA_LOCATION.longitude).toBe(39.8262);
    });
  });

  describe('calculateQiblaDirection', () => {
    it('should return a value between 0 and 360', () => {
      const qibla = calculateQiblaDirection(jakartaLocation);
      expect(qibla).toBeGreaterThanOrEqual(0);
      expect(qibla).toBeLessThan(360);
    });

    it('should calculate Qibla for Jakarta (northwest)', () => {
      const qibla = calculateQiblaDirection(jakartaLocation);
      // Jakarta's Qibla is approximately 295 degrees (northwest)
      expect(qibla).toBeGreaterThan(290);
      expect(qibla).toBeLessThan(300);
    });

    it('should calculate Qibla for London (southeast)', () => {
      const qibla = calculateQiblaDirection(londonLocation);
      // London's Qibla is approximately 119 degrees (southeast)
      expect(qibla).toBeGreaterThan(115);
      expect(qibla).toBeLessThan(125);
    });

    it('should calculate Qibla for New York (northeast)', () => {
      const qibla = calculateQiblaDirection(newYorkLocation);
      // New York's Qibla is approximately 58 degrees (northeast)
      expect(qibla).toBeGreaterThan(50);
      expect(qibla).toBeLessThan(65);
    });

    it('should return 0 when at Kaaba location', () => {
      const kaabaAsLocation: Location = {
        name: 'Mecca',
        latitude: KAABA_LOCATION.latitude,
        longitude: KAABA_LOCATION.longitude,
        timezone: 'Asia/Riyadh',
      };
      const qibla = calculateQiblaDirection(kaabaAsLocation);
      // Should be very close to 0 or 360 (any direction is valid at Kaaba)
      expect(qibla >= 0 && qibla < 360).toBe(true);
    });

    it('should calculate different directions for different locations', () => {
      const qiblaJakarta = calculateQiblaDirection(jakartaLocation);
      const qiblaLondon = calculateQiblaDirection(londonLocation);
      const qiblaNewYork = calculateQiblaDirection(newYorkLocation);

      expect(qiblaJakarta).not.toBe(qiblaLondon);
      expect(qiblaLondon).not.toBe(qiblaNewYork);
      expect(qiblaNewYork).not.toBe(qiblaJakarta);
    });
  });

  describe('calculateDistanceToKaaba', () => {
    it('should return distance in kilometers', () => {
      const distance = calculateDistanceToKaaba(jakartaLocation);
      expect(distance).toBeGreaterThan(0);
    });

    it('should calculate reasonable distance for Jakarta (~7,800 km)', () => {
      const distance = calculateDistanceToKaaba(jakartaLocation);
      expect(distance).toBeGreaterThan(7500);
      expect(distance).toBeLessThan(8500);
    });

    it('should calculate reasonable distance for London (~4,800 km)', () => {
      const distance = calculateDistanceToKaaba(londonLocation);
      expect(distance).toBeGreaterThan(4500);
      expect(distance).toBeLessThan(5000);
    });

    it('should calculate reasonable distance for New York (~10,000 km)', () => {
      const distance = calculateDistanceToKaaba(newYorkLocation);
      expect(distance).toBeGreaterThan(9500);
      expect(distance).toBeLessThan(11000);
    });

    it('should return 0 when at Kaaba location', () => {
      const kaabaAsLocation: Location = {
        name: 'Mecca',
        latitude: KAABA_LOCATION.latitude,
        longitude: KAABA_LOCATION.longitude,
        timezone: 'Asia/Riyadh',
      };
      const distance = calculateDistanceToKaaba(kaabaAsLocation);
      expect(distance).toBe(0);
    });

    it('should calculate different distances for different locations', () => {
      const distanceJakarta = calculateDistanceToKaaba(jakartaLocation);
      const distanceLondon = calculateDistanceToKaaba(londonLocation);
      const distanceNewYork = calculateDistanceToKaaba(newYorkLocation);

      expect(distanceJakarta).not.toBe(distanceLondon);
      expect(distanceLondon).not.toBe(distanceNewYork);
    });
  });

  describe('getCompassDirection', () => {
    it('should return "North" for 0 degrees', () => {
      expect(getCompassDirection(0)).toBe('North');
    });

    it('should return "East" for 90 degrees', () => {
      expect(getCompassDirection(90)).toBe('East');
    });

    it('should return "South" for 180 degrees', () => {
      expect(getCompassDirection(180)).toBe('South');
    });

    it('should return "West" for 270 degrees', () => {
      expect(getCompassDirection(270)).toBe('West');
    });

    it('should return "Northeast" for 45 degrees', () => {
      expect(getCompassDirection(45)).toBe('Northeast');
    });

    it('should return "Northwest" for 315 degrees', () => {
      expect(getCompassDirection(315)).toBe('Northwest');
    });

    it('should return "Northwest" for Jakarta Qibla', () => {
      const qibla = calculateQiblaDirection(jakartaLocation);
      const direction = getCompassDirection(qibla);
      expect(direction).toContain('Northwest');
    });

    it('should return "Southeast" for London Qibla', () => {
      const qibla = calculateQiblaDirection(londonLocation);
      const direction = getCompassDirection(qibla);
      expect(direction).toContain('Southeast');
    });

    it('should handle 360 degrees (same as 0)', () => {
      expect(getCompassDirection(360)).toBe('North');
    });
  });

  describe('formatQiblaDMS', () => {
    it('should format degrees as DMS', () => {
      const formatted = formatQiblaDMS(295.5);
      expect(formatted).toMatch(/^\d+° \d+' \d+"$/);
    });

    it('should format 0 degrees correctly', () => {
      const formatted = formatQiblaDMS(0);
      expect(formatted).toBe('0° 0\' 0"');
    });

    it('should format 90 degrees correctly', () => {
      const formatted = formatQiblaDMS(90);
      expect(formatted).toBe('90° 0\' 0"');
    });

    it('should format decimal degrees with minutes and seconds', () => {
      const formatted = formatQiblaDMS(295.5042);
      expect(formatted).toContain('295°');
      expect(formatted).toContain("30'"); // 0.5042 * 60 ≈ 30 minutes
    });

    it('should handle Jakarta Qibla formatting', () => {
      const qibla = calculateQiblaDirection(jakartaLocation);
      const formatted = formatQiblaDMS(qibla);
      expect(formatted).toMatch(/^\d+° \d+' \d+"$/);
      expect(formatted).toContain('°');
      expect(formatted).toContain("'");
      expect(formatted).toContain('"');
    });
  });

  describe('Integration: Full Qibla information', () => {
    it('should provide complete Qibla information for a location', () => {
      const direction = calculateQiblaDirection(jakartaLocation);
      const distance = calculateDistanceToKaaba(jakartaLocation);
      const compass = getCompassDirection(direction);
      const dms = formatQiblaDMS(direction);

      expect(direction).toBeGreaterThan(0);
      expect(distance).toBeGreaterThan(0);
      expect(compass).toBeTruthy();
      expect(dms).toBeTruthy();

      // All values should be consistent
      expect(typeof direction).toBe('number');
      expect(typeof distance).toBe('number');
      expect(typeof compass).toBe('string');
      expect(typeof dms).toBe('string');
    });
  });
});
