import { Loader } from 'lucide-react';
import React from 'react';

import { cn } from '@/lib/utils';

type Props = React.ComponentProps<'svg'> & {
  show?: boolean;
};

export const Spinner = ({ className, show = true, ...props }: Props) =>
  show && <Loader className={cn('animate-spin', className)} {...props} />;
