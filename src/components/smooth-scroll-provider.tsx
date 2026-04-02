'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react';

interface SmoothScrollContextType {
  isReady: boolean;
  scrollToTop: () => void;
  scrollTo: (target: string | number | HTMLElement, options?: { offset?: number }) => void;
  getScroll: () => number;
  getProgress: () => number;
}

const SmoothScrollContext = createContext<SmoothScrollContextType | null>(null);

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function useSmoothScroll(): SmoothScrollContextType {
  const contentRef = useRef<HTMLDivElement | null>(null);
  const scrollYRef = useRef(0);
  const targetScrollYRef = useRef(0);
  const rafRef = useRef<number | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const scrollContainer = document.getElementById('scroll-container') as HTMLDivElement | null;
    const content = document.getElementById('scroll-content') as HTMLDivElement | null;

    if (!scrollContainer || !content) {
      setIsReady(false);
      return;
    }

    contentRef.current = content;
    setIsReady(true);

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const lerpFactor = prefersReducedMotion ? 1 : 0.1;

    const handleWheel = (event: WheelEvent) => {
      event.preventDefault();
      const maxScroll = Math.max(0, content.scrollHeight - window.innerHeight);
      targetScrollYRef.current = clamp(
        targetScrollYRef.current + event.deltaY,
        0,
        maxScroll
      );
    };

    let touchStartY = 0;
    const handleTouchStart = (event: TouchEvent) => {
      touchStartY = event.touches[0]?.clientY ?? 0;
    };

    const handleTouchMove = (event: TouchEvent) => {
      const currentY = event.touches[0]?.clientY ?? 0;
      const deltaY = touchStartY - currentY;
      touchStartY = currentY;
      const maxScroll = Math.max(0, content.scrollHeight - window.innerHeight);
      targetScrollYRef.current = clamp(targetScrollYRef.current + deltaY * 1.2, 0, maxScroll);
    };

    const animate = () => {
      scrollYRef.current =
        scrollYRef.current + (targetScrollYRef.current - scrollYRef.current) * lerpFactor;

      if (content) {
        content.style.transform = `translate3d(0, ${-scrollYRef.current}px, 0)`;
      }

      const maxScroll = Math.max(0, content.scrollHeight - window.innerHeight);
      const progress = maxScroll > 0 ? scrollYRef.current / maxScroll : 0;
      document.documentElement.style.setProperty('--page-progress', progress.toFixed(4));

      scrollContainer.setAttribute('data-scroll', String(scrollYRef.current));
      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);

    scrollContainer.addEventListener('wheel', handleWheel, { passive: false });
    scrollContainer.addEventListener('touchstart', handleTouchStart, { passive: true });
    scrollContainer.addEventListener('touchmove', handleTouchMove, { passive: true });

    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
      scrollContainer.removeEventListener('wheel', handleWheel);
      scrollContainer.removeEventListener('touchstart', handleTouchStart);
      scrollContainer.removeEventListener('touchmove', handleTouchMove);
    };
  }, []);

  const scrollToTop = useCallback(() => {
    targetScrollYRef.current = 0;
  }, []);

  const scrollTo = useCallback(
    (target: string | number | HTMLElement, options?: { offset?: number }) => {
      const offset = options?.offset ?? 0;
      const content = contentRef.current;
      if (!content) {
        if (typeof target === 'string') {
          const element = document.querySelector(target);
          element?.scrollIntoView({ behavior: 'smooth' });
        } else if (typeof target === 'number') {
          window.scrollTo({ top: target, behavior: 'smooth' });
        } else if (target instanceof HTMLElement) {
          target.scrollIntoView({ behavior: 'smooth' });
        }
        return;
      }

      const maxScroll = Math.max(0, content.scrollHeight - window.innerHeight);

      if (typeof target === 'number') {
        targetScrollYRef.current = clamp(target + offset, 0, maxScroll);
        return;
      }

      if (typeof target === 'string') {
        const element = document.querySelector(target);
        if (element) {
          const rect = element.getBoundingClientRect();
          const targetPos = scrollYRef.current + rect.top + offset;
          targetScrollYRef.current = clamp(targetPos, 0, maxScroll);
        }
        return;
      }

      if (target instanceof HTMLElement) {
        const rect = target.getBoundingClientRect();
        const targetPos = scrollYRef.current + rect.top + offset;
        targetScrollYRef.current = clamp(targetPos, 0, maxScroll);
      }
    },
    []
  );

  const getScroll = useCallback(() => scrollYRef.current, []);
  const getProgress = useCallback(() => {
    const content = contentRef.current;
    if (!content) return 0;
    const maxScroll = Math.max(0, content.scrollHeight - window.innerHeight);
    return maxScroll > 0 ? scrollYRef.current / maxScroll : 0;
  }, []);

  return useMemo(
    () => ({
      isReady,
      scrollToTop,
      scrollTo,
      getScroll,
      getProgress
    }),
    [getProgress, getScroll, isReady, scrollTo, scrollToTop]
  );
}

export function SmoothScrollProvider({ children }: { children: React.ReactNode }) {
  const value = useSmoothScroll();
  return <SmoothScrollContext.Provider value={value}>{children}</SmoothScrollContext.Provider>;
}

export function useSmoothScrollContext() {
  const context = useContext(SmoothScrollContext);
  if (!context) {
    throw new Error('useSmoothScrollContext must be used within SmoothScrollProvider');
  }
  return context;
}
