import { DateTime } from 'luxon';

/**
 * Names of the six Islamic prayer times.
 */
export type PrayerName = 'fajr' | 'sunrise' | 'dhuhr' | 'asr' | 'maghrib' | 'isha';

/**
 * Single prayer time with name, DateTime object, and display string.
 */
export interface PrayerTime {
  name: PrayerName;
  time: DateTime;
  displayTime: string;
}

/**
 * All prayer times for a single day.
 * Times are stored as strings in HH:mm:ss format.
 */
export interface PrayerTimes {
  date: string;
  fajr: string;
  sunrise: string;
  dhuhr: string;
  asr: string;
  maghrib: string;
  isha: string;
}

/**
 * Prayer time calculation methods.
 * Each method uses different angles for Fajr and Isha calculations.
 */
export type CalculationMethod =
  | 'MWL' // Muslim World League
  | 'ISNA' // Islamic Society of North America
  | 'Egypt' // Egyptian General Authority of Survey
  | 'Makkah' // Umm Al-Qura University, Makkah
  | 'Karachi' // University of Islamic Sciences, Karachi
  | 'Tehran' // Institute of Geophysics, University of Tehran
  | 'Jafari'; // Shia Ithna-Ashari, Leva Institute, Qum

/**
 * Asr prayer calculation method.
 * Standard (Shafi'i): Shadow length = object length
 * Hanafi: Shadow length = 2x object length
 */
export type AsrCalculation = 'Standard' | 'Hanafi';

/**
 * Geographic location for prayer time calculations.
 */
export interface Location {
  name: string;
  latitude: number;
  longitude: number;
  timezone: string;
  country?: string;
}

/**
 * Manual adjustments for prayer times in minutes.
 * Positive values delay the time, negative values advance it.
 */
export interface PrayerAdjustments {
  fajr: number;
  sunrise: number;
  dhuhr: number;
  asr: number;
  maghrib: number;
  isha: number;
}
