import type { DateRange, DayPickerProps } from 'react-day-picker';

import { format } from 'date-fns';
import { CalendarIcon, X } from 'lucide-react';
import * as React from 'react';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { formatLocaleDate } from '@/lib/format.ts';
import { cn } from '@/lib/utils';

// Context for DatePicker
interface DatePickerContextValue {
  clearable?: boolean;
  closeOnSelect: boolean;
  dateFormat: string;
  disabled?: boolean;
  open: boolean;
  placeholder?: string;
  selected?: Date;
  onSelect?: (date: Date | undefined) => void;
  setOpen: (open: boolean) => void;
}

const DatePickerContext = React.createContext<DatePickerContextValue | undefined>(undefined);

function useDatePicker() {
  const context = React.use(DatePickerContext);
  if (!context) {
    throw new Error('DatePicker components must be used within DatePicker');
  }
  return context;
}

// Main DatePicker component (context provider)
interface DatePickerProps {
  children: React.ReactNode;
  clearable?: boolean;
  closeOnSelect?: boolean;
  dateFormat?: string;
  disabled?: boolean;
  open?: boolean;
  placeholder?: string;
  selected?: Date;
  onOpenChange?: (open: boolean) => void;
  onSelect?: (date: Date | undefined) => void;
}

const DatePicker = ({
  ref,
  children,
  selected,
  onSelect,
  placeholder = 'Pick a date',
  dateFormat = 'dd MMMM yyyy',
  disabled = false,
  closeOnSelect = true,
  clearable = false,
  open: controlledOpen,
  onOpenChange
}: DatePickerProps & { ref?: React.RefObject<HTMLDivElement | null> }) => {
  const [internalOpen, setInternalOpen] = React.useState(false);

  const open = controlledOpen ?? internalOpen;
  const setOpen = onOpenChange ?? setInternalOpen;

  const contextValue: DatePickerContextValue = {
    selected,
    onSelect,
    open,
    setOpen,
    placeholder,
    dateFormat,
    disabled,
    clearable,
    closeOnSelect
  };

  return (
    <DatePickerContext value={contextValue}>
      <Popover onOpenChange={setOpen} open={open}>
        <div ref={ref}>{children}</div>
      </Popover>
    </DatePickerContext>
  );
};
DatePicker.displayName = 'DatePicker';

type DatePickerTriggerProps = React.ComponentProps<typeof Button> & {
  asChild?: boolean;
};

const DatePickerTrigger = ({
  ref,
  className,
  variant = 'outline',
  asChild = false,
  children,
  ...props
}: DatePickerTriggerProps) => {
  const { disabled, clearable } = useDatePicker();

  if (asChild) {
    return <PopoverTrigger asChild>{children}</PopoverTrigger>;
  }

  return (
    <PopoverTrigger asChild>
      <Button
        ref={ref}
        className={cn('w-full justify-start text-left font-normal', className)}
        disabled={disabled}
        variant={variant}
        {...props}
      >
        <span className='flex-1'>{children}</span>
        {clearable && <DatePickerClear className='ml-auto' />}
        <CalendarIcon className='h-4 w-4' />
      </Button>
    </PopoverTrigger>
  );
};
DatePickerTrigger.displayName = 'DatePickerTrigger';

// DatePickerValue component
interface DatePickerValueProps extends React.HTMLAttributes<HTMLSpanElement> {
  placeholder?: string;
}

const DatePickerValue = ({
  ref,
  className,
  placeholder: propPlaceholder,
  ...props
}: DatePickerValueProps & { ref?: React.RefObject<HTMLSpanElement | null> }) => {
  const { selected, placeholder: contextPlaceholder, dateFormat } = useDatePicker();
  const displayPlaceholder = propPlaceholder ?? contextPlaceholder;

  return (
    <span ref={ref} className={cn(!selected && 'text-muted-foreground', className)} {...props}>
      {selected ? format(selected, dateFormat) : displayPlaceholder}
    </span>
  );
};
DatePickerValue.displayName = 'DatePickerValue';

// DatePickerClear component
type DatePickerClearProps = React.ComponentProps<'span'> & {
  onClear?: () => void;
};

const DatePickerClear = ({ ref, onClear, children, ...props }: DatePickerClearProps) => {
  const { selected, onSelect, setOpen } = useDatePicker();

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onClear?.();
    onSelect?.(undefined);
    setOpen(false);
  };

  if (!selected) return null;

  return (
    <Button asChild size='iconSm' variant='ghost'>
      <span ref={ref} onClick={handleClear} {...props}>
        {children || <X className='h-3 w-3' />}
        <span className='sr-only'>Clear date</span>
      </span>
    </Button>
  );
};
DatePickerClear.displayName = 'DatePickerClear';

// DatePickerContent component
interface DatePickerContentProps extends React.ComponentPropsWithoutRef<typeof PopoverContent> {
  children?: React.ReactNode;
}

const DatePickerContent = ({
  ref,
  className,
  align = 'start',
  children,
  ...props
}: DatePickerContentProps & {
  ref?: React.RefObject<React.ElementRef<typeof PopoverContent> | null>;
}) => (
  <PopoverContent ref={ref} align={align} className={cn('w-auto p-0', className)} {...props}>
    {children}
  </PopoverContent>
);
DatePickerContent.displayName = 'DatePickerContent';

// DatePickerCalendar component
interface DatePickerCalendarProps extends Omit<DayPickerProps, 'mode' | 'onSelect' | 'selected'> {}

const DatePickerCalendar = ({
  ref,
  className,
  ...props
}: DatePickerCalendarProps & { ref?: React.RefObject<HTMLDivElement | null> }) => {
  const { selected, onSelect, setOpen, closeOnSelect } = useDatePicker();

  const handleSelect = (date: Date | undefined) => {
    onSelect?.(date);
    if (closeOnSelect && date) {
      setOpen(false);
    }
  };

  return (
    <div ref={ref} className={className}>
      <Calendar
        selected={selected}
        autoFocus
        captionLayout='dropdown'
        mode='single'
        onSelect={handleSelect}
        {...props}
      />
    </div>
  );
};
DatePickerCalendar.displayName = 'DatePickerCalendar';

// Context for DateRangePicker
interface DateRangePickerContextValue {
  clearable?: boolean;
  dateFormat: string;
  disabled?: boolean;
  open: boolean;
  placeholder?: string;
  selected?: DateRange;
  onSelect?: (range: DateRange | undefined) => void;
  setOpen: (open: boolean) => void;
}

const DateRangePickerContext = React.createContext<DateRangePickerContextValue | undefined>(
  undefined
);

function useDateRangePicker() {
  const context = React.use(DateRangePickerContext);
  if (!context) {
    throw new Error('DateRangePicker components must be used within DateRangePicker');
  }
  return context;
}

// DateRangePicker component
interface DateRangePickerProps {
  children: React.ReactNode;
  clearable?: boolean;
  dateFormat?: string;
  disabled?: boolean;
  open?: boolean;
  placeholder?: string;
  selected?: DateRange;
  onOpenChange?: (open: boolean) => void;
  onSelect?: (range: DateRange | undefined) => void;
}

const DateRangePicker = ({
  children,
  selected,
  onSelect,
  placeholder = 'Pick a date range',
  dateFormat = 'LLL dd, y',
  disabled = false,
  open: controlledOpen,
  clearable = false,
  onOpenChange
}: DateRangePickerProps & { ref?: React.RefObject<HTMLDivElement | null> }) => {
  const [internalOpen, setInternalOpen] = React.useState(false);

  const open = controlledOpen ?? internalOpen;
  const setOpen = onOpenChange ?? setInternalOpen;

  const contextValue: DateRangePickerContextValue = {
    selected,
    onSelect,
    open,
    setOpen,
    placeholder,
    dateFormat,
    disabled,
    clearable
  };

  return (
    <DateRangePickerContext value={contextValue}>
      <Popover onOpenChange={setOpen} open={open}>
        {children}
      </Popover>
    </DateRangePickerContext>
  );
};
DateRangePicker.displayName = 'DateRangePicker';

// DateRangePickerTrigger component
const DateRangePickerTrigger = ({
  ref,
  className,
  variant = 'outline',
  asChild = false,
  children,
  ...props
}: DatePickerTriggerProps) => {
  const { disabled, clearable } = useDateRangePicker();

  if (asChild) {
    return <PopoverTrigger asChild>{children}</PopoverTrigger>;
  }

  return (
    <PopoverTrigger asChild>
      <Button
        ref={ref}
        className={cn('w-full justify-start text-left font-normal', className)}
        disabled={disabled}
        variant={variant}
        {...props}
      >
        <span className='flex-1'>{children}</span>
        {clearable && <DatePickerClear className='ml-auto' />}
        <CalendarIcon className='h-4 w-4' />
      </Button>
    </PopoverTrigger>
  );
};
DateRangePickerTrigger.displayName = 'DateRangePickerTrigger';

// DateRangePickerValue component
const DateRangePickerValue = ({
  ref,
  className,
  placeholder: propPlaceholder,
  ...props
}: DatePickerValueProps & { ref?: React.RefObject<HTMLSpanElement | null> }) => {
  const { selected, placeholder: contextPlaceholder, dateFormat } = useDateRangePicker();
  const displayPlaceholder = propPlaceholder ?? contextPlaceholder;

  const formatDateRange = (range: DateRange | undefined) => {
    if (!range?.from) return displayPlaceholder;

    if (!range.to) {
      return formatLocaleDate(range.from, dateFormat);
    }

    return `${formatLocaleDate(range.from, dateFormat)} - ${formatLocaleDate(range.to, dateFormat)}`;
  };

  return (
    <span
      ref={ref}
      className={cn(!selected?.from && 'text-muted-foreground', className)}
      {...props}
    >
      {formatDateRange(selected)}
    </span>
  );
};
DateRangePickerValue.displayName = 'DateRangePickerValue';

// DateRangePickerClear component
const DateRangePickerClear = ({ ref, onClear, children, ...props }: DatePickerClearProps) => {
  const { selected, onSelect, setOpen } = useDateRangePicker();

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onClear?.();
    onSelect?.(undefined);
    setOpen(false);
  };

  if (!selected?.from) return null;

  return (
    <Button asChild size='iconSm' variant='ghost'>
      <span ref={ref} onClick={handleClear} {...props}>
        {children || <X className='h-3 w-3' />}
        <span className='sr-only'>Clear dates</span>
      </span>
    </Button>
  );
};
DateRangePickerClear.displayName = 'DateRangePickerClear';

// DateRangePickerContent component
const DateRangePickerContent = DatePickerContent;
DateRangePickerContent.displayName = 'DateRangePickerContent';

// DateRangePickerCalendar component
interface DateRangePickerCalendarProps
  extends Omit<DayPickerProps, 'mode' | 'onSelect' | 'selected'> {}

const DateRangePickerCalendar = ({
  ref,
  className,
  ...props
}: DateRangePickerCalendarProps & { ref?: React.RefObject<HTMLDivElement | null> }) => {
  const { selected, onSelect } = useDateRangePicker();

  return (
    <div ref={ref} className={className}>
      <Calendar
        selected={selected}
        autoFocus
        captionLayout='dropdown'
        mode='range'
        onSelect={onSelect}
        {...props}
      />
    </div>
  );
};
DateRangePickerCalendar.displayName = 'DateRangePickerCalendar';

export {
  DatePicker,
  DatePickerCalendar,
  DatePickerContent,
  DatePickerTrigger,
  DatePickerValue,
  DateRangePicker,
  DateRangePickerCalendar,
  DateRangePickerClear,
  DateRangePickerContent,
  DateRangePickerTrigger,
  DateRangePickerValue
};
