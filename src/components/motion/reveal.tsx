'use client';

import { motion, useReducedMotion } from 'framer-motion';
import type { ReactNode } from 'react';

type RevealProps = {
  children: ReactNode;
  className?: string;
  id?: string;
  as?: 'div' | 'section' | 'article';
  y?: number;
  delay?: number;
  amount?: number;
  once?: boolean;
};

export function Reveal({
  children,
  className = '',
  id,
  as = 'div',
  y = 16,
  delay = 0,
  amount = 0.2,
  once = true
}: RevealProps) {
  const shouldReduceMotion = useReducedMotion();
  const MotionTag = as === 'section' ? motion.section : as === 'article' ? motion.article : motion.div;

  return (
    <MotionTag
      id={id}
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, amount }}
      variants={{
        hidden: { opacity: 0, y: shouldReduceMotion ? 0 : y },
        visible: { opacity: 1, y: 0 }
      }}
      transition={{
        duration: shouldReduceMotion ? 0.01 : 0.35,
        delay,
        ease: [0.16, 1, 0.3, 1]
      }}
    >
      {children}
    </MotionTag>
  );
}
