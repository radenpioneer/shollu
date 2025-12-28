import React from 'react';
import { useStore } from '@nanostores/react';
import { DateTime } from 'luxon';
import { $prayerTimes, $currentPrayer, $nextPrayer } from '@/stores/prayer-times';
import { $settings } from '@/stores/settings';
import { cn } from '@/lib/utils';

/**
 * Main page component displaying prayer times.
 * Shows all 6 prayer times with current prayer indicator and next prayer countdown.
 *
 * @returns Prayer times display component
 *
 * @example
 * ```tsx
 * <PrayerTimesDisplay />
 * ```
 */
const PrayerTimesDisplay = (): React.JSX.Element => {
  const times = useStore($prayerTimes);
  const currentPrayer = useStore($currentPrayer);
  const nextPrayer = useStore($nextPrayer);
  const settings = useStore($settings);

  /**
   * Formats time from HH:mm:ss to HH:mm.
   */
  const formatTime = (time: string): string => {
    return time.substring(0, 5); // Remove seconds
  };

  /**
   * Prayer time entries with names and times.
   */
  const prayers = [
    { name: 'Fajr', time: times.fajr, key: 'fajr' as const },
    { name: 'Sunrise', time: times.sunrise, key: 'sunrise' as const },
    { name: 'Dhuhr', time: times.dhuhr, key: 'dhuhr' as const },
    { name: 'Asr', time: times.asr, key: 'asr' as const },
    { name: 'Maghrib', time: times.maghrib, key: 'maghrib' as const },
    { name: 'Isha', time: times.isha, key: 'isha' as const },
  ];

  return (
    <div className="space-y-6">
      {/* Header with location and date */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Prayer Times</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {settings.location.name ||
              `${settings.location.latitude.toFixed(4)}, ${settings.location.longitude.toFixed(4)}`}
          </p>
        </div>
        <div className="text-right">
          <p className="text-sm font-medium text-gray-900 dark:text-white">
            {DateTime.now().setZone(settings.location.timezone).toFormat('EEEE')}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {DateTime.now().setZone(settings.location.timezone).toFormat('dd MMMM yyyy')}
          </p>
        </div>
      </div>

      {/* Next Prayer Card */}
      {nextPrayer && (
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg p-6 text-white shadow-lg">
          <p className="text-sm font-medium opacity-90">Next Prayer</p>
          <p className="text-3xl font-bold mt-1 capitalize">{nextPrayer.prayer}</p>
          <p className="text-2xl font-semibold mt-2">{formatTime(nextPrayer.time)}</p>
        </div>
      )}

      {/* Prayer Times Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {prayers.map((prayer) => (
          <div
            key={prayer.key}
            className={cn(
              'bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm transition-all',
              currentPrayer === prayer.key && 'ring-2 ring-blue-500 shadow-md'
            )}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                  {prayer.name}
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                  {formatTime(prayer.time)}
                </p>
              </div>
              {currentPrayer === prayer.key && (
                <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse" />
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Calculation Method Info */}
      <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4">
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Calculation Method: <span className="font-medium">{settings.calculationMethod}</span>
          {' • '}
          Asr: <span className="font-medium">{settings.asrCalculation}</span>
        </p>
      </div>
    </div>
  );
};

export default PrayerTimesDisplay;
