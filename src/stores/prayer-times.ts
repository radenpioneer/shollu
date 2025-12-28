import { atom, map, computed } from 'nanostores';
import { DateTime } from 'luxon';
import { PrayerTimes, PrayerName } from '@/types/prayer';
import { calculatePrayerTimes } from '@/lib/prayer-times/calculator';
import { $settings } from './settings';

/**
 * Current time atom, updated every second.
 * Used for determining current/next prayer and countdown timers.
 */
export const $currentTime = atom<DateTime>(DateTime.now());

/**
 * Prayer times for the current date.
 * Automatically recalculates when settings change (location, method, adjustments).
 */
export const $prayerTimes = map<PrayerTimes>({
  date: DateTime.now().toISODate() || '',
  fajr: '',
  sunrise: '',
  dhuhr: '',
  asr: '',
  maghrib: '',
  isha: '',
});

/**
 * Calculates and updates prayer times based on current settings.
 * Called when settings change or date changes.
 *
 * @param date - Date to calculate prayer times for (defaults to today)
 *
 * @example
 * ```ts
 * updatePrayerTimes(); // Calculate for today
 * updatePrayerTimes(DateTime.now().plus({ days: 1 })); // Calculate for tomorrow
 * ```
 */
export const updatePrayerTimes = (date?: DateTime): void => {
  const settings = $settings.get();
  const targetDate = date || DateTime.now().setZone(settings.location.timezone);

  const times = calculatePrayerTimes({
    date: targetDate,
    location: settings.location,
    method: settings.calculationMethod,
    asrMethod: settings.asrCalculation,
    adjustments: settings.adjustments,
  });

  $prayerTimes.set(times);
};

/**
 * Computed store for the current prayer.
 * Returns which prayer time period we are currently in.
 */
export const $currentPrayer = computed(
  [$prayerTimes, $currentTime],
  (times, now): PrayerName | null => {
    const currentTimeStr = now.toFormat('HH:mm:ss');

    // Check each prayer in order
    if (currentTimeStr >= times.isha) return 'isha';
    if (currentTimeStr >= times.maghrib) return 'maghrib';
    if (currentTimeStr >= times.asr) return 'asr';
    if (currentTimeStr >= times.dhuhr) return 'dhuhr';
    if (currentTimeStr >= times.sunrise) return 'sunrise';
    if (currentTimeStr >= times.fajr) return 'fajr';

    // Before Fajr, we're in Isha period from previous day
    return 'isha';
  }
);

/**
 * Computed store for the next prayer.
 * Returns the next upcoming prayer and its time.
 */
export const $nextPrayer = computed(
  [$prayerTimes, $currentTime],
  (times, now): { prayer: PrayerName; time: string } | null => {
    const currentTimeStr = now.toFormat('HH:mm:ss');

    // Check each prayer in order
    if (currentTimeStr < times.fajr) return { prayer: 'fajr', time: times.fajr };
    if (currentTimeStr < times.sunrise) return { prayer: 'sunrise', time: times.sunrise };
    if (currentTimeStr < times.dhuhr) return { prayer: 'dhuhr', time: times.dhuhr };
    if (currentTimeStr < times.asr) return { prayer: 'asr', time: times.asr };
    if (currentTimeStr < times.maghrib) return { prayer: 'maghrib', time: times.maghrib };
    if (currentTimeStr < times.isha) return { prayer: 'isha', time: times.isha };

    // After Isha, next prayer is Fajr tomorrow
    return { prayer: 'fajr', time: times.fajr };
  }
);

// Update current time every second
if (typeof window !== 'undefined') {
  setInterval(() => {
    $currentTime.set(DateTime.now());
  }, 1000);
}

// Recalculate prayer times when settings change
$settings.subscribe(() => {
  updatePrayerTimes();
});

// Initial calculation
updatePrayerTimes();
