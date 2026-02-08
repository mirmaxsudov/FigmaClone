import type { Column, Table } from '@tanstack/react-table';

import { X } from 'lucide-react';
import * as React from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

import { DataTableDateFilter } from './data-table-date-filter';
import { DataTableFacetedFilter } from './data-table-faceted-filter';
import { DataTableSliderFilter } from './data-table-slider-filter';

interface DataTableToolbarProps<TData> extends React.ComponentProps<'div'> {
  hasCustomFilters?: boolean;
  table: Table<TData>;
  onReset?: () => void;
}

export const DataTableToolbar = <TData,>({
  table,
  children,
  className,
  onReset: customOnReset,
  hasCustomFilters = false,
  ...props
}: DataTableToolbarProps<TData>) => {
  const isFiltered = table.getState().columnFilters.length > 0;

  const columns = table.getAllColumns().filter((column) => column.getCanFilter());

  const onReset = React.useCallback(() => {
    if (customOnReset) {
      customOnReset();
    } else {
      table.resetColumnFilters();
    }
  }, [table, customOnReset]);

  return (
    <div
      className={cn('flex w-full items-start justify-between gap-2', className)}
      aria-orientation='horizontal'
      role='toolbar'
      {...props}
    >
      <div className='flex flex-1 flex-wrap items-center gap-2'>
        {columns.map((column) => (
          <DataTableToolbarFilter key={column.id} column={column} />
        ))}
        {children}
        {(isFiltered || hasCustomFilters) && (
          <Button
            aria-label='Reset filters'
            className='border-dashed'
            size='sm'
            variant='destructiveOutline'
            onClick={onReset}
          >
            <X />
            Reset
          </Button>
        )}
      </div>
    </div>
  );
};

interface DataTableToolbarFilterProps<TData> {
  column: Column<TData>;
}

function DataTableToolbarFilter<TData>({ column }: DataTableToolbarFilterProps<TData>) {
  const columnMeta = column.columnDef.meta;

  const onFilterRender = React.useCallback(() => {
    if (!columnMeta?.variant) return null;

    switch (columnMeta.variant) {
      case 'text':
        return (
          <Input
            className='h-8 w-40 lg:w-56'
            value={(column.getFilterValue() as string) ?? ''}
            onChange={(event) => column.setFilterValue(event.target.value)}
            placeholder={columnMeta.placeholder ?? columnMeta.label}
          />
        );

      case 'number':
        return (
          <div className='relative'>
            <Input
              className={cn('h-8 w-[120px]', columnMeta.unit && 'pr-8')}
              type='number'
              value={(column.getFilterValue() as string) ?? ''}
              inputMode='numeric'
              onChange={(event) => column.setFilterValue(event.target.value)}
              placeholder={columnMeta.placeholder ?? columnMeta.label}
            />
            {columnMeta.unit && (
              <span className='bg-accent text-muted-foreground absolute top-0 right-0 bottom-0 flex items-center rounded-r-md px-2 text-sm'>
                {columnMeta.unit}
              </span>
            )}
          </div>
        );

      case 'range':
        return <DataTableSliderFilter title={columnMeta.label ?? column.id} column={column} />;

      case 'date':
      case 'dateRange':
        return (
          <DataTableDateFilter
            multiple={columnMeta.variant === 'dateRange'}
            title={columnMeta.label ?? column.id}
            column={column}
          />
        );

      case 'select':
      case 'multiSelect':
        return (
          <DataTableFacetedFilter
            multiple={columnMeta.variant === 'multiSelect'}
            title={columnMeta.label ?? column.id}
            column={column}
            options={columnMeta.options ?? []}
          />
        );

      default:
        return null;
    }
  }, [column, columnMeta]);

  return onFilterRender();
}
