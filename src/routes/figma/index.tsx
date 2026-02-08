import { createFileRoute } from '@tanstack/react-router';
import {
  ChevronDownIcon,
  ChevronRightIcon,
  Circle,
  Component as ComponentIcon,
  Copy,
  Download,
  Image as ImageIcon,
  Layout,
  Maximize,
  Minus,
  Monitor,
  MousePointer2,
  Plus,
  Square,
  Trash2,
  Type
} from 'lucide-react';
import * as React from 'react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button.tsx';
import { Input } from '@/components/ui/input.tsx';
import { Label } from '@/components/ui/label.tsx';
import { ScrollArea } from '@/components/ui/scroll-area.tsx';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select.tsx';
import { Separator } from '@/components/ui/separator.tsx';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs.tsx';
import { cn } from '@/lib/utils.ts';

type HorizontalConstraint = 'both' | 'center' | 'left' | 'right' | 'scale';
type VerticalConstraint = 'both' | 'bottom' | 'center' | 'scale' | 'top';

interface Constraints {
  horizontal: HorizontalConstraint;
  vertical: VerticalConstraint;
}

type ElementType = 'circle' | 'frame' | 'image' | 'instance' | 'rect' | 'text';

interface Element {
  children?: Element[];
  constraints: Constraints;
  fill: string;
  fontFamily?: string;
  fontSize?: number;
  fontWeight?: number;
  height: number;
  id: string;
  imageFit?: 'contain' | 'cover' | 'fill';
  imageSrc?: string;
  lineHeight?: number;
  masterId?: string;
  name: string;
  opacity: number;
  stroke: string;
  strokeWidth: number;
  text?: string;
  textAlign?: 'center' | 'left' | 'right';
  type: ElementType;
  width: number;
  x: number;
  y: number;
}

const generateId = () => Math.random().toString(36).substring(2, 9);
const clampZoom = (value: number) => Math.min(5, Math.max(0.1, value));
const escapeXML = (value: string) =>
  value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

interface DuplicateResult {
  duplicated: Element | null;
  elements: Element[];
}

const findElementById = (elements: Element[], id: string): Element | null => {
  for (const el of elements) {
    if (el.id === id) return el;
    if (el.children) {
      const found = findElementById(el.children, id);
      if (found) return found;
    }
  }
  return null;
};

const findParentElement = (
  elements: Element[],
  id: string,
  parent: Element | null = null
): Element | null => {
  for (const el of elements) {
    if (el.id === id) return parent;
    if (el.children) {
      const found = findParentElement(el.children, id, el);
      if (found) return found;
    }
  }
  return null;
};

const cloneElement = (el: Element, rename = false): Element => ({
  ...el,
  id: generateId(),
  name: rename ? `${el.name} Copy` : el.name,
  children: el.children ? el.children.map((child) => cloneElement(child)) : undefined
});

const updateElementInList = (
  elements: Element[],
  id: string,
  updates: Partial<Element>
): Element[] => {
  return elements.map((el) => {
    if (el.id === id) {
      const updated = { ...el, ...updates };
      if (
        el.type === 'frame' &&
        el.children &&
        (updates.width !== undefined || updates.height !== undefined)
      ) {
        updated.children = el.children.map((child) =>
          applyConstraints(
            child,
            el.width,
            el.height,
            updates.width ?? el.width,
            updates.height ?? el.height
          )
        );
      }
      return updated;
    }
    if (el.children) {
      return { ...el, children: updateElementInList(el.children, id, updates) };
    }
    return el;
  });
};

const deleteElementFromList = (elements: Element[], id: string): Element[] => {
  return elements
    .filter((el) => el.id !== id)
    .map((el) => ({
      ...el,
      children: el.children ? deleteElementFromList(el.children, id) : undefined
    }));
};

const applyConstraints = (
  element: Element,
  oldParentW: number,
  oldParentH: number,
  newParentW: number,
  newParentH: number
): Element => {
  let { x, y, width, height } = element;
  const dw = newParentW - oldParentW;
  const dh = newParentH - oldParentH;

  switch (element.constraints.horizontal) {
    case 'right':
      x += dw;
      break;
    case 'both':
      width += dw;
      break;
    case 'center':
      x = newParentW / 2 - oldParentW / 2 + x;
      break;
    case 'scale': {
      const ratioX = newParentW / oldParentW;
      x *= ratioX;
      width *= ratioX;
      break;
    }
  }

  switch (element.constraints.vertical) {
    case 'bottom':
      y += dh;
      break;
    case 'both':
      height += dh;
      break;
    case 'center':
      y = newParentH / 2 - oldParentH / 2 + y;
      break;
    case 'scale': {
      const ratioY = newParentH / oldParentH;
      y *= ratioY;
      height *= ratioY;
      break;
    }
  }

  return { ...element, x, y, width, height };
};

const FigmaLite = () => {
  const [elements, setElements] = useState<Element[]>(() => {
    const loginFrame: Element = {
      id: 'f1',
      name: 'Login',
      type: 'frame',
      x: 100,
      y: 100,
      width: 320,
      height: 568,
      fill: '#ffffff',
      stroke: '#e2e8f0',
      strokeWidth: 1,
      opacity: 1,
      constraints: { horizontal: 'left', vertical: 'top' },
      children: [
        {
          id: 't1',
          name: 'Title',
          type: 'text',
          x: 40,
          y: 60,
          width: 240,
          height: 40,
          fill: '#1e293b',
          stroke: '',
          strokeWidth: 0,
          opacity: 1,
          constraints: { horizontal: 'center', vertical: 'top' },
          text: 'MockDock',
          fontSize: 32
        },
        {
          id: 'r1',
          name: 'Input 1',
          type: 'rect',
          x: 30,
          y: 150,
          width: 260,
          height: 40,
          fill: '#f8fafc',
          stroke: '#e2e8f0',
          strokeWidth: 1,
          opacity: 1,
          constraints: { horizontal: 'both', vertical: 'top' }
        },
        {
          id: 'r2',
          name: 'Input 2',
          type: 'rect',
          x: 30,
          y: 200,
          width: 260,
          height: 40,
          fill: '#f8fafc',
          stroke: '#e2e8f0',
          strokeWidth: 1,
          opacity: 1,
          constraints: { horizontal: 'both', vertical: 'top' }
        },
        {
          id: 'b1',
          name: 'Login Button',
          type: 'rect',
          x: 30,
          y: 270,
          width: 260,
          height: 45,
          fill: '#3b82f6',
          stroke: '',
          strokeWidth: 0,
          opacity: 1,
          constraints: { horizontal: 'both', vertical: 'top' }
        },
        {
          id: 't2',
          name: 'Btn Label',
          type: 'text',
          x: 30,
          y: 270,
          width: 260,
          height: 45,
          fill: '#ffffff',
          stroke: '',
          strokeWidth: 0,
          opacity: 1,
          constraints: { horizontal: 'both', vertical: 'top' },
          text: 'Sign In',
          fontSize: 16
        }
      ]
    };
    const homeFrame: Element = {
      id: 'f2',
      name: 'Home',
      type: 'frame',
      x: 500,
      y: 100,
      width: 320,
      height: 568,
      fill: '#f1f5f9',
      stroke: '#e2e8f0',
      strokeWidth: 1,
      opacity: 1,
      constraints: { horizontal: 'left', vertical: 'top' },
      children: [
        {
          id: 'h1',
          name: 'Header',
          type: 'rect',
          x: 0,
          y: 0,
          width: 320,
          height: 60,
          fill: '#ffffff',
          stroke: '#e2e8f0',
          strokeWidth: 1,
          opacity: 1,
          constraints: { horizontal: 'both', vertical: 'top' }
        },
        {
          id: 'ht',
          name: 'Header Title',
          type: 'text',
          x: 0,
          y: 0,
          width: 320,
          height: 60,
          fill: '#0f172a',
          stroke: '',
          strokeWidth: 0,
          opacity: 1,
          constraints: { horizontal: 'center', vertical: 'top' },
          text: 'Dashboard',
          fontSize: 18
        },
        {
          id: 'c1',
          name: 'Card 1',
          type: 'rect',
          x: 20,
          y: 80,
          width: 280,
          height: 120,
          fill: '#ffffff',
          stroke: '#e2e8f0',
          strokeWidth: 1,
          opacity: 1,
          constraints: { horizontal: 'both', vertical: 'top' }
        },
        {
          id: 'c2',
          name: 'Card 2',
          type: 'rect',
          x: 20,
          y: 220,
          width: 280,
          height: 120,
          fill: '#ffffff',
          stroke: '#e2e8f0',
          strokeWidth: 1,
          opacity: 1,
          constraints: { horizontal: 'both', vertical: 'top' }
        },
        {
          id: 'nb',
          name: 'Nav Bar',
          type: 'rect',
          x: 0,
          y: 508,
          width: 320,
          height: 60,
          fill: '#ffffff',
          stroke: '#e2e8f0',
          strokeWidth: 1,
          opacity: 1,
          constraints: { horizontal: 'both', vertical: 'bottom' }
        }
      ]
    };
    const profileFrame: Element = {
      id: 'f3',
      name: 'Profile',
      type: 'frame',
      x: 900,
      y: 100,
      width: 320,
      height: 568,
      fill: '#ffffff',
      stroke: '#e2e8f0',
      strokeWidth: 1,
      opacity: 1,
      constraints: { horizontal: 'left', vertical: 'top' },
      children: [
        {
          id: 'pa',
          name: 'Avatar',
          type: 'circle',
          x: 110,
          y: 80,
          width: 100,
          height: 100,
          fill: '#cbd5e1',
          stroke: '#94a3b8',
          strokeWidth: 2,
          opacity: 1,
          constraints: { horizontal: 'center', vertical: 'top' }
        },
        {
          id: 'pn',
          name: 'Name',
          type: 'text',
          x: 40,
          y: 200,
          width: 240,
          height: 30,
          fill: '#1e293b',
          stroke: '',
          strokeWidth: 0,
          opacity: 1,
          constraints: { horizontal: 'center', vertical: 'top' },
          text: 'John Doe',
          fontSize: 20
        },
        {
          id: 'pe',
          name: 'Email',
          type: 'text',
          x: 40,
          y: 230,
          width: 240,
          height: 20,
          fill: '#64748b',
          stroke: '',
          strokeWidth: 0,
          opacity: 1,
          constraints: { horizontal: 'center', vertical: 'top' },
          text: 'john@example.com',
          fontSize: 14
        },
        {
          id: 'pb',
          name: 'Edit Profile',
          type: 'rect',
          x: 60,
          y: 280,
          width: 200,
          height: 40,
          fill: '#ffffff',
          stroke: '#3b82f6',
          strokeWidth: 1,
          opacity: 1,
          constraints: { horizontal: 'both', vertical: 'top' }
        }
      ]
    };
    return [loginFrame, homeFrame, profileFrame];
  });
  const [masters, setMasters] = useState<Record<string, Element>>({});
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [tool, setTool] = useState<'select' | ElementType>('select');
  const [isDragging, setIsDragging] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const imageTargetRef = useRef<{ mode: 'new' | 'replace'; id?: string }>({ mode: 'new' });
  const imageCacheRef = useRef<Map<string, HTMLImageElement>>(new Map());
  const dragRef = useRef<{
    id?: string;
    isPanning?: boolean;
    startX: number;
    startY: number;
    elX: number;
    elY: number;
  } | null>(null);

  const selectedElement = useMemo(
    () => (selectedId ? findElementById(elements, selectedId) || masters[selectedId] : null),
    [elements, masters, selectedId]
  );

  const addElement = (type: ElementType) => {
    const parentFrame = selectedElement?.type === 'frame' ? selectedElement : null;

    const newEl: Element = {
      id: generateId(),
      name: `${type.charAt(0).toUpperCase() + type.slice(1)} ${elements.length + 1}`,
      type,
      x: parentFrame ? 20 : 100,
      y: parentFrame ? 20 : 100,
      width: type === 'frame' ? 320 : 100,
      height: type === 'frame' ? 568 : 100,
      fill: type === 'frame' ? '#ffffff' : type === 'text' ? '#000000' : '#e2e8f0',
      stroke: '#94a3b8',
      strokeWidth: type === 'frame' ? 1 : 0,
      opacity: 1,
      constraints: { horizontal: 'left', vertical: 'top' },
      children: type === 'frame' ? [] : undefined,
      text: type === 'text' ? 'New Text' : undefined,
      fontSize: type === 'text' ? 16 : undefined,
      fontFamily: type === 'text' ? 'ui-sans-serif, system-ui, -apple-system' : undefined,
      fontWeight: type === 'text' ? 400 : undefined,
      textAlign: type === 'text' ? 'center' : undefined,
      lineHeight: type === 'text' ? 1.2 : undefined
    };

    if (parentFrame) {
      setElements((prev) =>
        updateElementInList(prev, parentFrame.id, {
          children: [...(parentFrame.children || []), newEl]
        })
      );
    } else {
      setElements((prev) => [...prev, newEl]);
    }
    setSelectedId(newEl.id);
  };

  const updateElement = useCallback(
    (id: string, updates: Partial<Element>) => {
      if (masters[id]) {
        setMasters((prev) => ({ ...prev, [id]: { ...prev[id], ...updates } }));
        return;
      }
      setElements((prev) => updateElementInList(prev, id, updates));
    },
    [masters]
  );

  const deleteSelected = () => {
    if (selectedId) {
      setElements((prev) => deleteElementFromList(prev, selectedId));
      setSelectedId(null);
    }
  };

  const openImagePicker = useCallback((mode: 'new' | 'replace', id?: string) => {
    imageTargetRef.current = { mode, id };
    imageInputRef.current?.click();
  }, []);

  const addImageElement = useCallback(
    (file: File, src: string) => {
      const img = new window.Image();
      img.onload = () => {
        const naturalW = img.naturalWidth || 1;
        const naturalH = img.naturalHeight || 1;
        let width = naturalW;
        let height = naturalH;
        const maxSize = 320;
        const scale = Math.min(1, maxSize / Math.max(width, height));
        width *= scale;
        height *= scale;

        let parentFrame: Element | null = null;
        if (selectedElement?.type === 'frame') {
          parentFrame = selectedElement;
        } else if (selectedId) {
          const parent = findParentElement(elements, selectedId);
          if (parent?.type === 'frame') parentFrame = parent;
        }
        if (parentFrame) {
          width = parentFrame.width;
          height = parentFrame.height;
        }

        const newEl: Element = {
          id: generateId(),
          name: file.name || 'Image',
          type: 'image',
          x: parentFrame ? 0 : 100,
          y: parentFrame ? 0 : 100,
          width,
          height,
          fill: '#ffffff',
          stroke: '#94a3b8',
          strokeWidth: 0,
          opacity: 1,
          constraints: { horizontal: 'left', vertical: 'top' },
          imageSrc: src,
          imageFit: parentFrame ? 'cover' : 'contain'
        };

        if (parentFrame) {
          setElements((prev) =>
            updateElementInList(prev, parentFrame.id, {
              children: [...(parentFrame.children || []), newEl]
            })
          );
        } else {
          setElements((prev) => [...prev, newEl]);
        }

        imageCacheRef.current.set(src, img);
        setSelectedId(newEl.id);
      };
      img.src = src;
    },
    [elements, selectedElement, selectedId]
  );

  const handleImageInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      const target = imageTargetRef.current;

      const reader = new FileReader();
      reader.onload = () => {
        const src = typeof reader.result === 'string' ? reader.result : '';
        if (!src) return;

        if (target.mode === 'replace' && target.id) {
          updateElement(target.id, { imageSrc: src });
          const img = new window.Image();
          img.onload = () => {
            imageCacheRef.current.set(src, img);
          };
          img.src = src;
          return;
        }

        addImageElement(file, src);
      };
      reader.readAsDataURL(file);
      e.target.value = '';
    },
    [addImageElement, updateElement]
  );

  const zoomAtPoint = useCallback(
    (nextZoom: number, clientX: number, clientY: number) => {
      const canvas = canvasRef.current;
      if (!canvas) {
        setZoom(nextZoom);
        return;
      }
      const rect = canvas.getBoundingClientRect();
      const mouseX = clientX - rect.left;
      const mouseY = clientY - rect.top;

      const worldX = (mouseX - pan.x) / zoom;
      const worldY = (mouseY - pan.y) / zoom;

      const nextPanX = mouseX - worldX * nextZoom;
      const nextPanY = mouseY - worldY * nextZoom;

      setZoom(nextZoom);
      setPan({ x: nextPanX, y: nextPanY });
    },
    [pan.x, pan.y, zoom]
  );

  const zoomToCenter = useCallback(
    (nextZoom: number) => {
      const canvas = canvasRef.current;
      if (!canvas) {
        setZoom(nextZoom);
        return;
      }
      const rect = canvas.getBoundingClientRect();
      zoomAtPoint(nextZoom, rect.left + rect.width / 2, rect.top + rect.height / 2);
    },
    [zoomAtPoint]
  );

  const duplicateElementInList = useCallback((list: Element[], id: string): DuplicateResult => {
    let duplicated: Element | null = null;
    const next: Element[] = [];

    for (const el of list) {
      if (el.id === id) {
        const clone = cloneElement(el, true);
        clone.x += 20;
        clone.y += 20;
        duplicated = clone;
        next.push(el, clone);
        continue;
      }

      if (el.children) {
        const result: DuplicateResult = duplicateElementInList(el.children, id);
        if (result.duplicated) {
          duplicated = result.duplicated;
          next.push({ ...el, children: result.elements });
          continue;
        }
      }

      next.push(el);
    }

    return { elements: next, duplicated };
  }, []);

  const duplicateSelected = useCallback(() => {
    if (!selectedId || !selectedElement) return;

    if (masters[selectedId]) {
      const clone = cloneElement(masters[selectedId], true);
      setMasters((prev) => ({ ...prev, [clone.id]: clone }));
      setSelectedId(clone.id);
      return;
    }

    const result = duplicateElementInList(elements, selectedId);
    if (result.duplicated) {
      setElements(result.elements);
      setSelectedId(result.duplicated.id);
    }
  }, [duplicateElementInList, elements, masters, selectedElement, selectedId]);

  const nudgeSelected = useCallback(
    (dx: number, dy: number) => {
      if (!selectedId || !selectedElement) return;
      updateElement(selectedId, { x: selectedElement.x + dx, y: selectedElement.y + dy });
    },
    [selectedElement, selectedId, updateElement]
  );

  const alignSelected = useCallback(
    (mode: 'bottom' | 'centerX' | 'centerY' | 'left' | 'right' | 'top') => {
      if (!selectedId || !selectedElement) return;

      const parent = findParentElement(elements, selectedId);
      let bounds: { x: number; y: number; width: number; height: number } | null = null;

      if (parent) {
        bounds = { x: 0, y: 0, width: parent.width, height: parent.height };
      } else {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const rect = canvas.getBoundingClientRect();
        bounds = {
          x: -pan.x / zoom,
          y: -pan.y / zoom,
          width: rect.width / zoom,
          height: rect.height / zoom
        };
      }

      let nextX = selectedElement.x;
      let nextY = selectedElement.y;

      switch (mode) {
        case 'left':
          nextX = bounds.x;
          break;
        case 'right':
          nextX = bounds.x + bounds.width - selectedElement.width;
          break;
        case 'centerX':
          nextX = bounds.x + (bounds.width - selectedElement.width) / 2;
          break;
        case 'top':
          nextY = bounds.y;
          break;
        case 'bottom':
          nextY = bounds.y + bounds.height - selectedElement.height;
          break;
        case 'centerY':
          nextY = bounds.y + (bounds.height - selectedElement.height) / 2;
          break;
      }

      updateElement(selectedId, { x: nextX, y: nextY });
    },
    [elements, pan.x, pan.y, selectedElement, selectedId, updateElement, zoom]
  );

  const getCanvasPoint = useCallback(
    (e: React.PointerEvent<HTMLCanvasElement>) => {
      const canvas = canvasRef.current;
      if (!canvas) return { x: 0, y: 0 };
      const rect = canvas.getBoundingClientRect();
      return {
        x: (e.clientX - rect.left - pan.x) / zoom,
        y: (e.clientY - rect.top - pan.y) / zoom
      };
    },
    [pan.x, pan.y, zoom]
  );

  const hitTestElements = useCallback(
    (point: { x: number; y: number }) => {
      const hitTest = (list: Element[], offsetX: number, offsetY: number): Element | null => {
        for (let i = list.length - 1; i >= 0; i -= 1) {
          const el = list[i];
          const x = offsetX + el.x;
          const y = offsetY + el.y;

          if (el.children && el.children.length > 0) {
            const hitChild = hitTest(el.children, x, y);
            if (hitChild) return hitChild;
          }

          if (el.type === 'circle') {
            const cx = x + el.width / 2;
            const cy = y + el.height / 2;
            const radius = el.width / 2;
            const dx = point.x - cx;
            const dy = point.y - cy;
            if (dx * dx + dy * dy <= radius * radius) return el;
            continue;
          }

          const withinRect =
            point.x >= x && point.x <= x + el.width && point.y >= y && point.y <= y + el.height;
          if (withinRect) return el;
        }
        return null;
      };

      return hitTest(elements, 0, 0);
    },
    [elements]
  );

  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    e.stopPropagation();
    const point = getCanvasPoint(e);
    const hit = hitTestElements(point);

    if (hit) {
      setSelectedId(hit.id);
      setIsDragging(true);
      dragRef.current = {
        id: hit.id,
        startX: e.clientX,
        startY: e.clientY,
        elX: hit.x,
        elY: hit.y
      };
    } else {
      setSelectedId(null);
      setIsDragging(true);
      dragRef.current = {
        isPanning: true,
        startX: e.clientX,
        startY: e.clientY,
        elX: pan.x,
        elY: pan.y
      };
    }
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!dragRef.current) return;
    const { id, isPanning, startX, startY, elX, elY } = dragRef.current;

    if (isPanning) {
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;
      setPan({ x: elX + dx, y: elY + dy });
    } else if (id) {
      const dx = (e.clientX - startX) / zoom;
      const dy = (e.clientY - startY) / zoom;
      updateElement(id, { x: elX + dx, y: elY + dy });
    }
  };

  const handlePointerUp = () => {
    dragRef.current = null;
    setIsDragging(false);
  };

  const handleWheel = (e: React.WheelEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const isPinch = e.ctrlKey || e.metaKey;
    const zoomIntensity = isPinch ? 0.003 : 0.002;
    const zoomFactor = Math.exp(-e.deltaY * zoomIntensity);
    const nextZoom = clampZoom(zoom * zoomFactor);
    zoomAtPoint(nextZoom, e.clientX, e.clientY);
  };

  const createMaster = () => {
    if (!selectedElement) return;
    const masterId = generateId();
    setMasters((prev) => ({
      ...prev,
      [masterId]: { ...selectedElement, id: masterId, name: `Master: ${selectedElement.name}` }
    }));
  };

  const createInstance = (masterId: string) => {
    const master = masters[masterId];
    if (!master) return;
    const instance: Element = {
      ...master,
      id: generateId(),
      type: 'instance',
      masterId,
      name: `Instance of ${master.name}`,
      children: master.children ? JSON.parse(JSON.stringify(master.children)) : undefined
    };
    setElements((prev) => [...prev, instance]);
  };

  const exportJSON = () => {
    const data = JSON.stringify({ elements, masters }, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'figma-lite.json';
    a.click();
  };

  const exportSVG = () => {
    const frame = elements.find((el) => el.type === 'frame');
    if (!frame) {
      toast.error('Add a frame first');
      return;
    }

    const renderSVGElement = (el: Element): string => {
      let content = '';
      if (el.type === 'rect' || el.type === 'frame' || el.type === 'instance') {
        content = `<rect x="${el.x}" y="${el.y}" width="${el.width}" height="${el.height}" fill="${el.fill}" stroke="${el.stroke}" stroke-width="${el.strokeWidth}" fill-opacity="${el.opacity}" />`;
      } else if (el.type === 'circle') {
        content = `<circle cx="${el.x + el.width / 2}" cy="${el.y + el.height / 2}" r="${el.width / 2}" fill="${el.fill}" stroke="${el.stroke}" stroke-width="${el.strokeWidth}" fill-opacity="${el.opacity}" />`;
      } else if (el.type === 'image') {
        if (el.imageSrc) {
          const fit = el.imageFit || 'contain';
          const preserve =
            fit === 'fill' ? 'none' : fit === 'cover' ? 'xMidYMid slice' : 'xMidYMid meet';
          content = `<image href="${el.imageSrc}" x="${el.x}" y="${el.y}" width="${el.width}" height="${el.height}" preserveAspectRatio="${preserve}" opacity="${el.opacity}" />`;
        }
      } else if (el.type === 'text') {
        const fontSize = el.fontSize || 16;
        const fontFamily = el.fontFamily || 'ui-sans-serif, system-ui, -apple-system';
        const fontWeight = el.fontWeight || 400;
        const align = el.textAlign || 'center';
        const anchor = align === 'left' ? 'start' : align === 'right' ? 'end' : 'middle';
        const lineHeight = (el.lineHeight || 1.2) * fontSize;
        const lines = (el.text || '').split('\n');
        const textX =
          align === 'left' ? el.x : align === 'right' ? el.x + el.width : el.x + el.width / 2;
        const startY = el.y + el.height / 2 - (lineHeight * (lines.length - 1)) / 2;

        const tspans = lines
          .map((line, index) => {
            const dy = index === 0 ? 0 : lineHeight;
            return `<tspan x="${textX}" dy="${dy}">${escapeXML(line)}</tspan>`;
          })
          .join('');

        content = `<text x="${textX}" y="${startY}" fill="${el.fill}" font-size="${fontSize}" font-family="${fontFamily}" font-weight="${fontWeight}" text-anchor="${anchor}" dominant-baseline="middle">${tspans}</text>`;
      }

      if (el.children) {
        content += `<g transform="translate(${el.x}, ${el.y})">`;
        content += el.children.map(renderSVGElement).join('');
        content += `</g>`;
      }
      return content;
    };

    const svg = `<svg width="${frame.width}" height="${frame.height}" viewBox="0 0 ${frame.width} ${frame.height}" xmlns="http://www.w3.org/2000/svg">${renderSVGElement(
      {
        ...frame,
        x: 0,
        y: 0
      }
    )}</svg>`;
    const blob = new Blob([svg], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'figma-lite.svg';
    a.click();
  };

  const drawScene = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const width = Math.max(1, rect.width);
    const height = Math.max(1, rect.height);
    const dpr = window.devicePixelRatio || 1;

    const targetWidth = Math.round(width * dpr);
    const targetHeight = Math.round(height * dpr);
    if (canvas.width !== targetWidth || canvas.height !== targetHeight) {
      canvas.width = targetWidth;
      canvas.height = targetHeight;
    }

    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, width, height);

    ctx.fillStyle = '#e5e5e5';
    ctx.fillRect(0, 0, width, height);

    const gridSize = 24;
    const left = -pan.x / zoom;
    const top = -pan.y / zoom;
    const right = (width - pan.x) / zoom;
    const bottom = (height - pan.y) / zoom;

    ctx.save();
    ctx.translate(pan.x, pan.y);
    ctx.scale(zoom, zoom);

    ctx.fillStyle = '#d1d5db';
    const startX = Math.floor(left / gridSize) * gridSize;
    const endX = Math.ceil(right / gridSize) * gridSize;
    const startY = Math.floor(top / gridSize) * gridSize;
    const endY = Math.ceil(bottom / gridSize) * gridSize;

    for (let x = startX; x <= endX; x += gridSize) {
      for (let y = startY; y <= endY; y += gridSize) {
        ctx.fillRect(x, y, 1, 1);
      }
    }

    const drawElement = (el: Element, offsetX: number, offsetY: number) => {
      const x = offsetX + el.x;
      const y = offsetY + el.y;
      const isFrame = el.type === 'frame';
      const isSelected = selectedId === el.id;

      ctx.save();
      ctx.globalAlpha = el.opacity;

      if (el.type === 'rect' || el.type === 'frame' || el.type === 'instance') {
        if (el.fill) {
          ctx.fillStyle = el.fill;
          ctx.fillRect(x, y, el.width, el.height);
        }
        if (el.strokeWidth > 0 && el.stroke) {
          ctx.strokeStyle = el.stroke;
          ctx.lineWidth = el.strokeWidth;
          ctx.strokeRect(x, y, el.width, el.height);
        }
      } else if (el.type === 'circle') {
        const radius = el.width / 2;
        const cx = x + radius;
        const cy = y + radius;
        ctx.beginPath();
        ctx.arc(cx, cy, radius, 0, Math.PI * 2);
        if (el.fill) {
          ctx.fillStyle = el.fill;
          ctx.fill();
        }
        if (el.strokeWidth > 0 && el.stroke) {
          ctx.strokeStyle = el.stroke;
          ctx.lineWidth = el.strokeWidth;
          ctx.stroke();
        }
      } else if (el.type === 'image') {
        ctx.save();
        ctx.beginPath();
        ctx.rect(x, y, el.width, el.height);
        ctx.clip();

        const src = el.imageSrc;
        if (src) {
          let image = imageCacheRef.current.get(src);
          if (!image) {
            image = new window.Image();
            image.onload = () => {
              imageCacheRef.current.set(src, image!);
              drawScene();
            };
            image.src = src;
            imageCacheRef.current.set(src, image);
          }

          if (image.complete && image.naturalWidth > 0) {
            const fit = el.imageFit || 'contain';
            if (fit === 'fill') {
              ctx.drawImage(image, x, y, el.width, el.height);
            } else {
              const scale =
                fit === 'cover'
                  ? Math.max(el.width / image.naturalWidth, el.height / image.naturalHeight)
                  : Math.min(el.width / image.naturalWidth, el.height / image.naturalHeight);
              const drawW = image.naturalWidth * scale;
              const drawH = image.naturalHeight * scale;
              const drawX = x + (el.width - drawW) / 2;
              const drawY = y + (el.height - drawH) / 2;
              ctx.drawImage(image, drawX, drawY, drawW, drawH);
            }
          } else {
            ctx.fillStyle = '#e2e8f0';
            ctx.fillRect(x, y, el.width, el.height);
          }
        } else {
          ctx.fillStyle = '#e2e8f0';
          ctx.fillRect(x, y, el.width, el.height);
        }
        ctx.restore();

        if (el.strokeWidth > 0 && el.stroke) {
          ctx.strokeStyle = el.stroke;
          ctx.lineWidth = el.strokeWidth;
          ctx.strokeRect(x, y, el.width, el.height);
        }
      } else if (el.type === 'text') {
        const fontSize = el.fontSize || 16;
        const fontFamily = el.fontFamily || 'ui-sans-serif, system-ui, -apple-system';
        const fontWeight = el.fontWeight || 400;
        const align = el.textAlign || 'center';
        const lineHeight = (el.lineHeight || 1.2) * fontSize;
        const lines = (el.text || '').split('\n');

        ctx.fillStyle = el.fill || '#000000';
        ctx.font = `${fontWeight} ${fontSize}px ${fontFamily}`;
        ctx.textAlign = align;
        ctx.textBaseline = 'middle';

        const textX = align === 'left' ? x : align === 'right' ? x + el.width : x + el.width / 2;
        const totalHeight = lineHeight * lines.length;
        const startY = y + el.height / 2 - totalHeight / 2 + lineHeight / 2;

        lines.forEach((line, index) => {
          ctx.fillText(line, textX, startY + index * lineHeight);
        });
      }
      ctx.restore();

      if (isFrame) {
        ctx.save();
        ctx.beginPath();
        ctx.rect(x, y, el.width, el.height);
        ctx.clip();
        if (el.children) {
          for (const child of el.children) {
            drawElement(child, x, y);
          }
        }
        ctx.restore();
      } else if (el.children) {
        for (const child of el.children) {
          drawElement(child, x, y);
        }
      }

      if (isFrame) {
        ctx.save();
        const labelText = el.name.toUpperCase();
        ctx.font = '8px ui-sans-serif, system-ui, -apple-system';
        const paddingX = 4;
        const paddingY = 2;
        const metrics = ctx.measureText(labelText);
        const labelWidth = metrics.width + paddingX * 2;
        const labelHeight = 12;
        ctx.fillStyle = 'rgba(241, 245, 249, 0.9)';
        ctx.fillRect(x, y, labelWidth, labelHeight);
        ctx.fillStyle = '#94a3b8';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'top';
        ctx.fillText(labelText, x + paddingX, y + paddingY);
        ctx.restore();
      }

      if (isSelected) {
        ctx.save();
        ctx.strokeStyle = '#3b82f6';
        ctx.lineWidth = 2;
        ctx.strokeRect(x - 1, y - 1, el.width + 2, el.height + 2);
        ctx.restore();
      }
    };

    for (const el of elements) {
      drawElement(el, 0, 0);
    }

    ctx.restore();
  }, [elements, pan.x, pan.y, selectedId, zoom]);

  useEffect(() => {
    drawScene();
  }, [drawScene]);

  useEffect(() => {
    const handleResize = () => drawScene();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [drawScene]);

  useEffect(() => {
    const isEditableTarget = (target: EventTarget | null) => {
      const el = target as HTMLElement | null;
      if (!el) return false;
      const tag = el.tagName?.toLowerCase();
      return tag === 'input' || tag === 'textarea' || tag === 'select' || el.isContentEditable;
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (isEditableTarget(e.target)) return;

      const mod = e.ctrlKey || e.metaKey;
      const key = e.key.toLowerCase();

      if (mod && e.shiftKey) {
        if (key === 'l') {
          e.preventDefault();
          alignSelected('left');
          return;
        }
        if (key === 'r') {
          e.preventDefault();
          alignSelected('right');
          return;
        }
        if (key === 't') {
          e.preventDefault();
          alignSelected('top');
          return;
        }
        if (key === 'b') {
          e.preventDefault();
          alignSelected('bottom');
          return;
        }
        if (key === 'h') {
          e.preventDefault();
          alignSelected('centerX');
          return;
        }
        if (key === 'v') {
          e.preventDefault();
          alignSelected('centerY');
          return;
        }
      }

      if (mod && (key === '=' || key === '+' || key === '-' || key === '0')) {
        e.preventDefault();
        if (key === '0') {
          zoomToCenter(1);
          return;
        }
        const step = key === '-' ? 1 / 1.1 : 1.1;
        zoomToCenter(clampZoom(zoom * step));
        return;
      }

      if (mod && key === 'd') {
        e.preventDefault();
        duplicateSelected();
        return;
      }

      if (key === 'delete' || key === 'backspace') {
        if (selectedId) {
          e.preventDefault();
          deleteSelected();
        }
        return;
      }

      if (!selectedElement) return;
      const nudgeStep = e.shiftKey ? 10 : 1;
      if (key === 'arrowleft') {
        e.preventDefault();
        nudgeSelected(-nudgeStep, 0);
      } else if (key === 'arrowright') {
        e.preventDefault();
        nudgeSelected(nudgeStep, 0);
      } else if (key === 'arrowup') {
        e.preventDefault();
        nudgeSelected(0, -nudgeStep);
      } else if (key === 'arrowdown') {
        e.preventDefault();
        nudgeSelected(0, nudgeStep);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    alignSelected,
    deleteSelected,
    duplicateSelected,
    nudgeSelected,
    selectedElement,
    selectedId,
    zoom,
    zoomToCenter
  ]);

  const LayerItem = ({ el, depth = 0 }: { el: Element; depth?: number }) => {
    const [isOpen, setIsOpen] = useState(true);
    const hasChildren = el.children && el.children.length > 0;
    const isSelected = selectedId === el.id;

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
            setSelectedId(el.id);
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
          {el.type === 'circle' && <Circle className='h-3 w-3' />}
          {el.type === 'image' && <ImageIcon className='h-3 w-3' />}
          {el.type === 'text' && <Type className='h-3 w-3' />}
          {el.type === 'instance' && <ComponentIcon className='h-3 w-3 text-purple-500' />}
          <span className='truncate'>{el.name}</span>
        </div>
        {isOpen &&
          el.children?.map((child) => <LayerItem key={child.id} depth={depth + 1} el={child} />)}
      </div>
    );
  };

  return (
    <div className='flex h-screen flex-col overflow-hidden bg-slate-50 font-sans text-slate-900'>
      {/* Toolbar */}
      <header className='z-20 flex h-12 shrink-0 items-center justify-between border-b bg-white px-4 shadow-sm'>
        <input
          ref={imageInputRef}
          accept='image/*'
          className='hidden'
          type='file'
          onChange={handleImageInputChange}
        />
        <div className='flex items-center gap-4'>
          <div className='flex items-center gap-1 rounded-lg bg-slate-100 p-1'>
            <Button
              className='h-8 w-8'
              size='icon'
              variant={tool === 'select' ? 'secondary' : 'ghost'}
              onClick={() => setTool('select')}
            >
              <MousePointer2 className='h-4 w-4' />
            </Button>
            <Separator className='mx-1 h-4' orientation='vertical' />
            <Button
              className='h-8 w-8'
              size='icon'
              variant='ghost'
              onClick={() => addElement('frame')}
            >
              <Monitor className='h-4 w-4' />
            </Button>
            <Button
              className='h-8 w-8'
              size='icon'
              variant='ghost'
              onClick={() => addElement('rect')}
            >
              <Square className='h-4 w-4' />
            </Button>
            <Button
              className='h-8 w-8'
              size='icon'
              variant='ghost'
              onClick={() => addElement('circle')}
            >
              <Circle className='h-4 w-4' />
            </Button>
            <Button
              className='h-8 w-8'
              size='icon'
              variant='ghost'
              onClick={() => openImagePicker('new')}
            >
              <ImageIcon className='h-4 w-4' />
            </Button>
            <Button
              className='h-8 w-8'
              size='icon'
              variant='ghost'
              onClick={() => addElement('text')}
            >
              <Type className='h-4 w-4' />
            </Button>
          </div>

          <div className='flex items-center gap-2 text-xs font-medium text-slate-500'>
            <Button
              className='h-6 w-6'
              size='icon'
              variant='ghost'
              onClick={() => setZoom(Math.max(0.1, zoom - 0.1))}
            >
              <Minus className='h-3 w-3' />
            </Button>
            <span className='w-10 text-center'>{Math.round(zoom * 100)}%</span>
            <Button
              className='h-6 w-6'
              size='icon'
              variant='ghost'
              onClick={() => setZoom(Math.min(5, zoom + 0.1))}
            >
              <Plus className='h-3 w-3' />
            </Button>
            <Button className='h-6 w-6' size='icon' variant='ghost' onClick={() => setZoom(1)}>
              <Maximize className='h-3 w-3' />
            </Button>
          </div>
        </div>

        <div className='flex items-center gap-2'>
          <Button className='h-8' size='sm' variant='outline' onClick={exportJSON}>
            <Download className='mr-2 h-3.5 w-3.5' /> JSON
          </Button>
          <Button className='h-8' size='sm' variant='outline' onClick={exportSVG}>
            <Copy className='mr-2 h-3.5 w-3.5' /> SVG
          </Button>
        </div>
      </header>
      <div className='flex flex-1 overflow-hidden'>
        <aside className='z-10 flex w-64 shrink-0 flex-col border-r bg-white'>
          <Tabs className='flex flex-1 flex-col' defaultValue='layers'>
            <TabsList className='h-10 w-full justify-start rounded-none border-b bg-transparent px-2'>
              <TabsTrigger
                className='h-full rounded-none border-b-2 border-transparent text-xs data-[state=active]:border-blue-600'
                value='layers'
              >
                Layers
              </TabsTrigger>
              <TabsTrigger
                className='h-full rounded-none border-b-2 border-transparent text-xs data-[state=active]:border-blue-600'
                value='assets'
              >
                Assets
              </TabsTrigger>
            </TabsList>
            <TabsContent className='m-0 flex flex-1 flex-col overflow-hidden p-0' value='layers'>
              <ScrollArea className='flex-1'>
                <div className='py-2'>
                  {elements.map((el) => (
                    <LayerItem key={el.id} el={el} />
                  ))}
                </div>
                {Object.keys(masters).length > 0 && (
                  <div className='mt-4'>
                    <div className='px-4 py-1 text-[10px] font-bold text-slate-400 uppercase'>
                      Components
                    </div>
                    {Object.values(masters).map((m) => (
                      <div
                        key={m.id}
                        className='flex cursor-pointer items-center gap-2 px-4 py-1.5 text-xs hover:bg-slate-50'
                        onClick={() => createInstance(m.id)}
                      >
                        <ComponentIcon className='h-3 w-3 text-purple-500' />
                        <span>{m.name}</span>
                      </div>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </TabsContent>
          </Tabs>
        </aside>
        <canvas
          ref={canvasRef}
          className={cn(
            'relative w-[130vh] flex-1 touch-none bg-[#e5e5e5]',
            isDragging ? 'cursor-grabbing' : 'cursor-grab'
          )}
          onPointerCancel={handlePointerUp}
          onPointerDown={handlePointerDown}
          onPointerLeave={handlePointerUp}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onWheel={handleWheel}
        />
        <aside className='z-10 flex w-72 shrink-0 flex-col border-l bg-white'>
          <Tabs className='flex flex-1 flex-col' defaultValue='design'>
            <TabsList className='h-10 w-full justify-start rounded-none border-b bg-transparent px-2'>
              <TabsTrigger
                className='h-full rounded-none border-b-2 border-transparent text-xs data-[state=active]:border-blue-600'
                value='design'
              >
                Design
              </TabsTrigger>
              <TabsTrigger
                className='h-full rounded-none border-b-2 border-transparent text-xs data-[state=active]:border-blue-600'
                value='prototype'
              >
                Prototype
              </TabsTrigger>
            </TabsList>
            <TabsContent className='m-0 flex-1 overflow-auto p-0' value='design'>
              {selectedElement ? (
                <div className='space-y-6 p-4'>
                  <div className='space-y-3'>
                    <h3 className='text-[10px] font-bold text-slate-400 uppercase'>Layout</h3>
                    <div className='grid grid-cols-2 gap-x-4 gap-y-2'>
                      <div className='flex items-center gap-2'>
                        <span className='w-4 font-mono text-[10px] text-slate-400'>X</span>
                        <Input
                          className='h-7 px-2 text-xs'
                          type='number'
                          value={Math.round(selectedElement.x)}
                          onChange={(e) =>
                            updateElement(selectedId!, { x: Number(e.target.value) })
                          }
                        />
                      </div>
                      <div className='flex items-center gap-2'>
                        <span className='w-4 font-mono text-[10px] text-slate-400'>Y</span>
                        <Input
                          className='h-7 px-2 text-xs'
                          type='number'
                          value={Math.round(selectedElement.y)}
                          onChange={(e) =>
                            updateElement(selectedId!, { y: Number(e.target.value) })
                          }
                        />
                      </div>
                      <div className='flex items-center gap-2'>
                        <span className='w-4 font-mono text-[10px] text-slate-400'>W</span>
                        <Input
                          className='h-7 px-2 text-xs'
                          type='number'
                          value={Math.round(selectedElement.width)}
                          onChange={(e) =>
                            updateElement(selectedId!, { width: Number(e.target.value) })
                          }
                        />
                      </div>
                      <div className='flex items-center gap-2'>
                        <span className='w-4 font-mono text-[10px] text-slate-400'>H</span>
                        <Input
                          className='h-7 px-2 text-xs'
                          type='number'
                          value={Math.round(selectedElement.height)}
                          onChange={(e) =>
                            updateElement(selectedId!, { height: Number(e.target.value) })
                          }
                        />
                      </div>
                    </div>
                  </div>
                  <Separator />
                  <div className='space-y-3'>
                    <h3 className='text-[10px] font-bold text-slate-400 uppercase'>Constraints</h3>
                    <div className='grid grid-cols-1 gap-2'>
                      <div className='space-y-1'>
                        <Label className='text-[10px]'>Horizontal</Label>
                        <Select
                          value={selectedElement.constraints.horizontal}
                          onValueChange={(v) =>
                            updateElement(selectedId!, {
                              constraints: {
                                ...selectedElement.constraints,
                                horizontal: v as HorizontalConstraint
                              }
                            })
                          }
                        >
                          <SelectTrigger className='h-8 text-xs'>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value='left'>Left</SelectItem>
                            <SelectItem value='right'>Right</SelectItem>
                            <SelectItem value='both'>Left & Right</SelectItem>
                            <SelectItem value='center'>Center</SelectItem>
                            <SelectItem value='scale'>Scale</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className='space-y-1'>
                        <Label className='text-[10px]'>Vertical</Label>
                        <Select
                          value={selectedElement.constraints.vertical}
                          onValueChange={(v) =>
                            updateElement(selectedId!, {
                              constraints: {
                                ...selectedElement.constraints,
                                vertical: v as VerticalConstraint
                              }
                            })
                          }
                        >
                          <SelectTrigger className='h-8 text-xs'>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value='top'>Top</SelectItem>
                            <SelectItem value='bottom'>Bottom</SelectItem>
                            <SelectItem value='both'>Top & Bottom</SelectItem>
                            <SelectItem value='center'>Center</SelectItem>
                            <SelectItem value='scale'>Scale</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                  <Separator />
                  <div className='space-y-3'>
                    <h3 className='text-[10px] font-bold text-slate-400 uppercase'>Fill</h3>
                    <div className='flex items-center gap-2'>
                      <Input
                        className='h-8 w-12 border-none bg-transparent p-1'
                        type='color'
                        value={selectedElement.fill}
                        onChange={(e) => updateElement(selectedId!, { fill: e.target.value })}
                      />
                      <Input
                        className='h-8 flex-1 text-xs'
                        type='text'
                        value={selectedElement.fill}
                        onChange={(e) => updateElement(selectedId!, { fill: e.target.value })}
                      />
                      <div className='w-8 text-[10px] text-slate-400'>
                        {Math.round(selectedElement.opacity * 100)}%
                      </div>
                    </div>
                    {selectedElement.type === 'image' && (
                      <div className='space-y-2 pt-2'>
                        <Label className='text-[10px]'>Image Fit</Label>
                        <Select
                          value={selectedElement.imageFit || 'contain'}
                          onValueChange={(v) =>
                            updateElement(selectedId!, {
                              imageFit: v as 'contain' | 'cover' | 'fill'
                            })
                          }
                        >
                          <SelectTrigger className='h-8 text-xs'>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value='contain'>Contain</SelectItem>
                            <SelectItem value='cover'>Cover</SelectItem>
                            <SelectItem value='fill'>Fill</SelectItem>
                          </SelectContent>
                        </Select>
                        <Button
                          className='w-full'
                          size='sm'
                          variant='outline'
                          onClick={() => openImagePicker('replace', selectedId!)}
                        >
                          Replace Image
                        </Button>
                      </div>
                    )}
                    {selectedElement.type === 'text' && (
                      <div className='space-y-2 pt-2'>
                        <Label className='text-[10px]'>Font Size</Label>
                        <Input
                          className='h-8 text-xs'
                          type='number'
                          value={selectedElement.fontSize}
                          onChange={(e) =>
                            updateElement(selectedId!, { fontSize: Number(e.target.value) })
                          }
                        />
                        <Label className='text-[10px]'>Font Family</Label>
                        <Select
                          value={
                            selectedElement.fontFamily || 'ui-sans-serif, system-ui, -apple-system'
                          }
                          onValueChange={(v) => updateElement(selectedId!, { fontFamily: v })}
                        >
                          <SelectTrigger className='h-8 text-xs'>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value='ui-sans-serif, system-ui, -apple-system'>
                              Sans
                            </SelectItem>
                            <SelectItem value='ui-serif, Georgia, serif'>Serif</SelectItem>
                            <SelectItem value='ui-monospace, SFMono-Regular, Menlo, monospace'>
                              Mono
                            </SelectItem>
                            <SelectItem value='Arial, Helvetica, sans-serif'>Arial</SelectItem>
                            <SelectItem value='Georgia, serif'>Georgia</SelectItem>
                          </SelectContent>
                        </Select>
                        <Label className='text-[10px]'>Font Weight</Label>
                        <Select
                          value={String(selectedElement.fontWeight || 400)}
                          onValueChange={(v) =>
                            updateElement(selectedId!, { fontWeight: Number(v) })
                          }
                        >
                          <SelectTrigger className='h-8 text-xs'>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value='300'>Light</SelectItem>
                            <SelectItem value='400'>Regular</SelectItem>
                            <SelectItem value='500'>Medium</SelectItem>
                            <SelectItem value='600'>Semibold</SelectItem>
                            <SelectItem value='700'>Bold</SelectItem>
                          </SelectContent>
                        </Select>
                        <Label className='text-[10px]'>Alignment</Label>
                        <Select
                          value={selectedElement.textAlign || 'center'}
                          onValueChange={(v) =>
                            updateElement(selectedId!, {
                              textAlign: v as 'center' | 'left' | 'right'
                            })
                          }
                        >
                          <SelectTrigger className='h-8 text-xs'>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value='left'>Left</SelectItem>
                            <SelectItem value='center'>Center</SelectItem>
                            <SelectItem value='right'>Right</SelectItem>
                          </SelectContent>
                        </Select>
                        <Label className='text-[10px]'>Line Height</Label>
                        <Input
                          className='h-8 text-xs'
                          step='0.1'
                          type='number'
                          value={selectedElement.lineHeight || 1.2}
                          onChange={(e) =>
                            updateElement(selectedId!, { lineHeight: Number(e.target.value) })
                          }
                        />
                        <Label className='text-[10px]'>Text</Label>
                        <Input
                          className='h-8 text-xs'
                          value={selectedElement.text}
                          onChange={(e) => updateElement(selectedId!, { text: e.target.value })}
                        />
                      </div>
                    )}
                  </div>

                  <Separator />

                  <div className='space-y-2 pt-2'>
                    <Button
                      className='w-full border-purple-200 text-purple-600 hover:bg-purple-50'
                      size='sm'
                      variant='outline'
                      onClick={createMaster}
                    >
                      <ComponentIcon className='mr-2 h-3.5 w-3.5' /> Create Component
                    </Button>
                    <Button
                      className='w-full text-red-500 hover:bg-red-50 hover:text-red-600'
                      size='sm'
                      variant='ghost'
                      onClick={deleteSelected}
                    >
                      <Trash2 className='mr-2 h-3.5 w-3.5' /> Delete Layer
                    </Button>
                  </div>
                </div>
              ) : (
                <div className='flex h-full flex-col items-center justify-center p-8 text-center text-slate-300'>
                  <Layout className='mb-4 h-12 w-12 opacity-20' />
                  <p className='text-sm'>Select an element to edit</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </aside>
      </div>
    </div>
  );
};

export const Route = createFileRoute('/figma/')({
  component: FigmaLite
});
