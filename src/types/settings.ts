import { Language, TimeFormat, Theme } from './common';
import { CalculationMethod, AsrCalculation, Location, PrayerAdjustments } from './prayer';

export interface AppSettings {
  // Location
  location: Location;
  altitude: number;

  // Prayer calculation
  calculationMethod: CalculationMethod;
  asrCalculation: AsrCalculation;
  adjustments: PrayerAdjustments;

  // Notifications
  notificationsEnabled: boolean;
  adzanEnabled: boolean;
  adzanFile: string;
  adzanVolume: number;
  duaAfterAdzan: boolean;
  duaFile: string;

  // Appearance
  theme: Theme;
  language: Language;
  timeFormat: TimeFormat;

  // Behavior
  autoStart: boolean;
  minimizeToTray: boolean;
  showDropZone: boolean;
  dropZoneTransparent: boolean;

  // Advanced
  hijriAdjustment: number;
}

export const defaultSettings: AppSettings = {
  location: {
    name: 'Jakarta',
    latitude: -6.2088,
    longitude: 106.8456,
    timezone: 'Asia/Jakarta',
    country: 'Indonesia',
  },
  altitude: 0,
  calculationMethod: 'MWL',
  asrCalculation: 'Standard',
  adjustments: {
    fajr: 0,
    sunrise: 0,
    dhuhr: 0,
    asr: 0,
    maghrib: 0,
    isha: 0,
  },
  notificationsEnabled: true,
  adzanEnabled: true,
  adzanFile: '',
  adzanVolume: 80,
  duaAfterAdzan: false,
  duaFile: '',
  theme: 'system',
  language: 'en',
  timeFormat: '24h',
  autoStart: false,
  minimizeToTray: true,
  showDropZone: false,
  dropZoneTransparent: false,
  hijriAdjustment: 0,
};
