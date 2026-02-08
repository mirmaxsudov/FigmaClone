import type { LinkProps } from '@tanstack/react-router';

import { Link } from '@tanstack/react-router';
import React from 'react';

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from '@/components/ui/breadcrumb.tsx';
import { SidebarTrigger, useSidebar } from '@/components/ui/sidebar.tsx';
import { useIsMobile } from '@/hooks/use-mobile.ts';
import { cn } from '@/lib/utils.ts';

interface AppHeaderProps extends React.ComponentProps<'header'> {
  children?: React.ReactNode;
  pageIcon?: React.ElementType;
  pageTitle?: string | React.ReactNode;
  breadcrumbs?: {
    label: string;
    href?: LinkProps['to'];
    params?: LinkProps['params'];
    icon?: React.ElementType;
  }[];
}

export const PageHeader = ({
  ref,
  pageIcon: PageIcon,
  pageTitle,
  className,
  children,
  breadcrumbs,
  ...props
}: AppHeaderProps) => {
  const { open } = useSidebar();
  const isMobile = useIsMobile();
  return (
    <header
      ref={ref}
      className={cn(
        'rounded-t-x bg-background sticky top-0 z-50 flex h-16 items-center gap-2 border-b px-2',
        className
      )}
      {...props}
    >
      {(!open || isMobile) && <SidebarTrigger />}
      <div className='min-w-0 flex-1 pl-1'>
        <div className='flex items-center gap-2'>
          {PageIcon && <PageIcon className='size-4 shrink-0' />}
          {pageTitle && <span className='truncate font-medium'>{pageTitle}</span>}
          {!pageTitle && breadcrumbs && (
            <Breadcrumb className='min-w-0 flex-1'>
              <BreadcrumbList className='flex-nowrap'>
                {breadcrumbs.map((breadcrumb, index) => (
                  <React.Fragment key={breadcrumb.label}>
                    <BreadcrumbItem className='min-w-0'>
                      {breadcrumb.href ? (
                        <BreadcrumbLink asChild>
                          <Link params={breadcrumb.params} to={breadcrumb.href}>
                            {breadcrumb.icon && <breadcrumb.icon className='size-4 shrink-0' />}
                            <span className='max-w-sm min-w-0 truncate'>{breadcrumb.label}</span>
                          </Link>
                        </BreadcrumbLink>
                      ) : (
                        <BreadcrumbPage>
                          {breadcrumb.icon && <breadcrumb.icon className='size-4 shrink-0' />}
                          <span className='max-w-sm min-w-0 truncate'>{breadcrumb.label}</span>
                        </BreadcrumbPage>
                      )}
                    </BreadcrumbItem>
                    {index < breadcrumbs.length - 1 && <BreadcrumbSeparator />}
                  </React.Fragment>
                ))}
              </BreadcrumbList>
            </Breadcrumb>
          )}
        </div>
      </div>
      <div className='flex items-center gap-2'>{children}</div>
    </header>
  );
};
PageHeader.displayName = 'AppHeader';
