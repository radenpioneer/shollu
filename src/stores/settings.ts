import { map } from 'nanostores';
import { AppSettings, defaultSettings } from '@/types/settings';

/**
 * Global store for application settings.
 * Contains location, calculation method, appearance, and behavior settings.
 */
export const $settings = map<AppSettings>(defaultSettings);

/**
 * Updates application settings with partial values.
 * Merges new settings with existing ones.
 *
 * @param partial - Partial settings object to update
 *
 * @example
 * ```ts
 * updateSettings({ theme: 'dark', language: 'id' });
 * ```
 */
export const updateSettings = (partial: Partial<AppSettings>): void => {
  const current = $settings.get();
  $settings.set({ ...current, ...partial });
};
