import {
  ChevronDownIcon,
  ChevronRightIcon,
  CircleIcon,
  ComponentIcon,
  ImageIcon,
  Layout,
  Monitor,
  Square,
  Type
} from 'lucide-react';
import { useState } from 'react';

import { cn } from '@/lib/utils.ts';

import type { Element } from './types';

interface LayerItemProps {
  depth?: number;
  el: Element;
  selectedIds: string[];
  setSelection: (ids: string[], primaryId?: string | null) => void;
  toggleSelection: (id: string) => void;
}

export const LayerItem = ({
  el,
  depth = 0,
  selectedIds,
  setSelection,
  toggleSelection
}: LayerItemProps) => {
  const [isOpen, setIsOpen] = useState(true);
  const hasChildren = el.children && el.children.length > 0;
  const isSelected = selectedIds.includes(el.id);

  return (
    <div>
      <div
        className={cn(
          'flex cursor-pointer items-center gap-2 px-2 py-1 text-xs hover:bg-slate-100',
          isSelected && 'bg-blue-50 font-medium text-blue-600'
        )}
        style={{ paddingLeft: `${depth * 12 + 8}px` }}
        onClick={(e) => {
          e.stopPropagation();
          if (e.shiftKey) {
            toggleSelection(el.id);
          } else {
            setSelection([el.id], el.id);
          }
        }}
      >
        {hasChildren ? (
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsOpen(!isOpen);
            }}
          >
            {isOpen ? (
              <ChevronDownIcon className='h-3 w-3' />
            ) : (
              <ChevronRightIcon className='h-3 w-3' />
            )}
          </button>
        ) : (
          <div className='w-3' />
        )}
        {el.type === 'frame' && <Monitor className='h-3 w-3' />}
        {el.type === 'rect' && <Square className='h-3 w-3' />}
        {el.type === 'circle' && <CircleIcon className='h-3 w-3' />}
        {el.type === 'group' && <Layout className='h-3 w-3' />}
        {el.type === 'image' && <ImageIcon className='h-3 w-3' />}
        {el.type === 'text' && <Type className='h-3 w-3' />}
        {el.type === 'instance' && <ComponentIcon className='h-3 w-3 text-purple-500' />}
        <span className='truncate'>{el.name}</span>
      </div>
      {isOpen &&
        el.children?.map((child) => (
          <LayerItem
            key={child.id}
            depth={depth + 1}
            el={child}
            selectedIds={selectedIds}
            setSelection={setSelection}
            toggleSelection={toggleSelection}
          />
        ))}
    </div>
  );
};
