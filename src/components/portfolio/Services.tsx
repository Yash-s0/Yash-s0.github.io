'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { portfolio } from '../../data/portfolio';
import { SectionHeader } from './SectionHeader';

export function Services() {
  const reduceMotion = useReducedMotion();
  const rawImpactCards = [
    ...portfolio.hero.metrics.map((metric) => ({
      title: metric.label,
      value: metric.value,
      note: 'Production benchmark'
    })),
    ...portfolio.achievements.map((achievement) => ({
      title: achievement.label,
      value: `${achievement.value}${achievement.suffix}`,
      note: 'Measured delivery outcome'
    }))
  ];
  const removeValues = new Set(['50% Faster', '120ms', '20% Faster']);
  const preferredOrder = ['50% ↓', '120ms P95', '20% faster'];
  const impactCards = rawImpactCards
    .filter((item) => !removeValues.has(item.value))
    .sort((a, b) => preferredOrder.indexOf(a.value) - preferredOrder.indexOf(b.value));

  return (
    <section id="services" className="relative overflow-hidden py-32">
      <div className="absolute inset-0">
        <div className="absolute left-1/3 top-1/2 h-96 w-96 rounded-full bg-signal-500/10 blur-[130px]" />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader
          eyebrow="What I Deliver"
          title="Measured Impact"
          subtitle={portfolio.hero.supporting}
        />

        <div className="mt-16 grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
          {impactCards.map((item, index) => (
            <motion.article
              key={`${item.title}-${index}`}
              initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 22 }}
              whileInView={reduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.22 }}
              transition={{ duration: 0.56, delay: index * 0.04, ease: [0.16, 1, 0.3, 1] }}
              whileHover={reduceMotion ? undefined : { y: -7 }}
              className="group relative h-full rounded-2xl border border-white/10 bg-graphite-900/75 p-7 transition-colors hover:border-signal-500/45"
            >
              <div className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-br from-signal-500/12 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              <div className="absolute right-0 top-0 h-24 w-24 rounded-bl-2xl bg-gradient-to-bl from-signal-500/20 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
              <p className="text-4xl font-semibold text-white">{item.value}</p>
              <p className="mt-3 text-xs uppercase tracking-[0.3em] text-text-secondary">{item.title}</p>
              <p className="mt-5 text-sm leading-relaxed text-text-secondary">{item.note}</p>
              <div className="mt-5 h-1 rounded-full bg-gradient-to-r from-signal-500 to-cyan-400 opacity-0 transition-opacity group-hover:opacity-100" />
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
