import React from 'react';
/**
 * About dialog component.
 * Displays application information, version, credits, and license.
 *
 * @returns About dialog component
 */
const AboutDialog = (): React.JSX.Element => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">About Shollu</h2>
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Shollu v4.0.0</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">Islamic Prayer Time Reminder</p>
          </div>
          <div>
            <p className="text-gray-700 dark:text-gray-300">
              A modern, cross-platform prayer time reminder application built with Tauri, React, and
              TypeScript.
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Original Shollu © 2005-2012 Ebta Setiawan (ebsoft)
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Rewrite © 2024 - Built with modern technologies
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutDialog;
