import { atom } from 'nanostores';

/**
 * Available views in the application.
 */
export type View = 'main' | 'schedule' | 'tasks' | 'settings' | 'converter' | 'about';

/**
 * Global store for current active view.
 * Determines which component is displayed in the main content area.
 */
export const $currentView = atom<View>('main');

/**
 * Global store for sidebar visibility state.
 */
export const $sidebarOpen = atom<boolean>(true);

/**
 * Navigates to a different view in the application.
 *
 * @param view - View name to navigate to
 *
 * @example
 * ```ts
 * navigateTo('settings');
 * ```
 */
export const navigateTo = (view: View): void => {
  $currentView.set(view);
};

/**
 * Toggles the sidebar open/closed state.
 *
 * @example
 * ```ts
 * toggleSidebar(); // Opens if closed, closes if open
 * ```
 */
export const toggleSidebar = (): void => {
  $sidebarOpen.set(!$sidebarOpen.get());
};
