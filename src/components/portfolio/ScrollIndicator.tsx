'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export function ScrollIndicator() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const scrollContainer = document.getElementById('scroll-container');
    const content = document.getElementById('scroll-content');
    let rafId: number;

    const update = () => {
      const scrollData = scrollContainer?.getAttribute('data-scroll');
      const scrollY = scrollData ? parseFloat(scrollData) : 0;

      if (content) {
        const maxScroll = content.scrollHeight - window.innerHeight;
        const next = maxScroll > 0 ? (scrollY / maxScroll) * 100 : 0;
        setProgress(next);
      }

      rafId = requestAnimationFrame(update);
    };

    rafId = requestAnimationFrame(update);
    return () => cancelAnimationFrame(rafId);
  }, []);

  return (
    <div className="fixed top-0 left-0 right-0 z-[100] h-1 bg-graphite-900/80">
      <motion.div
        className="h-full bg-gradient-to-r from-signal-500 to-cyan-400 shadow-[0_0_10px_rgba(96,165,250,0.5)]"
        style={{ width: `${progress}%` }}
        initial={{ width: 0 }}
        transition={{ duration: 0.1 }}
      />
    </div>
  );
}
