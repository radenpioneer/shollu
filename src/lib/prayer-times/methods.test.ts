import { describe, it, expect } from 'vitest';
import { CALCULATION_METHODS, getMethodConfig, getAllMethods } from './methods';

describe('Prayer Calculation Methods', () => {
  describe('CALCULATION_METHODS', () => {
    it('should have all 7 calculation methods defined', () => {
      const methods = Object.keys(CALCULATION_METHODS);
      expect(methods).toHaveLength(7);
      expect(methods).toContain('Karachi');
      expect(methods).toContain('ISNA');
      expect(methods).toContain('MWL');
      expect(methods).toContain('Makkah');
      expect(methods).toContain('Egypt');
      expect(methods).toContain('Tehran');
      expect(methods).toContain('Jafari');
    });

    it('should have valid Fajr angles (between 15 and 20 degrees)', () => {
      Object.values(CALCULATION_METHODS).forEach((method) => {
        expect(method.fajrAngle).toBeGreaterThanOrEqual(15);
        expect(method.fajrAngle).toBeLessThanOrEqual(20);
      });
    });

    it('should have valid Isha angles (between 14 and 90)', () => {
      Object.values(CALCULATION_METHODS).forEach((method) => {
        expect(method.ishaAngle).toBeGreaterThanOrEqual(14);
        expect(method.ishaAngle).toBeLessThanOrEqual(90);
      });
    });

    it('should have descriptions for all methods', () => {
      Object.values(CALCULATION_METHODS).forEach((method) => {
        expect(method.description).toBeTruthy();
        expect(method.description.length).toBeGreaterThan(10);
      });
    });
  });

  describe('Karachi method', () => {
    it('should have correct angles', () => {
      const method = CALCULATION_METHODS.Karachi;
      expect(method.fajrAngle).toBe(18);
      expect(method.ishaAngle).toBe(18);
    });

    it('should have correct name and description', () => {
      const method = CALCULATION_METHODS.Karachi;
      expect(method.name).toBe('Karachi');
      expect(method.description).toContain('Karachi');
    });
  });

  describe('ISNA method', () => {
    it('should have correct angles', () => {
      const method = CALCULATION_METHODS.ISNA;
      expect(method.fajrAngle).toBe(15);
      expect(method.ishaAngle).toBe(15);
    });

    it('should have correct name and description', () => {
      const method = CALCULATION_METHODS.ISNA;
      expect(method.name).toBe('ISNA');
      expect(method.description).toContain('North America');
    });
  });

  describe('MWL method', () => {
    it('should have correct angles', () => {
      const method = CALCULATION_METHODS.MWL;
      expect(method.fajrAngle).toBe(18);
      expect(method.ishaAngle).toBe(17);
    });

    it('should have correct name and description', () => {
      const method = CALCULATION_METHODS.MWL;
      expect(method.name).toBe('MWL');
      expect(method.description).toContain('Muslim World League');
    });
  });

  describe('Makkah method', () => {
    it('should have correct angles', () => {
      const method = CALCULATION_METHODS.Makkah;
      expect(method.fajrAngle).toBe(18.5);
      expect(method.ishaAngle).toBe(90); // 90 minutes, not degrees
    });

    it('should have correct name and description', () => {
      const method = CALCULATION_METHODS.Makkah;
      expect(method.name).toBe('Makkah');
      expect(method.description).toContain('Makkah');
    });

    it('should have special Isha calculation (90 minutes)', () => {
      const method = CALCULATION_METHODS.Makkah;
      expect(method.ishaAngle).toBe(90);
    });
  });

  describe('Egypt method', () => {
    it('should have correct angles', () => {
      const method = CALCULATION_METHODS.Egypt;
      expect(method.fajrAngle).toBe(19.5);
      expect(method.ishaAngle).toBe(17.5);
    });

    it('should have correct name and description', () => {
      const method = CALCULATION_METHODS.Egypt;
      expect(method.name).toBe('Egypt');
      expect(method.description).toContain('Egypt');
    });
  });

  describe('Tehran method', () => {
    it('should have correct angles', () => {
      const method = CALCULATION_METHODS.Tehran;
      expect(method.fajrAngle).toBe(17.7);
      expect(method.ishaAngle).toBe(14);
    });

    it('should have correct name and description', () => {
      const method = CALCULATION_METHODS.Tehran;
      expect(method.name).toBe('Tehran');
      expect(method.description).toContain('Tehran');
    });
  });

  describe('Jafari method', () => {
    it('should have correct angles', () => {
      const method = CALCULATION_METHODS.Jafari;
      expect(method.fajrAngle).toBe(16);
      expect(method.ishaAngle).toBe(14);
    });

    it('should have correct name and description', () => {
      const method = CALCULATION_METHODS.Jafari;
      expect(method.name).toBe('Jafari');
      expect(method.description).toContain('Shia');
    });
  });

  describe('getMethodConfig', () => {
    it('should return correct config for MWL', () => {
      const config = getMethodConfig('MWL');
      expect(config.name).toBe('MWL');
      expect(config.fajrAngle).toBe(18);
      expect(config.ishaAngle).toBe(17);
    });

    it('should return correct config for ISNA', () => {
      const config = getMethodConfig('ISNA');
      expect(config.name).toBe('ISNA');
      expect(config.fajrAngle).toBe(15);
      expect(config.ishaAngle).toBe(15);
    });

    it('should return correct config for all methods', () => {
      const methods: Array<keyof typeof CALCULATION_METHODS> = [
        'Karachi',
        'ISNA',
        'MWL',
        'Makkah',
        'Egypt',
        'Tehran',
        'Jafari',
      ];

      methods.forEach((method) => {
        const config = getMethodConfig(method);
        expect(config.name).toBe(method);
        expect(config.fajrAngle).toBeDefined();
        expect(config.ishaAngle).toBeDefined();
        expect(config.description).toBeDefined();
      });
    });
  });

  describe('getAllMethods', () => {
    it('should return array of all methods', () => {
      const methods = getAllMethods();
      expect(methods).toHaveLength(7);
    });

    it('should return method configs with all properties', () => {
      const methods = getAllMethods();
      methods.forEach((method) => {
        expect(method.name).toBeDefined();
        expect(method.fajrAngle).toBeDefined();
        expect(method.ishaAngle).toBeDefined();
        expect(method.description).toBeDefined();
      });
    });

    it('should include all expected methods', () => {
      const methods = getAllMethods();
      const names = methods.map((m) => m.name);
      expect(names).toContain('Karachi');
      expect(names).toContain('ISNA');
      expect(names).toContain('MWL');
      expect(names).toContain('Makkah');
      expect(names).toContain('Egypt');
      expect(names).toContain('Tehran');
      expect(names).toContain('Jafari');
    });
  });

  describe('Method comparison', () => {
    it('should have different Fajr angles for different methods', () => {
      const isna = CALCULATION_METHODS.ISNA.fajrAngle;
      const mwl = CALCULATION_METHODS.MWL.fajrAngle;
      const egypt = CALCULATION_METHODS.Egypt.fajrAngle;

      expect(isna).not.toBe(mwl);
      expect(mwl).not.toBe(egypt);
    });

    it('should have ISNA with smallest Fajr angle (15 degrees)', () => {
      const methods = getAllMethods();
      const fajrAngles = methods.map((m) => m.fajrAngle);
      const minFajr = Math.min(...fajrAngles);
      expect(minFajr).toBe(15);
      expect(CALCULATION_METHODS.ISNA.fajrAngle).toBe(minFajr);
    });

    it('should have Egypt with largest Fajr angle (19.5 degrees)', () => {
      const methods = getAllMethods();
      const fajrAngles = methods.map((m) => m.fajrAngle);
      const maxFajr = Math.max(...fajrAngles);
      expect(maxFajr).toBe(19.5);
      expect(CALCULATION_METHODS.Egypt.fajrAngle).toBe(maxFajr);
    });
  });
});
