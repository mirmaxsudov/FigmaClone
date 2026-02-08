import Cookies from 'js-cookie';

import type { Locale } from '@/utils/i18n/config';

import { COOKIES } from '@/utils/constants';
import { APP_LOCALES, SOURCE_LOCALE } from '@/utils/i18n/config';
import { dynamicActivate } from '@/utils/i18n/dynamicActivate';

export const initialI18nActivate = () => {
  const locale = (Cookies.get(COOKIES.LOCALE) || SOURCE_LOCALE) as Locale;

  if (APP_LOCALES.includes(locale)) {
    Cookies.set(COOKIES.LOCALE, locale, { expires: 365 });
  } else {
    Cookies.set(COOKIES.LOCALE, SOURCE_LOCALE, { expires: 365 });
  }

  dynamicActivate(locale);
};
