import type { LinkProps } from '@tanstack/react-router';
import type { ReactNode } from 'react';

import { useLingui } from '@lingui/react/macro';
import { Link, useLocation } from '@tanstack/react-router';
import { ChevronRight } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar
} from '@/components/ui/sidebar';

import type { NavCollapsible, NavGroup, NavItem, NavLink } from '../types';

export const AppSidebarNavGroup = ({ title, items, allowedRoles }: NavGroup) => {
  const { t } = useLingui();
  const { state } = useSidebar();

  const pathname = useLocation().pathname;

  const filteredItems = items.filter((item) => !item.allowedRoles);

  if (allowedRoles || !filteredItems.length) return;

  return (
    <SidebarGroup>
      {title && <SidebarGroupLabel>{t(title)}</SidebarGroupLabel>}
      <SidebarMenu>
        {filteredItems.map((item, index) => {
          const key = `${item.title}-${index}`;

          if (!item.items) return <SidebarMenuLink href={pathname} key={key} item={item} />;

          if (state === 'collapsed')
            return <SidebarMenuCollapsedDropdown href={pathname} key={key} item={item} />;

          return <SidebarMenuCollapsible href={pathname} key={key} item={item} />;
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
};

const NavBadge = ({ children }: { children: ReactNode }) => (
  <Badge className='h-[20px] max-w-full min-w-[20px] rounded-full px-1 text-xs'>{children}</Badge>
);

const SidebarMenuLink = ({ item, href }: { item: NavLink; href: string }) => {
  const { t } = useLingui();
  const { setOpenMobile } = useSidebar();
  return (
    <SidebarMenuItem>
      <SidebarMenuButton asChild isActive={checkIsActive(href, item)} tooltip={t(item.title)}>
        <Link params={item.params} onClick={() => setOpenMobile(false)} to={item.url}>
          {item.icon && <item.icon className='text-muted-foreground' />}
          <span>{t(item.title)}</span>
          {item.badge && <NavBadge>{item.badge}</NavBadge>}
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
};

const SidebarMenuCollapsible = ({ item, href }: { item: NavCollapsible; href: string }) => {
  const { t } = useLingui();
  const { setOpenMobile } = useSidebar();
  return (
    <Collapsible
      asChild
      className='group/collapsible'
      defaultOpen={checkIsActive(href, item, true)}
    >
      <SidebarMenuItem>
        <CollapsibleTrigger asChild>
          <SidebarMenuButton tooltip={t(item.title)}>
            {item.icon && <item.icon className='text-muted-foreground' />}
            <span>{t(item.title)}</span>
            {item.badge && <NavBadge>{item.badge}</NavBadge>}
            <ChevronRight className='ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90' />
          </SidebarMenuButton>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <SidebarMenuSub>
            {item.items.map((subItem) => (
              <SidebarMenuSubItem key={subItem.url}>
                <SidebarMenuSubButton asChild isActive={checkIsActive(href, subItem)}>
                  <Link
                    params={subItem.params}
                    onClick={() => setOpenMobile(false)}
                    to={subItem.url}
                  >
                    {subItem.icon && <subItem.icon className='text-muted-foreground' />}
                    <span className='flex-1 truncate text-nowrap'>{t(subItem.title)}</span>
                    {checkAndReturnBadgeVal(subItem.badge) && <NavBadge>{subItem.badge}</NavBadge>}
                  </Link>
                </SidebarMenuSubButton>
              </SidebarMenuSubItem>
            ))}
          </SidebarMenuSub>
        </CollapsibleContent>
      </SidebarMenuItem>
    </Collapsible>
  );
};

const SidebarMenuCollapsedDropdown = ({ item, href }: { item: NavCollapsible; href: string }) => {
  const { t } = useLingui();
  return (
    <SidebarMenuItem>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <SidebarMenuButton isActive={checkIsActive(href, item)} tooltip={t(item.title)}>
            {item.icon && <item.icon className='text-muted-foreground' />}
            <span>{t(item.title)}</span>
            {item.badge && <NavBadge>{item.badge}</NavBadge>}
            <ChevronRight className='ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90' />
          </SidebarMenuButton>
        </DropdownMenuTrigger>
        <DropdownMenuContent align='start' side='right' sideOffset={4}>
          <DropdownMenuLabel>
            {t(item.title)} {item.badge ? `(${item.badge})` : ''}
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          {item.items.map((sub) => (
            <DropdownMenuItem asChild key={`${sub.title}-${sub.url}`}>
              <Link
                className={`${checkIsActive(href, sub) ? 'bg-secondary' : ''}`}
                params={sub.params}
                to={sub.url}
              >
                {sub.icon && <sub.icon className='text-muted-foreground' />}
                <span className='max-w-52 text-wrap'>{t(sub.title)}</span>
                {checkAndReturnBadgeVal(sub.badge) && (
                  <span className='ml-auto text-xs'>
                    <Badge className='h-[20px] max-w-full min-w-[20px] rounded-full px-1'>
                      {String(sub.badge)}
                    </Badge>
                  </span>
                )}
              </Link>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </SidebarMenuItem>
  );
};

const checkAndReturnBadgeVal = (val: number | string | null | undefined): boolean =>
  !(val === undefined || val === null);

const resolve = (tpl?: string, p?: LinkProps['params']) => {
  if (!tpl || !p) return tpl;
  const dict = new Map<string, unknown>(Object.entries(p as Record<string, unknown>));
  return tpl.replace(/\$(\w+)/g, (m, k) => {
    const v = dict.get(k);
    return v == null ? m : encodeURIComponent(String(v));
  });
};

const startsWithSeg = (h: string, b?: string) =>
  !!b && (h === b || h.startsWith(b.endsWith('/') ? b : `${b}/`));

const firstSeg = (s?: string) => s?.split('/')[1] ?? '';

export function checkIsActive(href: string, item: Omit<NavItem, 'title'>, mainNav = false) {
  const url = resolve(item.url, item.params);
  return (
    startsWithSeg(href, url) ||
    item.items?.some((i) => resolve(i.url, i.params) === href) ||
    (mainNav && firstSeg(href) === firstSeg(url ?? item.url)) ||
    false
  );
}
