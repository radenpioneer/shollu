import React from 'react';
import { useStore } from '@nanostores/react';
import { $currentView } from '@/stores/ui';
import Sidebar from './Sidebar';
import Header from './Header';
import MainPage from '@/components/MainPage/PrayerTimesDisplay';
import ScheduleView from '@/components/Schedule/ScheduleView';
import TaskList from '@/components/Tasks/TaskList';
import SettingsPanel from '@/components/Settings/SettingsPanel';
import DateConverter from '@/components/Converter/DateConverter';
import AboutDialog from '@/components/About/AboutDialog';

/**
 * Main application layout component.
 * Provides the overall structure with sidebar, header, and content area.
 * Handles view routing based on current navigation state.
 *
 * @returns Application layout with navigation and content
 */
const AppLayout = (): React.JSX.Element => {
  const currentView = useStore($currentView);

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-6">
          {currentView === 'main' && <MainPage />}
          {currentView === 'schedule' && <ScheduleView />}
          {currentView === 'tasks' && <TaskList />}
          {currentView === 'settings' && <SettingsPanel />}
          {currentView === 'converter' && <DateConverter />}
          {currentView === 'about' && <AboutDialog />}
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
