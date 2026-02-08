import { useLingui } from '@lingui/react/macro';
import { useNavigate, useRouter } from '@tanstack/react-router';

import { Button } from '@/components/ui/button';

export const ForbiddenError = () => {
  const navigate = useNavigate();
  const { history } = useRouter();
  const { t } = useLingui();

  return (
    <div className='h-svh'>
      <div className='m-auto flex h-full w-full flex-col items-center justify-center gap-2'>
        <h1 className='text-[7rem] leading-tight font-bold'>403</h1>
        <span className='font-medium'>{t`Access Forbidden`}</span>
        <p className='text-muted-foreground text-center whitespace-pre-line'>
          {t`You don't have necessary permission
          to view this resource.`}
        </p>
        <div className='mt-6 flex gap-4'>
          <Button variant='outline' onClick={() => history.go(-1)}>
            {t`Go Back`}
          </Button>
          <Button onClick={() => navigate({ to: '/' })}>{t`Back to Home`}</Button>
        </div>
      </div>
    </div>
  );
};
