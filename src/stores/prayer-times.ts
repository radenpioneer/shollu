import { atom, map, computed } from 'nanostores';
import { DateTime } from 'luxon';
import { PrayerTimes, PrayerName } from '@/types/prayer';

export const $currentTime = atom<DateTime>(DateTime.now());

export const $prayerTimes = map<PrayerTimes>({
  date: DateTime.now().toISODate() || '',
  fajr: '',
  sunrise: '',
  dhuhr: '',
  asr: '',
  maghrib: '',
  isha: '',
});

export const $currentPrayer = computed(
  [$prayerTimes, $currentTime],
  (_times, _now): PrayerName | null => {
    // Will implement logic later
    return null;
  }
);

export const $nextPrayer = computed([$prayerTimes, $currentTime], (_times, _now) => {
  // Will implement logic later
  return null;
});

// Update current time every second
if (typeof window !== 'undefined') {
  setInterval(() => {
    $currentTime.set(DateTime.now());
  }, 1000);
}
