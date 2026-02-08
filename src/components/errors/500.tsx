import type { ErrorComponentProps, ErrorRouteComponent } from '@tanstack/react-router';

import { useLingui } from '@lingui/react/macro';
import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from '@tanstack/react-router';

import { Button } from '@/components/ui/button';

export const GeneralError: ErrorRouteComponent = ({ error }: ErrorComponentProps<any>) => {
  const { history, invalidate } = useRouter();
  const queryClient = useQueryClient();
  const { t } = useLingui();

  const refreshPage = async () => {
    await queryClient.resetQueries();
    await invalidate();
  };

  return (
    <div className='h-svh w-full'>
      <div className='m-auto flex h-full w-full flex-col items-center justify-center gap-2'>
        {error?.status && <h1 className='text-[7rem] leading-tight font-bold'>{error.status}</h1>}
        <span className='font-medium'>{t`Oops! Something went wrong :')`}</span>
        <p className='text-muted-foreground text-center'>
          {error?.response?.data?.message ?? error.message}
        </p>
        <div className='mt-6 flex gap-4'>
          <Button variant='outline' onClick={() => history.go(-1)}>
            {t`Go Back`}
          </Button>
          <Button onClick={refreshPage}>{t`Refresh`}</Button>
        </div>
      </div>
    </div>
  );
};
