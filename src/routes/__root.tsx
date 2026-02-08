import type {QueryClient} from '@tanstack/react-query';

import {createRootRouteWithContext, Outlet} from '@tanstack/react-router';
import {NuqsAdapter} from 'nuqs/adapters/tanstack-router';

import {NotFoundError} from '@/components/errors/404.tsx';
import {GeneralError} from '@/components/errors/500.tsx';
import {Toaster} from '@/components/ui/sonner.tsx';
import {ThemeProvider} from '@/utils/context';

interface RouterContext {
    queryClient: QueryClient;
}

export const Route = createRootRouteWithContext<RouterContext>()({
    notFoundComponent: NotFoundError,
    errorComponent: GeneralError,
    component: () => (
        <NuqsAdapter>
            <ThemeProvider>
                <Outlet/>
                <Toaster/>
            </ThemeProvider>
        </NuqsAdapter>
    )
});
