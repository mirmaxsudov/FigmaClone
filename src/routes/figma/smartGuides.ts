import type { Element } from './types';

export interface Bounds {
  height: number;
  width: number;
  x: number;
  y: number;
}

export interface WorldBounds extends Bounds {
  id: string;
  rotation?: number;
}

export interface GuideLine {
  end: number;
  orientation: 'horizontal' | 'vertical';
  start: number;
  value: number;
}

export interface MeasurementGuide {
  cross: number;
  end: number;
  orientation: 'horizontal' | 'vertical';
  start: number;
  value: number;
}

export interface SmartGuideState {
  lines: GuideLine[];
  measurements: MeasurementGuide[];
}

export interface AlignmentSnap {
  delta: number;
  kind: 'bottom' | 'center' | 'centerY' | 'left' | 'right' | 'top';
  line: GuideLine;
  value: number;
}

export interface AlignmentResult {
  lines: GuideLine[];
  snapX?: AlignmentSnap;
  snapY?: AlignmentSnap;
}

export interface SpatialIndex {
  cellSize: number;
  query: (bounds: Bounds, padding?: number) => WorldBounds[];
}

const intersects = (a: Bounds, b: Bounds) => {
  return (
    a.x <= b.x + b.width && a.x + a.width >= b.x && a.y <= b.y + b.height && a.y + a.height >= b.y
  );
};

export const getRotatedBounds = (
  x: number,
  y: number,
  width: number,
  height: number,
  rotation = 0
): Bounds => {
  if (!rotation) {
    return { x, y, width, height };
  }
  const rad = (rotation * Math.PI) / 180;
  const cos = Math.cos(rad);
  const sin = Math.sin(rad);
  const cx = x + width / 2;
  const cy = y + height / 2;

  const corners = [
    { x, y },
    { x: x + width, y },
    { x: x + width, y: y + height },
    { x, y: y + height }
  ].map((pt) => {
    const dx = pt.x - cx;
    const dy = pt.y - cy;
    return {
      x: cx + dx * cos - dy * sin,
      y: cy + dx * sin + dy * cos
    };
  });

  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;
  for (const pt of corners) {
    minX = Math.min(minX, pt.x);
    minY = Math.min(minY, pt.y);
    maxX = Math.max(maxX, pt.x);
    maxY = Math.max(maxY, pt.y);
  }

  return { x: minX, y: minY, width: maxX - minX, height: maxY - minY };
};

const toWorldBounds = (el: Element, offsetX: number, offsetY: number): WorldBounds => {
  const rotation = el.rotation ?? 0;
  const baseX = offsetX + el.x;
  const baseY = offsetY + el.y;
  const rotated = getRotatedBounds(baseX, baseY, el.width, el.height, rotation);
  return { ...rotated, id: el.id, rotation };
};

export const collectWorldBounds = (
  elements: Element[],
  options?: { excludeIds?: Set<string>; viewport?: Bounds }
): WorldBounds[] => {
  const result: WorldBounds[] = [];
  const visit = (list: Element[], offsetX: number, offsetY: number) => {
    for (const el of list) {
      if (options?.excludeIds?.has(el.id)) {
        continue;
      }
      const bounds = toWorldBounds(el, offsetX, offsetY);
      if (!options?.viewport || intersects(bounds, options.viewport)) {
        result.push(bounds);
      }
      if (el.children) {
        visit(el.children, offsetX + el.x, offsetY + el.y);
      }
    }
  };
  visit(elements, 0, 0);
  return result;
};

export const collectBoundsById = (
  elements: Element[],
  ids: Set<string>
): Map<string, WorldBounds> => {
  const map = new Map<string, WorldBounds>();
  const visit = (list: Element[], offsetX: number, offsetY: number) => {
    for (const el of list) {
      if (ids.has(el.id)) {
        map.set(el.id, toWorldBounds(el, offsetX, offsetY));
        continue;
      }
      if (el.children) {
        visit(el.children, offsetX + el.x, offsetY + el.y);
      }
    }
  };
  visit(elements, 0, 0);
  return map;
};

export const unionBounds = (bounds: WorldBounds[], dx = 0, dy = 0): Bounds => {
  if (bounds.length === 0) {
    return { x: 0, y: 0, width: 0, height: 0 };
  }
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;
  for (const b of bounds) {
    const x0 = b.x + dx;
    const y0 = b.y + dy;
    const x1 = x0 + b.width;
    const y1 = y0 + b.height;
    minX = Math.min(minX, x0);
    minY = Math.min(minY, y0);
    maxX = Math.max(maxX, x1);
    maxY = Math.max(maxY, y1);
  }
  return { x: minX, y: minY, width: maxX - minX, height: maxY - minY };
};

export const buildSpatialIndex = (bounds: WorldBounds[], cellSize = 240): SpatialIndex => {
  const buckets = new Map<string, WorldBounds[]>();
  const keyFor = (x: number, y: number) => `${x},${y}`;

  for (const b of bounds) {
    const minX = Math.floor(b.x / cellSize);
    const maxX = Math.floor((b.x + b.width) / cellSize);
    const minY = Math.floor(b.y / cellSize);
    const maxY = Math.floor((b.y + b.height) / cellSize);
    for (let gx = minX; gx <= maxX; gx += 1) {
      for (let gy = minY; gy <= maxY; gy += 1) {
        const key = keyFor(gx, gy);
        const bucket = buckets.get(key);
        if (bucket) {
          bucket.push(b);
        } else {
          buckets.set(key, [b]);
        }
      }
    }
  }

  return {
    cellSize,
    query: (boundsToQuery: Bounds, padding = 0) => {
      const x0 = boundsToQuery.x - padding;
      const y0 = boundsToQuery.y - padding;
      const x1 = boundsToQuery.x + boundsToQuery.width + padding;
      const y1 = boundsToQuery.y + boundsToQuery.height + padding;
      const minX = Math.floor(x0 / cellSize);
      const maxX = Math.floor(x1 / cellSize);
      const minY = Math.floor(y0 / cellSize);
      const maxY = Math.floor(y1 / cellSize);

      const seen = new Map<string, WorldBounds>();
      for (let gx = minX; gx <= maxX; gx += 1) {
        for (let gy = minY; gy <= maxY; gy += 1) {
          const bucket = buckets.get(keyFor(gx, gy));
          if (!bucket) continue;
          for (const item of bucket) {
            seen.set(item.id, item);
          }
        }
      }
      return Array.from(seen.values());
    }
  };
};

export const computeAlignmentGuides = (params: {
  allowedX: Array<'center' | 'left' | 'right'>;
  allowedY: Array<'bottom' | 'centerY' | 'top'>;
  candidates: WorldBounds[];
  movingBounds: Bounds;
  snapThreshold: number;
}): AlignmentResult => {
  const { movingBounds, candidates, snapThreshold, allowedX, allowedY } = params;
  const selfX = [
    { kind: 'left' as const, value: movingBounds.x },
    { kind: 'center' as const, value: movingBounds.x + movingBounds.width / 2 },
    { kind: 'right' as const, value: movingBounds.x + movingBounds.width }
  ].filter((line) => allowedX.includes(line.kind));
  const selfY = [
    { kind: 'top' as const, value: movingBounds.y },
    { kind: 'centerY' as const, value: movingBounds.y + movingBounds.height / 2 },
    { kind: 'bottom' as const, value: movingBounds.y + movingBounds.height }
  ].filter((line) => allowedY.includes(line.kind));

  let bestX: AlignmentSnap | undefined;
  let bestY: AlignmentSnap | undefined;

  for (const candidate of candidates) {
    const candX = [candidate.x, candidate.x + candidate.width / 2, candidate.x + candidate.width];
    const candY = [candidate.y, candidate.y + candidate.height / 2, candidate.y + candidate.height];

    for (const selfLine of selfX) {
      for (const value of candX) {
        const delta = value - selfLine.value;
        const distance = Math.abs(delta);
        if (distance > snapThreshold) continue;
        if (!bestX || distance < Math.abs(bestX.delta)) {
          bestX = {
            delta,
            kind: selfLine.kind,
            value,
            line: {
              orientation: 'vertical',
              value,
              start: Math.min(movingBounds.y, candidate.y),
              end: Math.max(movingBounds.y + movingBounds.height, candidate.y + candidate.height)
            }
          };
        }
      }
    }

    for (const selfLine of selfY) {
      for (const value of candY) {
        const delta = value - selfLine.value;
        const distance = Math.abs(delta);
        if (distance > snapThreshold) continue;
        if (!bestY || distance < Math.abs(bestY.delta)) {
          bestY = {
            delta,
            kind: selfLine.kind,
            value,
            line: {
              orientation: 'horizontal',
              value,
              start: Math.min(movingBounds.x, candidate.x),
              end: Math.max(movingBounds.x + movingBounds.width, candidate.x + candidate.width)
            }
          };
        }
      }
    }
  }

  const lines: GuideLine[] = [];
  if (bestX) lines.push(bestX.line);
  if (bestY) lines.push(bestY.line);

  return { lines, snapX: bestX, snapY: bestY };
};

export const computeMeasurements = (movingBounds: Bounds, candidates: WorldBounds[]) => {
  const left = movingBounds.x;
  const right = movingBounds.x + movingBounds.width;
  const top = movingBounds.y;
  const bottom = movingBounds.y + movingBounds.height;

  let nearestLeft: {
    dist: number;
    bounds: WorldBounds;
    overlapStart: number;
    overlapEnd: number;
  } | null = null;
  let nearestRight: {
    dist: number;
    bounds: WorldBounds;
    overlapStart: number;
    overlapEnd: number;
  } | null = null;
  let nearestTop: {
    dist: number;
    bounds: WorldBounds;
    overlapStart: number;
    overlapEnd: number;
  } | null = null;
  let nearestBottom: {
    dist: number;
    bounds: WorldBounds;
    overlapStart: number;
    overlapEnd: number;
  } | null = null;

  for (const candidate of candidates) {
    const cLeft = candidate.x;
    const cRight = candidate.x + candidate.width;
    const cTop = candidate.y;
    const cBottom = candidate.y + candidate.height;

    const overlapYStart = Math.max(top, cTop);
    const overlapYEnd = Math.min(bottom, cBottom);
    const overlapY = overlapYEnd - overlapYStart;
    if (overlapY > 0) {
      if (cRight <= left) {
        const dist = left - cRight;
        if (dist > 0 && (!nearestLeft || dist < nearestLeft.dist)) {
          nearestLeft = {
            dist,
            bounds: candidate,
            overlapStart: overlapYStart,
            overlapEnd: overlapYEnd
          };
        }
      } else if (cLeft >= right) {
        const dist = cLeft - right;
        if (dist > 0 && (!nearestRight || dist < nearestRight.dist)) {
          nearestRight = {
            dist,
            bounds: candidate,
            overlapStart: overlapYStart,
            overlapEnd: overlapYEnd
          };
        }
      }
    }

    const overlapXStart = Math.max(left, cLeft);
    const overlapXEnd = Math.min(right, cRight);
    const overlapX = overlapXEnd - overlapXStart;
    if (overlapX > 0) {
      if (cBottom <= top) {
        const dist = top - cBottom;
        if (dist > 0 && (!nearestTop || dist < nearestTop.dist)) {
          nearestTop = {
            dist,
            bounds: candidate,
            overlapStart: overlapXStart,
            overlapEnd: overlapXEnd
          };
        }
      } else if (cTop >= bottom) {
        const dist = cTop - bottom;
        if (dist > 0 && (!nearestBottom || dist < nearestBottom.dist)) {
          nearestBottom = {
            dist,
            bounds: candidate,
            overlapStart: overlapXStart,
            overlapEnd: overlapXEnd
          };
        }
      }
    }
  }

  const measurements: MeasurementGuide[] = [];
  if (nearestLeft) {
    const mid = (nearestLeft.overlapStart + nearestLeft.overlapEnd) / 2;
    measurements.push({
      orientation: 'horizontal',
      start: nearestLeft.bounds.x + nearestLeft.bounds.width,
      end: left,
      cross: mid,
      value: Math.round(nearestLeft.dist)
    });
  }
  if (nearestRight) {
    const mid = (nearestRight.overlapStart + nearestRight.overlapEnd) / 2;
    measurements.push({
      orientation: 'horizontal',
      start: right,
      end: nearestRight.bounds.x,
      cross: mid,
      value: Math.round(nearestRight.dist)
    });
  }
  if (nearestTop) {
    const mid = (nearestTop.overlapStart + nearestTop.overlapEnd) / 2;
    measurements.push({
      orientation: 'vertical',
      start: nearestTop.bounds.y + nearestTop.bounds.height,
      end: top,
      cross: mid,
      value: Math.round(nearestTop.dist)
    });
  }
  if (nearestBottom) {
    const mid = (nearestBottom.overlapStart + nearestBottom.overlapEnd) / 2;
    measurements.push({
      orientation: 'vertical',
      start: bottom,
      end: nearestBottom.bounds.y,
      cross: mid,
      value: Math.round(nearestBottom.dist)
    });
  }

  return measurements;
};
