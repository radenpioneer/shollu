import { atom } from 'nanostores';

export type View = 'main' | 'schedule' | 'tasks' | 'settings' | 'converter' | 'about';

export const $currentView = atom<View>('main');

export const $sidebarOpen = atom<boolean>(true);

export function navigateTo(view: View) {
  $currentView.set(view);
}

export function toggleSidebar() {
  $sidebarOpen.set(!$sidebarOpen.get());
}
