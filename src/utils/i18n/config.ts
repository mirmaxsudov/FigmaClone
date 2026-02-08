const APP_LOCALES = ['uz', 'ru', 'en', 'uz-Cyrl'] as const;
const SOURCE_LOCALE = 'uz';

export type Locale = (typeof APP_LOCALES)[number];

export { APP_LOCALES, SOURCE_LOCALE };
