import { useLingui } from '@lingui/react/macro';
import { SearchIcon } from 'lucide-react';
import * as React from 'react';

import { useSidebarData } from '@/components/layout/AppSidebar/useSidebarData.ts';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar
} from '@/components/ui/sidebar';
import { useSearch } from '@/utils/context';

import { AccountDropdownMenu } from './AccountDropdownMenu';
import { AppSidebarNavGroup } from './AppSidebarNavGroup';

export const AppSidebar = ({ ...props }: React.ComponentProps<typeof Sidebar>) => {
  const { t } = useLingui();
  const { setOpen } = useSearch();
  const { open } = useSidebar();
  const sidebarData = useSidebarData();

  return (
    <Sidebar collapsible='icon' {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem className='flex items-center justify-between'>
            <AccountDropdownMenu />
            {open && <SidebarTrigger />}
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton aria-label='Search' onClick={() => setOpen(true)}>
                <SearchIcon className='text-muted-foreground' />
                {t`Search`}
                <SidebarMenuBadge className='text-muted-foreground border'>⌘K</SidebarMenuBadge>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
        {sidebarData.navGroups.map((props, index) => (
          <AppSidebarNavGroup key={index} {...props} />
        ))}
      </SidebarContent>
    </Sidebar>
  );
};
