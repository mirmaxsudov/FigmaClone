import * as React from 'react';

import { cn } from '@/lib/utils';

const Table = ({ className, ...props }: React.ComponentProps<'table'>) => {
  return (
    <div className='relative w-full overflow-x-auto' data-slot='table-container'>
      <table
        className={cn('w-full caption-bottom text-sm', className)}
        data-slot='table'
        {...props}
      />
    </div>
  );
};

const TableHeader = ({ className, ...props }: React.ComponentProps<'thead'>) => {
  return <thead className={cn('border-t', className)} data-slot='table-header' {...props} />;
};

const TableBody = ({ className, ...props }: React.ComponentProps<'tbody'>) => {
  return <tbody className={cn(className)} data-slot='table-body' {...props} />;
};

const TableFooter = ({ className, ...props }: React.ComponentProps<'tfoot'>) => {
  return (
    <tfoot
      className={cn('bg-muted/50 border-t font-medium [&>tr]:last:border-b-0', className)}
      data-slot='table-footer'
      {...props}
    />
  );
};

const TableRow = ({ className, ...props }: React.ComponentProps<'tr'>) => {
  return (
    <tr
      className={cn('data-[state=selected]:bg-primary/5 border-b transition-colors', className)}
      data-slot='table-row'
      {...props}
    />
  );
};

const TableHead = ({ className, ...props }: React.ComponentProps<'th'>) => {
  return (
    <th
      className={cn(
        'text-muted-foreground h-8 border-r px-2 text-left align-middle font-medium whitespace-nowrap last:border-r-0 [&:has([role=checkbox])]:border-r-0 [&>[role=checkbox]]:translate-y-[2px]',
        className
      )}
      data-slot='table-head'
      {...props}
    />
  );
};

const TableCell = ({ className, ...props }: React.ComponentProps<'td'>) => {
  return (
    <td
      className={cn(
        'border-r px-2 py-1 align-middle whitespace-nowrap last:border-r-0 [&:has([role=checkbox])]:border-r-0 [&>[role=checkbox]]:translate-y-[2px]',
        className
      )}
      data-slot='table-cell'
      {...props}
    />
  );
};

const TableCaption = ({ className, ...props }: React.ComponentProps<'caption'>) => {
  return (
    <caption
      className={cn('text-muted-foreground mt-4 text-sm', className)}
      data-slot='table-caption'
      {...props}
    />
  );
};

export { Table, TableBody, TableCaption, TableCell, TableFooter, TableHead, TableHeader, TableRow };
