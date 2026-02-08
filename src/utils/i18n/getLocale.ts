import Cookies from 'js-cookie';

import { COOKIES } from '@/utils/constants';
import { SOURCE_LOCALE } from '@/utils/i18n/config';

export const getLocale = () => {
  return Cookies.get(COOKIES.LOCALE) || SOURCE_LOCALE;
};
