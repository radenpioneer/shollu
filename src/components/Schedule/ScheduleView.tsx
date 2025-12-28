import React from 'react';
/**
 * Schedule view component.
 * Displays prayer times for yesterday, today, and tomorrow.
 * Includes calendar navigation and print functionality.
 * Will be implemented in Phase 3.
 *
 * @returns Schedule view component
 */
const ScheduleView = (): React.JSX.Element => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Prayer Schedule</h2>
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
        <p className="text-gray-500 dark:text-gray-400">
          Schedule for yesterday, today, and tomorrow will be displayed here...
        </p>
      </div>
    </div>
  );
};

export default ScheduleView;
