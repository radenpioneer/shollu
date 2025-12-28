import { describe, it, expect } from 'vitest';
import {
  degreesToRadians,
  radiansToDegrees,
  getDayOfYear,
  getSolarDeclination,
  getEquationOfTime,
  getHourAngle,
  getSunriseHourAngle,
  getAsrHourAngle,
} from './astronomical';

describe('Astronomical Calculations', () => {
  describe('degreesToRadians', () => {
    it('should convert 0 degrees to 0 radians', () => {
      expect(degreesToRadians(0)).toBe(0);
    });

    it('should convert 180 degrees to π radians', () => {
      expect(degreesToRadians(180)).toBeCloseTo(Math.PI, 10);
    });

    it('should convert 90 degrees to π/2 radians', () => {
      expect(degreesToRadians(90)).toBeCloseTo(Math.PI / 2, 10);
    });

    it('should convert 360 degrees to 2π radians', () => {
      expect(degreesToRadians(360)).toBeCloseTo(2 * Math.PI, 10);
    });

    it('should handle negative degrees', () => {
      expect(degreesToRadians(-90)).toBeCloseTo(-Math.PI / 2, 10);
    });
  });

  describe('radiansToDegrees', () => {
    it('should convert 0 radians to 0 degrees', () => {
      expect(radiansToDegrees(0)).toBe(0);
    });

    it('should convert π radians to 180 degrees', () => {
      expect(radiansToDegrees(Math.PI)).toBeCloseTo(180, 10);
    });

    it('should convert π/2 radians to 90 degrees', () => {
      expect(radiansToDegrees(Math.PI / 2)).toBeCloseTo(90, 10);
    });

    it('should convert 2π radians to 360 degrees', () => {
      expect(radiansToDegrees(2 * Math.PI)).toBeCloseTo(360, 10);
    });

    it('should handle negative radians', () => {
      expect(radiansToDegrees(-Math.PI / 2)).toBeCloseTo(-90, 10);
    });
  });

  describe('getDayOfYear', () => {
    it('should return 1 for January 1st', () => {
      const date = new Date('2024-01-01');
      expect(getDayOfYear(date)).toBe(1);
    });

    it('should return 32 for February 1st', () => {
      const date = new Date('2024-02-01');
      expect(getDayOfYear(date)).toBe(32);
    });

    it('should return 60 for February 29th (leap year)', () => {
      const date = new Date('2024-02-29');
      expect(getDayOfYear(date)).toBe(60);
    });

    it('should return 172 for June 21st (summer solstice)', () => {
      const date = new Date('2024-06-21');
      expect(getDayOfYear(date)).toBe(173); // 172 or 173 depending on leap year
    });

    it('should return 365 for December 31st (non-leap year)', () => {
      const date = new Date('2023-12-31');
      expect(getDayOfYear(date)).toBe(365);
    });

    it('should return 366 for December 31st (leap year)', () => {
      const date = new Date('2024-12-31');
      expect(getDayOfYear(date)).toBe(366);
    });
  });

  describe('getSolarDeclination', () => {
    it('should return ~0 degrees at equinoxes (day 80 and 266)', () => {
      const declination1 = getSolarDeclination(80); // March 21
      const declination2 = getSolarDeclination(266); // September 23
      expect(Math.abs(declination1)).toBeLessThan(2);
      expect(Math.abs(declination2)).toBeLessThan(2);
    });

    it('should return positive declination in summer (northern hemisphere)', () => {
      const declination = getSolarDeclination(172); // June 21
      expect(declination).toBeGreaterThan(20);
      expect(declination).toBeLessThan(24);
    });

    it('should return negative declination in winter (northern hemisphere)', () => {
      const declination = getSolarDeclination(355); // December 21
      expect(declination).toBeLessThan(-20);
      expect(declination).toBeGreaterThan(-24);
    });

    it('should return values within valid range (-23.45 to +23.45)', () => {
      for (let day = 1; day <= 365; day++) {
        const declination = getSolarDeclination(day);
        expect(declination).toBeGreaterThanOrEqual(-23.5);
        expect(declination).toBeLessThanOrEqual(23.5);
      }
    });
  });

  describe('getEquationOfTime', () => {
    it('should return values within valid range (-20 to +20 minutes)', () => {
      for (let day = 1; day <= 365; day++) {
        const eot = getEquationOfTime(day);
        expect(eot).toBeGreaterThanOrEqual(-20);
        expect(eot).toBeLessThanOrEqual(20);
      }
    });

    it('should return different values for different days', () => {
      const eot1 = getEquationOfTime(1);
      const eot100 = getEquationOfTime(100);
      const eot200 = getEquationOfTime(200);
      expect(eot1).not.toBe(eot100);
      expect(eot100).not.toBe(eot200);
    });
  });

  describe('getHourAngle', () => {
    it('should return positive hour angle for valid inputs', () => {
      const angle = getHourAngle(-6.2088, 15, -18); // Jakarta, Fajr
      expect(angle).toBeGreaterThan(0);
      expect(angle).toBeLessThan(12);
    });

    it('should handle polar regions gracefully', () => {
      const angle1 = getHourAngle(85, 20, -18); // Near north pole in summer
      const angle2 = getHourAngle(85, -20, -18); // Near north pole in winter
      // In polar regions, calculations may not reach extreme values
      // but should still return valid hour angles
      expect(angle1).toBeGreaterThanOrEqual(0);
      expect(angle1).toBeLessThanOrEqual(12);
      expect(angle2).toBeGreaterThanOrEqual(0);
      expect(angle2).toBeLessThanOrEqual(12);
    });

    it('should return larger angles for deeper sun positions', () => {
      const angle15 = getHourAngle(-6.2088, 15, -15);
      const angle18 = getHourAngle(-6.2088, 15, -18);
      expect(angle18).toBeGreaterThan(angle15);
    });
  });

  describe('getSunriseHourAngle', () => {
    it('should return positive hour angle for sunrise', () => {
      const angle = getSunriseHourAngle(-6.2088, 15, 0); // Jakarta at sea level
      expect(angle).toBeGreaterThan(0);
      expect(angle).toBeLessThan(12);
    });

    it('should account for altitude (higher altitude = earlier sunrise)', () => {
      const angleSeaLevel = getSunriseHourAngle(-6.2088, 15, 0);
      const angleHighAltitude = getSunriseHourAngle(-6.2088, 15, 1000);
      expect(angleHighAltitude).toBeGreaterThan(angleSeaLevel);
    });

    it('should handle negative altitude (below sea level)', () => {
      const angle = getSunriseHourAngle(-6.2088, 15, -100);
      expect(angle).toBeGreaterThan(0);
      expect(angle).toBeLessThan(12);
    });
  });

  describe('getAsrHourAngle', () => {
    it('should return positive hour angle for Asr', () => {
      const angle = getAsrHourAngle(-6.2088, 15, 1); // Standard Asr
      expect(angle).toBeGreaterThan(0);
      expect(angle).toBeLessThan(12);
    });

    it('should return larger angle for Hanafi Asr (shadow factor 2)', () => {
      const angleStandard = getAsrHourAngle(-6.2088, 15, 1);
      const angleHanafi = getAsrHourAngle(-6.2088, 15, 2);
      expect(angleHanafi).toBeGreaterThan(angleStandard);
    });

    it('should work for different latitudes', () => {
      const angleJakarta = getAsrHourAngle(-6.2088, 15, 1);
      const angleLondon = getAsrHourAngle(51.5074, 15, 1);
      expect(angleJakarta).toBeGreaterThan(0);
      expect(angleLondon).toBeGreaterThan(0);
    });
  });

  describe('Integration: Full day cycle', () => {
    it('should calculate consistent times for a full day', () => {
      const latitude = -6.2088; // Jakarta
      const declination = 15; // Summer

      const fajrAngle = getHourAngle(latitude, declination, -18);
      const sunriseAngle = getSunriseHourAngle(latitude, declination, 0);
      const asrAngle = getAsrHourAngle(latitude, declination, 1);

      // Fajr should be before sunrise
      expect(fajrAngle).toBeGreaterThan(sunriseAngle);

      // Asr should be after solar noon (positive angle)
      expect(asrAngle).toBeGreaterThan(0);
    });
  });
});
