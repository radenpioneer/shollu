/**
 * Supported languages for the application.
 * Includes English, Indonesian, Arabic, Javanese, and Sundanese.
 */
export type Language = 'en' | 'id' | 'ar' | 'jv' | 'su';

/**
 * Time display format options.
 * 12h: 12-hour format with AM/PM
 * 24h: 24-hour format
 */
export type TimeFormat = '12h' | '24h';

/**
 * Application theme options.
 * light: Light mode
 * dark: Dark mode
 * system: Follow system preference
 */
export type Theme = 'light' | 'dark' | 'system';
