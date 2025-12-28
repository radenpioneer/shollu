import { describe, it, expect, beforeEach } from 'vitest';
import { $settings, updateSettings } from './settings';
import { defaultSettings } from '@/types/settings';

describe('Settings Store', () => {
  beforeEach(() => {
    // Reset to default settings
    $settings.set(defaultSettings);
  });

  describe('$settings store', () => {
    it('should have default settings initially', () => {
      const settings = $settings.get();
      expect(settings).toEqual(defaultSettings);
    });

    it('should have correct default location (Jakarta)', () => {
      const settings = $settings.get();
      expect(settings.location.name).toBe('Jakarta');
      expect(settings.location.latitude).toBe(-6.2088);
      expect(settings.location.longitude).toBe(106.8456);
      expect(settings.location.timezone).toBe('Asia/Jakarta');
    });

    it('should have correct default calculation method (MWL)', () => {
      const settings = $settings.get();
      expect(settings.calculationMethod).toBe('MWL');
    });

    it('should have correct default Asr calculation (Standard)', () => {
      const settings = $settings.get();
      expect(settings.asrCalculation).toBe('Standard');
    });

    it('should have all prayer adjustments set to 0', () => {
      const settings = $settings.get();
      expect(settings.adjustments.fajr).toBe(0);
      expect(settings.adjustments.sunrise).toBe(0);
      expect(settings.adjustments.dhuhr).toBe(0);
      expect(settings.adjustments.asr).toBe(0);
      expect(settings.adjustments.maghrib).toBe(0);
      expect(settings.adjustments.isha).toBe(0);
    });

    it('should have notifications enabled by default', () => {
      const settings = $settings.get();
      expect(settings.notificationsEnabled).toBe(true);
      expect(settings.adzanEnabled).toBe(true);
    });

    it('should have correct default theme (system)', () => {
      const settings = $settings.get();
      expect(settings.theme).toBe('system');
    });

    it('should have correct default language (en)', () => {
      const settings = $settings.get();
      expect(settings.language).toBe('en');
    });
  });

  describe('updateSettings action', () => {
    it('should update single setting', () => {
      updateSettings({ theme: 'dark' });
      const settings = $settings.get();
      expect(settings.theme).toBe('dark');
    });

    it('should update multiple settings', () => {
      updateSettings({
        theme: 'dark',
        language: 'id',
        timeFormat: '12h',
      });

      const settings = $settings.get();
      expect(settings.theme).toBe('dark');
      expect(settings.language).toBe('id');
      expect(settings.timeFormat).toBe('12h');
    });

    it('should preserve other settings when updating', () => {
      updateSettings({ theme: 'dark' });

      const settings = $settings.get();
      expect(settings.theme).toBe('dark');
      expect(settings.language).toBe('en'); // Should remain unchanged
      expect(settings.calculationMethod).toBe('MWL'); // Should remain unchanged
    });

    it('should update location settings', () => {
      updateSettings({
        location: {
          name: 'Mecca',
          latitude: 21.4225,
          longitude: 39.8262,
          timezone: 'Asia/Riyadh',
          country: 'Saudi Arabia',
        },
      });

      const settings = $settings.get();
      expect(settings.location.name).toBe('Mecca');
      expect(settings.location.latitude).toBe(21.4225);
      expect(settings.location.longitude).toBe(39.8262);
    });

    it('should update calculation method', () => {
      updateSettings({ calculationMethod: 'ISNA' });
      expect($settings.get().calculationMethod).toBe('ISNA');
    });

    it('should update Asr calculation method', () => {
      updateSettings({ asrCalculation: 'Hanafi' });
      expect($settings.get().asrCalculation).toBe('Hanafi');
    });

    it('should update prayer adjustments', () => {
      updateSettings({
        adjustments: {
          fajr: 2,
          sunrise: 0,
          dhuhr: -1,
          asr: 3,
          maghrib: 0,
          isha: 1,
        },
      });

      const settings = $settings.get();
      expect(settings.adjustments.fajr).toBe(2);
      expect(settings.adjustments.dhuhr).toBe(-1);
      expect(settings.adjustments.asr).toBe(3);
      expect(settings.adjustments.isha).toBe(1);
    });

    it('should update notification settings', () => {
      updateSettings({
        notificationsEnabled: false,
        adzanEnabled: false,
        adzanVolume: 50,
      });

      const settings = $settings.get();
      expect(settings.notificationsEnabled).toBe(false);
      expect(settings.adzanEnabled).toBe(false);
      expect(settings.adzanVolume).toBe(50);
    });

    it('should update behavior settings', () => {
      updateSettings({
        autoStart: true,
        minimizeToTray: false,
      });

      const settings = $settings.get();
      expect(settings.autoStart).toBe(true);
      expect(settings.minimizeToTray).toBe(false);
    });

    it('should handle multiple sequential updates', () => {
      updateSettings({ theme: 'dark' });
      updateSettings({ language: 'id' });
      updateSettings({ calculationMethod: 'ISNA' });

      const settings = $settings.get();
      expect(settings.theme).toBe('dark');
      expect(settings.language).toBe('id');
      expect(settings.calculationMethod).toBe('ISNA');
    });
  });
});
