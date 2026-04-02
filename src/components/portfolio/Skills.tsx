'use client';

import Image from 'next/image';
import { motion, useReducedMotion } from 'framer-motion';
import { portfolio } from '../../data/portfolio';
import { SectionHeader } from './SectionHeader';

export function Skills() {
  const reduceMotion = useReducedMotion();
  const techTags = Array.from(new Set(portfolio.techStack.flatMap((group) => group.items)));

  return (
    <section id="skills" className="relative overflow-hidden bg-graphite-900/45 py-32">
      <div className="absolute inset-0">
        <div className="absolute left-1/4 top-0 h-96 w-96 rounded-full bg-cyan-400/12 blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 h-96 w-96 rounded-full bg-signal-500/10 blur-[120px]" />
        <motion.div
          animate={reduceMotion ? undefined : { rotate: [0, 360] }}
          transition={reduceMotion ? undefined : { duration: 44, repeat: Infinity, ease: 'linear' }}
          className="absolute right-1/4 top-1/3 h-56 w-56 rounded-3xl border border-white/10"
        />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader
          eyebrow="My Expertise"
          title="Skills & Technologies"
          subtitle={portfolio.skillsScenes[0]?.summary}
        />

        <div className="mt-16 grid gap-8 md:grid-cols-2">
          {portfolio.skillsScenes.map((scene, index) => (
            <motion.article
              key={scene.label}
              initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 24 }}
              whileInView={reduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.56, delay: index * 0.05, ease: [0.16, 1, 0.3, 1] }}
              whileHover={reduceMotion ? undefined : { y: -6 }}
              className="group relative rounded-2xl border border-white/10 bg-graphite-900/75 p-7 transition-colors hover:border-signal-500/45"
            >
              <div className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-br from-signal-500/10 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              <div className="absolute left-0 right-0 top-0 h-1 rounded-t-2xl bg-gradient-to-r from-signal-500 to-transparent" />

              <div className="flex flex-wrap items-center gap-3 text-xs uppercase tracking-[0.32em] text-cyan-300">
                <span>{scene.label}</span>
                <span className="text-text-secondary">{scene.metric}</span>
              </div>
              <h3 className="mt-4 text-2xl font-semibold text-white">{scene.description}</h3>
              <p className="mt-3 text-sm leading-relaxed text-text-secondary">{scene.summary}</p>
              <p className="mt-3 text-xs text-cyan-300">{scene.systemNote}</p>

              <div className="mt-5 flex flex-wrap gap-2">
                {scene.chips.map((chip) => (
                  <span
                    key={chip}
                    className="rounded-lg border border-white/10 bg-graphite-950/45 px-3 py-1 text-[0.65rem] uppercase tracking-[0.24em] text-text-secondary"
                  >
                    {chip}
                  </span>
                ))}
              </div>

              <div className="mt-5 flex flex-wrap gap-2">
                {scene.visuals.map((visual) => (
                  <span
                    key={visual.label}
                    className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-graphite-950/45 px-3 py-1.5 text-[0.65rem] uppercase tracking-[0.2em] text-text-secondary"
                  >
                    <Image src={`/img/icons/${visual.icon}.svg`} alt={visual.label} width={14} height={14} />
                    {visual.label}
                  </span>
                ))}
              </div>
            </motion.article>
          ))}
        </div>

        <motion.div
          initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 20 }}
          whileInView={reduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.6, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}
          className="mt-20 text-center"
        >
          <h3 className="text-2xl font-semibold text-white">Tech Stack</h3>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            {techTags.map((tech, index) => (
              <motion.span
                key={tech}
                initial={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.9 }}
                whileInView={reduceMotion ? { opacity: 1 } : { opacity: 1, scale: 1 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ delay: 0.16 + index * 0.012, duration: 0.35 }}
                whileHover={reduceMotion ? undefined : { y: -4, scale: 1.03 }}
                className="cursor-default rounded-lg border border-white/10 bg-graphite-900/75 px-4 py-2 text-sm text-text-secondary transition-all hover:border-signal-500/55 hover:text-signal-300"
              >
                {tech}
              </motion.span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

