'use client';

import Image from 'next/image';
import { motion, useReducedMotion } from 'framer-motion';
import type { MouseEvent } from 'react';

type HeroProfileCardProps = {
  imageSrc: string;
  imageAlt: string;
  tags: { title: string; accent: string }[];
};

export function HeroProfileCard({ imageSrc, imageAlt, tags }: HeroProfileCardProps) {
  const shouldReduceMotion = useReducedMotion();

  const stagger = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: shouldReduceMotion ? 0 : 0.06,
        delayChildren: shouldReduceMotion ? 0 : 0.05
      }
    }
  };

  const itemFade = shouldReduceMotion
    ? { hidden: { opacity: 0 }, visible: { opacity: 1 } }
    : {
        hidden: { opacity: 0, y: 10, filter: 'blur(6px)' },
        visible: { opacity: 1, y: 0, filter: 'blur(0px)' }
      };

  const handlePortraitMove = (event: MouseEvent<HTMLElement>) => {
    if (shouldReduceMotion) return;
    const target = event.currentTarget;
    const rect = target.getBoundingClientRect();
    const x = (event.clientX - rect.left - rect.width / 2) / rect.width;
    const y = (event.clientY - rect.top - rect.height / 2) / rect.height;
    const moveX = `${x * 6}px`;
    const moveY = `${y * 6}px`;
    target.style.setProperty('--portrait-x', moveX);
    target.style.setProperty('--portrait-y', moveY);
  };

  return (
    <motion.div
      initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 30, filter: 'blur(10px)' }}
      animate={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, y: 0, filter: 'blur(0px)' }}
      transition={{ duration: shouldReduceMotion ? 0.1 : 0.4, delay: shouldReduceMotion ? 0 : 0.08, ease: [0.16, 1, 0.3, 1] }}
      className="relative isolate group w-full max-w-xs sm:max-w-sm mx-auto rounded-[24px] border border-slate-800/70 bg-slate-950/80 p-4 sm:p-5 shadow-[0_16px_42px_rgba(2,6,23,0.55)] transition-all duration-500 ease-out hover:-translate-y-0.5 hover:border-cyan-400/35 hover:shadow-[0_22px_54px_rgba(2,6,23,0.6),0_0_0_1px_rgba(34,211,238,0.25)]"
      data-layer
      data-depth="0.2"
    >
      <div className="pointer-events-none absolute inset-0 rounded-[24px] bg-gradient-to-br from-white/4 via-transparent to-cyan-500/8 opacity-70 transition-opacity duration-500 group-hover:opacity-90" />
      <div className="pointer-events-none absolute -inset-4 rounded-[32px] bg-[radial-gradient(circle_at_top,_rgba(34,211,238,0.2),_transparent_65%)] opacity-35 blur-2xl transition-opacity duration-500 group-hover:opacity-55" />

      <div
        className="relative overflow-hidden rounded-2xl border border-slate-800/70 bg-slate-950/60 shadow-[inset_0_0_0_1px_rgba(34,211,238,0.06)]"
        onMouseMove={handlePortraitMove}
        onMouseLeave={(event) => {
          const target = event.currentTarget;
          target.style.setProperty('--portrait-x', '0px');
          target.style.setProperty('--portrait-y', '0px');
        }}
      >
        <div className="relative aspect-[4/5] w-full">
          <div
            className="absolute inset-0 transition-transform duration-300 ease-out will-change-transform"
            style={{ transform: 'translate3d(var(--portrait-x, 0px), var(--portrait-y, 0px), 0)' }}
          >
            <Image
              src={imageSrc}
              alt={imageAlt}
              fill
              sizes="(max-width: 640px) 72vw, (max-width: 1024px) 38vw, 320px"
              priority
              className="object-cover object-center scale-[1.02] brightness-[0.92] transition-transform duration-400 ease-out group-hover:scale-[1.05] group-hover:brightness-100"
            />
          </div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_15%,rgba(34,211,238,0.14),transparent_55%)] opacity-70" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/65 via-slate-950/20 to-transparent" />
          <div className="absolute inset-0 ring-1 ring-inset ring-white/10" />
        </div>
      </div>

      <motion.div
        className="mt-4 flex flex-wrap gap-2 border-t border-slate-800/50 pt-3"
        initial="hidden"
        animate="visible"
        variants={stagger}
      >
        {tags.map((tag) => (
          <motion.span
            key={tag.title}
            variants={itemFade}
            className="inline-flex items-center rounded-full border border-slate-800/60 bg-slate-900/50 px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-[0.16em] text-slate-200/70 shadow-[0_0_0_1px_rgba(34,211,238,0.04)]"
          >
            {tag.accent}
          </motion.span>
        ))}
      </motion.div>
    </motion.div>
  );
}
