import type { VariantProps } from 'class-variance-authority';

import { cva } from 'class-variance-authority';
import { Slot as SlotPrimitive } from 'radix-ui';
import * as React from 'react';

import { cn } from '@/lib/utils';

import { Spinner } from './spinner.tsx';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary/90',
        success:
          'bg-success text-white hover:bg-success/90 focus-visible:ring-success/20 dark:focus-visible:ring-success/40 dark:bg-success/60',
        destructive:
          'bg-destructive text-white hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60',
        destructiveOutline:
          'border border-destructive/50 text-destructive bg-background shadow-xs hover:bg-destructive/10 dark:bg-destructive/10 dark:hover:bg-destructive/20',
        destructiveGhost: 'hover:bg-destructive/10 text-destructive dark:hover:bg-destructive/10',
        outline:
          'border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50',
        secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        ghost: 'hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50',
        link: 'text-primary underline-offset-4 hover:underline !px-0'
      },
      size: {
        default: "h-10 px-4 py-2 has-[>svg]:px-3  [&_svg:not([class*='size-'])]:size-5",
        xs: "h-7 rounded-md gap-1.5 px-2 has-[>svg]:px-2 [&_svg:not([class*='size-'])]:size-3.5",
        sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5 [&_svg:not([class*='size-'])]:size-4",
        lg: "h-11 rounded-md px-6 has-[>svg]:px-4 [&_svg:not([class*='size-'])]:size-6",
        icon: "size-10 [&_svg:not([class*='size-'])]:size-5",
        iconSm: "size-8 [&_svg:not([class*='size-'])]:size-4"
      }
    },
    defaultVariants: {
      variant: 'default',
      size: 'default'
    }
  }
);

interface ButtonPropsBase
  extends React.ComponentProps<'button'>,
    VariantProps<typeof buttonVariants> {}

type ButtonProps = ButtonPropsBase &
  (
    | { asChild: true }
    | {
        asChild?: false;
        loading?: boolean;
      }
  );

const Button = ({ className, children, variant, size, ...props }: ButtonProps) => {
  const { asChild, ...rest } = props;
  if (asChild) {
    return (
      <SlotPrimitive.Slot className={cn(buttonVariants({ variant, size, className }))} {...rest}>
        {children}
      </SlotPrimitive.Slot>
    );
  }

  const { loading = false, disabled, ...otherProps } = props;

  return (
    <button
      className={cn(buttonVariants({ variant, size, className }))}
      disabled={loading || disabled}
      {...otherProps}
    >
      <Spinner show={loading} />
      {children}
    </button>
  );
};

export { Button, buttonVariants };
