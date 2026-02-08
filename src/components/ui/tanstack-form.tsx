import { Slot } from '@radix-ui/react-slot';
import { createFormHook, createFormHookContexts, useStore } from '@tanstack/react-form';
import * as React from 'react';

import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

const {
  fieldContext,
  formContext,
  useFieldContext: _useFieldContext,
  useFormContext
} = createFormHookContexts();

interface FormItemContextValue {
  id: string;
}

const FormItemContext = React.createContext<FormItemContextValue>({} as FormItemContextValue);

const FormItem = ({ className, ...props }: React.ComponentProps<'div'>) => {
  const id = React.useId();

  return (
    <FormItemContext value={{ id }}>
      <div className={cn('grid gap-2', className)} data-slot='form-item' {...props} />
    </FormItemContext>
  );
};

const useFieldContext = () => {
  const { id } = React.use(FormItemContext);
  const { name, store, ...fieldContext } = _useFieldContext();

  const errors = useStore(store, (state) => state.meta.errors);
  if (!fieldContext) {
    throw new Error('useFieldContext should be used within <FormItem>');
  }

  return {
    id,
    name,
    formItemId: `${id}-form-item`,
    formDescriptionId: `${id}-form-item-description`,
    formMessageId: `${id}-form-item-message`,
    errors,
    store,
    ...fieldContext
  };
};

const FormLabel = ({ className, ...props }: React.ComponentProps<typeof Label>) => {
  const { formItemId, errors } = useFieldContext();

  return (
    <Label
      className={cn('data-[error=true]:text-destructive', className)}
      data-error={!!errors.length}
      data-slot='form-label'
      htmlFor={formItemId}
      {...props}
    />
  );
};

const FormControl = ({ ...props }: React.ComponentProps<typeof Slot>) => {
  const { errors, formItemId, formDescriptionId, formMessageId } = useFieldContext();

  return (
    <Slot
      aria-describedby={
        !errors.length ? `${formDescriptionId}` : `${formDescriptionId} ${formMessageId}`
      }
      aria-invalid={!!errors.length}
      id={formItemId}
      data-slot='form-control'
      {...props}
    />
  );
};

const FormDescription = ({ className, ...props }: React.ComponentProps<'p'>) => {
  const { formDescriptionId } = useFieldContext();

  return (
    <p
      className={cn('text-muted-foreground text-sm', className)}
      id={formDescriptionId}
      data-slot='form-description'
      {...props}
    />
  );
};

const FormMessage = ({ className, ...props }: React.ComponentProps<'p'>) => {
  const { errors, formMessageId } = useFieldContext();
  const body = errors.length ? String(errors.at(0)?.message ?? '') : props.children;
  if (!body) return null;

  return (
    <p
      className={cn('text-destructive text-sm', className)}
      id={formMessageId}
      data-slot='form-message'
      {...props}
    >
      {body}
    </p>
  );
};
const { useAppForm, withForm } = createFormHook({
  fieldContext,
  formContext,
  fieldComponents: {
    FormLabel,
    FormControl,
    FormDescription,
    FormMessage,
    FormItem
  },
  formComponents: {}
});

export { useAppForm, useFieldContext, useFormContext, withForm };
