import type { DateArg } from 'date-fns';
import type { FormatOptions } from 'date-fns/format';

import { format } from 'date-fns';
import { ru } from 'date-fns/locale/ru';
import { uz } from 'date-fns/locale/uz';
import { uzCyrl } from 'date-fns/locale/uz-Cyrl';
import Cookies from 'js-cookie';

import type { Locale } from '@/utils/i18n';

import { COOKIES } from '@/utils/constants';
import { SOURCE_LOCALE } from '@/utils/i18n';

export const formatPhoneNumber = (phoneNumber: string) =>
  phoneNumber.replace(/(\d{3})(\d{2})(\d{3})(\d{2})(\d{2})/, '$1 ($2) $3 $4 $5');

export const formatPrice = (price: number | string) =>
  price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');

const localeMap = {
  en: undefined,
  ru,
  uz,
  'uz-Cyrl': uzCyrl
};

export const formatLocaleDate = (
  date: DateArg<Date> & {},
  formatStr: string,
  options?: FormatOptions
) => {
  const locale = (Cookies.get(COOKIES.LOCALE) || SOURCE_LOCALE) as Locale;
  return format(date, formatStr, { locale: localeMap[locale], ...options });
};

export function formatDateToString(date: Date) {
  return format(date, 'yyyy-MM-dd');
}

export function formatDateTimeToString(date: Date) {
  return format(date, "yyyy-MM-dd'T'HH:mm:ss");
}

export function formatDate(
  date: number | string | Date | undefined,
  opts: Intl.DateTimeFormatOptions = {}
) {
  if (!date) return '';

  try {
    return new Intl.DateTimeFormat('en-US', {
      month: opts.month ?? 'long',
      day: opts.day ?? 'numeric',
      year: opts.year ?? 'numeric',
      ...opts
    }).format(new Date(date));
  } catch (_err) {
    console.error(_err);
    return '';
  }
}
