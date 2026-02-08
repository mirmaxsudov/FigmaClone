import { useLingui } from '@lingui/react/macro';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from '@/components/ui/alert-dialog';

interface Props {
  description?: string;
  isLoading?: boolean;
  itemName?: string;
  open: boolean;
  title?: string;
  onDelete: () => void;
  onOpenChange: (open: boolean) => void;
}

export const DeleteAlertDialog = ({
  open,
  onOpenChange,
  onDelete,
  isLoading = false,
  title,
  description,
  itemName = 'item'
}: Props) => {
  const { t } = useLingui();

  const handleDelete = () => {
    onDelete();
  };

  const dialogTitle = title || t`Delete ${itemName}`;
  const dialogDescription =
    description ||
    t`Are you sure you want to delete this ${itemName}? This action cannot be undone.`;

  return (
    <AlertDialog onOpenChange={onOpenChange} open={open}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{dialogTitle}</AlertDialogTitle>
          <AlertDialogDescription>{dialogDescription}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className='flex'>
          <AlertDialogCancel>{t`Cancel`}</AlertDialogCancel>
          <AlertDialogAction variant='destructive' loading={isLoading} onClick={handleDelete}>
            {t`Delete`}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
