/**
 * Astronomical calculations for prayer times.
 * Based on the original Shollu v3.10 Delphi implementation.
 *
 * These formulas calculate the sun's position and timing
 * for accurate prayer time determination.
 */

/**
 * Converts degrees to radians.
 *
 * @param degrees - Angle in degrees
 * @returns Angle in radians
 */
export const degreesToRadians = (degrees: number): number => {
  return (degrees * Math.PI) / 180;
};

/**
 * Converts radians to degrees.
 *
 * @param radians - Angle in radians
 * @returns Angle in degrees
 */
export const radiansToDegrees = (radians: number): number => {
  return (radians * 180) / Math.PI;
};

/**
 * Calculates the day of year (1-365/366).
 *
 * @param date - Date to calculate for
 * @returns Day of year (1 = January 1st)
 *
 * @example
 * ```ts
 * const day = getDayOfYear(DateTime.fromISO('2024-03-15'));
 * console.log(day); // 75 (March 15th is the 75th day)
 * ```
 */
export const getDayOfYear = (date: Date): number => {
  const start = new Date(date.getFullYear(), 0, 0);
  const diff = date.getTime() - start.getTime();
  const oneDay = 1000 * 60 * 60 * 24;
  return Math.floor(diff / oneDay);
};

/**
 * Calculates solar declination (sun's angle relative to equator).
 *
 * Solar declination varies throughout the year as Earth orbits the sun.
 * It ranges from -23.45° (winter solstice) to +23.45° (summer solstice).
 *
 * Formula from original Shollu implementation.
 *
 * @param dayOfYear - Day of year (1-365/366)
 * @returns Solar declination in degrees
 *
 * @example
 * ```ts
 * const declination = getSolarDeclination(172); // June 21 (summer solstice)
 * console.log(declination); // ~23.45 degrees
 * ```
 */
export const getSolarDeclination = (dayOfYear: number): number => {
  const bt = (2 * Math.PI * dayOfYear) / 365;

  const declination =
    (180 / Math.PI) *
    (0.006918 -
      0.399912 * Math.cos(bt) +
      0.070257 * Math.sin(bt) -
      0.006758 * Math.cos(2 * bt) +
      0.000907 * Math.sin(2 * bt) -
      0.002697 * Math.cos(3 * bt) +
      0.00148 * Math.sin(3 * bt));

  return declination;
};

/**
 * Calculates equation of time (difference between solar time and clock time).
 *
 * The equation of time accounts for Earth's elliptical orbit and axial tilt.
 * It varies from about -16 minutes to +16 minutes throughout the year.
 *
 * Formula from original Shollu implementation.
 *
 * @param dayOfYear - Day of year (1-365/366)
 * @returns Equation of time in minutes
 *
 * @example
 * ```ts
 * const eot = getEquationOfTime(100);
 * console.log(eot); // Minutes to adjust solar time
 * ```
 */
export const getEquationOfTime = (dayOfYear: number): number => {
  const bt = (2 * Math.PI * dayOfYear) / 365;

  const equationOfTime =
    229.18 *
    (0.000075 +
      0.001868 * Math.cos(bt) -
      0.032077 * Math.sin(bt) -
      0.014615 * Math.cos(2 * bt) -
      0.040849 * Math.sin(2 * bt));

  return equationOfTime;
};

/**
 * Calculates the hour angle for a given sun altitude.
 *
 * The hour angle determines when the sun reaches a specific altitude
 * (angle above/below the horizon). Used for calculating prayer times.
 *
 * Formula from original Shollu implementation.
 *
 * @param latitude - Geographic latitude in degrees
 * @param declination - Solar declination in degrees
 * @param altitude - Sun altitude in degrees (negative for below horizon)
 * @returns Hour angle in hours (time from solar noon)
 *
 * @example
 * ```ts
 * const angle = getHourAngle(-6.2088, 15.5, -18); // Fajr in Jakarta
 * console.log(angle); // Hours before solar noon
 * ```
 */
export const getHourAngle = (latitude: number, declination: number, altitude: number): number => {
  const latRad = degreesToRadians(latitude);
  const decRad = degreesToRadians(declination);
  const altRad = degreesToRadians(altitude);

  const cosH =
    (Math.sin(altRad) - Math.sin(decRad) * Math.sin(latRad)) /
    (Math.cos(decRad) * Math.cos(latRad));

  // Handle edge cases (polar regions where sun may not rise/set)
  if (cosH > 1) return 0; // Sun never rises
  if (cosH < -1) return 12; // Sun never sets

  const hourAngle = Math.acos(cosH);
  return radiansToDegrees(hourAngle) / 15; // Convert to hours
};

/**
 * Calculates sunrise/sunset hour angle with altitude correction.
 *
 * Accounts for atmospheric refraction and observer's altitude above sea level.
 *
 * Formula from original Shollu implementation.
 *
 * @param latitude - Geographic latitude in degrees
 * @param declination - Solar declination in degrees
 * @param altitude - Observer's altitude in meters
 * @returns Hour angle in hours
 *
 * @example
 * ```ts
 * const angle = getSunriseHourAngle(-6.2088, 15.5, 100);
 * console.log(angle); // Hours from solar noon to sunrise
 * ```
 */
export const getSunriseHourAngle = (
  latitude: number,
  declination: number,
  altitude: number
): number => {
  const latRad = degreesToRadians(latitude);
  const decRad = degreesToRadians(declination);

  // Altitude correction: -0.8333 degrees for refraction
  // Additional correction based on observer's altitude
  const altitudeCorrection = -0.8333 - 0.0347 * Math.sign(altitude) * Math.sqrt(Math.abs(altitude));

  const altRad = degreesToRadians(altitudeCorrection);

  const cosH =
    (Math.sin(altRad) - Math.sin(decRad) * Math.sin(latRad)) /
    (Math.cos(decRad) * Math.cos(latRad));

  if (cosH > 1) return 0;
  if (cosH < -1) return 12;

  const hourAngle = Math.acos(cosH);
  return radiansToDegrees(hourAngle) / 15;
};

/**
 * Calculates Asr hour angle based on shadow length.
 *
 * Asr time is when the shadow length equals the object length plus
 * the shadow at solar noon.
 *
 * - Standard (Shafi'i, Maliki, Hanbali): Shadow = object length
 * - Hanafi: Shadow = 2 × object length
 *
 * Formula from original Shollu implementation.
 *
 * @param latitude - Geographic latitude in degrees
 * @param declination - Solar declination in degrees
 * @param shadowFactor - Shadow length factor (1 for Standard, 2 for Hanafi)
 * @returns Hour angle in hours
 *
 * @example
 * ```ts
 * // Standard (Shafi'i) Asr
 * const asrStandard = getAsrHourAngle(-6.2088, 15.5, 1);
 *
 * // Hanafi Asr
 * const asrHanafi = getAsrHourAngle(-6.2088, 15.5, 2);
 * ```
 */
export const getAsrHourAngle = (
  latitude: number,
  declination: number,
  shadowFactor: number
): number => {
  const latRad = degreesToRadians(latitude);
  const decRad = degreesToRadians(declination);

  // Calculate sun altitude at Asr time
  const asrAltitude = Math.atan(1 / (shadowFactor + Math.tan(Math.abs(latRad - decRad))));

  const cosH =
    (Math.sin(asrAltitude) - Math.sin(decRad) * Math.sin(latRad)) /
    (Math.cos(decRad) * Math.cos(latRad));

  if (cosH > 1) return 0;
  if (cosH < -1) return 12;

  const hourAngle = Math.acos(cosH);
  return radiansToDegrees(hourAngle) / 15;
};
