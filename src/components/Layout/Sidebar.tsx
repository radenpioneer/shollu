import React from 'react';
import { useStore } from '@nanostores/react';
import { $currentView, navigateTo, type View } from '@/stores/ui';
import { Home, Calendar, CheckSquare, Settings, RefreshCw, Info } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * Navigation menu items configuration.
 */
const menuItems: { id: View; label: string; icon: typeof Home }[] = [
  { id: 'main', label: 'Prayer Times', icon: Home },
  { id: 'schedule', label: 'Schedule', icon: Calendar },
  { id: 'tasks', label: 'Tasks', icon: CheckSquare },
  { id: 'converter', label: 'Date Converter', icon: RefreshCw },
  { id: 'settings', label: 'Settings', icon: Settings },
  { id: 'about', label: 'About', icon: Info },
];

/**
 * Sidebar navigation component.
 * Displays the application logo and navigation menu with active state highlighting.
 *
 * @returns Sidebar navigation component
 */
const Sidebar = (): React.JSX.Element => {
  const currentView = useStore($currentView);

  return (
    <aside className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
      <div className="p-6">
        <h1 className="text-2xl font-bold text-primary-600">Shollu</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">Prayer Reminder</p>
      </div>

      <nav className="px-3 space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;

          return (
            <button
              key={item.id}
              onClick={() => navigateTo(item.id)}
              className={cn(
                'w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors',
                isActive
                  ? 'bg-primary-50 text-primary-700 dark:bg-primary-900/20 dark:text-primary-400'
                  : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
              )}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </button>
          );
        })}
      </nav>
    </aside>
  );
};

export default Sidebar;
