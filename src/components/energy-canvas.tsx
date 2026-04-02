'use client';

import { useEffect, useRef } from 'react';

type Point = { x: number; y: number };
type Path = { id: string; points: Point[]; width: number; kind: 'spine' | 'branch' };
type Node = { id: string; pathId: string; t: number; radius: number };

const spinePath: Path = {
  id: 'spine',
  kind: 'spine',
  width: 3.2,
  points: [
    { x: 0.58, y: -0.08 },
    { x: 0.62, y: 0.12 },
    { x: 0.56, y: 0.28 },
    { x: 0.64, y: 0.44 },
    { x: 0.6, y: 0.6 },
    { x: 0.66, y: 0.76 },
    { x: 0.62, y: 1.06 }
  ]
};

const branchPaths: Path[] = [
  { id: 'b1', kind: 'branch', width: 1.2, points: [{ x: 0.61, y: 0.16 }, { x: 0.52, y: 0.2 }, { x: 0.48, y: 0.26 }] },
  { id: 'b2', kind: 'branch', width: 1.2, points: [{ x: 0.58, y: 0.22 }, { x: 0.66, y: 0.26 }, { x: 0.72, y: 0.31 }] },
  { id: 'b3', kind: 'branch', width: 1.1, points: [{ x: 0.57, y: 0.35 }, { x: 0.49, y: 0.4 }, { x: 0.44, y: 0.48 }] },
  { id: 'b4', kind: 'branch', width: 1.1, points: [{ x: 0.63, y: 0.4 }, { x: 0.71, y: 0.44 }, { x: 0.77, y: 0.5 }] },
  { id: 'b5', kind: 'branch', width: 1.0, points: [{ x: 0.61, y: 0.55 }, { x: 0.53, y: 0.6 }, { x: 0.47, y: 0.66 }] },
  { id: 'b6', kind: 'branch', width: 1.0, points: [{ x: 0.64, y: 0.62 }, { x: 0.72, y: 0.67 }, { x: 0.78, y: 0.74 }] },
  { id: 'b7', kind: 'branch', width: 0.95, points: [{ x: 0.65, y: 0.74 }, { x: 0.57, y: 0.8 }, { x: 0.52, y: 0.86 }] },
  { id: 'b8', kind: 'branch', width: 0.95, points: [{ x: 0.63, y: 0.83 }, { x: 0.71, y: 0.88 }, { x: 0.76, y: 0.94 }] }
];

const nodes: Node[] = [
  { id: 'n1', pathId: 'spine', t: 0.08, radius: 4.2 },
  { id: 'n2', pathId: 'spine', t: 0.18, radius: 4.4 },
  { id: 'n3', pathId: 'spine', t: 0.3, radius: 4.8 },
  { id: 'n4', pathId: 'spine', t: 0.42, radius: 5.1 },
  { id: 'n5', pathId: 'spine', t: 0.54, radius: 5.2 },
  { id: 'n6', pathId: 'spine', t: 0.66, radius: 5.1 },
  { id: 'n7', pathId: 'spine', t: 0.78, radius: 4.8 },
  { id: 'n8', pathId: 'spine', t: 0.9, radius: 4.4 }
];

const segmentLength = (a: Point, b: Point) => Math.hypot(b.x - a.x, b.y - a.y);

const samplePath = (points: Point[]) => {
  const sampled: Point[] = [];
  for (let i = 0; i < points.length - 1; i++) {
    const a = points[i];
    const b = points[i + 1];
    const segments = 22;
    for (let j = 0; j < segments; j++) {
      const t = j / segments;
      sampled.push({ x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t });
    }
  }
  sampled.push(points[points.length - 1]);
  return sampled;
};

const buildLengths = (points: Point[]) => {
  const cumulative = [0];
  let total = 0;
  for (let i = 1; i < points.length; i++) {
    total += segmentLength(points[i - 1], points[i]);
    cumulative.push(total);
  }
  return { cumulative, total };
};

const toPixelPoints = (points: Point[], width: number, height: number, shiftX: number, shiftY: number) =>
  points.map((p) => ({ x: p.x * width + shiftX, y: p.y * height + shiftY }));

const pointAtT = (points: Point[], cumulative: number[], total: number, t: number) => {
  const target = Math.max(0, Math.min(1, t)) * total;
  for (let i = 1; i < cumulative.length; i++) {
    if (cumulative[i] >= target) {
      const prev = cumulative[i - 1];
      const ratio = (target - prev) / (cumulative[i] - prev || 1);
      return {
        x: points[i - 1].x + (points[i].x - points[i - 1].x) * ratio,
        y: points[i - 1].y + (points[i].y - points[i - 1].y) * ratio
      };
    }
  }
  return points[points.length - 1];
};

const drawPath = (ctx: CanvasRenderingContext2D, points: Point[], color: string, width: number) => {
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  ctx.beginPath();
  points.forEach((p, i) => (i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y)));
  ctx.stroke();
};

const drawPathUpTo = (
  ctx: CanvasRenderingContext2D,
  points: Point[],
  cumulative: number[],
  total: number,
  distance: number,
  color: string,
  width: number
) => {
  const capped = Math.max(0, Math.min(total, distance));
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  ctx.beginPath();
  if (points.length === 0) return;
  ctx.moveTo(points[0].x, points[0].y);
  for (let i = 1; i < points.length; i++) {
    if (cumulative[i] <= capped) {
      ctx.lineTo(points[i].x, points[i].y);
      continue;
    }
    const prev = cumulative[i - 1];
    const seg = cumulative[i] - prev || 1;
    const ratio = (capped - prev) / seg;
    const x = points[i - 1].x + (points[i].x - points[i - 1].x) * ratio;
    const y = points[i - 1].y + (points[i].y - points[i - 1].y) * ratio;
    ctx.lineTo(x, y);
    break;
  }
  ctx.stroke();
};

const drawPathSegment = (
  ctx: CanvasRenderingContext2D,
  points: Point[],
  cumulative: number[],
  total: number,
  fromDistance: number,
  toDistance: number,
  color: string,
  width: number
) => {
  const start = Math.max(0, Math.min(total, fromDistance));
  const end = Math.max(0, Math.min(total, toDistance));
  if (end <= start) return;
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  ctx.beginPath();
  let started = false;
  for (let i = 1; i < points.length; i++) {
    const segStart = cumulative[i - 1];
    const segEnd = cumulative[i];
    if (segEnd < start) continue;
    if (segStart > end) break;
    const localStart = Math.max(start, segStart);
    const localEnd = Math.min(end, segEnd);
    const segLen = segEnd - segStart || 1;
    const startRatio = (localStart - segStart) / segLen;
    const endRatio = (localEnd - segStart) / segLen;
    const sx = points[i - 1].x + (points[i].x - points[i - 1].x) * startRatio;
    const sy = points[i - 1].y + (points[i].y - points[i - 1].y) * startRatio;
    const ex = points[i - 1].x + (points[i].x - points[i - 1].x) * endRatio;
    const ey = points[i - 1].y + (points[i].y - points[i - 1].y) * endRatio;
    if (!started) {
      ctx.moveTo(sx, sy);
      started = true;
    } else {
      ctx.lineTo(sx, sy);
    }
    ctx.lineTo(ex, ey);
  }
  if (started) ctx.stroke();
};

export function EnergyCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isMobile = window.matchMedia('(max-width: 768px)').matches;

    const activeBranches = isMobile ? branchPaths.slice(0, 5) : branchPaths;
    const activeNodes = isMobile ? nodes.slice(1, 7) : nodes;

    const allPaths = [spinePath, ...activeBranches];
    const sampledById = new Map<string, Point[]>();
    const lengthsById = new Map<string, { cumulative: number[]; total: number }>();

    allPaths.forEach((path) => {
      const sampled = samplePath(path.points);
      sampledById.set(path.id, sampled);
      lengthsById.set(path.id, buildLengths(sampled));
    });

    let raf = 0;
    let frameRequested = false;

    const resize = () => {
      const dprCap = isMobile ? 1.25 : 1.6;
      const dpr = Math.min(window.devicePixelRatio || 1, dprCap);
      canvas.width = Math.floor(window.innerWidth * dpr);
      canvas.height = Math.floor(window.innerHeight * dpr);
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const readVars = () => {
      const style = getComputedStyle(document.documentElement);
      return {
        shiftX: Number.parseFloat(style.getPropertyValue('--energy-shift-x')) || 0,
        shiftY: Number.parseFloat(style.getPropertyValue('--energy-shift-y')) || 0,
        intensity: Number.parseFloat(style.getPropertyValue('--energy-intensity')) || 0.9,
        phase: Number.parseFloat(style.getPropertyValue('--energy-phase')) || 0,
        branch: Number.parseFloat(style.getPropertyValue('--energy-branch')) || 0.4,
        progress: Number.parseFloat(style.getPropertyValue('--energy-progress')) || 0
      };
    };

    const render = () => {
      const { shiftX, shiftY, intensity, phase, branch, progress } = readVars();
      const width = window.innerWidth;
      const height = window.innerHeight;
      ctx.clearRect(0, 0, width, height);

      const spinePts = toPixelPoints(sampledById.get(spinePath.id) || [], width, height, shiftX * 0.35, shiftY * 0.6);
      const spineLen = lengthsById.get(spinePath.id);
      if (!spineLen) return;

      ctx.save();
      ctx.globalCompositeOperation = 'lighter';

      drawPath(ctx, spinePts, `rgba(75, 155, 235, ${0.12 + intensity * 0.16})`, spinePath.width + 3.4);
      drawPath(ctx, spinePts, `rgba(110, 195, 255, ${0.12 + intensity * 0.22})`, spinePath.width + 1.6);
      drawPath(ctx, spinePts, `rgba(190, 240, 255, ${0.18 + intensity * 0.3})`, spinePath.width);

      const activeDistance = spineLen.total * progress;
      drawPathUpTo(ctx, spinePts, spineLen.cumulative, spineLen.total, activeDistance, `rgba(225, 250, 255, ${0.6 + intensity * 0.2})`, spinePath.width + 0.8);

      activeBranches.forEach((path, idx) => {
        const sampled = sampledById.get(path.id) || [];
        const lens = lengthsById.get(path.id);
        if (!lens) return;
        const pts = toPixelPoints(sampled, width, height, shiftX * 0.45, shiftY * 0.7);
        const gate = 0.18 + idx * 0.07;
        const branchProgress = Math.max(0, Math.min(1, (progress - gate) * 2.8));

        drawPath(ctx, pts, `rgba(85, 165, 245, ${0.06 + branch * 0.16})`, path.width);
        if (branchProgress > 0) {
          drawPathUpTo(
            ctx,
            pts,
            lens.cumulative,
            lens.total,
            lens.total * branchProgress,
            `rgba(175, 230, 255, ${0.22 + branch * 0.3})`,
            path.width + 0.15
          );

          const pulseStart = ((phase * 1.6 + progress * 0.8 + idx * 0.1) % 1) * lens.total;
          drawPathSegment(
            ctx,
            pts,
            lens.cumulative,
            lens.total,
            pulseStart,
            Math.min(lens.total, pulseStart + lens.total * 0.12),
            `rgba(235, 252, 255, ${0.22 + branch * 0.28})`,
            path.width * 0.8
          );
        }
      });

      const pulseWindow = 0.06;
      activeNodes.forEach((node) => {
        const sampled = sampledById.get(node.pathId);
        const lens = lengthsById.get(node.pathId);
        if (!sampled || !lens) return;
        const point = pointAtT(sampled, lens.cumulative, lens.total, node.t);
        const x = point.x * width + shiftX * 0.35;
        const y = point.y * height + shiftY * 0.6;

        const baseR = isMobile ? node.radius * 0.8 : node.radius;
        const activation = Math.max(0, 1 - Math.abs(progress - node.t) / pulseWindow);

        ctx.fillStyle = `rgba(125, 205, 255, ${0.2 + activation * 0.32})`;
        ctx.beginPath();
        ctx.arc(x, y, baseR, 0, Math.PI * 2);
        ctx.fill();

        if (activation > 0.01) {
          const glow = ctx.createRadialGradient(x, y, 0, x, y, baseR * (2.3 + activation));
          glow.addColorStop(0, `rgba(230, 250, 255, ${0.35 * activation})`);
          glow.addColorStop(1, 'rgba(70, 150, 245, 0)');
          ctx.fillStyle = glow;
          ctx.beginPath();
          ctx.arc(x, y, baseR * (2.3 + activation), 0, Math.PI * 2);
          ctx.fill();
        }
      });

      ctx.restore();

    };

    const requestRender = () => {
      if (frameRequested) return;
      frameRequested = true;
      raf = requestAnimationFrame(() => {
        frameRequested = false;
        render();
      });
    };

    resize();
    requestRender();

    const onResize = () => {
      resize();
      requestRender();
    };
    const onScrollSignal = () => requestRender();
    window.addEventListener('resize', onResize);
    window.addEventListener('scroll', onScrollSignal, { passive: true });
    window.addEventListener('wheel', onScrollSignal, { passive: true });
    window.addEventListener('touchmove', onScrollSignal, { passive: true });

    return () => {
      window.removeEventListener('resize', onResize);
      window.removeEventListener('scroll', onScrollSignal);
      window.removeEventListener('wheel', onScrollSignal);
      window.removeEventListener('touchmove', onScrollSignal);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div className="ambient-energy-canvas" aria-hidden>
      <canvas ref={canvasRef} />
    </div>
  );
}
