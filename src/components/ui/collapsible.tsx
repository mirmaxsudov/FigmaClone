import { Collapsible as CollapsiblePrimitive } from 'radix-ui';

import { cn } from '@/lib/utils.ts';

const Collapsible = ({ ...props }: React.ComponentProps<typeof CollapsiblePrimitive.Root>) => {
  return <CollapsiblePrimitive.Root data-slot='collapsible' {...props} />;
};

const CollapsibleTrigger = ({
  ...props
}: React.ComponentProps<typeof CollapsiblePrimitive.CollapsibleTrigger>) => {
  return <CollapsiblePrimitive.CollapsibleTrigger data-slot='collapsible-trigger' {...props} />;
};

const CollapsibleContent = ({
  className,
  ...props
}: React.ComponentProps<typeof CollapsiblePrimitive.CollapsibleContent>) => {
  return (
    <CollapsiblePrimitive.CollapsibleContent
      className={cn(
        className,
        'data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down overflow-hidden transition-all'
      )}
      data-slot='collapsible-content'
      {...props}
    />
  );
};

export { Collapsible, CollapsibleContent, CollapsibleTrigger };
