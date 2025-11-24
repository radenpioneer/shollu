import { DateTime } from 'luxon';
import type { PrayerTimes, Location, CalculationMethod, AsrCalculation } from '@/types/prayer';
import { getMethodConfig } from './methods';
import {
  getDayOfYear,
  getSolarDeclination,
  getEquationOfTime,
  getHourAngle,
  getSunriseHourAngle,
  getAsrHourAngle,
} from './astronomical';

/**
 * Options for prayer time calculation.
 */
export interface CalculationOptions {
  /** Date to calculate prayer times for */
  date: DateTime;
  /** Geographic location */
  location: Location;
  /** Calculation method (determines Fajr and Isha angles) */
  method: CalculationMethod;
  /** Asr calculation method */
  asrMethod: AsrCalculation;
  /** Observer's altitude above sea level in meters */
  altitude?: number;
  /** Manual adjustments in minutes for each prayer */
  adjustments?: {
    fajr?: number;
    sunrise?: number;
    dhuhr?: number;
    asr?: number;
    maghrib?: number;
    isha?: number;
  };
}

/**
 * Converts decimal hours to HH:mm:ss format.
 *
 * @param hours - Time in decimal hours (e.g., 12.5 = 12:30:00)
 * @returns Time string in HH:mm:ss format
 *
 * @example
 * ```ts
 * hoursToTimeString(12.5); // "12:30:00"
 * hoursToTimeString(5.25);  // "05:15:00"
 * ```
 */
const hoursToTimeString = (hours: number): string => {
  // Normalize to 0-24 range
  let normalizedHours = hours % 24;
  if (normalizedHours < 0) normalizedHours += 24;

  const h = Math.floor(normalizedHours);
  const m = Math.floor((normalizedHours - h) * 60);
  const s = Math.floor(((normalizedHours - h) * 60 - m) * 60);

  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
};

/**
 * Adds minutes to a time string.
 *
 * @param timeString - Time in HH:mm:ss format
 * @param minutes - Minutes to add (can be negative)
 * @returns Adjusted time string in HH:mm:ss format
 *
 * @example
 * ```ts
 * addMinutes("12:00:00", 30);  // "12:30:00"
 * addMinutes("12:00:00", -15); // "11:45:00"
 * ```
 */
const addMinutes = (timeString: string, minutes: number): string => {
  const parts = timeString.split(':').map(Number);
  const h = parts[0] || 0;
  const m = parts[1] || 0;
  const s = parts[2] || 0;

  const totalMinutes = h * 60 + m + minutes;
  const hours = Math.floor(totalMinutes / 60) % 24;
  const mins = totalMinutes % 60;

  return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
};

/**
 * Calculates prayer times for a given date and location.
 *
 * This is the main prayer time calculation function, implementing the
 * algorithm from the original Shollu v3.10 Delphi code.
 *
 * The calculation uses astronomical formulas to determine when the sun
 * reaches specific angles below/above the horizon for each prayer.
 *
 * @param options - Calculation options including date, location, and method
 * @returns Prayer times for all six prayers in HH:mm:ss format
 *
 * @example
 * ```ts
 * const times = calculatePrayerTimes({
 *   date: DateTime.now(),
 *   location: {
 *     name: 'Jakarta',
 *     latitude: -6.2088,
 *     longitude: 106.8456,
 *     timezone: 'Asia/Jakarta',
 *   },
 *   method: 'MWL',
 *   asrMethod: 'Standard',
 *   altitude: 0,
 * });
 *
 * console.log(times.fajr);    // "04:45:00"
 * console.log(times.dhuhr);   // "12:00:00"
 * console.log(times.asr);     // "15:15:00"
 * console.log(times.maghrib); // "18:00:00"
 * console.log(times.isha);    // "19:15:00"
 * ```
 */
export const calculatePrayerTimes = (options: CalculationOptions): PrayerTimes => {
  const { date, location, method, asrMethod, altitude = 0, adjustments = {} } = options;

  // Get calculation method configuration
  const methodConfig = getMethodConfig(method);

  // Extract location data
  const { latitude, longitude } = location;

  // Get timezone offset in hours
  const timezoneOffset = date.offset / 60; // Luxon offset is in minutes

  // Calculate day of year
  const dayOfYear = getDayOfYear(date.toJSDate());

  // Calculate solar declination (sun's angle relative to equator)
  const declination = getSolarDeclination(dayOfYear);

  // Calculate equation of time (correction for Earth's elliptical orbit)
  const equationOfTime = getEquationOfTime(dayOfYear);

  // Reference longitude for timezone (15 degrees per hour)
  const referenceLongitude = 15 * timezoneOffset;

  // Calculate solar noon (Dhuhr time)
  // Formula: 12 + (referenceLongitude - longitude) / 15 - equationOfTime / 60
  const solarNoon = 12 + (referenceLongitude - longitude) / 15 - equationOfTime / 60;

  // Calculate Fajr (dawn) - sun at fajrAngle degrees below horizon
  const fajrHourAngle = getHourAngle(latitude, declination, -methodConfig.fajrAngle);
  let fajrTime = solarNoon - fajrHourAngle;

  // Calculate Sunrise - sun at horizon with altitude correction
  const sunriseHourAngle = getSunriseHourAngle(latitude, declination, altitude);
  const sunriseTime = solarNoon - sunriseHourAngle;

  // High latitude adjustment for Fajr: if Fajr is invalid (after sunrise or wraps),
  // use 1/7th of night method (Fajr = Sunrise - 1/7 of night duration)
  // We'll apply this after calculating Maghrib

  // Dhuhr is solar noon
  const dhuhrTime = solarNoon;

  // Calculate Asr - shadow length based on madhab
  const asrShadowFactor = asrMethod === 'Hanafi' ? 2 : 1;
  const asrHourAngle = getAsrHourAngle(latitude, declination, asrShadowFactor);
  const asrTime = solarNoon + asrHourAngle;

  // Calculate Maghrib (sunset) - same as sunrise but after noon
  const maghribTime = solarNoon + sunriseHourAngle;

  // Apply high latitude adjustment for Fajr if needed
  if (fajrTime >= sunriseTime || fajrTime < 0) {
    const nightDuration = 24 - maghribTime + sunriseTime;
    fajrTime = sunriseTime - nightDuration / 7;
    if (fajrTime < 0) fajrTime += 24;
  }

  // Calculate Isha (night) - sun at ishaAngle degrees below horizon
  // Special case for Makkah method: Isha is 90 minutes after Maghrib
  let ishaTime: number;
  if (method === 'Makkah') {
    ishaTime = maghribTime + 90 / 60; // 90 minutes = 1.5 hours
  } else {
    const ishaHourAngle = getHourAngle(latitude, declination, -methodConfig.ishaAngle);
    ishaTime = solarNoon + ishaHourAngle;

    // High latitude adjustment: if Isha is invalid (wraps to next day or same as Fajr),
    // use 1/7th of night method (Isha = Maghrib + 1/7 of night duration)
    if (ishaTime >= 24 || ishaTime <= fajrTime) {
      const nightDuration = 24 - maghribTime + fajrTime;
      ishaTime = maghribTime + nightDuration / 7;
    }
  }

  // Convert to time strings
  let fajr = hoursToTimeString(fajrTime);
  let sunrise = hoursToTimeString(sunriseTime);
  let dhuhr = hoursToTimeString(dhuhrTime);
  let asr = hoursToTimeString(asrTime);
  let maghrib = hoursToTimeString(maghribTime);
  let isha = hoursToTimeString(ishaTime);

  // Apply manual adjustments
  if (adjustments.fajr) fajr = addMinutes(fajr, adjustments.fajr);
  if (adjustments.sunrise) sunrise = addMinutes(sunrise, adjustments.sunrise);
  if (adjustments.dhuhr) dhuhr = addMinutes(dhuhr, adjustments.dhuhr);
  if (adjustments.asr) asr = addMinutes(asr, adjustments.asr);
  if (adjustments.maghrib) maghrib = addMinutes(maghrib, adjustments.maghrib);
  if (adjustments.isha) isha = addMinutes(isha, adjustments.isha);

  return {
    date: date.toISODate() || '',
    fajr,
    sunrise,
    dhuhr,
    asr,
    maghrib,
    isha,
  };
};

/**
 * Calculates prayer times for multiple days.
 *
 * @param options - Base calculation options
 * @param days - Number of days to calculate (default: 1)
 * @returns Array of prayer times for each day
 *
 * @example
 * ```ts
 * // Get prayer times for next 7 days
 * const weekTimes = calculatePrayerTimesForDays({
 *   date: DateTime.now(),
 *   location: jakartaLocation,
 *   method: 'MWL',
 *   asrMethod: 'Standard',
 * }, 7);
 * ```
 */
export const calculatePrayerTimesForDays = (
  options: CalculationOptions,
  days: number = 1
): PrayerTimes[] => {
  const times: PrayerTimes[] = [];

  for (let i = 0; i < days; i++) {
    const date = options.date.plus({ days: i });
    times.push(calculatePrayerTimes({ ...options, date }));
  }

  return times;
};
