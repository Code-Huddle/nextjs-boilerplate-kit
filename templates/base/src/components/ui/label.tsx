'use client';

import type { VariantProps } from 'class-variance-authority';
import * as LabelPrimitive from '@radix-ui/react-label';
import { cva } from 'class-variance-authority';
import * as React from 'react';

import { cn } from '@/lib/utils';

const labelVariants = cva(
  'text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
  {
    variants: {
      variant: {
        default: '',
        primary: 'text-foreground font-semibold',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
);

const Label = ({ ref, className, variant, ...props }: React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root>
  & VariantProps<typeof labelVariants> & { ref?: React.RefObject<React.ElementRef<typeof LabelPrimitive.Root> | null> }) => (
  <LabelPrimitive.Root
    ref={ref}
    className={cn(labelVariants({ variant }), className)}
    {...props}
  />
);
Label.displayName = LabelPrimitive.Root.displayName;

export { Label };
