import { map } from 'nanostores';
import { AppSettings, defaultSettings } from '@/types/settings';

export const $settings = map<AppSettings>(defaultSettings);

export function updateSettings(partial: Partial<AppSettings>) {
  const current = $settings.get();
  $settings.set({ ...current, ...partial });
}
