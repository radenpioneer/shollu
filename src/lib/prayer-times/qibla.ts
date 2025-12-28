import type { Location } from '@/types/prayer';

/**
 * Kaaba location in Mecca, Saudi Arabia.
 * This is the direction Muslims face during prayer.
 */
export const KAABA_LOCATION = {
  latitude: 21.4225,
  longitude: 39.8262,
} as const;

/**
 * Converts degrees to radians.
 *
 * @param degrees - Angle in degrees
 * @returns Angle in radians
 */
const degreesToRadians = (degrees: number): number => {
  return (degrees * Math.PI) / 180;
};

/**
 * Converts radians to degrees.
 *
 * @param radians - Angle in radians
 * @returns Angle in degrees
 */
const radiansToDegrees = (radians: number): number => {
  return (radians * 180) / Math.PI;
};

/**
 * Calculates the Qibla direction from a given location.
 *
 * The Qibla is the direction towards the Kaaba in Mecca that Muslims
 * face during prayer. This function calculates the bearing (angle from
 * north) to the Kaaba from any location on Earth.
 *
 * Uses the great circle formula for accurate calculation on a sphere.
 *
 * @param location - Geographic location to calculate Qibla from
 * @returns Qibla direction in degrees from north (0-360)
 *
 * @example
 * ```ts
 * const qibla = calculateQiblaDirection({
 *   name: 'Jakarta',
 *   latitude: -6.2088,
 *   longitude: 106.8456,
 *   timezone: 'Asia/Jakarta',
 * });
 *
 * console.log(qibla); // ~295 degrees (northwest)
 * ```
 */
export const calculateQiblaDirection = (location: Location): number => {
  const { latitude: lat1, longitude: lon1 } = location;
  const { latitude: lat2, longitude: lon2 } = KAABA_LOCATION;

  // Convert to radians
  const lat1Rad = degreesToRadians(lat1);
  const lat2Rad = degreesToRadians(lat2);
  const deltaLon = degreesToRadians(lon2 - lon1);

  // Calculate bearing using great circle formula
  // Formula: atan2(sin(Δlong)⋅cos(lat2), cos(lat1)⋅sin(lat2) − sin(lat1)⋅cos(lat2)⋅cos(Δlong))
  const y = Math.sin(deltaLon) * Math.cos(lat2Rad);
  const x =
    Math.cos(lat1Rad) * Math.sin(lat2Rad) -
    Math.sin(lat1Rad) * Math.cos(lat2Rad) * Math.cos(deltaLon);

  let bearing = Math.atan2(y, x);

  // Convert to degrees
  bearing = radiansToDegrees(bearing);

  // Normalize to 0-360 range
  bearing = (bearing + 360) % 360;

  return bearing;
};

/**
 * Calculates the distance to Kaaba from a given location.
 *
 * Uses the Haversine formula to calculate the great circle distance
 * between two points on Earth.
 *
 * @param location - Geographic location to calculate distance from
 * @returns Distance to Kaaba in kilometers
 *
 * @example
 * ```ts
 * const distance = calculateDistanceToKaaba({
 *   name: 'Jakarta',
 *   latitude: -6.2088,
 *   longitude: 106.8456,
 *   timezone: 'Asia/Jakarta',
 * });
 *
 * console.log(distance); // ~7,800 km
 * ```
 */
export const calculateDistanceToKaaba = (location: Location): number => {
  const { latitude: lat1, longitude: lon1 } = location;
  const { latitude: lat2, longitude: lon2 } = KAABA_LOCATION;

  // Earth's radius in kilometers
  const R = 6371;

  // Convert to radians
  const lat1Rad = degreesToRadians(lat1);
  const lat2Rad = degreesToRadians(lat2);
  const deltaLat = degreesToRadians(lat2 - lat1);
  const deltaLon = degreesToRadians(lon2 - lon1);

  // Haversine formula
  const a =
    Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
    Math.cos(lat1Rad) * Math.cos(lat2Rad) * Math.sin(deltaLon / 2) * Math.sin(deltaLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  const distance = R * c;

  return Math.round(distance);
};

/**
 * Converts Qibla direction to compass direction name.
 *
 * @param degrees - Qibla direction in degrees (0-360)
 * @returns Compass direction name (e.g., "North", "Northwest", "West")
 *
 * @example
 * ```ts
 * getCompassDirection(0);    // "North"
 * getCompassDirection(45);   // "Northeast"
 * getCompassDirection(295);  // "Northwest"
 * ```
 */
export const getCompassDirection = (degrees: number): string => {
  const directions = [
    'North',
    'North-Northeast',
    'Northeast',
    'East-Northeast',
    'East',
    'East-Southeast',
    'Southeast',
    'South-Southeast',
    'South',
    'South-Southwest',
    'Southwest',
    'West-Southwest',
    'West',
    'West-Northwest',
    'Northwest',
    'North-Northwest',
  ];

  const index = Math.round(degrees / 22.5) % 16;
  return directions[index] || 'North';
};

/**
 * Formats Qibla direction as degrees, minutes, seconds.
 *
 * @param degrees - Qibla direction in decimal degrees
 * @returns Formatted string in DMS format (e.g., "295° 30' 15\"")
 *
 * @example
 * ```ts
 * formatQiblaDMS(295.5042); // "295° 30' 15\""
 * ```
 */
export const formatQiblaDMS = (degrees: number): string => {
  const d = Math.floor(degrees);
  const minFloat = (degrees - d) * 60;
  const m = Math.floor(minFloat);
  const s = Math.floor((minFloat - m) * 60);

  return `${d}° ${m}' ${s}"`;
};
