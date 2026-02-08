import React from 'react';

import { cn } from '@/lib/utils.ts';

interface MainProps extends React.ComponentProps<'main'> {}

export const PageContent = ({ ref, className, ...props }: MainProps) => {
  return (
    <main
      ref={ref}
      className={cn('bg-background flex-1 overflow-y-auto p-4', className)}
      {...props}
    />
  );
};
