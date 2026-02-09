export type HorizontalConstraint = 'both' | 'center' | 'left' | 'right' | 'scale';
export type VerticalConstraint = 'both' | 'bottom' | 'center' | 'scale' | 'top';

export interface Constraints {
  horizontal: HorizontalConstraint;
  vertical: VerticalConstraint;
}

export type ElementType = 'circle' | 'frame' | 'group' | 'image' | 'instance' | 'rect' | 'text';
export type ResizeHandle = 'e' | 'n' | 'ne' | 'nw' | 's' | 'se' | 'sw' | 'w';

export interface GradientStop {
  color: string;
  offset: number;
  opacity?: number;
}

export interface GradientFill {
  angle?: number;
  stops: GradientStop[];
  type: 'linear' | 'radial';
}

export interface Element {
  children?: Element[];
  constraints: Constraints;
  fill: string;
  fillGradient?: GradientFill;
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

export interface DuplicateResult {
  duplicated: Element | null;
  elements: Element[];
}

export interface ElementBounds {
  height: number;
  width: number;
  x: number;
  y: number;
}

export interface SelectionRect {
  height: number;
  width: number;
  x: number;
  y: number;
}

export interface HistoryState {
  elements: Element[];
  masters: Record<string, Element>;
  selectedIds: string[];
}
