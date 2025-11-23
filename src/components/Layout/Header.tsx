import { useStore } from '@nanostores/react';
import { $currentTime } from '@/stores/prayer-times';

export default function Header() {
  const currentTime = useStore($currentTime);

  return (
    <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            {currentTime.toFormat('cccc, dd MMMM yyyy')}
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {currentTime.toFormat('HH:mm:ss')}
          </p>
        </div>

        <div className="flex items-center gap-4">
          {/* Will add theme toggle, notifications, etc. */}
        </div>
      </div>
    </header>
  );
}
