'use client';

import { motion, useReducedMotion } from 'framer-motion';

type SectionHeaderProps = {
  eyebrow: string;
  title: string;
  subtitle?: string;
  center?: boolean;
};

export function SectionHeader({ eyebrow, title, subtitle, center = true }: SectionHeaderProps) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 24 }}
      whileInView={reduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.35 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className={center ? 'text-center' : 'text-left'}
    >
      <span className="mb-4 block text-xs uppercase tracking-[0.38em] text-cyan-300 sm:text-sm">
        {eyebrow}
      </span>
      <h2 className="text-4xl font-semibold leading-tight text-white sm:text-5xl md:text-6xl">
        {title}
      </h2>
      {subtitle ? (
        <p className={`mt-6 text-base leading-relaxed text-text-secondary ${center ? 'mx-auto max-w-3xl' : 'max-w-2xl'}`}>
          {subtitle}
        </p>
      ) : null}
      <div className={`mt-7 h-1 w-24 bg-gradient-to-r from-signal-500 to-cyan-400 ${center ? 'mx-auto' : ''}`} />
    </motion.div>
  );
}

