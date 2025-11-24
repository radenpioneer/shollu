import React from 'react';
/**
 * Main page component displaying prayer times.
 * Shows all 6 prayer times, current prayer indicator, and next prayer countdown.
 * Will be fully implemented in Phase 2.
 *
 * @returns Prayer times display component
 */
const PrayerTimesDisplay = (): React.JSX.Element => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Prayer Times</h2>
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
        <p className="text-gray-500 dark:text-gray-400">Prayer times will be displayed here...</p>
      </div>
    </div>
  );
};

export default PrayerTimesDisplay;
