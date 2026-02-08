import { defineConfig } from '@lingui/cli';

export default defineConfig({
  sourceLocale: 'en',
  locales: ['uz', 'ru', 'en', 'uz-Cyrl'],
  catalogs: [
    {
      path: '<rootDir>/src/utils/i18n/locales/{locale}/messages',
      include: ['src']
    }
  ],
  format: 'po',
  service: {
    name: 'TranslationIO',
    apiKey: '89ce5c48a29044ab8a100183df2e9b6b'
  }
});
