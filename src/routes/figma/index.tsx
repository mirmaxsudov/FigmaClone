import { createFileRoute, Link } from '@tanstack/react-router';
import {
  ArrowDown,
  ArrowUp,
  CircleIcon,
  ComponentIcon,
  CopyIcon,
  DownloadIcon,
  ImageIcon,
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

import type {
  DuplicateResult,
  Element,
  ElementType,
  GradientFill,
  HistoryState,
  HorizontalConstraint,
  ResizeHandle,
  SelectionRect,
  VerticalConstraint
} from './types';

import { LayerItem } from './LayerItem';
import {
  clampZoom,
  cloneElement,
  collectElementsInRect,
  cursorForHandle,
  defaultGradientStops,
  deleteElementFromList,
  escapeXML,
  findElementBounds,
  findElementById,
  findParentElement,
  generateId,
  getCanvasFill,
  getTopLevelSelection,
  updateElementInList
} from './utils';
import {
  buildSpatialIndex,
  collectBoundsById,
  collectWorldBounds,
  computeAlignmentGuides,
  computeMeasurements,
  getRotatedBounds,
  unionBounds
} from './smartGuides';
import type { SmartGuideState, SpatialIndex, WorldBounds } from './smartGuides';

const GRID_SIZE = 24;
const HANDLE_SIZE = 8;
const HISTORY_LIMIT = 100;
const SMART_GUIDE_SNAP = 4;
const SMART_GUIDE_CELL = 240;
const SMART_GUIDE_SEARCH_PADDING = 80;
const SMART_GUIDE_VIEWPORT_PADDING = 200;

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
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [tool, setTool] = useState<'select' | ElementType>('select');
  const [isDragging, setIsDragging] = useState(false);
  const [hoverHandle, setHoverHandle] = useState<ResizeHandle | null>(null);
  const [activeHandle, setActiveHandle] = useState<ResizeHandle | null>(null);
  const [isSpacePressed, setIsSpacePressed] = useState(false);
  const [isAltPressed, setIsAltPressed] = useState(false);
  const [selectionBox, setSelectionBox] = useState<SelectionRect | null>(null);
  const [smartGuides, setSmartGuides] = useState<SmartGuideState | null>(null);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const imageTargetRef = useRef<{ mode: 'new' | 'replace'; id?: string }>({ mode: 'new' });
  const imageCacheRef = useRef<Map<string, HTMLImageElement>>(new Map());
  const rafRef = useRef<number | null>(null);
  const pendingUpdateRef = useRef<Array<{ id: string; updates: Partial<Element> }> | null>(null);
  const historyRef = useRef<HistoryState[]>([]);
  const redoRef = useRef<HistoryState[]>([]);
  const isRestoringRef = useRef(false);
  const dragRef = useRef<
    | {
        mode: 'marquee';
        startX: number;
        startY: number;
        startWorldX: number;
        startWorldY: number;
        additive: boolean;
      }
    | {
        mode: 'move';
        ids: string[];
        positions: Record<string, { x: number; y: number }>;
        startX: number;
        startY: number;
        hasHistory: boolean;
        guideIndex?: SpatialIndex;
        guideBounds?: Map<string, WorldBounds>;
        guideViewport?: { x: number; y: number; width: number; height: number };
      }
    | {
        mode: 'pan';
        startX: number;
        startY: number;
        elX: number;
        elY: number;
      }
    | {
        mode: 'resize';
        id: string;
        handle: ResizeHandle;
        startX: number;
        startY: number;
        elX: number;
        elY: number;
        elW: number;
        elH: number;
        aspect: number;
        hasHistory: boolean;
        rotation?: number;
        guideIndex?: SpatialIndex;
        guideViewport?: { x: number; y: number; width: number; height: number };
      }
    | null
  >(null);

  const selectedId = selectedIds.length > 0 ? selectedIds[selectedIds.length - 1] : null;
  const selectedElement = useMemo(
    () => (selectedId ? findElementById(elements, selectedId) || masters[selectedId] : null),
    [elements, masters, selectedId]
  );
  const fillMode = selectedElement?.fillGradient?.type ?? 'solid';
  const gradientStops =
    selectedElement?.fillGradient?.stops && selectedElement.fillGradient.stops.length > 0
      ? selectedElement.fillGradient.stops
      : defaultGradientStops(selectedElement?.fill ?? '#e2e8f0');
  const reorderableSelection = useMemo(
    () => getTopLevelSelection(elements, new Set(selectedIds)),
    [elements, selectedIds]
  );
  const canReorder = reorderableSelection.length > 0;

  const snapshotState = useCallback(
    (): HistoryState => ({
      elements: structuredClone(elements),
      masters: structuredClone(masters),
      selectedIds: structuredClone(selectedIds)
    }),
    [elements, masters, selectedIds]
  );

  const pushHistory = useCallback(() => {
    if (isRestoringRef.current) return;
    historyRef.current.push(snapshotState());
    if (historyRef.current.length > HISTORY_LIMIT) {
      historyRef.current.shift();
    }
    redoRef.current = [];
  }, [snapshotState]);

  const restoreState = useCallback((snapshot: HistoryState) => {
    isRestoringRef.current = true;
    dragRef.current = null;
    if (rafRef.current !== null) {
      window.cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    pendingUpdateRef.current = null;
    setIsDragging(false);
    setActiveHandle(null);
    setHoverHandle(null);
    setSelectionBox(null);
    setSmartGuides(null);
    setElements(snapshot.elements);
    setMasters(snapshot.masters);
    setSelectedIds(snapshot.selectedIds);
    window.requestAnimationFrame(() => {
      isRestoringRef.current = false;
    });
  }, []);

  const undo = useCallback(() => {
    const previous = historyRef.current.pop();
    if (!previous) return;
    redoRef.current.push(snapshotState());
    restoreState(previous);
  }, [restoreState, snapshotState]);

  const redo = useCallback(() => {
    const next = redoRef.current.pop();
    if (!next) return;
    historyRef.current.push(snapshotState());
    restoreState(next);
  }, [restoreState, snapshotState]);

  const normalizeSelection = useCallback(
    (ids: string[], primaryId?: string | null) => {
      const normalized = getTopLevelSelection(elements, new Set(ids));
      if (primaryId && normalized.includes(primaryId)) {
        return [...normalized.filter((id) => id !== primaryId), primaryId];
      }
      return normalized;
    },
    [elements]
  );

  const setSelection = useCallback(
    (ids: string[], primaryId?: string | null) => {
      setSelectedIds(normalizeSelection(ids, primaryId ?? null));
    },
    [normalizeSelection]
  );

  const toggleSelection = useCallback(
    (id: string) => {
      setSelectedIds((prev) => {
        const set = new Set(prev);
        const has = set.has(id);
        if (has) {
          set.delete(id);
        } else {
          set.add(id);
        }
        const nextPrimary = has ? null : id;
        return normalizeSelection(Array.from(set), nextPrimary);
      });
    },
    [normalizeSelection]
  );

  const addElement = (type: ElementType) => {
    pushHistory();
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
    setSelection([newEl.id], newEl.id);
  };

  const updateElement = useCallback(
    (id: string, updates: Partial<Element>) => {
      pushHistory();
      if (masters[id]) {
        setMasters((prev) => ({ ...prev, [id]: { ...prev[id], ...updates } }));
        return;
      }
      setElements((prev) => updateElementInList(prev, id, updates));
    },
    [masters, pushHistory]
  );

  const updateFillGradient = useCallback(
    (updater: (current: GradientFill) => GradientFill) => {
      if (!selectedId || !selectedElement) return;
      const base: GradientFill = selectedElement.fillGradient ?? {
        type: 'linear',
        angle: 0,
        stops: defaultGradientStops(selectedElement.fill || '#e2e8f0')
      };
      updateElement(selectedId, { fillGradient: updater(base) });
    },
    [selectedElement, selectedId, updateElement]
  );

  const deleteSelected = () => {
    if (selectedIds.length === 0) return;
    pushHistory();
    const topLevel = getTopLevelSelection(elements, new Set(selectedIds));
    setElements((prev) => topLevel.reduce((acc, id) => deleteElementFromList(acc, id), prev));
    setSelectedIds([]);
  };

  const scheduleElementsUpdate = useCallback(
    (updates: Array<{ id: string; updates: Partial<Element> }>) => {
      pendingUpdateRef.current = updates;
      if (rafRef.current !== null) return;
      rafRef.current = window.requestAnimationFrame(() => {
        const pending = pendingUpdateRef.current;
        rafRef.current = null;
        if (pending && pending.length > 0) {
          setElements((prev) =>
            pending.reduce((acc, item) => updateElementInList(acc, item.id, item.updates), prev)
          );
        }
      });
    },
    []
  );

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

        pushHistory();
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
        setSelection([newEl.id], newEl.id);
      };
      img.src = src;
    },
    [elements, pushHistory, selectedElement, selectedId]
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
    pushHistory();

    if (masters[selectedId]) {
      const clone = cloneElement(masters[selectedId], true);
      setMasters((prev) => ({ ...prev, [clone.id]: clone }));
      setSelection([clone.id], clone.id);
      return;
    }

    const result = duplicateElementInList(elements, selectedId);
    if (result.duplicated) {
      setElements(result.elements);
      setSelection([result.duplicated.id], result.duplicated.id);
    }
  }, [
    duplicateElementInList,
    elements,
    masters,
    pushHistory,
    selectedElement,
    selectedId,
    setSelection
  ]);

  const groupSelected = useCallback(() => {
    if (selectedIds.length < 2) return;
    const topLevel = getTopLevelSelection(elements, new Set(selectedIds));
    if (topLevel.length < 2) return;

    const parent = findParentElement(elements, topLevel[0]);
    const parentId = parent?.id ?? null;
    const sameParent = topLevel.every(
      (id) => (findParentElement(elements, id)?.id ?? null) === parentId
    );

    if (!sameParent) {
      toast.error('Select layers with the same parent to group');
      return;
    }

    pushHistory();
    const sourceList = parent ? parent.children || [] : elements;
    const selectedSet = new Set(topLevel);
    const selectedElements = sourceList.filter((el) => selectedSet.has(el.id));
    if (selectedElements.length < 2) return;

    const minX = Math.min(...selectedElements.map((el) => el.x));
    const minY = Math.min(...selectedElements.map((el) => el.y));
    const maxX = Math.max(...selectedElements.map((el) => el.x + el.width));
    const maxY = Math.max(...selectedElements.map((el) => el.y + el.height));

    const groupChildren = selectedElements.map((el) => ({
      ...el,
      x: el.x - minX,
      y: el.y - minY
    }));

    const group: Element = {
      id: generateId(),
      name: `Group ${elements.length + 1}`,
      type: 'group',
      x: minX,
      y: minY,
      width: maxX - minX,
      height: maxY - minY,
      fill: '#ffffff',
      stroke: '',
      strokeWidth: 0,
      opacity: 1,
      constraints: { horizontal: 'left', vertical: 'top' },
      children: groupChildren
    };

    const insertIndex = sourceList.findIndex((el) => selectedSet.has(el.id));
    const nextList = sourceList.filter((el) => !selectedSet.has(el.id));
    nextList.splice(Math.max(0, insertIndex), 0, group);

    if (parent) {
      setElements((prev) => updateElementInList(prev, parent.id, { children: nextList }));
    } else {
      setElements(nextList);
    }

    setSelection([group.id], group.id);
  }, [elements, pushHistory, selectedIds, setSelection]);

  const ungroupSelected = useCallback(() => {
    if (selectedIds.length === 0) return;
    const topLevel = getTopLevelSelection(elements, new Set(selectedIds));
    const hasGroup = topLevel.some((id) => findElementById(elements, id)?.type === 'group');
    if (!hasGroup) return;
    pushHistory();
    const selectedSet = new Set(topLevel);
    const retained = topLevel.filter((id) => {
      const el = findElementById(elements, id);
      return el?.type !== 'group';
    });
    let nextSelection: string[] = [...retained];

    const ungroupList = (list: Element[]): Element[] => {
      const result: Element[] = [];
      for (const el of list) {
        if (selectedSet.has(el.id) && el.type === 'group') {
          const children = (el.children || []).map((child) => ({
            ...child,
            x: child.x + el.x,
            y: child.y + el.y
          }));
          nextSelection = nextSelection.concat(children.map((child) => child.id));
          result.push(...children);
          continue;
        }
        if (el.children) {
          result.push({ ...el, children: ungroupList(el.children) });
        } else {
          result.push(el);
        }
      }
      return result;
    };

    setElements((prev) => ungroupList(prev));
    if (nextSelection.length > 0) {
      setSelection(nextSelection, nextSelection[nextSelection.length - 1]);
    } else {
      setSelectedIds([]);
    }
  }, [elements, pushHistory, selectedIds, setSelection]);

  const reorderSelected = useCallback(
    (direction: 'backward' | 'forward') => {
      if (selectedIds.length === 0) return;
      const topLevel = getTopLevelSelection(elements, new Set(selectedIds));
      if (topLevel.length === 0) return;
      pushHistory();
      setElements((prev) => {
        const selectedSet = new Set(topLevel);

        const reorderList = (list: Element[]): Element[] => {
          const next = list.map((el) =>
            el.children ? { ...el, children: reorderList(el.children) } : el
          );

          if (direction === 'forward') {
            for (let i = next.length - 2; i >= 0; i -= 1) {
              if (selectedSet.has(next[i].id) && !selectedSet.has(next[i + 1].id)) {
                const temp = next[i + 1];
                next[i + 1] = next[i];
                next[i] = temp;
              }
            }
          } else {
            for (let i = 1; i < next.length; i += 1) {
              if (selectedSet.has(next[i].id) && !selectedSet.has(next[i - 1].id)) {
                const temp = next[i - 1];
                next[i - 1] = next[i];
                next[i] = temp;
              }
            }
          }

          return next;
        };

        return reorderList(prev);
      });
    },
    [elements, pushHistory, selectedIds]
  );

  const nudgeSelected = useCallback(
    (dx: number, dy: number) => {
      if (selectedIds.length === 0) return;
      const topLevel = getTopLevelSelection(elements, new Set(selectedIds));
      const updates: Array<{ id: string; updates: Partial<Element> }> = [];
      for (const id of topLevel) {
        const el = findElementById(elements, id);
        if (!el) continue;
        updates.push({ id, updates: { x: el.x + dx, y: el.y + dy } });
      }

      if (updates.length > 0) {
        pushHistory();
        scheduleElementsUpdate(updates);
      }
    },
    [elements, pushHistory, scheduleElementsUpdate, selectedIds]
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

  const getViewportBounds = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0, width: 0, height: 0 };
    const rect = canvas.getBoundingClientRect();
    return {
      x: -pan.x / zoom,
      y: -pan.y / zoom,
      width: rect.width / zoom,
      height: rect.height / zoom
    };
  }, [pan.x, pan.y, zoom]);

  const getGuideViewport = useCallback(() => {
    const base = getViewportBounds();
    return {
      x: base.x - SMART_GUIDE_VIEWPORT_PADDING,
      y: base.y - SMART_GUIDE_VIEWPORT_PADDING,
      width: base.width + SMART_GUIDE_VIEWPORT_PADDING * 2,
      height: base.height + SMART_GUIDE_VIEWPORT_PADDING * 2
    };
  }, [getViewportBounds]);

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

  const getResizeHandleAtPoint = useCallback(
    (point: { x: number; y: number }) => {
      if (!selectedId || !selectedElement || selectedIds.length !== 1) return null;
      const bounds = findElementBounds(elements, selectedId);
      if (!bounds) return null;

      const size = HANDLE_SIZE / zoom;
      const half = size / 2;
      const handles: Record<ResizeHandle, { x: number; y: number }> = {
        nw: { x: bounds.x, y: bounds.y },
        n: { x: bounds.x + bounds.width / 2, y: bounds.y },
        ne: { x: bounds.x + bounds.width, y: bounds.y },
        e: { x: bounds.x + bounds.width, y: bounds.y + bounds.height / 2 },
        se: { x: bounds.x + bounds.width, y: bounds.y + bounds.height },
        s: { x: bounds.x + bounds.width / 2, y: bounds.y + bounds.height },
        sw: { x: bounds.x, y: bounds.y + bounds.height },
        w: { x: bounds.x, y: bounds.y + bounds.height / 2 }
      };

      for (const [handle, pos] of Object.entries(handles) as [
        ResizeHandle,
        { x: number; y: number }
      ][]) {
        if (
          point.x >= pos.x - half &&
          point.x <= pos.x + half &&
          point.y >= pos.y - half &&
          point.y <= pos.y + half
        ) {
          return handle;
        }
      }
      return null;
    },
    [elements, selectedElement, selectedId, selectedIds, zoom]
  );

  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    e.stopPropagation();
    const point = getCanvasPoint(e);
    const resizeHandle = getResizeHandleAtPoint(point);
    if (resizeHandle && selectedId && selectedElement) {
      setIsDragging(true);
      setActiveHandle(resizeHandle);
      setSelectionBox(null);
      const guideViewport = getGuideViewport();
      const guideBounds = collectWorldBounds(elements, {
        excludeIds: new Set([selectedId]),
        viewport: guideViewport
      });
      const guideIndex = buildSpatialIndex(guideBounds, SMART_GUIDE_CELL);
      dragRef.current = {
        mode: 'resize',
        id: selectedId,
        handle: resizeHandle,
        startX: e.clientX,
        startY: e.clientY,
        elX: selectedElement.x,
        elY: selectedElement.y,
        elW: selectedElement.width,
        elH: selectedElement.height,
        aspect: selectedElement.width / Math.max(1, selectedElement.height),
        hasHistory: false,
        rotation: selectedElement.rotation ?? 0,
        guideIndex,
        guideViewport
      };
      (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
      return;
    }

    const hit = hitTestElements(point);

    if (hit) {
      if (e.shiftKey) {
        toggleSelection(hit.id);
        return;
      }

      const hitAlreadySelected = selectedIds.includes(hit.id);
      if (!hitAlreadySelected) {
        setSelection([hit.id], hit.id);
      } else {
        setSelection(selectedIds, hit.id);
      }

      const moveIds = hitAlreadySelected
        ? getTopLevelSelection(elements, new Set(selectedIds))
        : [hit.id];
      const positions: Record<string, { x: number; y: number }> = {};
      const validIds: string[] = [];
      for (const id of moveIds) {
        const el = findElementById(elements, id);
        if (el) {
          positions[id] = { x: el.x, y: el.y };
          validIds.push(id);
        }
      }

      setIsDragging(true);
      setActiveHandle(null);
      setSelectionBox(null);
      const guideViewport = getGuideViewport();
      const guideBounds = collectWorldBounds(elements, {
        excludeIds: new Set(validIds),
        viewport: guideViewport
      });
      const guideIndex = buildSpatialIndex(guideBounds, SMART_GUIDE_CELL);
      const guideBoundsById = collectBoundsById(elements, new Set(validIds));
      dragRef.current = {
        mode: 'move',
        ids: validIds,
        positions,
        startX: e.clientX,
        startY: e.clientY,
        hasHistory: false,
        guideIndex,
        guideBounds: guideBoundsById,
        guideViewport
      };
    } else {
      if (isSpacePressed || e.button === 1) {
        setIsDragging(true);
        setActiveHandle(null);
        setSelectionBox(null);
        dragRef.current = {
          mode: 'pan',
          startX: e.clientX,
          startY: e.clientY,
          elX: pan.x,
          elY: pan.y
        };
      } else {
        if (!e.shiftKey) {
          setSelectedIds([]);
        }
        setIsDragging(true);
        setActiveHandle(null);
        dragRef.current = {
          mode: 'marquee',
          startX: e.clientX,
          startY: e.clientY,
          startWorldX: point.x,
          startWorldY: point.y,
          additive: e.shiftKey
        };
        setSelectionBox({ x: point.x, y: point.y, width: 0, height: 0 });
      }
    }
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const point = getCanvasPoint(e);
    if (!dragRef.current) {
      const nextHandle = getResizeHandleAtPoint(point);
      setHoverHandle((prev) => (prev === nextHandle ? prev : nextHandle));
      if (smartGuides) {
        setSmartGuides(null);
      }
      return;
    }
    const state = dragRef.current;
    const dx = (e.clientX - state.startX) / zoom;
    const dy = (e.clientY - state.startY) / zoom;

    if (state.mode === 'pan') {
      setPan({ x: state.elX + e.clientX - state.startX, y: state.elY + e.clientY - state.startY });
      return;
    }

    if (state.mode === 'move') {
      const updates: Array<{ id: string; updates: Partial<Element> }> = [];
      const measureMode = e.altKey || isAltPressed;
      let snapX = 0;
      let snapY = 0;

      if (state.guideIndex && state.guideBounds && state.guideViewport) {
        const movingBounds = unionBounds(Array.from(state.guideBounds.values()), dx, dy);
        if (measureMode) {
          const measureRange = Math.max(state.guideViewport.width, state.guideViewport.height);
          const candidates = state.guideIndex.query(movingBounds, measureRange);
          setSmartGuides({ lines: [], measurements: computeMeasurements(movingBounds, candidates) });
        } else {
          const candidates = state.guideIndex.query(movingBounds, SMART_GUIDE_SEARCH_PADDING);
          const alignment = computeAlignmentGuides({
            movingBounds,
            candidates,
            snapThreshold: SMART_GUIDE_SNAP,
            allowedX: ['left', 'center', 'right'],
            allowedY: ['top', 'centerY', 'bottom']
          });
          snapX = alignment.snapX?.delta ?? 0;
          snapY = alignment.snapY?.delta ?? 0;
          setSmartGuides({ lines: alignment.lines, measurements: [] });
        }
      } else if (smartGuides) {
        setSmartGuides(null);
      }

      const snappedDx = dx + snapX;
      const snappedDy = dy + snapY;
      if (!state.hasHistory && (dx !== 0 || dy !== 0)) {
        pushHistory();
        state.hasHistory = true;
      }
      for (const id of state.ids) {
        const position = state.positions[id];
        if (!position) continue;
        updates.push({ id, updates: { x: position.x + snappedDx, y: position.y + snappedDy } });
      }

      if (updates.length > 0) {
        scheduleElementsUpdate(updates);
      }
      return;
    }

    if (state.mode === 'marquee') {
      const nextX = Math.min(state.startWorldX, point.x);
      const nextY = Math.min(state.startWorldY, point.y);
      const nextW = Math.abs(point.x - state.startWorldX);
      const nextH = Math.abs(point.y - state.startWorldY);
      setSelectionBox({ x: nextX, y: nextY, width: nextW, height: nextH });
      return;
    }

    if (state.mode === 'resize') {
      const moveLeft = state.handle.includes('w');
      const moveRight = state.handle.includes('e');
      const moveTop = state.handle.includes('n');
      const moveBottom = state.handle.includes('s');
      const measureMode = e.altKey || isAltPressed;

      let left = state.elX;
      let right = state.elX + state.elW;
      let top = state.elY;
      let bottom = state.elY + state.elH;

      if (moveLeft) left += dx;
      if (moveRight) right += dx;
      if (moveTop) top += dy;
      if (moveBottom) bottom += dy;

      const snap = (value: number) => Math.round(value);
      const minSize = 16;
      const aspect = state.aspect || 1;

      const bounds = findElementBounds(elements, state.id);
      const offsetX = bounds ? bounds.x - state.elX : 0;
      const offsetY = bounds ? bounds.y - state.elY : 0;

      let width = right - left;
      let height = bottom - top;
      let primary: 'height' | 'width' | null = null;

      if (e.shiftKey) {
        if ((moveLeft || moveRight) && !(moveTop || moveBottom)) {
          primary = 'width';
        } else if ((moveTop || moveBottom) && !(moveLeft || moveRight)) {
          primary = 'height';
        } else {
          primary = Math.abs(dx) >= Math.abs(dy) ? 'width' : 'height';
        }

        if (primary === 'width') {
          if (moveLeft && !moveRight) {
            left = snap(left + offsetX) - offsetX;
          } else if (moveRight && !moveLeft) {
            right = snap(right + offsetX) - offsetX;
          }
          width = Math.max(minSize, right - left);
          height = Math.max(minSize, width / aspect);
        } else {
          if (moveTop && !moveBottom) {
            top = snap(top + offsetY) - offsetY;
          } else if (moveBottom && !moveTop) {
            bottom = snap(bottom + offsetY) - offsetY;
          }
          height = Math.max(minSize, bottom - top);
          width = Math.max(minSize, height * aspect);
        }

        if (moveLeft && !moveRight) {
          left = right - width;
        } else if (moveRight && !moveLeft) {
          right = left + width;
        } else {
          const centerX = state.elX + state.elW / 2;
          left = centerX - width / 2;
          right = centerX + width / 2;
        }

        if (moveTop && !moveBottom) {
          top = bottom - height;
        } else if (moveBottom && !moveTop) {
          bottom = top + height;
        } else {
          const centerY = state.elY + state.elH / 2;
          top = centerY - height / 2;
          bottom = centerY + height / 2;
        }
      } else {
        if (moveLeft) left = snap(left + offsetX) - offsetX;
        if (moveRight) right = snap(right + offsetX) - offsetX;
        if (moveTop) top = snap(top + offsetY) - offsetY;
        if (moveBottom) bottom = snap(bottom + offsetY) - offsetY;

        width = right - left;
        height = bottom - top;

        if (width < minSize) {
          width = minSize;
          if (moveLeft && !moveRight) {
            left = right - width;
          } else {
            right = left + width;
          }
        }

        if (height < minSize) {
          height = minSize;
          if (moveTop && !moveBottom) {
            top = bottom - height;
          } else {
            bottom = top + height;
          }
        }
      }

      let snapAppliedX = false;
      let snapAppliedY = false;

      if (state.guideIndex && state.guideViewport) {
        const movingBounds = getRotatedBounds(
          left + offsetX,
          top + offsetY,
          width,
          height,
          state.rotation ?? 0
        );
        if (measureMode) {
          const measureRange = Math.max(state.guideViewport.width, state.guideViewport.height);
          const candidates = state.guideIndex.query(movingBounds, measureRange);
          setSmartGuides({ lines: [], measurements: computeMeasurements(movingBounds, candidates) });
        } else {
          let allowedX: Array<'center' | 'left' | 'right'> = [];
          let allowedY: Array<'bottom' | 'centerY' | 'top'> = [];
          if (moveLeft) allowedX.push('left');
          if (moveRight) allowedX.push('right');
          if (moveTop) allowedY.push('top');
          if (moveBottom) allowedY.push('bottom');

          if (primary === 'width') {
            allowedY = [];
          } else if (primary === 'height') {
            allowedX = [];
          }

          const candidates = state.guideIndex.query(movingBounds, SMART_GUIDE_SEARCH_PADDING);
          const alignment = computeAlignmentGuides({
            movingBounds,
            candidates,
            snapThreshold: SMART_GUIDE_SNAP,
            allowedX,
            allowedY
          });

          if (alignment.snapX && (moveLeft || moveRight)) {
            if (moveLeft && !moveRight) {
              left = alignment.snapX.value - offsetX;
            } else if (moveRight && !moveLeft) {
              right = alignment.snapX.value - offsetX;
            }
            snapAppliedX = true;
          }
          if (alignment.snapY && (moveTop || moveBottom)) {
            if (moveTop && !moveBottom) {
              top = alignment.snapY.value - offsetY;
            } else if (moveBottom && !moveTop) {
              bottom = alignment.snapY.value - offsetY;
            }
            snapAppliedY = true;
          }

          setSmartGuides({ lines: alignment.lines, measurements: [] });
        }
      } else if (smartGuides) {
        setSmartGuides(null);
      }

      if (e.shiftKey && primary) {
        if (primary === 'width' && snapAppliedX) {
          width = Math.max(minSize, right - left);
          height = Math.max(minSize, width / aspect);
          if (moveTop && !moveBottom) {
            top = bottom - height;
          } else if (moveBottom && !moveTop) {
            bottom = top + height;
          } else {
            const centerY = state.elY + state.elH / 2;
            top = centerY - height / 2;
            bottom = centerY + height / 2;
          }
        } else if (primary === 'height' && snapAppliedY) {
          height = Math.max(minSize, bottom - top);
          width = Math.max(minSize, height * aspect);
          if (moveLeft && !moveRight) {
            left = right - width;
          } else if (moveRight && !moveLeft) {
            right = left + width;
          } else {
            const centerX = state.elX + state.elW / 2;
            left = centerX - width / 2;
            right = centerX + width / 2;
          }
        }
      }

      width = right - left;
      height = bottom - top;

      if (!e.shiftKey) {
        if (width < minSize) {
          width = minSize;
          if (moveLeft && !moveRight) {
            left = right - width;
          } else {
            right = left + width;
          }
        }
        if (height < minSize) {
          height = minSize;
          if (moveTop && !moveBottom) {
            top = bottom - height;
          } else {
            bottom = top + height;
          }
        }
      }

      const nextX = Math.round(left);
      const nextY = Math.round(top);
      const nextW = Math.round(width);
      const nextH = Math.round(height);
      if (
        !state.hasHistory &&
        (nextX !== state.elX || nextY !== state.elY || nextW !== state.elW || nextH !== state.elH)
      ) {
        pushHistory();
        state.hasHistory = true;
      }

      scheduleElementsUpdate([
        {
          id: state.id,
          updates: {
            x: nextX,
            y: nextY,
            width: nextW,
            height: nextH
          }
        }
      ]);
    }
  };

  const handlePointerUp = (e?: React.PointerEvent<HTMLCanvasElement>) => {
    const state = dragRef.current;
    if (state?.mode === 'marquee') {
      const endPoint = e ? getCanvasPoint(e) : { x: state.startWorldX, y: state.startWorldY };
      const rect: SelectionRect = {
        x: Math.min(state.startWorldX, endPoint.x),
        y: Math.min(state.startWorldY, endPoint.y),
        width: Math.abs(endPoint.x - state.startWorldX),
        height: Math.abs(endPoint.y - state.startWorldY)
      };
      const isClick = rect.width < 2 && rect.height < 2;
      if (!isClick) {
        const ids = collectElementsInRect(elements, rect);
        setSelectedIds((prev) => {
          const base = state.additive ? prev : [];
          const merged = [...base, ...ids];
          const primary = ids.length > 0 ? ids[ids.length - 1] : null;
          return normalizeSelection(merged, primary);
        });
      } else if (!state.additive) {
        setSelectedIds([]);
      }
      setSelectionBox(null);
    }

    dragRef.current = null;
    setIsDragging(false);
    setActiveHandle(null);
    setHoverHandle(null);
    setSelectionBox(null);
    setSmartGuides(null);
  };

  useEffect(() => {
    return () => {
      if (rafRef.current !== null) {
        window.cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };
  }, []);

  const handleWheel = (e: React.WheelEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const isPinch = e.ctrlKey || e.metaKey;
    const zoomIntensity = isPinch ? 0.003 : 0.002;
    const zoomFactor = Math.exp(-e.deltaY * zoomIntensity);
    const nextZoom = clampZoom(zoom * zoomFactor);
    zoomAtPoint(nextZoom, e.clientX, e.clientY);
  };

  const createInstance = (masterId: string) => {
    const master = masters[masterId];
    if (!master) return;
    pushHistory();
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

    const gradientDefs: string[] = [];
    const gradientIds = new Map<string, string>();

    const buildGradientDef = (el: Element, id: string) => {
      if (!el.fillGradient) return '';
      const gradient = el.fillGradient;
      const stops =
        gradient.stops && gradient.stops.length > 0
          ? gradient.stops
          : defaultGradientStops(el.fill || '#e2e8f0');
      const stopMarkup = stops
        .slice()
        .sort((a, b) => a.offset - b.offset)
        .map((stop) => {
          const offset = Math.min(1, Math.max(0, stop.offset));
          const opacity = stop.opacity ?? 1;
          return `<stop offset="${offset * 100}%" stop-color="${stop.color}"${
            opacity < 1 ? ` stop-opacity="${opacity}"` : ''
          } />`;
        })
        .join('');

      if (gradient.type === 'linear') {
        const angle = ((gradient.angle ?? 0) * Math.PI) / 180;
        const x1 = 0.5 - Math.cos(angle) / 2;
        const y1 = 0.5 - Math.sin(angle) / 2;
        const x2 = 0.5 + Math.cos(angle) / 2;
        const y2 = 0.5 + Math.sin(angle) / 2;
        return `<linearGradient id="${id}" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}">${stopMarkup}</linearGradient>`;
      }

      return `<radialGradient id="${id}" cx="0.5" cy="0.5" r="0.5">${stopMarkup}</radialGradient>`;
    };

    const collectGradients = (list: Element[]) => {
      for (const el of list) {
        if (el.fillGradient) {
          const id = `grad-${el.id}`;
          if (!gradientIds.has(el.id)) {
            gradientIds.set(el.id, id);
            gradientDefs.push(buildGradientDef(el, id));
          }
        }
        if (el.children) {
          collectGradients(el.children);
        }
      }
    };

    collectGradients([frame]);

    const renderSVGElement = (el: Element): string => {
      let content = '';
      const fill =
        el.fillGradient && gradientIds.has(el.id) ? `url(#${gradientIds.get(el.id)})` : el.fill;
      if (el.type === 'group') {
        // groups are visual containers only
      } else if (el.type === 'rect' || el.type === 'frame' || el.type === 'instance') {
        content = `<rect x="${el.x}" y="${el.y}" width="${el.width}" height="${el.height}" fill="${fill}" stroke="${el.stroke}" stroke-width="${el.strokeWidth}" fill-opacity="${el.opacity}" />`;
      } else if (el.type === 'circle') {
        content = `<circle cx="${el.x + el.width / 2}" cy="${el.y + el.height / 2}" r="${el.width / 2}" fill="${fill}" stroke="${el.stroke}" stroke-width="${el.strokeWidth}" fill-opacity="${el.opacity}" />`;
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

        content = `<text x="${textX}" y="${startY}" fill="${fill}" font-size="${fontSize}" font-family="${fontFamily}" font-weight="${fontWeight}" text-anchor="${anchor}" dominant-baseline="middle">${tspans}</text>`;
      }

      if (el.children) {
        content += `<g transform="translate(${el.x}, ${el.y})">`;
        content += el.children.map(renderSVGElement).join('');
        content += `</g>`;
      }
      return content;
    };

    const defs = gradientDefs.length > 0 ? `<defs>${gradientDefs.join('')}</defs>` : '';
    const svg = `<svg width="${frame.width}" height="${frame.height}" viewBox="0 0 ${frame.width} ${frame.height}" xmlns="http://www.w3.org/2000/svg">${defs}${renderSVGElement(
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

    const gridSize = GRID_SIZE;
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
      const isSelected = selectedIds.includes(el.id);

      ctx.save();
      ctx.globalAlpha = el.opacity;

      if (el.type === 'rect' || el.type === 'frame' || el.type === 'instance') {
        const fillPaint = getCanvasFill(ctx, el, x, y);
        if (fillPaint) {
          ctx.fillStyle = fillPaint;
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
        const fillPaint = getCanvasFill(ctx, el, x, y);
        if (fillPaint) {
          ctx.fillStyle = fillPaint;
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

        const fillPaint = getCanvasFill(ctx, el, x, y);
        ctx.fillStyle = fillPaint || el.fill || '#000000';
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
        ctx.lineWidth = 2 / zoom;
        ctx.strokeRect(x - 1, y - 1, el.width + 2, el.height + 2);
        if (selectedIds.length === 1) {
          const labelText = `${Math.round(el.width)} x ${Math.round(el.height)}`;
          const fontSize = 9 / zoom;
          const paddingX = 4 / zoom;
          const paddingY = 2 / zoom;
          ctx.font = `${fontSize}px ui-sans-serif, system-ui, -apple-system`;
          const metrics = ctx.measureText(labelText);
          const labelWidth = metrics.width + paddingX * 2;
          const labelHeight = fontSize + paddingY * 2;
          const gap = 6 / zoom;
          const labelX = x;
          const labelY = y - labelHeight - gap;
          ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
          ctx.fillRect(labelX, labelY, labelWidth, labelHeight);
          ctx.fillStyle = '#ffffff';
          ctx.textAlign = 'left';
          ctx.textBaseline = 'top';
          ctx.fillText(labelText, labelX + paddingX, labelY + paddingY);

          const handleSize = HANDLE_SIZE / zoom;
          const half = handleSize / 2;
          const handles: Array<{ x: number; y: number }> = [
            { x, y },
            { x: x + el.width / 2, y },
            { x: x + el.width, y },
            { x: x + el.width, y: y + el.height / 2 },
            { x: x + el.width, y: y + el.height },
            { x: x + el.width / 2, y: y + el.height },
            { x, y: y + el.height },
            { x, y: y + el.height / 2 }
          ];
          ctx.fillStyle = '#ffffff';
          ctx.strokeStyle = '#3b82f6';
          ctx.lineWidth = 1 / zoom;
          for (const handle of handles) {
            ctx.fillRect(handle.x - half, handle.y - half, handleSize, handleSize);
            ctx.strokeRect(handle.x - half, handle.y - half, handleSize, handleSize);
          }
        }
        ctx.restore();
      }
    };

    for (const el of elements) {
      drawElement(el, 0, 0);
    }

    if (smartGuides && (smartGuides.lines.length > 0 || smartGuides.measurements.length > 0)) {
      ctx.save();
      const guideWidth = 1 / zoom;
      ctx.lineWidth = guideWidth;
      ctx.strokeStyle = '#f43f5e';
      for (const line of smartGuides.lines) {
        ctx.beginPath();
        if (line.orientation === 'vertical') {
          ctx.moveTo(line.value, line.start);
          ctx.lineTo(line.value, line.end);
        } else {
          ctx.moveTo(line.start, line.value);
          ctx.lineTo(line.end, line.value);
        }
        ctx.stroke();
      }

      if (smartGuides.measurements.length > 0) {
        ctx.strokeStyle = '#22c55e';
        ctx.setLineDash([4 / zoom, 3 / zoom]);
        for (const measure of smartGuides.measurements) {
          ctx.beginPath();
          if (measure.orientation === 'horizontal') {
            ctx.moveTo(measure.start, measure.cross);
            ctx.lineTo(measure.end, measure.cross);
          } else {
            ctx.moveTo(measure.cross, measure.start);
            ctx.lineTo(measure.cross, measure.end);
          }
          ctx.stroke();
        }
        ctx.setLineDash([]);

        const fontSize = 10 / zoom;
        const paddingX = 4 / zoom;
        const paddingY = 2 / zoom;
        ctx.font = `${fontSize}px ui-sans-serif, system-ui, -apple-system`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        for (const measure of smartGuides.measurements) {
          const label = String(measure.value);
          const labelX =
            measure.orientation === 'horizontal'
              ? (measure.start + measure.end) / 2
              : measure.cross;
          const labelY =
            measure.orientation === 'horizontal'
              ? measure.cross
              : (measure.start + measure.end) / 2;
          const metrics = ctx.measureText(label);
          const labelWidth = metrics.width + paddingX * 2;
          const labelHeight = fontSize + paddingY * 2;
          ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
          ctx.fillRect(labelX - labelWidth / 2, labelY - labelHeight / 2, labelWidth, labelHeight);
          ctx.fillStyle = '#ffffff';
          ctx.fillText(label, labelX, labelY);
        }
      }
      ctx.restore();
    }

    if (selectionBox) {
      ctx.save();
      ctx.strokeStyle = '#3b82f6';
      ctx.fillStyle = 'rgba(59, 130, 246, 0.12)';
      ctx.lineWidth = 1 / zoom;
      ctx.fillRect(selectionBox.x, selectionBox.y, selectionBox.width, selectionBox.height);
      ctx.strokeRect(selectionBox.x, selectionBox.y, selectionBox.width, selectionBox.height);
      ctx.restore();
    }

    ctx.restore();
  }, [elements, pan.x, pan.y, selectedIds, selectionBox, smartGuides, zoom]);

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

      if (e.code === 'AltLeft' || e.code === 'AltRight') {
        setIsAltPressed(true);
      }

      if (e.code === 'Space') {
        e.preventDefault();
        setIsSpacePressed(true);
        return;
      }

      const mod = e.ctrlKey || e.metaKey;
      const key = e.key.toLowerCase();

      if (mod && key === 'z') {
        e.preventDefault();
        if (e.shiftKey) {
          redo();
        } else {
          undo();
        }
        return;
      }

      if (mod && key === 'g') {
        e.preventDefault();
        if (e.shiftKey) {
          ungroupSelected();
        } else {
          groupSelected();
        }
        return;
      }

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

      if (mod && (key === ']' || key === '[')) {
        e.preventDefault();
        reorderSelected(key === ']' ? 'forward' : 'backward');
        return;
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

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        setIsSpacePressed(false);
      }
      if (e.code === 'AltLeft' || e.code === 'AltRight') {
        setIsAltPressed(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [
    alignSelected,
    deleteSelected,
    duplicateSelected,
    groupSelected,
    nudgeSelected,
    reorderSelected,
    redo,
    selectedElement,
    selectedId,
    undo,
    ungroupSelected,
    zoom,
    zoomToCenter
  ]);

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
          <Link className='mr-2 flex items-center gap-2 transition-opacity hover:opacity-80' to='/'>
            <div className='flex h-7 w-7 items-center justify-center rounded bg-purple-600 text-white'>
              <MousePointer2 className='h-4 w-4' />
            </div>
            <span className='hidden text-sm font-bold sm:block'>Mockdock</span>
          </Link>
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
              <CircleIcon className='h-4 w-4' />
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
            <DownloadIcon className='mr-2 h-3.5 w-3.5' /> JSON
          </Button>
          <Button className='h-8' size='sm' variant='outline' onClick={exportSVG}>
            <CopyIcon className='mr-2 h-3.5 w-3.5' /> SVG
          </Button>
        </div>
      </header>
      <div className='flex flex-1 overflow-hidden'>
        <aside className='z-10 flex min-h-0 w-64 shrink-0 flex-col border-r bg-white'>
          <Tabs className='flex min-h-0 flex-1 flex-col' defaultValue='layers'>
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
            <TabsContent
              className='m-0 flex min-h-0 flex-1 flex-col overflow-hidden p-0'
              value='layers'
            >
              <div className='flex items-center justify-between border-b px-3 py-2'>
                <span className='text-[10px] font-bold text-slate-400 uppercase'>Order</span>
                <div className='flex items-center gap-1'>
                  <Button
                    aria-label='Send backward'
                    className='h-7 w-7'
                    disabled={!canReorder}
                    size='icon'
                    variant='ghost'
                    onClick={() => reorderSelected('backward')}
                  >
                    <ArrowDown className='h-3.5 w-3.5' />
                  </Button>
                  <Button
                    aria-label='Bring forward'
                    className='h-7 w-7'
                    disabled={!canReorder}
                    size='icon'
                    variant='ghost'
                    onClick={() => reorderSelected('forward')}
                  >
                    <ArrowUp className='h-3.5 w-3.5' />
                  </Button>
                </div>
              </div>
              <ScrollArea className='flex-1'>
                <div className='py-2'>
                  {elements.map((el) => (
                    <LayerItem
                      key={el.id}
                      el={el}
                      selectedIds={selectedIds}
                      setSelection={setSelection}
                      toggleSelection={toggleSelection}
                    />
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
          style={{
            cursor: activeHandle
              ? cursorForHandle(activeHandle)
              : hoverHandle
                ? cursorForHandle(hoverHandle)
                : isDragging
                  ? 'grabbing'
                  : 'grab'
          }}
          className='relative w-[130vh] flex-1 touch-none bg-[#e5e5e5]'
          onPointerCancel={handlePointerUp}
          onPointerDown={handlePointerDown}
          onPointerLeave={handlePointerUp}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onWheel={handleWheel}
        />
        <aside className='z-10 flex min-h-0 w-72 shrink-0 flex-col border-l bg-white'>
          <Tabs className='flex min-h-0 flex-1 flex-col' defaultValue='design'>
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
            <TabsContent
              className='m-0 flex min-h-0 flex-1 flex-col overflow-hidden p-0'
              value='design'
            >
              <ScrollArea className='flex-1'>
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
                      <h3 className='text-[10px] font-bold text-slate-400 uppercase'>
                        Constraints
                      </h3>
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
                      <div className='space-y-2'>
                        <Label className='text-[10px]'>Fill Type</Label>
                        <Select
                          value={fillMode}
                          onValueChange={(value) => {
                            if (!selectedId || !selectedElement) return;
                            if (value === 'solid') {
                              updateElement(selectedId, { fillGradient: undefined });
                              return;
                            }
                            const nextStops = selectedElement.fillGradient?.stops?.length
                              ? selectedElement.fillGradient.stops
                              : defaultGradientStops(selectedElement.fill || '#e2e8f0');
                            updateElement(selectedId, {
                              fillGradient: {
                                type: value as 'linear' | 'radial',
                                angle:
                                  value === 'linear'
                                    ? (selectedElement.fillGradient?.angle ?? 0)
                                    : undefined,
                                stops: nextStops
                              }
                            });
                          }}
                        >
                          <SelectTrigger className='h-8 text-xs'>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value='solid'>Solid</SelectItem>
                            <SelectItem value='linear'>Linear</SelectItem>
                            <SelectItem value='radial'>Radial</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {fillMode === 'solid' ? (
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
                      ) : (
                        <div className='space-y-3'>
                          {fillMode === 'linear' && (
                            <div className='flex items-center gap-2'>
                              <Label className='w-10 text-[10px] text-slate-400'>Angle</Label>
                              <Input
                                className='h-8 text-xs'
                                type='number'
                                value={selectedElement.fillGradient?.angle ?? 0}
                                onChange={(e) =>
                                  updateFillGradient((current) => ({
                                    ...current,
                                    angle: Number(e.target.value)
                                  }))
                                }
                              />
                            </div>
                          )}
                          <div className='grid grid-cols-2 gap-3'>
                            <div className='space-y-1'>
                              <Label className='text-[10px]'>Start</Label>
                              <div className='flex items-center gap-2'>
                                <Input
                                  className='h-8 w-12 border-none bg-transparent p-1'
                                  type='color'
                                  value={gradientStops[0]?.color || '#000000'}
                                  onChange={(e) =>
                                    updateFillGradient((current) => {
                                      const stops =
                                        current.stops.length > 0
                                          ? current.stops
                                          : defaultGradientStops(selectedElement.fill || '#e2e8f0');
                                      const nextStops = stops.map((stop, index) =>
                                        index === 0 ? { ...stop, color: e.target.value } : stop
                                      );
                                      return { ...current, stops: nextStops };
                                    })
                                  }
                                />
                                <Input
                                  className='h-8 flex-1 text-xs'
                                  type='text'
                                  value={gradientStops[0]?.color || '#000000'}
                                  onChange={(e) =>
                                    updateFillGradient((current) => {
                                      const stops =
                                        current.stops.length > 0
                                          ? current.stops
                                          : defaultGradientStops(selectedElement.fill || '#e2e8f0');
                                      const nextStops = stops.map((stop, index) =>
                                        index === 0 ? { ...stop, color: e.target.value } : stop
                                      );
                                      return { ...current, stops: nextStops };
                                    })
                                  }
                                />
                              </div>
                            </div>
                            <div className='space-y-1'>
                              <Label className='text-[10px]'>End</Label>
                              <div className='flex items-center gap-2'>
                                <Input
                                  className='h-8 w-12 border-none bg-transparent p-1'
                                  type='color'
                                  value={gradientStops[1]?.color || '#ffffff'}
                                  onChange={(e) =>
                                    updateFillGradient((current) => {
                                      const stops =
                                        current.stops.length > 1
                                          ? current.stops
                                          : defaultGradientStops(selectedElement.fill || '#e2e8f0');
                                      const nextStops = stops.map((stop, index) =>
                                        index === 1 ? { ...stop, color: e.target.value } : stop
                                      );
                                      return { ...current, stops: nextStops };
                                    })
                                  }
                                />
                                <Input
                                  className='h-8 flex-1 text-xs'
                                  type='text'
                                  value={gradientStops[1]?.color || '#ffffff'}
                                  onChange={(e) =>
                                    updateFillGradient((current) => {
                                      const stops =
                                        current.stops.length > 1
                                          ? current.stops
                                          : defaultGradientStops(selectedElement.fill || '#e2e8f0');
                                      const nextStops = stops.map((stop, index) =>
                                        index === 1 ? { ...stop, color: e.target.value } : stop
                                      );
                                      return { ...current, stops: nextStops };
                                    })
                                  }
                                />
                              </div>
                            </div>
                          </div>
                          <div className='text-[10px] text-slate-400'>
                            {Math.round(selectedElement.opacity * 100)}%
                          </div>
                        </div>
                      )}
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
                              selectedElement.fontFamily ||
                              'ui-sans-serif, system-ui, -apple-system'
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
              </ScrollArea>
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
