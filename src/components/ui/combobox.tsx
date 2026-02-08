import type { ComponentProps } from 'react';

import { useControllableState } from '@radix-ui/react-use-controllable-state';
import { CheckIcon, ChevronsUpDownIcon, SearchIcon, XIcon } from 'lucide-react';
import { createContext, use, useEffect, useRef, useState } from 'react';

import { Button } from '@/components/ui/button.tsx';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
  CommandSeparator
} from '@/components/ui/command.tsx';
import { Input } from '@/components/ui/input.tsx';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover.tsx';
import { cn } from '@/lib/utils.ts';

export interface ComboboxData {
  label: string;
  value: string;
}

export interface ComboboxOption {
  label: string;
  value: string;
}

interface ComboboxContextType {
  clearable?: boolean;
  data: ComboboxData[];
  emptyText?: string;
  open: boolean;
  placeholder?: string;
  value: ComboboxOption | null;
  width: number;
  onOpenChange: (open: boolean) => void;
  onValueChange: (value: ComboboxOption | null) => void;
  setWidth: (width: number) => void;
}

const ComboboxContext = createContext<ComboboxContextType>({
  data: [],
  placeholder: '',
  emptyText: '',
  value: null,
  onValueChange: () => {},
  open: false,
  onOpenChange: () => {},
  width: 200,
  setWidth: () => {},
  clearable: false
});

export type ComboboxProps = ComponentProps<typeof Popover> & {
  data: ComboboxData[];
  placeholder?: string;
  defaultValue?: ComboboxOption | null;
  emptyText?: string;
  value?: ComboboxOption | null;
  onValueChange?: (value: ComboboxOption | null) => void;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  clearable?: boolean;
};

export const Combobox = ({
  data,
  placeholder,
  emptyText,
  defaultValue = null,
  value: controlledValue,
  onValueChange: controlledOnValueChange,
  defaultOpen = false,
  open: controlledOpen,
  onOpenChange: controlledOnOpenChange,
  clearable = false,
  ...props
}: ComboboxProps) => {
  const [value, onValueChange] = useControllableState({
    defaultProp: defaultValue,
    prop: controlledValue,
    onChange: controlledOnValueChange
  });
  const [open, onOpenChange] = useControllableState({
    defaultProp: defaultOpen,
    prop: controlledOpen,
    onChange: controlledOnOpenChange
  });
  const [width, setWidth] = useState(200);
  return (
    <ComboboxContext
      value={{
        placeholder,
        value,
        onValueChange,
        open,
        onOpenChange,
        data,
        width,
        setWidth,
        clearable,
        emptyText
      }}
    >
      <Popover {...props} onOpenChange={onOpenChange} open={open} />
    </ComboboxContext>
  );
};

export type ComboboxTriggerProps = ComponentProps<typeof Button> & {
  isHover?: boolean;
};
export const ComboboxTrigger = ({
  children,
  className,
  isHover = false,
  variant = 'outline',
  ...props
}: ComboboxTriggerProps) => {
  const { value, placeholder, open, clearable, onValueChange, setWidth } = use(ComboboxContext);
  const ref = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    // Create a ResizeObserver to detect width changes
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const newWidth = (entry.target as HTMLElement).offsetWidth;
        if (newWidth) {
          setWidth?.(newWidth);
        }
      }
    });
    if (ref.current) {
      resizeObserver.observe(ref.current);
    }
    return () => {
      resizeObserver.disconnect();
    };
  }, [setWidth]);
  return (
    <PopoverTrigger asChild>
      <Button
        className={cn(
          'font-normal',
          value
            ? 'text-foreground hover:text-foreground hover:bg-transparent'
            : 'text-muted-foreground hover:text-muted-foreground',
          className,
          isHover && 'dark:bg-transparent dark:hover:bg-transparent'
        )}
        aria-expanded={open}
        variant={variant}
        role='combobox'
        {...props}
        ref={ref}
      >
        {children ?? (
          <span className='flex w-full items-center justify-between gap-2'>
            <span
              className={cn(
                'min-w-0 flex-1 truncate text-left',
                value?.label ? 'text-foreground' : 'text-muted-foreground'
              )}
            >
              {value?.label || placeholder}
            </span>
            {clearable && value?.value && (
              <span
                className='text-muted-foreground hover:text-foreground shrink-0'
                onClick={() => onValueChange?.(null)}
              >
                <XIcon size={16} />
              </span>
            )}
            <ChevronsUpDownIcon className='text-muted-foreground shrink-0' size={16} />
          </span>
        )}
      </Button>
    </PopoverTrigger>
  );
};

export type ComboboxContentProps = ComponentProps<typeof Command> & {
  popoverOptions?: ComponentProps<typeof PopoverContent>;
};
export const ComboboxContent = ({ className, popoverOptions, ...props }: ComboboxContentProps) => {
  const { width, value } = use(ComboboxContext);
  return (
    <PopoverContent className={cn('p-1', className)} style={{ width }} {...popoverOptions}>
      <Command defaultValue={value?.value ?? ''} {...props} />
    </PopoverContent>
  );
};

export type ComboboxInputProps = ComponentProps<typeof Input>;
export const ComboboxInput = ({ className, ...props }: ComboboxInputProps) => {
  const { placeholder } = use(ComboboxContext);
  return (
    <div className='p-1 pb-2'>
      <div className='relative'>
        <Input
          className={cn('w-full pr-8', className)}
          size='sm'
          placeholder={placeholder}
          {...props}
        />
        <SearchIcon className='text-muted-foreground absolute top-1/2 right-3 size-4 -translate-y-1/2' />
      </div>
    </div>
  );
};

export type ComboboxListProps = ComponentProps<typeof CommandList>;
export const ComboboxList = (props: ComboboxListProps) => <CommandList {...props} />;

export type ComboboxEmptyProps = ComponentProps<typeof CommandEmpty>;
export const ComboboxEmpty = ({ children, ...props }: ComboboxEmptyProps) => {
  return <CommandEmpty {...props}>{children}</CommandEmpty>;
};

export type ComboboxGroupProps = ComponentProps<typeof CommandGroup>;
export const ComboboxGroup = (props: ComboboxGroupProps) => <CommandGroup {...props} />;

export type ComboboxItemProps = ComponentProps<typeof CommandItem>;
export const ComboboxItem = ({
  className,
  children,
  value: _value,
  ...props
}: ComboboxItemProps) => {
  const { onValueChange, value, data, onOpenChange } = use(ComboboxContext);
  return (
    <div className='relative'>
      <CommandItem
        className={cn('pr-8', className)}
        value={_value ?? ''}
        onSelect={(currentValue) => {
          onValueChange(data.find((item) => item.value === currentValue) ?? null);
          onOpenChange(false);
        }}
        {...props}
      >
        {children}
        {_value === value?.value && (
          <CheckIcon className='text-muted-foreground absolute top-1/2 right-2 -translate-y-1/2' />
        )}
      </CommandItem>
    </div>
  );
};
export type ComboboxSeparatorProps = ComponentProps<typeof CommandSeparator>;
export const ComboboxSeparator = (props: ComboboxSeparatorProps) => <CommandSeparator {...props} />;
