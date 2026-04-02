'use client';

import { useEffect, useRef } from 'react';

type Point = { x: number; y: number };

type GraphNode = {
  id: number;
  x: number;
  y: number;
  dirX: number;
  dirY: number;
  radius: number;
  glow: number;
  traffic: number;
  depth: number;
  bornAt: number;
  ageMs: number;
  ttlMs: number;
  fadeInMs: number;
  fadeOutMs: number;
  alpha: number;
  lastActiveAt: number;
  isFadingOut: boolean;
  isAnchor: boolean;
  parentId?: number;
  children: number[];
};

type GraphEdge = {
  id: number;
  a: number;
  b: number;
  length: number;
  points: Point[];
  cumulative: number[];
  total: number;
  baseAlpha: number;
  jitterSeed: number;
  activity: number;
  depth: number;
  bornAt: number;
  ageMs: number;
  ttlMs: number;
  fadeInMs: number;
  fadeOutMs: number;
  alpha: number;
  lastActiveAt: number;
  isFadingOut: boolean;
};

type Pulse = {
  edgeId: number;
  progress: number;
  speed: number;
  direction: 1 | -1;
  intensity: number;
  lifeMs: number;
  maxLifeMs: number;
};

type SurgeStep = {
  edgeId: number;
  direction: 1 | -1;
};

type Surge = {
  steps: SurgeStep[];
  progress: number;
  speed: number;
  intensity: number;
  lifeMs: number;
  maxLifeMs: number;
};

type Spark = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  lifeMs: number;
  maxLifeMs: number;
  radius: number;
};

const TAU = Math.PI * 2;
const rand = (min: number, max: number) => min + Math.random() * (max - min);
const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const fract = (n: number) => n - Math.floor(n);
const randNormal = () => {
  let u = 0;
  let v = 0;
  while (u === 0) u = Math.random();
  while (v === 0) v = Math.random();
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(TAU * v);
};

const pointDistance = (a: Point, b: Point) => Math.hypot(a.x - b.x, a.y - b.y);
const normalizeDir = (dir: Point) => {
  const len = Math.hypot(dir.x, dir.y) || 1;
  return { x: dir.x / len, y: dir.y / len };
};

const buildCumulativeLengths = (points: Point[]) => {
  const cumulative = [0];
  let total = 0;
  for (let i = 1; i < points.length; i++) {
    total += pointDistance(points[i - 1], points[i]);
    cumulative.push(total);
  }
  return { cumulative, total };
};

const samplePointOnEdge = (edge: GraphEdge, t: number): Point => {
  const target = clamp(t, 0, 1) * edge.total;
  for (let i = 1; i < edge.cumulative.length; i++) {
    if (edge.cumulative[i] < target) continue;
    const segStart = edge.cumulative[i - 1];
    const segEnd = edge.cumulative[i];
    const segT = (target - segStart) / (segEnd - segStart || 1);
    return {
      x: lerp(edge.points[i - 1].x, edge.points[i].x, segT),
      y: lerp(edge.points[i - 1].y, edge.points[i].y, segT)
    };
  }
  return edge.points[edge.points.length - 1];
};

const drawEdgeSlice = (
  ctx: CanvasRenderingContext2D,
  edge: GraphEdge,
  tFrom: number,
  tTo: number,
  lineWidth: number,
  strokeStyle: string,
  offsetX = 0,
  offsetY = 0
) => {
  const start = clamp(Math.min(tFrom, tTo), 0, 1) * edge.total;
  const end = clamp(Math.max(tFrom, tTo), 0, 1) * edge.total;
  if (end <= start) return;

  ctx.beginPath();
  let opened = false;

  for (let i = 1; i < edge.points.length; i++) {
    const segStart = edge.cumulative[i - 1];
    const segEnd = edge.cumulative[i];
    if (segEnd < start || segStart > end) continue;

    const localStart = Math.max(segStart, start);
    const localEnd = Math.min(segEnd, end);
    const length = segEnd - segStart || 1;
    const aT = (localStart - segStart) / length;
    const bT = (localEnd - segStart) / length;
    const ax = lerp(edge.points[i - 1].x, edge.points[i].x, aT) + offsetX;
    const ay = lerp(edge.points[i - 1].y, edge.points[i].y, aT) + offsetY;
    const bx = lerp(edge.points[i - 1].x, edge.points[i].x, bT) + offsetX;
    const by = lerp(edge.points[i - 1].y, edge.points[i].y, bT) + offsetY;

    if (!opened) {
      ctx.moveTo(ax, ay);
      opened = true;
    } else {
      ctx.lineTo(ax, ay);
    }
    ctx.lineTo(bx, by);
  }

  if (!opened) return;
  ctx.strokeStyle = strokeStyle;
  ctx.lineWidth = lineWidth;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.stroke();
};

const buildEdgePolyline = (start: Point, end: Point, seed: number, isMobile: boolean) => {
  const dx = end.x - start.x;
  const dy = end.y - start.y;
  const distance = Math.hypot(dx, dy) || 1;
  const nx = -dy / distance;
  const ny = dx / distance;
  const segments = clamp(Math.round(distance / (isMobile ? 56 : 48)), 4, 10);
  const points: Point[] = [start];

  for (let i = 1; i < segments; i++) {
    const t = i / segments;
    const n = fract(Math.sin(seed * 12.9898 + i * 78.233) * 43758.5453);
    const wobble = (n - 0.5) * 2;
    const taper = 1 - Math.abs(t - 0.5) * 1.8;
    const offset = wobble * distance * (isMobile ? 0.028 : 0.04) * taper;
    points.push({
      x: lerp(start.x, end.x, t) + nx * offset,
      y: lerp(start.y, end.y, t) + ny * offset
    });
  }

  points.push(end);
  return points;
};

type DensityCenter = { x: number; y: number; radius: number; weight: number };

const buildDensityCenters = (width: number, height: number): DensityCenter[] => {
  const count = Math.random() > 0.5 ? 2 : 3;
  const minDim = Math.min(width, height);
  const centers: DensityCenter[] = [];
  for (let i = 0; i < count; i++) {
    centers.push({
      x: rand(width * 0.2, width * 0.8),
      y: rand(height * 0.18, height * 0.82),
      radius: rand(minDim * 0.18, minDim * 0.42),
      weight: rand(0.6, 1.2)
    });
  }
  return centers;
};

const densityAtPoint = (x: number, y: number, centers: DensityCenter[]) => {
  let sum = 0;
  let max = 0;
  for (let i = 0; i < centers.length; i++) {
    const c = centers[i];
    const d = pointDistance({ x, y }, c);
    const influence = Math.exp(-(d * d) / (2 * c.radius * c.radius));
    sum += influence * c.weight;
    max = Math.max(max, c.weight);
  }
  return clamp(sum / Math.max(0.0001, centers.length * max), 0, 1);
};

const pickDensityCenters = (width: number, height: number) => buildDensityCenters(width, height);

const getScrollProgress = () => {
  const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
  return clamp(window.scrollY / max, 0, 1);
};

const getViewportPadding = (width: number, height: number) => {
  const padX = width * 0.06;
  const padY = height * 0.08;
  return { minX: padX, maxX: width - padX, minY: padY, maxY: height - padY };
};

const inHeroSafeZone = (x: number, y: number, width: number, height: number) => {
  const centerX = width * 0.5;
  const centerY = height * 0.45;
  const safeW = width * 0.36;
  const safeH = height * 0.31;
  return Math.abs(x - centerX) < safeW * 0.5 && Math.abs(y - centerY) < safeH * 0.5;
};

const createNode = (
  width: number,
  height: number,
  isMobile: boolean,
  centers: DensityCenter[],
  scrollProgress: number,
  now: number,
  existing: GraphNode[]
): GraphNode | null => {
  const minDim = Math.min(width, height);
  const baseMinDistance = isMobile ? minDim * 0.11 : minDim * 0.095;
  const padding = getViewportPadding(width, height);
  const safeBias = 0.7 - scrollProgress * 0.45;
  const verticalBias = lerp(0.25, 0.7, scrollProgress);
  const minY = lerp(padding.minY, height * 0.32, 1 - scrollProgress);
  const maxY = lerp(height * 0.78, padding.maxY, scrollProgress);

  let attempts = 0;
  const maxAttempts = 40;
  while (attempts < maxAttempts) {
    attempts += 1;
    const centerPick = centers[Math.floor(Math.random() * centers.length)];
    const spreadX = centerPick.radius * 0.55;
    const spreadY = centerPick.radius * 0.5;
    const x = clamp(centerPick.x + randNormal() * spreadX, padding.minX, padding.maxX);
    const y = clamp(centerPick.y + randNormal() * spreadY, minY, maxY);
    const density = densityAtPoint(x, y, centers);
    if (inHeroSafeZone(x, y, width, height) && Math.random() < safeBias + density * 0.2) continue;

    const minDistance = baseMinDistance * lerp(1.35, 0.75, density);
    let tooClose = false;
    for (let i = 0; i < existing.length; i++) {
      const n = existing[i];
      if (pointDistance({ x, y }, n) < minDistance) {
        tooClose = true;
        break;
      }
    }
    if (tooClose) continue;

    return {
      id: -1,
      x: clamp(x, padding.minX, padding.maxX),
      y: clamp(y, padding.minY, padding.maxY),
      dirX: rand(-0.8, 0.8),
      dirY: rand(-0.8, 0.8),
      radius: rand(isMobile ? 1.8 : 2.2, isMobile ? 2.9 : 3.6),
      glow: rand(0.36, 0.6),
      traffic: 0,
      depth: clamp(rand(0.2, 0.95) + (verticalBias - 0.5) * 0.15, 0.1, 0.98),
      bornAt: now,
      ageMs: 0,
      ttlMs: rand(12000, 18000),
      fadeInMs: rand(360, 540),
      fadeOutMs: rand(620, 900),
      alpha: 0,
      lastActiveAt: now,
      isFadingOut: false,
      isAnchor: false,
      children: []
    };
  }

  return null;
};

const createBranchNode = (
  width: number,
  height: number,
  isMobile: boolean,
  origin: Point,
  direction: Point,
  scrollProgress: number,
  now: number,
  existing: GraphNode[]
): GraphNode | null => {
  const minDim = Math.min(width, height);
  const padding = getViewportPadding(width, height);
  const step = minDim * lerp(0.06, 0.1, scrollProgress);
  const jitter = minDim * 0.035;
  const baseMinDistance = isMobile ? minDim * 0.11 : minDim * 0.095;

  let attempts = 0;
  const maxAttempts = 24;
  while (attempts < maxAttempts) {
    attempts += 1;
    const x = clamp(origin.x + direction.x * step + rand(-jitter, jitter), padding.minX, padding.maxX);
    const y = clamp(origin.y + direction.y * step + rand(-jitter, jitter), padding.minY, padding.maxY);
    if (inHeroSafeZone(x, y, width, height) && Math.random() < 0.55) continue;

    let tooClose = false;
    for (let i = 0; i < existing.length; i++) {
      const n = existing[i];
      if (pointDistance({ x, y }, n) < baseMinDistance) {
        tooClose = true;
        break;
      }
    }
  if (tooClose) continue;

    return {
      id: -1,
      x,
      y,
      dirX: direction.x,
      dirY: direction.y,
      radius: rand(isMobile ? 1.8 : 2.2, isMobile ? 2.9 : 3.6),
      glow: rand(0.36, 0.6),
      traffic: 0,
      depth: clamp(rand(0.2, 0.95), 0.1, 0.98),
      bornAt: now,
      ageMs: 0,
      ttlMs: rand(11000, 17000),
      fadeInMs: rand(340, 520),
      fadeOutMs: rand(600, 860),
      alpha: 0,
      lastActiveAt: now,
      isFadingOut: false,
      isAnchor: false,
      children: []
    };
  }

  return null;
};

const createEdge = (
  a: GraphNode,
  b: GraphNode,
  edgeId: number,
  isMobile: boolean,
  now: number
): GraphEdge => {
  const points = buildEdgePolyline(a, b, edgeId * 1.31 + a.id * 0.77 + b.id * 1.13, isMobile);
  const { cumulative, total } = buildCumulativeLengths(points);
  return {
    id: edgeId,
    a: a.id,
    b: b.id,
    length: pointDistance(a, b),
    points,
    cumulative,
    total,
    baseAlpha: rand(0.1, 0.2),
    jitterSeed: rand(0, TAU),
    activity: 0,
    depth: (a.depth + b.depth) * 0.5,
    bornAt: now,
    ageMs: 0,
    ttlMs: rand(9000, 14000),
    fadeInMs: rand(320, 520),
    fadeOutMs: rand(560, 860),
    alpha: 0,
    lastActiveAt: now,
    isFadingOut: false
  };
};

const spawnPulse = (edges: GraphEdge[], isMobile: boolean, reduced: boolean): Pulse | null => {
  if (!edges.length) return null;
  const edge = edges[Math.floor(Math.random() * edges.length)];
  return {
    edgeId: edge.id,
    progress: Math.random(),
    speed: reduced ? rand(0.09, 0.16) : rand(0.2, isMobile ? 0.34 : 0.42),
    direction: Math.random() > 0.5 ? 1 : -1,
    intensity: reduced ? rand(0.42, 0.62) : rand(0.55, 1),
    lifeMs: 0,
    maxLifeMs: reduced ? rand(3200, 5200) : rand(1700, 3500)
  };
};

const spawnSurge = (
  adjacency: Map<number, Array<{ node: number; edgeId: number }>>,
  edgeById: Map<number, GraphEdge>,
  reduced: boolean
): Surge | null => {
  if (reduced || adjacency.size === 0) return null;
  const nodeIds = Array.from(adjacency.keys());
  const startNode = nodeIds[Math.floor(Math.random() * nodeIds.length)];
  const hops = Math.floor(rand(1, 4));
  const visited = new Set<number>([startNode]);
  const steps: SurgeStep[] = [];

  let current = startNode;
  for (let i = 0; i < hops; i++) {
    const options = (adjacency.get(current) || []).filter((next) => !visited.has(next.node));
    const pickFrom = options.length ? options : adjacency.get(current) || [];
    if (!pickFrom.length) break;
    const next = pickFrom[Math.floor(Math.random() * pickFrom.length)];
    const edge = edgeById.get(next.edgeId);
    if (!edge) break;
    const direction = edge.a === current ? 1 : -1;
    steps.push({ edgeId: next.edgeId, direction });
    visited.add(next.node);
    current = next.node;
  }

  if (!steps.length) return null;
  return {
    steps,
    progress: 0,
    speed: rand(1.1, 2.1),
    intensity: rand(0.7, 1.1),
    lifeMs: 0,
    maxLifeMs: rand(520, 1100)
  };
};

export function AnimatedLightningBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    const passiveCanvas = document.createElement('canvas');
    const passiveCtx = passiveCanvas.getContext('2d', { alpha: true });
    if (!passiveCtx) return;

    const reducedQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    let prefersReduced = reducedQuery.matches;
    let isMobile = window.matchMedia('(max-width: 768px)').matches;
    let raf = 0;
    let lastTime = performance.now();
    let accumulator = 0;
    let lastScrollY = window.scrollY;
    let scrollVelocity = 0;
    let scrollVelocitySmoothed = 0;
    let energySmoothed = 0;
    let energyAccumulator = 0;

    let nodes: GraphNode[] = [];
    let edges: GraphEdge[] = [];
    let nodeById = new Map<number, GraphNode>();
    let edgeById = new Map<number, GraphEdge>();
    let adjacency = new Map<number, Array<{ node: number; edgeId: number }>>();
    let pulses: Pulse[] = [];
    let surges: Surge[] = [];
    let sparks: Spark[] = [];
    let nodeIdCounter = 0;
    let edgeIdCounter = 0;
    let densityCenters: DensityCenter[] = [];
    let passiveDirty = true;
    let passiveFrame = 0;
    let backdropFrame = 0;
    let backdropVars = { pageProgress: 0, phase: 0, shiftX: 0, shiftY: 0 };
    let gridCellSize = 220;
    let spatialGrid = new Map<string, number[]>();
    let anchorNodeId: number | null = null;
    let trunkTipId: number | null = null;
    let trunkSet = new Set<number>();
    let isTopResetting = false;

    const MIN_NODE_AGE_MS = 3200;
    const ENERGY_THRESHOLD = 160;
    const ENERGY_DECAY = 12;
    const VEL_LERP = 0.08;
    const ENERGY_LERP = 0.06;

    let maxNodes = isMobile ? 50 : 70;
    let maxEdges = Math.round(maxNodes * (isMobile ? 2.1 : 2.4));

    let idleMaxNodes = 12;
    let activeMaxNodes = isMobile ? 50 : 70;
    const TOP_RESET_Y = 6;
    const TOP_RESET_FADE_MS = 700;

    const getPulseTarget = (energy: number) => {
      if (prefersReduced) return 2;
      const base = isMobile ? 5 : 8;
      return Math.round(base + energy * (isMobile ? 2 : 4));
    };
    const getSparkCap = () => (prefersReduced ? 8 : isMobile ? 28 : 46);
    const getSurgeChancePerFrame = (energy: number) => {
      if (prefersReduced) return 0;
      const base = isMobile ? 0.006 : 0.009;
      return base * (0.6 + energy * 0.7);
    };

    const markPassiveDirty = () => {
      passiveDirty = true;
    };

    const updateScrollEnergy = (dtMs: number) => {
      const currentScrollY = window.scrollY;
      const rawVelocity = (currentScrollY - lastScrollY) / (dtMs || 16);
      lastScrollY = currentScrollY;
      scrollVelocity = lerp(scrollVelocity, rawVelocity, VEL_LERP);
      scrollVelocitySmoothed = lerp(scrollVelocitySmoothed, scrollVelocity, VEL_LERP * 0.8);
      const targetEnergy = Math.abs(scrollVelocitySmoothed);
      energySmoothed = lerp(energySmoothed, targetEnergy, ENERGY_LERP);
      energyAccumulator = Math.max(0, energyAccumulator + energySmoothed * dtMs - ENERGY_DECAY * (dtMs / 16));
      return energySmoothed;
    };

    const rebuildAdjacency = () => {
      adjacency.clear();
      for (let i = 0; i < nodes.length; i++) {
        adjacency.set(nodes[i].id, []);
      }
      for (let i = 0; i < edges.length; i++) {
        const edge = edges[i];
        const listA = adjacency.get(edge.a);
        const listB = adjacency.get(edge.b);
        if (listA) listA.push({ node: edge.b, edgeId: edge.id });
        if (listB) listB.push({ node: edge.a, edgeId: edge.id });
      }
    };

    const attachChild = (parentId: number, childId: number) => {
      const parent = nodeById.get(parentId);
      const child = nodeById.get(childId);
      if (!parent || !child) return;
      if (!parent.children.includes(childId)) {
        parent.children.push(childId);
      }
      child.parentId = parentId;
    };

    const updateTrunkSet = () => {
      trunkSet = new Set<number>();
      let current = trunkTipId ?? anchorNodeId;
      while (current !== null && current !== undefined) {
        const node = nodeById.get(current);
        if (!node) break;
        trunkSet.add(node.id);
        if (node.isAnchor) break;
        current = node.parentId ?? null;
      }
    };

    const hasActiveChildren = (node: GraphNode) =>
      node.children.some((id) => {
        const child = nodeById.get(id);
        return child && !child.isFadingOut;
      });

    const getLeafCandidates = () =>
      nodes.filter(
        (node) => !node.isAnchor && !node.isFadingOut && !hasActiveChildren(node) && !trunkSet.has(node.id)
      );

    const gridKey = (x: number, y: number) => `${Math.floor(x / gridCellSize)},${Math.floor(y / gridCellSize)}`;

    const rebuildGrid = () => {
      spatialGrid.clear();
      for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i];
        const key = gridKey(node.x, node.y);
        const bucket = spatialGrid.get(key) || [];
        bucket.push(node.id);
        spatialGrid.set(key, bucket);
      }
    };

    const addNodeToGrid = (node: GraphNode) => {
      const key = gridKey(node.x, node.y);
      const bucket = spatialGrid.get(key) || [];
      bucket.push(node.id);
      spatialGrid.set(key, bucket);
    };

    const removeNodeFromGrid = (node: GraphNode) => {
      const key = gridKey(node.x, node.y);
      const bucket = spatialGrid.get(key);
      if (!bucket) return;
      spatialGrid.set(
        key,
        bucket.filter((id) => id !== node.id)
      );
    };

    const queryNearbyNodes = (x: number, y: number, radius: number) => {
      const gx = Math.floor(x / gridCellSize);
      const gy = Math.floor(y / gridCellSize);
      const range = Math.ceil(radius / gridCellSize);
      const result: GraphNode[] = [];
      for (let i = -range; i <= range; i++) {
        for (let j = -range; j <= range; j++) {
          const key = `${gx + i},${gy + j}`;
          const bucket = spatialGrid.get(key);
          if (!bucket) continue;
          for (let k = 0; k < bucket.length; k++) {
            const node = nodeById.get(bucket[k]);
            if (node) result.push(node);
          }
        }
      }
      return result;
    };

    const spawnSpark = (x: number, y: number, strength: number) => {
      if (sparks.length >= getSparkCap()) return;
      sparks.push({
        x,
        y,
        vx: rand(-0.09, 0.09) * strength,
        vy: rand(-0.12, 0.08) * strength,
        lifeMs: 0,
        maxLifeMs: rand(240, 640),
        radius: rand(0.5, 1.4)
      });
    };

    const drawBackdrop = (timeMs: number, vars: { pageProgress: number; phase: number; shiftX: number; shiftY: number }) => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      const pageProgress = vars.pageProgress;
      const phase = vars.phase;
      const shiftX = vars.shiftX;
      const shiftY = vars.shiftY;

      ctx.clearRect(0, 0, width, height);
      const base = ctx.createLinearGradient(0, 0, width, height);
      base.addColorStop(0, '#020617');
      base.addColorStop(0.5, '#030c21');
      base.addColorStop(1, '#020617');
      ctx.fillStyle = base;
      ctx.fillRect(0, 0, width, height);

      const ambientPulse = 0.06 + Math.sin(timeMs * 0.00045 + phase * TAU) * 0.03 + pageProgress * 0.06;
      const plasma = ctx.createRadialGradient(
        width * 0.48 + shiftX * 0.04,
        height * 0.43 + shiftY * 0.04,
        24,
        width * 0.52 + shiftX * 0.08,
        height * 0.5 + shiftY * 0.08,
        Math.max(width, height) * 0.78
      );
      plasma.addColorStop(0, `rgba(0, 229, 255, ${clamp(ambientPulse, 0.03, 0.2).toFixed(3)})`);
      plasma.addColorStop(0.38, 'rgba(0, 191, 255, 0.07)');
      plasma.addColorStop(1, 'rgba(0, 97, 170, 0)');
      ctx.fillStyle = plasma;
      ctx.fillRect(0, 0, width, height);
    };

    const getReadabilityZone = (width: number, height: number) => {
      const cx = width * 0.5;
      const cy = height * 0.45;
      const rx = width * 0.28;
      const ry = height * 0.22;
      return { cx, cy, rx, ry };
    };

    const getDepthOffsets = (now: number, depth: number, scrollSpeed: number) => {
      const idleX = Math.sin(now * 0.00018 + depth * 6.4) * 0.75;
      const idleY = Math.cos(now * 0.00014 + depth * 5.1) * 0.55;
      const scrollX = clamp(scrollSpeed * 0.005, -8, 8);
      const scrollY = clamp(scrollSpeed * 0.0038, -6, 6);
      const depthScale = 0.2 + depth * 0.8;
      return {
        x: (idleX + scrollX) * depthScale,
        y: (idleY + scrollY) * depthScale
      };
    };

    const renderPassiveLayer = (now: number) => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      passiveCtx.clearRect(0, 0, width, height);
      passiveCtx.save();
      passiveCtx.globalCompositeOperation = 'lighter';
      passiveCtx.filter = prefersReduced ? 'none' : 'blur(1.2px)';

      for (let i = 0; i < edges.length; i++) {
        const edge = edges[i];
        if (edge.isFadingOut && edge.alpha <= 0) continue;
        const activity = clamp(edge.activity, 0, 1);
        const ageRatio = clamp(edge.ageMs / edge.ttlMs, 0, 1);
        const isTrunkEdge = trunkSet.has(edge.a) && trunkSet.has(edge.b);
        const baseAlpha =
          edge.baseAlpha * edge.alpha * (1 - activity * 0.7) * (1 - ageRatio * 0.55) * (isTrunkEdge ? 1.2 : 1);
        if (baseAlpha < 0.02) continue;
        passiveCtx.shadowColor = 'rgba(0, 191, 255, 0.22)';
        passiveCtx.shadowBlur = 6 + ageRatio * 5;
        drawEdgeSlice(
          passiveCtx,
          edge,
          0,
          1,
          (isMobile ? 2.1 : 2.7) + (isTrunkEdge ? 0.3 : 0),
          `rgba(0, 191, 255, ${baseAlpha.toFixed(3)})`
        );
      }

      passiveCtx.restore();
      passiveDirty = false;
    };

    const drawPassiveFromCache = (now: number, scrollSpeed: number) => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      const offset = getDepthOffsets(now, 0.35, scrollSpeed);
      ctx.save();
      ctx.globalCompositeOperation = 'lighter';
      ctx.translate(offset.x * 0.4, offset.y * 0.4);
      ctx.drawImage(passiveCanvas, 0, 0, width, height);
      ctx.restore();
    };

    const drawReadabilityVeil = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      const readability = getReadabilityZone(width, height);
      ctx.save();
      const veil = ctx.createRadialGradient(
        readability.cx,
        readability.cy,
        readability.rx * 0.2,
        readability.cx,
        readability.cy,
        readability.rx * 1.15
      );
      veil.addColorStop(0, 'rgba(2, 6, 23, 0.38)');
      veil.addColorStop(0.6, 'rgba(2, 6, 23, 0.18)');
      veil.addColorStop(1, 'rgba(2, 6, 23, 0)');
      ctx.fillStyle = veil;
      ctx.fillRect(0, 0, width, height);
      ctx.restore();
    };

    const connectNewNode = (node: GraphNode, now: number) => {
      const parentId = node.parentId ?? anchorNodeId ?? undefined;
      if (parentId === undefined) return;
      const parent = nodeById.get(parentId);
      if (!parent) return;
      const edge = createEdge(node, parent, edgeIdCounter++, isMobile, now);
      edge.activity = 0.95;
      edge.alpha = 0;
      edges.push(edge);
      edgeById.set(edge.id, edge);

      if (!adjacency.has(node.id)) adjacency.set(node.id, []);
      if (!adjacency.has(parent.id)) adjacency.set(parent.id, []);
      adjacency.get(node.id)?.push({ node: parent.id, edgeId: edge.id });
      adjacency.get(parent.id)?.push({ node: node.id, edgeId: edge.id });
      attachChild(parent.id, node.id);

      if (!prefersReduced) {
        pulses.push({
          edgeId: edge.id,
          progress: 0,
          speed: rand(0.55, 0.9),
          direction: 1,
          intensity: rand(0.7, 1),
          lifeMs: 0,
          maxLifeMs: rand(600, 1100)
        });
      }
    };

    const pickGrowthNode = () => {
      updateTrunkSet();
      const leaves = nodes.filter((node) => !node.isAnchor && !node.isFadingOut && !hasActiveChildren(node));
      const trunkNodes = nodes.filter((node) => trunkSet.has(node.id) && !node.isAnchor && !node.isFadingOut);
      if (leaves.length && Math.random() < 0.75) {
        return leaves[Math.floor(Math.random() * leaves.length)];
      }
      if (trunkNodes.length) {
        return trunkNodes[Math.floor(Math.random() * trunkNodes.length)];
      }
      return anchorNodeId !== null ? nodeById.get(anchorNodeId) : undefined;
    };

    const computeChildDirection = (parent: GraphNode, isTrunk: boolean) => {
      const base = normalizeDir({ x: parent.dirX, y: parent.dirY });
      const angle = Math.atan2(base.y, base.x);
      const maxTurn = isTrunk ? 1.0 : 1.4;
      const turn = rand(-maxTurn, maxTurn);
      const next = { x: Math.cos(angle + turn), y: Math.sin(angle + turn) };
      const randVec = normalizeDir({ x: rand(-1, 1), y: rand(-1, 1) });
      const mix = isTrunk ? 0.18 : 0.28;
      const blended = normalizeDir({
        x: lerp(next.x, randVec.x, mix),
        y: lerp(next.y, randVec.y, mix)
      });
      if (isTrunk) {
        const bias = normalizeDir({ x: 1, y: blended.y });
        return normalizeDir({ x: lerp(blended.x, bias.x, 0.12), y: lerp(blended.y, bias.y, 0.12) });
      }
      return blended;
    };

    const spawnNodesFromScroll = (count: number, now: number) => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      const scrollProgress = getScrollProgress();
      for (let i = 0; i < count; i++) {
        const branchOrigin = pickGrowthNode();
        if (!branchOrigin) continue;
        const isTrunk = trunkTipId === branchOrigin.id || trunkSet.has(branchOrigin.id);
        const direction = computeChildDirection(branchOrigin, isTrunk);
        const node = createBranchNode(width, height, isMobile, branchOrigin, direction, scrollProgress, now, nodes);
        if (!node) continue;
        node.id = nodeIdCounter++;
        node.parentId = branchOrigin.id;
        nodes.push(node);
        nodeById.set(node.id, node);
        adjacency.set(node.id, []);
        addNodeToGrid(node);
        connectNewNode(node, now);
        if (branchOrigin.id === trunkTipId || trunkTipId === null) {
          trunkTipId = node.id;
          updateTrunkSet();
        }
      }
      if (count > 0) {
        markPassiveDirty();
      }
    };

    const retirePeripheralLeaves = (count: number, now: number, force = false) => {
      if (count <= 0) return;
      updateTrunkSet();
      const candidates = getLeafCandidates().filter((node) => force || now - node.bornAt > MIN_NODE_AGE_MS);
      candidates.sort((a, b) => {
        if (a.lastActiveAt !== b.lastActiveAt) return a.lastActiveAt - b.lastActiveAt;
        return a.bornAt - b.bornAt;
      });
      const removeCount = Math.min(count, candidates.length);
      for (let i = 0; i < removeCount; i++) {
        const node = candidates[i];
        node.isFadingOut = true;
        node.lastActiveAt = now;
      }
      if (removeCount > 0) {
        for (let i = 0; i < edges.length; i++) {
          const edge = edges[i];
          const a = nodeById.get(edge.a);
          const b = nodeById.get(edge.b);
          if (a?.isFadingOut || b?.isFadingOut) {
            edge.isFadingOut = true;
            edge.lastActiveAt = now;
          }
        }
      }
    };

    const pruneNodesIfNeeded = (now: number) => {
      if (nodes.length <= maxNodes) return;
      const removeCount = Math.max(0, nodes.length - maxNodes);
      if (removeCount > 0) {
        retirePeripheralLeaves(removeCount, now, true);
      }
    };

    const pruneEdgesIfNeeded = (now: number) => {
      if (edges.length <= maxEdges) return;
      const candidates = edges.filter((edge) => !edge.isFadingOut);
      candidates.sort((a, b) => a.bornAt - b.bornAt);
      const removeCount = Math.min(candidates.length, edges.length - maxEdges);
      for (let i = 0; i < removeCount; i++) {
        const edge = candidates[i];
        edge.isFadingOut = true;
        edge.lastActiveAt = now;
      }
    };

    const updateAlphas = (now: number, dtMs: number) => {
      const dt = dtMs / 1000;
      for (let i = 0; i < edges.length; i++) {
        const edge = edges[i];
        edge.activity *= Math.exp(-dt * 2.2);
        edge.ageMs = now - edge.bornAt;
        if (!edge.isFadingOut && edge.ageMs > edge.ttlMs) {
          edge.isFadingOut = true;
          edge.lastActiveAt = now;
        }
        if (edge.isFadingOut) {
          const t = (now - edge.lastActiveAt) / edge.fadeOutMs;
          edge.alpha = clamp(1 - t, 0, 1);
        } else {
          const t = (now - edge.bornAt) / edge.fadeInMs;
          edge.alpha = clamp(t, 0, 1);
        }
      }
      for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i];
        node.traffic *= Math.exp(-dt * 2.4);
        node.ageMs = now - node.bornAt;
        if (!node.isFadingOut && node.ageMs > node.ttlMs) {
          node.isFadingOut = true;
          node.lastActiveAt = now;
        }
        if (node.isFadingOut) {
          const t = (now - node.lastActiveAt) / node.fadeOutMs;
          node.alpha = clamp(1 - t, 0, 1);
        } else {
          const t = (now - node.bornAt) / node.fadeInMs;
          node.alpha = clamp(t, 0, 1);
        }
      }
    };

    const cleanupDead = () => {
      let changed = false;
      nodes = nodes.filter((node) => {
        if (node.isFadingOut && node.alpha <= 0) {
          if (node.parentId !== undefined) {
            const parent = nodeById.get(node.parentId);
            if (parent) {
              parent.children = parent.children.filter((id) => id !== node.id);
            }
          }
          nodeById.delete(node.id);
          adjacency.delete(node.id);
          removeNodeFromGrid(node);
          changed = true;
          return false;
        }
        return true;
      });
      edges = edges.filter((edge) => {
        if (edge.isFadingOut && edge.alpha <= 0) {
          edgeById.delete(edge.id);
          changed = true;
          return false;
        }
        if (!nodeById.has(edge.a) || !nodeById.has(edge.b)) {
          edgeById.delete(edge.id);
          changed = true;
          return false;
        }
        return true;
      });
      if (changed) {
        rebuildAdjacency();
        rebuildGrid();
        if (trunkTipId !== null && !nodeById.has(trunkTipId)) {
          trunkTipId = anchorNodeId;
        }
        updateTrunkSet();
        markPassiveDirty();
      }
    };

    const updatePulsesAndSurges = (dtMs: number, energy: number, speedScale: number, now: number) => {
      while (pulses.length < getPulseTarget(energy)) {
        const pulse = spawnPulse(edges, isMobile, prefersReduced);
        if (!pulse) break;
        pulses.push(pulse);
      }

      const dt = dtMs / 1000;
      const nextPulses: Pulse[] = [];
      for (let i = 0; i < pulses.length; i++) {
        const pulse = pulses[i];
        const edge = edgeById.get(pulse.edgeId);
        if (!edge) continue;
        pulse.lifeMs += dtMs;
        pulse.progress += pulse.direction * pulse.speed * dt * speedScale;
        if (pulse.progress < 0 || pulse.progress > 1 || pulse.lifeMs > pulse.maxLifeMs) continue;
        edge.activity = Math.max(edge.activity, 0.2 + pulse.intensity * 0.35);
        edge.lastActiveAt = now;
        const nodeA = nodeById.get(edge.a);
        const nodeB = nodeById.get(edge.b);
        if (nodeA) nodeA.lastActiveAt = now;
        if (nodeB) nodeB.lastActiveAt = now;
        nextPulses.push(pulse);
      }
      pulses = nextPulses;

      if (Math.random() < getSurgeChancePerFrame(energy)) {
        const surge = spawnSurge(adjacency, edgeById, prefersReduced);
        if (surge) surges.push(surge);
      }

      const nextSurges: Surge[] = [];
      for (let i = 0; i < surges.length; i++) {
        const surge = surges[i];
        surge.lifeMs += dtMs;
        surge.progress += surge.speed * dt;
        if (surge.lifeMs > surge.maxLifeMs || surge.progress > surge.steps.length + 0.6) continue;

        const index = Math.floor(surge.progress);
        const localT = surge.progress - index;
        for (let s = Math.max(0, index - 1); s <= Math.min(surge.steps.length - 1, index); s++) {
          const step = surge.steps[s];
          const edge = edgeById.get(step.edgeId);
          if (!edge) continue;
          const segProgress = s === index ? localT : 1;
          const t = step.direction === 1 ? segProgress : 1 - segProgress;
          const point = samplePointOnEdge(edge, t);
          edge.activity = Math.max(edge.activity, 0.8 * surge.intensity);
          edge.lastActiveAt = now;

          const startNode = nodeById.get(edge.a);
          const endNode = nodeById.get(edge.b);
          if (startNode) {
            startNode.traffic = Math.max(startNode.traffic, 0.5);
            startNode.lastActiveAt = now;
          }
          if (endNode) {
            endNode.traffic = Math.max(endNode.traffic, 0.5);
            endNode.lastActiveAt = now;
          }

          if (Math.random() > 0.9) {
            spawnSpark(point.x, point.y, 1.4 * surge.intensity);
          }
        }

        nextSurges.push(surge);
      }
      surges = nextSurges;
    };

    const drawActiveEdges = (now: number, scrollSpeed: number) => {
      if (!edges.length) return;
      ctx.save();
      ctx.globalCompositeOperation = 'lighter';
      for (let i = 0; i < edges.length; i++) {
        const edge = edges[i];
        if (edge.activity < 0.2) continue;
        const isTrunkEdge = trunkSet.has(edge.a) && trunkSet.has(edge.b);
        const alpha = clamp(edge.activity * edge.alpha * (isTrunkEdge ? 1.2 : 1), 0.05, 0.9);
        const offset = getDepthOffsets(now, edge.depth * 0.9, scrollSpeed);
        ctx.shadowColor = 'rgba(0, 229, 255, 0.5)';
        ctx.shadowBlur = 8;
        drawEdgeSlice(
          ctx,
          edge,
          0,
          1,
          (isMobile ? 2.5 : 3.1) + (isTrunkEdge ? 0.35 : 0),
          `rgba(0, 191, 255, ${alpha.toFixed(3)})`,
          offset.x,
          offset.y
        );
      }
      ctx.restore();
    };

    const drawPulses = (now: number, scrollSpeed: number) => {
      if (!pulses.length && !surges.length) return;
      ctx.globalCompositeOperation = 'lighter';

      for (let i = 0; i < pulses.length; i++) {
        const pulse = pulses[i];
        const edge = edgeById.get(pulse.edgeId);
        if (!edge) continue;
        const head = clamp(pulse.progress, 0, 1);
        const tail = clamp(head - pulse.direction * 0.1, 0, 1);
        const outerAlpha = (0.25 + pulse.intensity * 0.3) * edge.alpha;
        const coreAlpha = (0.45 + pulse.intensity * 0.35) * edge.alpha;
        const offset = getDepthOffsets(now, edge.depth * 0.9, scrollSpeed);

        ctx.shadowColor = 'rgba(0, 229, 255, 0.7)';
        ctx.shadowBlur = 10;
        drawEdgeSlice(
          ctx,
          edge,
          tail,
          head,
          isMobile ? 2.2 : 2.7,
          `rgba(0, 191, 255, ${outerAlpha.toFixed(3)})`,
          offset.x,
          offset.y
        );
        ctx.shadowBlur = 5;
        drawEdgeSlice(
          ctx,
          edge,
          tail,
          head,
          isMobile ? 1 : 1.3,
          `rgba(230, 252, 255, ${coreAlpha.toFixed(3)})`,
          offset.x,
          offset.y
        );
      }

      for (let i = 0; i < surges.length; i++) {
        const surge = surges[i];
        const index = Math.floor(surge.progress);
        const localT = surge.progress - index;
        for (let s = 0; s <= Math.min(surge.steps.length - 1, index); s++) {
          const step = surge.steps[s];
          const edge = edgeById.get(step.edgeId);
          if (!edge) continue;
          const progress = s < index ? 1 : localT;
          const from = step.direction === 1 ? 0 : 1;
          const to = step.direction === 1 ? progress : 1 - progress;
          const outerAlpha = clamp(0.4 + surge.intensity * 0.3, 0.45, 0.9) * edge.alpha;
          const offset = getDepthOffsets(now, edge.depth, scrollSpeed);

          ctx.shadowColor = 'rgba(0, 229, 255, 0.85)';
          ctx.shadowBlur = 12;
          drawEdgeSlice(
            ctx,
            edge,
            from,
            to,
            isMobile ? 3 : 3.8,
            `rgba(0, 229, 255, ${outerAlpha.toFixed(3)})`,
            offset.x,
            offset.y
          );
        }
      }

      ctx.shadowBlur = 0;
      ctx.globalCompositeOperation = 'source-over';
    };

    const drawNodes = (now: number, scrollSpeed: number) => {
      if (!nodes.length) return;
      ctx.globalCompositeOperation = 'lighter';

      ctx.save();
      ctx.filter = 'blur(1px)';
      ctx.shadowBlur = 8;
      for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i];
        const ageRatio = clamp(node.ageMs / node.ttlMs, 0, 1);
        if (node.alpha <= 0 || ageRatio < 0.25) continue;
        const energy = node.glow + node.traffic * 0.7;
        const radius = node.radius + node.traffic * 0.7;
        const offset = getDepthOffsets(now, node.depth, scrollSpeed);
        const x = node.x + offset.x;
        const y = node.y + offset.y;
        const alpha = node.alpha * (1 - ageRatio * 0.35);

        const halo = ctx.createRadialGradient(x, y, 0, x, y, radius * 7.2);
        halo.addColorStop(0, `rgba(0, 229, 255, ${(0.14 + energy * 0.18) * alpha})`);
        halo.addColorStop(0.45, `rgba(0, 191, 255, ${(0.04 + energy * 0.06) * alpha})`);
        halo.addColorStop(1, 'rgba(0, 191, 255, 0)');
        ctx.fillStyle = halo;
        ctx.beginPath();
        ctx.arc(x, y, radius * 7.2, 0, TAU);
        ctx.fill();

        ctx.fillStyle = `rgba(152, 240, 255, ${(0.28 + energy * 0.35) * alpha})`;
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, TAU);
        ctx.fill();
      }
      ctx.restore();

      for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i];
        const ageRatio = clamp(node.ageMs / node.ttlMs, 0, 1);
        if (node.alpha <= 0 || ageRatio >= 0.25) continue;
        const energy = node.glow + node.traffic * 0.85;
        const radius = node.radius + node.traffic * 0.85;
        const offset = getDepthOffsets(now, node.depth, scrollSpeed);
        const x = node.x + offset.x;
        const y = node.y + offset.y;
        const alpha = node.alpha;

        const halo = ctx.createRadialGradient(x, y, 0, x, y, radius * 6.5);
        halo.addColorStop(0, `rgba(0, 229, 255, ${(0.2 + energy * 0.24) * alpha})`);
        halo.addColorStop(0.45, `rgba(0, 191, 255, ${(0.06 + energy * 0.1) * alpha})`);
        halo.addColorStop(1, 'rgba(0, 191, 255, 0)');
        ctx.fillStyle = halo;
        ctx.beginPath();
        ctx.arc(x, y, radius * 6.5, 0, TAU);
        ctx.fill();

        ctx.fillStyle = `rgba(170, 245, 255, ${(0.42 + energy * 0.45) * alpha})`;
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, TAU);
        ctx.fill();
      }

      ctx.globalCompositeOperation = 'source-over';
    };

    const drawSparks = (dtMs: number) => {
      if (!sparks.length) return;
      const next: Spark[] = [];
      ctx.globalCompositeOperation = 'lighter';
      for (let i = 0; i < sparks.length; i++) {
        const spark = sparks[i];
        spark.lifeMs += dtMs;
        if (spark.lifeMs >= spark.maxLifeMs) continue;
        spark.vx *= 0.992;
        spark.vy = spark.vy * 0.992 + 0.00014 * dtMs;
        spark.x += spark.vx * dtMs;
        spark.y += spark.vy * dtMs;
        const t = spark.lifeMs / spark.maxLifeMs;
        const alpha = (1 - t) * 0.7;
        ctx.fillStyle = `rgba(185, 245, 255, ${alpha.toFixed(3)})`;
        ctx.beginPath();
        ctx.arc(spark.x, spark.y, spark.radius * (1 - t * 0.45), 0, TAU);
        ctx.fill();
        next.push(spark);
      }
      sparks = next;
      ctx.globalCompositeOperation = 'source-over';
    };

    const resetGraph = () => {
      isMobile = window.matchMedia('(max-width: 768px)').matches;
      activeMaxNodes = isMobile ? 50 : 70;
      maxNodes = activeMaxNodes;
      maxEdges = Math.round(maxNodes * (isMobile ? 2.1 : 2.4));
      gridCellSize = Math.min(window.innerWidth, window.innerHeight) * 0.22;
      const dpr = Math.min(window.devicePixelRatio || 1, isMobile ? 1.2 : 1.6);
      canvas.width = Math.floor(window.innerWidth * dpr);
      canvas.height = Math.floor(window.innerHeight * dpr);
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      passiveCanvas.width = Math.floor(window.innerWidth * dpr);
      passiveCanvas.height = Math.floor(window.innerHeight * dpr);
      passiveCanvas.style.width = `${window.innerWidth}px`;
      passiveCanvas.style.height = `${window.innerHeight}px`;
      passiveCtx.setTransform(dpr, 0, 0, dpr, 0, 0);

      densityCenters = pickDensityCenters(window.innerWidth, window.innerHeight);
      nodes = [];
      edges = [];
      nodeById.clear();
      edgeById.clear();
      adjacency.clear();
      pulses = [];
      surges = [];
      sparks = [];
      nodeIdCounter = 0;
      edgeIdCounter = 0;
      energyAccumulator = 0;
      energySmoothed = 0;
      anchorNodeId = null;
      trunkTipId = null;
      trunkSet = new Set<number>();
      isTopResetting = false;

      const seedCount = 0;
      const now = performance.now();
      const anchorX = window.innerWidth * 0.08;
      const anchorY = window.innerHeight * lerp(0.35, 0.65, Math.random());
      const rootDir = normalizeDir({ x: 0.9, y: rand(-0.35, 0.35) });

      const anchorNode: GraphNode = {
        id: nodeIdCounter++,
        x: anchorX,
        y: anchorY,
        dirX: rootDir.x,
        dirY: rootDir.y,
        radius: rand(isMobile ? 2.4 : 2.9, isMobile ? 3.4 : 4.2),
        glow: rand(0.45, 0.7),
        traffic: 0,
        depth: 0.6,
        bornAt: now,
        ageMs: 0,
        ttlMs: 999999,
        fadeInMs: 320,
        fadeOutMs: 900,
        alpha: 1,
        lastActiveAt: now,
        isFadingOut: false,
        isAnchor: true,
        children: []
      };
      nodes.push(anchorNode);
      nodeById.set(anchorNode.id, anchorNode);
      adjacency.set(anchorNode.id, []);
      addNodeToGrid(anchorNode);
      anchorNodeId = anchorNode.id;
      trunkTipId = anchorNode.id;
      updateTrunkSet();

      for (let i = 0; i < seedCount; i++) {
        const origin = nodeById.get(trunkTipId ?? anchorNode.id) || anchorNode;
        const direction = computeChildDirection(origin, true);
        const node = createBranchNode(window.innerWidth, window.innerHeight, isMobile, origin, direction, 0, now, nodes);
        if (!node) continue;
        node.id = nodeIdCounter++;
        node.parentId = origin.id;
        nodes.push(node);
        nodeById.set(node.id, node);
        adjacency.set(node.id, []);
        addNodeToGrid(node);
        connectNewNode(node, now);
        trunkTipId = node.id;
        updateTrunkSet();
      }

      rebuildAdjacency();
      rebuildGrid();
      markPassiveDirty();
    };

    const collapseToRoot = (now: number) => {
      for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i];
        if (node.isAnchor) continue;
        node.isFadingOut = true;
        node.lastActiveAt = now;
        node.fadeOutMs = TOP_RESET_FADE_MS;
      }
      for (let i = 0; i < edges.length; i++) {
        const edge = edges[i];
        edge.isFadingOut = true;
        edge.lastActiveAt = now;
        edge.fadeOutMs = TOP_RESET_FADE_MS;
      }
      pulses = [];
      surges = [];
      sparks = [];
      trunkTipId = anchorNodeId;
      updateTrunkSet();
      markPassiveDirty();
    };

    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      const dt = Math.min(34, now - lastTime);
      lastTime = now;
      accumulator += dt;

      const targetStep = prefersReduced ? 1000 / 24 : 1000 / 60;
      if (accumulator < targetStep) return;
      const step = accumulator;
      accumulator = 0;

      const energy = updateScrollEnergy(step);
      const energyFactor = clamp(energy * 900, 0, 1);
      const isIdle = energyFactor < 0.02;
      const nearTop = window.scrollY <= TOP_RESET_Y;
      if (nearTop && energySmoothed < 0.002) {
        if (!isTopResetting && nodes.length > 1) {
          collapseToRoot(now);
        }
        isTopResetting = true;
      } else if (!nearTop) {
        isTopResetting = false;
      }

      const targetMaxNodes = Math.round(lerp(idleMaxNodes, activeMaxNodes, energyFactor));
      const forceIdle = isIdle && nodes.length > idleMaxNodes;
      if (isIdle) {
        energyAccumulator = 0;
      }
      maxNodes = isTopResetting ? 1 : targetMaxNodes;
      maxEdges = Math.round(maxNodes * (isMobile ? 2.1 : 2.4));
      if (!isIdle && !isTopResetting && energyAccumulator >= ENERGY_THRESHOLD) {
        energyAccumulator -= ENERGY_THRESHOLD;
        const spawnCount = Math.random() > 0.55 ? 2 : 1;
        spawnNodesFromScroll(spawnCount, now);
        retirePeripheralLeaves(spawnCount, now);
      }

      if (forceIdle && !isTopResetting) {
        retirePeripheralLeaves(nodes.length - idleMaxNodes, now, true);
      } else if (nodes.length > targetMaxNodes) {
        retirePeripheralLeaves(nodes.length - targetMaxNodes, now, true);
      }

      pruneNodesIfNeeded(now);
      pruneEdgesIfNeeded(now);
      updateAlphas(now, step);
      cleanupDead();

      const scrollSpeed = scrollVelocitySmoothed * 1000;
      const energyNorm = prefersReduced ? 0 : energyFactor;
      const speedScale = prefersReduced ? 1 : 1 + energy * 0.4;

      passiveFrame += 1;
      if (passiveDirty || passiveFrame % 12 === 0) {
        renderPassiveLayer(now);
      }

      backdropFrame += 1;
      if (backdropFrame % 6 === 0) {
        const style = getComputedStyle(document.documentElement);
        backdropVars = {
          pageProgress: Number.parseFloat(style.getPropertyValue('--page-progress')) || 0,
          phase: Number.parseFloat(style.getPropertyValue('--energy-phase')) || 0,
          shiftX: Number.parseFloat(style.getPropertyValue('--energy-shift-x')) || 0,
          shiftY: Number.parseFloat(style.getPropertyValue('--energy-shift-y')) || 0
        };
      }

      drawBackdrop(now, backdropVars);
      drawPassiveFromCache(now, scrollSpeed);
      drawActiveEdges(now, scrollSpeed);
      updatePulsesAndSurges(step, energyNorm, speedScale, now);
      drawPulses(now, scrollSpeed);
      drawNodes(now, scrollSpeed);
      drawSparks(step);
      drawReadabilityVeil();
    };

    const onMotionChange = (event: MediaQueryListEvent) => {
      prefersReduced = event.matches;
      pulses = [];
      surges = [];
      sparks = [];
      markPassiveDirty();
    };

    resetGraph();
    raf = requestAnimationFrame(frame);
    window.addEventListener('resize', resetGraph);
    reducedQuery.addEventListener('change', onMotionChange);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resetGraph);
      reducedQuery.removeEventListener('change', onMotionChange);
    };
  }, []);

  return (
    <div className="animated-lightning-bg" aria-hidden>
      <canvas ref={canvasRef} />
    </div>
  );
}
