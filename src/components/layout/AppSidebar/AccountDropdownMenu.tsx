import { useLingui } from '@lingui/react/macro';
import {
  CheckIcon,
  ChevronDown,
  LanguagesIcon,
  LogOutIcon,
  MoonIcon,
  SunIcon,
  SunMoonIcon
} from 'lucide-react';
import { useEffect } from 'react';

import type { Locale } from '@/utils/i18n';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { SidebarMenuButton } from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';
import { useTheme } from '@/utils/context';
import { dynamicActivate, getLocale } from '@/utils/i18n';
import { localeOptions } from '@/utils/i18n/constants.ts';

export const AccountDropdownMenu = () => {
  const { t } = useLingui();
  const { theme, setTheme } = useTheme();
  const currentLocale = getLocale();

  useEffect(() => {
    const themeColor = theme === 'dark' ? '#020817' : '#fff';
    const metaThemeColor = document.querySelector("meta[name='theme-color']");
    if (metaThemeColor) metaThemeColor.setAttribute('content', themeColor);
  }, [theme]);

  const onLocaleChange = async (locale: Locale) => {
    await dynamicActivate(locale);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <SidebarMenuButton className='w-fit p-1.5 group-data-[collapsible=icon]:p-1.5!'>
          {/*<img alt='logo' className='size-6 shrink-0 rounded-xs' src='/favicon.ico' />*/}
          <span className='truncate font-semibold'>Mockdock</span>
          <ChevronDown className='opacity-50' />
        </SidebarMenuButton>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='start' className='w-52 rounded-lg' side='top'>
        <DropdownMenuLabel className='text-sidebar-foreground/70 flex items-center gap-2'>
          {/*<img alt='logo' className='size-5 shrink-0 rounded-xs' src='/favicon.ico' />*/}
          <span className='truncate font-semibold'>Mockdock</span>
        </DropdownMenuLabel>
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>
            <SunMoonIcon className='text-muted-foreground mr-2 size-4' />
            {t`Theme`}
          </DropdownMenuSubTrigger>
          <DropdownMenuPortal>
            <DropdownMenuSubContent>
              <DropdownMenuItem onClick={() => setTheme('light')}>
                <SunIcon />
                {t`Light`}
                <CheckIcon className={cn('ml-auto size-3.5', theme !== 'light' && 'hidden')} />
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setTheme('dark')}>
                <MoonIcon />
                {t`Dark`}
                <CheckIcon className={cn('ml-auto size-3.5', theme !== 'dark' && 'hidden')} />
              </DropdownMenuItem>
            </DropdownMenuSubContent>
          </DropdownMenuPortal>
        </DropdownMenuSub>
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>
            <LanguagesIcon className='text-muted-foreground mr-2 size-4' />
            {t`Language`}
          </DropdownMenuSubTrigger>
          <DropdownMenuPortal>
            <DropdownMenuSubContent>
              {localeOptions.map((locale) => (
                <DropdownMenuItem key={locale.value} onClick={() => onLocaleChange(locale.value)}>
                  {locale.label}
                  <CheckIcon
                    className={cn('ml-auto size-3.5', locale.value !== currentLocale && 'hidden')}
                  />
                </DropdownMenuItem>
              ))}
            </DropdownMenuSubContent>
          </DropdownMenuPortal>
        </DropdownMenuSub>
        <DropdownMenuSeparator />
        <DropdownMenuItem variant='destructive' onClick={() => {}}>
          <LogOutIcon />
          {t`Logout`}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
