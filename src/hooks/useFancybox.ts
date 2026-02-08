import type { FancyboxOptions } from '@fancyapps/ui/dist/fancybox/';

import { Fancybox } from '@fancyapps/ui/dist/fancybox/';
import { useEffect, useRef, useState } from 'react';

import '@fancyapps/ui/dist/fancybox/fancybox.css';

export default function useFancybox(options: Partial<FancyboxOptions> = {}) {
  const [root, setRoot] = useState<HTMLElement | null>(null);
  const optionsRef = useRef(options);

  useEffect(() => {
    optionsRef.current = options;
  }, [options]);

  useEffect(() => {
    if (root) {
      Fancybox.bind(root, '[data-fancybox]', optionsRef.current);
      return () => Fancybox.unbind(root);
    }
  }, [root]);

  return { fancyboxRef: setRoot };
}
