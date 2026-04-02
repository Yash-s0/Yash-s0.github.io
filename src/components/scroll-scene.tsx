'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function ScrollScene({
  id,
  steps,
  render,
  className = ''
}: {
  id: string;
  steps: number;
  render: (active: number, progress: number) => React.ReactNode;
  className?: string;
}) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [active, setActive] = useState(0);
  const [progress, setProgress] = useState(0);
  const activeRef = useRef(0);
  const lockUntilRef = useRef(0);
  const cooldownUntilRef = useRef(0);
  const pendingIndexRef = useRef<number | null>(null);
  const pendingSinceRef = useRef(0);
  const lastProgressRef = useRef(0);
  const lastDirectionRef = useRef(0);
  const isMobileRef = useRef(false);

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    isMobileRef.current = window.matchMedia('(max-width: 768px)').matches;
    const container = containerRef.current;
    if (!container) return;
    container.style.setProperty('--scene-progress', '0');

    const ctx = gsap.context(() => {
      activeRef.current = 0;
      setActive(0);
      lockUntilRef.current = 0;
      cooldownUntilRef.current = 0;
      pendingIndexRef.current = null;
      pendingSinceRef.current = 0;
      lastProgressRef.current = 0;
      lastDirectionRef.current = 0;
      const stepCount = Math.max(steps, 1);
      // Each step gets the same scroll distance by extending the scene length per step.
      const stepSize = stepCount > 0 ? 1 / stepCount : 1;
      const sceneLength = stepCount * 100;
      const snapTo = (value: number) => gsap.utils.snap(stepSize, value);
      const threshold = 0.2;
      const holdMs = 90;
      const lockMs = 520;
      const cooldownMs = 80;
      const quickTos = new Map<Element, gsap.QuickToFunc>();

      const getTargetIndex = (current: number, nextProgress: number, direction: number) => {
        if (stepCount <= 1) return current;
        if (direction > 0) {
          const boundary = (current + 1) * stepSize;
          if (nextProgress >= boundary + threshold * stepSize) {
            return Math.min(current + 1, stepCount - 1);
          }
        }
        if (direction < 0) {
          const boundary = current * stepSize;
          if (nextProgress <= boundary - threshold * stepSize) {
            return Math.max(current - 1, 0);
          }
        }
        return current;
      };

      const trigger = ScrollTrigger.create({
        trigger: container,
        start: 'top top',
        end: `+=${sceneLength}%`,
        scrub: 0.2,
        snap: stepCount > 1 ? { snapTo, duration: { min: 0.18, max: 0.32 }, delay: 0.02, ease: 'power2.out', inertia: false } : 1,
        anticipatePin: 1,
        pin: !isMobileRef.current,
        onUpdate: (self) => {
          const now = performance.now();
          const nextProgress = self.progress;
          const current = activeRef.current;
          const progressDelta = Math.abs(nextProgress - lastProgressRef.current);
          const rawDirection = self.direction || Math.sign(nextProgress - lastProgressRef.current);
          const direction = rawDirection === 0 ? lastDirectionRef.current : rawDirection;
          lastProgressRef.current = nextProgress;
          if (rawDirection !== 0 && rawDirection !== lastDirectionRef.current) {
            lastDirectionRef.current = rawDirection;
            pendingIndexRef.current = null;
            pendingSinceRef.current = 0;
          }

          if ((now < lockUntilRef.current || now < cooldownUntilRef.current) && stepCount > 1) {
            const clampProgress = current * stepSize;
            const targetScroll = self.start + (self.end - self.start) * clampProgress;
            if (Math.abs(self.scroll() - targetScroll) > 1) {
              self.scroll(targetScroll);
            }
            setProgress(clampProgress);
            container.style.setProperty('--scene-progress', clampProgress.toFixed(3));
            return;
          }

          if (stepCount > 1) {
            const limitedProgress =
              progressDelta > stepSize * 0.9
                ? current * stepSize + Math.sign(direction || 1) * stepSize
                : nextProgress;
            const targetIndex = getTargetIndex(current, limitedProgress, direction);
            if (targetIndex !== current) {
              if (pendingIndexRef.current !== targetIndex) {
                pendingIndexRef.current = targetIndex;
                pendingSinceRef.current = now;
              } else if (now - pendingSinceRef.current >= holdMs) {
                activeRef.current = targetIndex;
                setActive(targetIndex);
                lockUntilRef.current = now + lockMs;
                cooldownUntilRef.current = now + lockMs + cooldownMs;
                pendingIndexRef.current = null;
                pendingSinceRef.current = 0;
              }
            } else {
              pendingIndexRef.current = null;
              pendingSinceRef.current = 0;
            }
          }

          const currentBoundary = current * stepSize;
          const minProgress = Math.max(currentBoundary - stepSize, 0);
          const maxProgress = Math.min(currentBoundary + stepSize, 1);
          const clampedProgress = stepCount > 1 ? Math.min(Math.max(nextProgress, minProgress), maxProgress) : nextProgress;
          setProgress(clampedProgress);
          container.style.setProperty('--scene-progress', clampedProgress.toFixed(3));

          const layers = container.querySelectorAll('[data-layer]');
          layers.forEach((layer) => {
            const depthAttr = layer.getAttribute('data-depth');
            const depth = depthAttr ? Number(depthAttr) : 0.15;
            const translate = (clampedProgress - 0.5) * depth * 120;
            let quickTo = quickTos.get(layer);
            if (!quickTo) {
              quickTo = gsap.quickTo(layer, 'y', { duration: 0.2, ease: 'power2.out' });
              quickTos.set(layer, quickTo);
            }
            quickTo(translate);
          });
        },
        onSnapComplete: (self) => {
          if (stepCount <= 1) return;
          const snapped = snapTo(self.progress);
          const nextIndex = Math.min(stepCount - 1, Math.max(0, Math.round(snapped / stepSize)));
          if (nextIndex !== activeRef.current) {
            activeRef.current = nextIndex;
            setActive(nextIndex);
          }
          pendingIndexRef.current = null;
          pendingSinceRef.current = 0;
          lockUntilRef.current = 0;
          cooldownUntilRef.current = 0;
          lastDirectionRef.current = 0;
        }
      });

      gsap.fromTo(
        container.querySelectorAll('[data-scene]'),
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.4,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: container,
            start: 'top 60%'
          }
        }
      );

      return () => trigger.kill();
    }, container);

    return () => ctx.revert();
  }, [steps]);

  return (
    <section id={id} className={`section-shell ${className}`} ref={containerRef}>
      <div className="section-pin w-full" data-scene>
        {render(active, progress)}
      </div>
    </section>
  );
}
