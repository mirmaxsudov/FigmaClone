import type {
  Element,
  ElementBounds,
  GradientStop,
  ResizeHandle,
  SelectionRect
} from './types';

export const generateId = () => Math.random().toString(36).substring(2, 9);
export const clampZoom = (value: number) => Math.min(5, Math.max(0.1, value));
export const escapeXML = (value: string) =>
  value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

export const cursorForHandle = (handle: ResizeHandle) => {
  switch (handle) {
    case 'nw':
    case 'se':
      return 'nwse-resize';
    case 'ne':
    case 'sw':
      return 'nesw-resize';
    case 'n':
    case 's':
      return 'ns-resize';
    case 'e':
    case 'w':
      return 'ew-resize';
    default:
      return 'default';
  }
};

export const defaultGradientStops = (baseColor: string): GradientStop[] => [
  { offset: 0, color: baseColor, opacity: 1 },
  { offset: 1, color: '#ffffff', opacity: 1 }
];

const hexToRgba = (value: string, opacity: number) => {
  const hex = value.replace('#', '').trim();
  if (hex.length !== 3 && hex.length !== 6) return value;
  const normalized = hex.length === 3 ? hex.split('').map((c) => c + c).join('') : hex;
  const num = Number.parseInt(normalized, 16);
  if (Number.isNaN(num)) return value;
  const r = (num >> 16) & 255;
  const g = (num >> 8) & 255;
  const b = num & 255;
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
};

const colorWithOpacity = (value: string, opacity?: number) => {
  if (opacity === undefined || opacity >= 1) return value;
  if (value.startsWith('#')) {
    return hexToRgba(value, opacity);
  }
  return value;
};

export const findElementById = (elements: Element[], id: string): Element | null => {
  for (const el of elements) {
    if (el.id === id) return el;
    if (el.children) {
      const found = findElementById(el.children, id);
      if (found) return found;
    }
  }
  return null;
};

export const findElementBounds = (
  elements: Element[],
  id: string,
  offsetX = 0,
  offsetY = 0
): ElementBounds | null => {
  for (const el of elements) {
    const x = offsetX + el.x;
    const y = offsetY + el.y;
    if (el.id === id) {
      return { x, y, width: el.width, height: el.height };
    }
    if (el.children) {
      const found = findElementBounds(el.children, id, x, y);
      if (found) return found;
    }
  }
  return null;
};

export const getTopLevelSelection = (elements: Element[], selectedSet: Set<string>): string[] => {
  const result: string[] = [];
  const visit = (list: Element[], ancestorSelected: boolean) => {
    for (const el of list) {
      const isSelected = selectedSet.has(el.id);
      if (isSelected && !ancestorSelected) {
        result.push(el.id);
      }
      const nextAncestor = ancestorSelected || isSelected;
      if (el.children) {
        visit(el.children, nextAncestor);
      }
    }
  };
  visit(elements, false);
  return result;
};

export const collectElementsInRect = (elements: Element[], rect: SelectionRect): string[] => {
  const ids: string[] = [];
  const visit = (list: Element[], offsetX: number, offsetY: number) => {
    for (const el of list) {
      const x = offsetX + el.x;
      const y = offsetY + el.y;
      const within =
        rect.x <= x &&
        rect.y <= y &&
        rect.x + rect.width >= x + el.width &&
        rect.y + rect.height >= y + el.height;

      if (within) {
        ids.push(el.id);
      }

      if (el.children) {
        visit(el.children, x, y);
      }
    }
  };

  visit(elements, 0, 0);
  return ids;
};

export const findParentElement = (
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

export const cloneElement = (el: Element, rename = false): Element => ({
  ...el,
  id: generateId(),
  name: rename ? `${el.name} CopyIcon` : el.name,
  children: el.children ? el.children.map((child) => cloneElement(child)) : undefined
});

export const updateElementInList = (
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

export const deleteElementFromList = (elements: Element[], id: string): Element[] => {
  return elements
    .filter((el) => el.id !== id)
    .map((el) => ({
      ...el,
      children: el.children ? deleteElementFromList(el.children, id) : undefined
    }));
};

export const applyConstraints = (
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

export const getCanvasFill = (
  ctx: CanvasRenderingContext2D,
  element: Element,
  x: number,
  y: number
) => {
  if (!element.fillGradient) {
    return element.fill || null;
  }

  const width = element.width;
  const height = element.height;
  const gradient = element.fillGradient;
  const stops =
    gradient.stops && gradient.stops.length > 0
      ? gradient.stops
      : defaultGradientStops(element.fill || '#e2e8f0');

  let paint: CanvasGradient | null = null;
  if (gradient.type === 'linear') {
    const angle = ((gradient.angle ?? 0) * Math.PI) / 180;
    const cx = x + width / 2;
    const cy = y + height / 2;
    const dx = Math.cos(angle) * (width / 2);
    const dy = Math.sin(angle) * (height / 2);
    paint = ctx.createLinearGradient(cx - dx, cy - dy, cx + dx, cy + dy);
  } else {
    const cx = x + width / 2;
    const cy = y + height / 2;
    const radius = Math.max(width, height) / 2;
    paint = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius);
  }

  stops
    .slice()
    .sort((a, b) => a.offset - b.offset)
    .forEach((stop) => {
      const offset = Math.min(1, Math.max(0, stop.offset));
      paint!.addColorStop(offset, colorWithOpacity(stop.color, stop.opacity));
    });

  return paint;
};
