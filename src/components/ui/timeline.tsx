import { Slot } from 'radix-ui';
import * as React from 'react';

import { cn } from '@/lib/utils';

// Types
interface TimelineContextValue {
  activeStep: number;
  setActiveStep: (step: number) => void;
}

// Context
const TimelineContext = React.createContext<TimelineContextValue | undefined>(undefined);

const useTimeline = () => {
  const context = React.use(TimelineContext);
  if (!context) {
    throw new Error('useTimeline must be used within a Timeline');
  }
  return context;
};

// Components
interface TimelineProps extends React.HTMLAttributes<HTMLDivElement> {
  defaultValue?: number;
  orientation?: 'horizontal' | 'vertical';
  value?: number;
  onValueChange?: (value: number) => void;
}

const Timeline = ({
  defaultValue = 1,
  value,
  onValueChange,
  orientation = 'vertical',
  className,
  ...props
}: TimelineProps) => {
  const [activeStep, setInternalStep] = React.useState(defaultValue);

  const setActiveStep = React.useCallback(
    (step: number) => {
      if (value === undefined) {
        setInternalStep(step);
      }
      onValueChange?.(step);
    },
    [value, onValueChange]
  );

  const currentStep = value ?? activeStep;

  return (
    <TimelineContext value={{ activeStep: currentStep, setActiveStep }}>
      <div
        className={cn(
          'group/timeline flex data-[orientation=horizontal]:w-full data-[orientation=horizontal]:flex-row data-[orientation=vertical]:flex-col',
          className
        )}
        data-orientation={orientation}
        data-slot='timeline'
        {...props}
      />
    </TimelineContext>
  );
};

// TimelineContent
const TimelineContent = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <div
      className={cn('text-muted-foreground text-sm', className)}
      data-slot='timeline-content'
      {...props}
    />
  );
};

// TimelineDate
interface TimelineDateProps extends React.HTMLAttributes<HTMLTimeElement> {
  asChild?: boolean;
}

const TimelineDate = ({ asChild = false, className, ...props }: TimelineDateProps) => {
  const Comp = asChild ? Slot.Root : 'time';

  return (
    <Comp
      className={cn(
        'text-muted-foreground mb-1 block text-xs font-medium group-data-[orientation=vertical]/timeline:max-sm:h-4',
        className
      )}
      data-slot='timeline-date'
      {...props}
    />
  );
};

// TimelineHeader
const TimelineHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => {
  return <div className={cn(className)} data-slot='timeline-header' {...props} />;
};

// TimelineIndicator
interface TimelineIndicatorProps extends React.HTMLAttributes<HTMLDivElement> {
  asChild?: boolean;
}

const TimelineIndicator = ({
  asChild = false,
  className,
  children,
  ...props
}: TimelineIndicatorProps) => {
  const Comp = asChild ? Slot.Root : 'div';
  return (
    <Comp
      className={cn(
        'border-primary/20 group-data-completed/timeline-item:border-primary absolute size-4 rounded-full border-2 group-data-[orientation=horizontal]/timeline:-top-6 group-data-[orientation=horizontal]/timeline:left-0 group-data-[orientation=horizontal]/timeline:-translate-y-1/2 group-data-[orientation=vertical]/timeline:top-0 group-data-[orientation=vertical]/timeline:-left-6 group-data-[orientation=vertical]/timeline:-translate-x-1/2',
        className
      )}
      aria-hidden='true'
      data-slot='timeline-indicator'
      {...props}
    >
      {children}
    </Comp>
  );
};

// TimelineItem
interface TimelineItemProps extends React.HTMLAttributes<HTMLDivElement> {
  step: number;
}

const TimelineItem = ({ step, className, ...props }: TimelineItemProps) => {
  const { activeStep } = useTimeline();

  return (
    <div
      className={cn(
        'group/timeline-item has-[+[data-completed]]:[&_[data-slot=timeline-separator]]:bg-primary relative flex flex-1 flex-col gap-0.5 group-data-[orientation=horizontal]/timeline:mt-8 group-data-[orientation=horizontal]/timeline:not-last:pe-8 group-data-[orientation=vertical]/timeline:ms-8 group-data-[orientation=vertical]/timeline:not-last:pb-12',
        className
      )}
      data-completed={step <= activeStep || undefined}
      data-slot='timeline-item'
      {...props}
    />
  );
};

// TimelineSeparator
const TimelineSeparator = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <div
      className={cn(
        'bg-primary/10 absolute self-start group-last/timeline-item:hidden group-data-[orientation=horizontal]/timeline:-top-6 group-data-[orientation=horizontal]/timeline:h-0.5 group-data-[orientation=horizontal]/timeline:w-[calc(100%-1rem-0.25rem)] group-data-[orientation=horizontal]/timeline:translate-x-4.5 group-data-[orientation=horizontal]/timeline:-translate-y-1/2 group-data-[orientation=vertical]/timeline:-left-6 group-data-[orientation=vertical]/timeline:h-[calc(100%-1rem-0.25rem)] group-data-[orientation=vertical]/timeline:w-0.5 group-data-[orientation=vertical]/timeline:-translate-x-1/2 group-data-[orientation=vertical]/timeline:translate-y-4.5',
        className
      )}
      aria-hidden='true'
      data-slot='timeline-separator'
      {...props}
    />
  );
};

// TimelineTitle
const TimelineTitle = ({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => {
  return (
    <h3 className={cn('text-sm font-medium', className)} data-slot='timeline-title' {...props} />
  );
};

export {
  Timeline,
  TimelineContent,
  TimelineDate,
  TimelineHeader,
  TimelineIndicator,
  TimelineItem,
  TimelineSeparator,
  TimelineTitle
};
