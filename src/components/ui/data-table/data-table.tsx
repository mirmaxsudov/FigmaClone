import type { Table as TanstackTable } from '@tanstack/react-table';
import type * as React from 'react';

import { useLingui } from '@lingui/react/macro';
import { flexRender } from '@tanstack/react-table';

import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { getCommonPinningStyles } from '@/lib/data-table';
import { cn } from '@/lib/utils';

import { DataTablePagination } from './data-table-pagination';

interface DataTableProps<TData> extends React.ComponentProps<'div'> {
  actionBar?: React.ReactNode;
  isLoading?: boolean;
  table: TanstackTable<TData>;
  loadingOptions?: {
    cellWidths?: string[];
    columnCount: number;
    filterCount?: number;
    rowCount?: number;
    shrinkZero?: boolean;
    withPagination?: boolean;
    withViewOptions?: boolean;
  };
}

export const DataTable = <TData,>({
  table,
  actionBar,
  isLoading,
  loadingOptions = {
    columnCount: 5,
    rowCount: 10,
    filterCount: 0,
    cellWidths: ['auto'],
    withViewOptions: true,
    withPagination: true,
    shrinkZero: false
  },
  children,
  className,
  ...props
}: DataTableProps<TData>) => {
  const { t } = useLingui();
  const cozyCellWidths = Array.from(
    { length: loadingOptions?.columnCount },
    (_, index) => loadingOptions.cellWidths?.[index % loadingOptions.cellWidths.length] ?? 'auto'
  );
  return (
    <div className={cn('flex w-full flex-col gap-2.5', className)} {...props}>
      {children}
      <div className='overflow-clip'>
        <Table>
          <TableHeader>
            {isLoading ? (
              <TableRow className='hover:bg-transparent'>
                {Array.from({ length: loadingOptions.columnCount }).map((_, j) => (
                  <TableHead
                    key={j}
                    style={{
                      width: cozyCellWidths[j],
                      minWidth: loadingOptions.shrinkZero ? cozyCellWidths[j] : 'auto'
                    }}
                  >
                    <div className='py-0.5'>
                      <Skeleton className='h-5 w-full' />
                    </div>
                  </TableHead>
                ))}
              </TableRow>
            ) : (
              table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead
                      key={header.id}
                      style={{
                        ...getCommonPinningStyles({ column: header.column })
                      }}
                      colSpan={header.colSpan}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  ))}
                </TableRow>
              ))
            )}
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: table.getState().pagination.pageSize || 10 }).map((_, i) => (
                <TableRow key={i} className='hover:bg-transparent'>
                  {Array.from({ length: loadingOptions.columnCount }).map((_, j) => (
                    <TableCell
                      key={j}
                      style={{
                        width: cozyCellWidths[j],
                        minWidth: loadingOptions.shrinkZero ? cozyCellWidths[j] : 'auto'
                      }}
                    >
                      <div className='py-1.5'>
                        <Skeleton className='h-5 w-full' />
                      </div>
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      style={{
                        ...getCommonPinningStyles({ column: cell.column })
                      }}
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell className='h-24 text-center' colSpan={table.getAllColumns().length}>
                  {t`No results.`}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className='flex flex-col gap-2.5'>
        <DataTablePagination table={table} />
        {actionBar && table.getFilteredSelectedRowModel().rows.length > 0 && actionBar}
      </div>
    </div>
  );
};
