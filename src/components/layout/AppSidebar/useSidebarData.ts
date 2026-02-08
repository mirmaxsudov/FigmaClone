import { msg } from '@lingui/core/macro';

import type { SidebarData } from '@/components/layout/types.ts';

export const useSidebarData = () => {
  const sidebarData: SidebarData = {
    navGroups: [
      {
        title: msg`System`,
        items: []
      }
    ]
  };

  return sidebarData;
};
