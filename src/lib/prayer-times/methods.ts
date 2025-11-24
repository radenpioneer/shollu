import type { CalculationMethod } from '@/types/prayer';

/**
 * Configuration for a prayer time calculation method.
 * Each method uses different angles for Fajr and Isha calculations.
 */
export interface MethodConfig {
  /** Method identifier */
  name: CalculationMethod;
  /** Fajr angle (degrees below horizon) */
  fajrAngle: number;
  /** Isha angle (degrees below horizon) */
  ishaAngle: number;
  /** Description of the method */
  description: string;
}

/**
 * Prayer time calculation methods with their respective angles.
 * Based on the original Shollu v3.10 implementation.
 *
 * Angles represent degrees below the horizon:
 * - Fajr: When morning twilight begins
 * - Isha: When evening twilight ends
 */
export const CALCULATION_METHODS: Record<CalculationMethod, MethodConfig> = {
  /**
   * University of Islamic Sciences, Karachi
   * Used in Pakistan, Bangladesh, India, Afghanistan, and parts of Europe
   */
  Karachi: {
    name: 'Karachi',
    fajrAngle: 18,
    ishaAngle: 18,
    description: 'University of Islamic Sciences, Karachi',
  },

  /**
   * Islamic Society of North America (ISNA)
   * Used in North America (USA, Canada, Mexico)
   */
  ISNA: {
    name: 'ISNA',
    fajrAngle: 15,
    ishaAngle: 15,
    description: 'Islamic Society of North America',
  },

  /**
   * Muslim World League (MWL)
   * Used in Europe, Far East, and parts of America
   */
  MWL: {
    name: 'MWL',
    fajrAngle: 18,
    ishaAngle: 17,
    description: 'Muslim World League',
  },

  /**
   * Umm Al-Qura University, Makkah
   * Used in Saudi Arabia
   * Note: Isha is 90 minutes after Maghrib (not angle-based)
   */
  Makkah: {
    name: 'Makkah',
    fajrAngle: 18.5,
    ishaAngle: 90, // 90 minutes after Maghrib (special case)
    description: 'Umm Al-Qura University, Makkah',
  },

  /**
   * Egyptian General Authority of Survey
   * Used in Africa, Syria, Iraq, Lebanon, Malaysia, and Indonesia
   */
  Egypt: {
    name: 'Egypt',
    fajrAngle: 19.5,
    ishaAngle: 17.5,
    description: 'Egyptian General Authority of Survey',
  },

  /**
   * Institute of Geophysics, University of Tehran
   * Used in Iran and some Shia communities
   */
  Tehran: {
    name: 'Tehran',
    fajrAngle: 17.7,
    ishaAngle: 14,
    description: 'Institute of Geophysics, University of Tehran',
  },

  /**
   * Shia Ithna-Ashari, Leva Institute, Qum
   * Used by Shia communities
   */
  Jafari: {
    name: 'Jafari',
    fajrAngle: 16,
    ishaAngle: 14,
    description: 'Shia Ithna-Ashari, Leva Institute, Qum',
  },
};

/**
 * Gets the configuration for a specific calculation method.
 *
 * @param method - The calculation method to get configuration for
 * @returns Method configuration with Fajr and Isha angles
 *
 * @example
 * ```ts
 * const config = getMethodConfig('MWL');
 * console.log(config.fajrAngle); // 18
 * console.log(config.ishaAngle); // 17
 * ```
 */
export const getMethodConfig = (method: CalculationMethod): MethodConfig => {
  return CALCULATION_METHODS[method];
};

/**
 * Gets all available calculation methods.
 *
 * @returns Array of all method configurations
 *
 * @example
 * ```ts
 * const methods = getAllMethods();
 * methods.forEach(m => console.log(m.name, m.description));
 * ```
 */
export const getAllMethods = (): MethodConfig[] => {
  return Object.values(CALCULATION_METHODS);
};
