'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { portfolio } from '../../data/portfolio';
import { SectionHeader } from './SectionHeader';

export function About() {
  const reduceMotion = useReducedMotion();
  const education = portfolio.aboutSteps.find((step) => step.education)?.education;

  return (
    <section id="about" className="relative overflow-hidden py-32">
      <div className="absolute inset-0">
        <div className="absolute right-0 top-1/4 h-96 w-96 rounded-full bg-signal-500/12 blur-[120px]" />
        <div className="absolute bottom-0 left-0 h-80 w-80 rounded-full bg-cyan-400/10 blur-[110px]" />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader
          eyebrow="Get To Know Me"
          title="About Me"
          subtitle={portfolio.hero.supporting}
        />

        <div className="mt-16 grid items-start gap-12 lg:grid-cols-[1.08fr_0.92fr]">
          <motion.div
            initial={reduceMotion ? { opacity: 0 } : { opacity: 0, x: -28 }}
            whileInView={reduceMotion ? { opacity: 1 } : { opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.35 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-6"
          >
            <div className="rounded-2xl border border-white/10 bg-graphite-900/72 p-7">
              <p className="text-base leading-relaxed text-text-secondary">
                {portfolio.aboutSteps[0]?.body}
              </p>
              <p className="mt-4 text-base leading-relaxed text-text-secondary">
                {portfolio.aboutSteps[1]?.supporting}
              </p>
            </div>

            {education ? (
              <div className="rounded-2xl border border-white/10 bg-graphite-900/72 p-6">
                <p className="text-xs uppercase tracking-[0.33em] text-cyan-300">Education</p>
                <p className="mt-3 text-xl font-semibold text-white">{education}</p>
              </div>
            ) : null}

            <div className="rounded-2xl border border-white/10 bg-graphite-900/75 p-6">
              <p className="text-xs uppercase tracking-[0.33em] text-cyan-300">Current Focus</p>
              <p className="mt-3 text-base leading-relaxed text-text-secondary">
                Building resilient APIs, event-driven pipelines, and blockchain data systems with
                a strong performance and reliability-first mindset.
              </p>
              <div className="mt-5 grid gap-3 sm:grid-cols-3">
                {portfolio.hero.metrics.map((metric) => (
                  <div key={metric.label} className="rounded-lg border border-white/10 bg-graphite-950/50 px-4 py-3">
                    <p className="text-xs uppercase tracking-[0.22em] text-text-secondary">{metric.label}</p>
                    <p className="mt-2 text-lg font-semibold text-white">{metric.value}</p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          <div className="grid gap-5 sm:grid-cols-2">
            {portfolio.aboutSteps.map((step, index) => (
              <motion.article
                key={step.title}
                initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 20 }}
                whileInView={reduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.5, delay: index * 0.05, ease: [0.16, 1, 0.3, 1] }}
                whileHover={reduceMotion ? undefined : { y: -6 }}
                className="group relative rounded-2xl border border-white/10 bg-graphite-900/72 p-6 transition-colors hover:border-signal-500/45"
              >
                <div className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-br from-signal-500/12 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                <p className="text-xs uppercase tracking-[0.32em] text-cyan-300">{step.accent}</p>
                <h3 className="mt-3 text-xl font-semibold text-white">{step.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-text-secondary">{step.body}</p>
                <p className="mt-3 text-sm leading-relaxed text-text-secondary">{step.supporting}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {step.chips.map((chip) => (
                    <span
                      key={chip}
                      className="rounded-lg border border-white/10 bg-graphite-950/45 px-3 py-1 text-[0.65rem] uppercase tracking-[0.24em] text-text-secondary"
                    >
                      {chip}
                    </span>
                  ))}
                </div>
                <p className="mt-4 text-xs text-cyan-300">{step.systemNote}</p>
              </motion.article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
