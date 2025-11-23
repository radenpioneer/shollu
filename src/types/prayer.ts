import { DateTime } from 'luxon';

export type PrayerName = 'fajr' | 'sunrise' | 'dhuhr' | 'asr' | 'maghrib' | 'isha';

export interface PrayerTime {
  name: PrayerName;
  time: DateTime;
  displayTime: string;
}

export interface PrayerTimes {
  date: string;
  fajr: string;
  sunrise: string;
  dhuhr: string;
  asr: string;
  maghrib: string;
  isha: string;
}

export type CalculationMethod =
  | 'MWL' // Muslim World League
  | 'ISNA' // Islamic Society of North America
  | 'Egypt' // Egyptian General Authority of Survey
  | 'Makkah' // Umm Al-Qura University, Makkah
  | 'Karachi' // University of Islamic Sciences, Karachi
  | 'Tehran' // Institute of Geophysics, University of Tehran
  | 'Jafari'; // Shia Ithna-Ashari, Leva Institute, Qum

export type AsrCalculation = 'Standard' | 'Hanafi';

export interface Location {
  name: string;
  latitude: number;
  longitude: number;
  timezone: string;
  country?: string;
}

export interface PrayerAdjustments {
  fajr: number;
  sunrise: number;
  dhuhr: number;
  asr: number;
  maghrib: number;
  isha: number;
}
