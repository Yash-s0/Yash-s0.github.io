'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { portfolio } from '../../data/portfolio';
import { SectionHeader } from './SectionHeader';

export function Experience() {
  const reduceMotion = useReducedMotion();

  return (
    <section id="experience" className="relative overflow-hidden bg-graphite-900/45 py-32">
      <div className="absolute inset-0">
        <div className="absolute right-0 top-1/4 h-96 w-96 rounded-full bg-cyan-400/10 blur-[130px]" />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader
          eyebrow="Career Journey"
          title="Work Experience"
          subtitle={portfolio.experienceScenes[0]?.impact}
        />

        <div className="relative mt-16">
          <div className="absolute bottom-0 left-1/2 top-0 hidden w-px -translate-x-1/2 bg-gradient-to-b from-signal-500 via-cyan-400 to-transparent lg:block" />
          <div className="space-y-14">
            {portfolio.experienceScenes.map((exp, index) => (
              <motion.article
                key={`${exp.company}-${exp.role}-${exp.period}`}
                initial={reduceMotion ? { opacity: 0 } : { opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                whileInView={reduceMotion ? { opacity: 1 } : { opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.24 }}
                transition={{ duration: 0.58, delay: index * 0.05, ease: [0.16, 1, 0.3, 1] }}
                className={`relative flex flex-col gap-7 lg:flex-row ${index % 2 === 0 ? 'lg:flex-row-reverse' : ''}`}
              >
                <span className="absolute left-1/2 top-8 hidden h-5 w-5 -translate-x-1/2 rounded-full border-4 border-graphite-950 bg-signal-500 shadow-[0_0_18px_rgba(96,165,250,0.5)] lg:block" />

                <div className={`lg:w-[calc(50%-1.75rem)] ${index % 2 === 0 ? 'lg:text-right' : ''}`}>
                  <motion.div
                    whileHover={reduceMotion ? undefined : { y: -6 }}
                    className="group relative rounded-2xl border border-white/10 bg-graphite-900/75 p-7 transition-colors hover:border-signal-500/45"
                  >
                    <div className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-br from-signal-500/12 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                    <p className="text-xs uppercase tracking-[0.3em] text-cyan-300">{exp.period}</p>
                    <h3 className="mt-3 text-2xl font-semibold text-white">{exp.role}</h3>
                    <p className="mt-1 text-sm font-semibold uppercase tracking-[0.25em] text-signal-300">{exp.company}</p>
                    <p className="mt-4 text-sm leading-relaxed text-text-secondary">{exp.focus}</p>
                    <p className="mt-3 text-sm leading-relaxed text-text-secondary">{exp.impact}</p>

                    <div className="mt-5">
                      <p className="text-xs uppercase tracking-[0.26em] text-text-secondary">Systems</p>
                      <div className={`mt-2 flex flex-wrap gap-2 ${index % 2 === 0 ? 'lg:justify-end' : ''}`}>
                        {exp.systems.map((system) => (
                          <span
                            key={system}
                            className="rounded-lg border border-white/10 bg-graphite-950/45 px-3 py-1 text-[0.62rem] uppercase tracking-[0.2em] text-text-secondary"
                          >
                            {system}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="mt-5">
                      <p className="text-xs uppercase tracking-[0.26em] text-text-secondary">Outcomes</p>
                      <div className={`mt-2 flex flex-wrap gap-2 ${index % 2 === 0 ? 'lg:justify-end' : ''}`}>
                        {exp.outcomes.map((outcome) => (
                          <span
                            key={outcome}
                            className="rounded-lg border border-white/10 bg-graphite-950/45 px-3 py-1 text-[0.62rem] uppercase tracking-[0.2em] text-text-secondary"
                          >
                            {outcome}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="mt-5">
                      <p className="text-xs uppercase tracking-[0.26em] text-text-secondary">Key Achievements</p>
                      <ul className={`mt-2 space-y-2 text-sm text-text-secondary ${index % 2 === 0 ? 'lg:text-right' : ''}`}>
                        {exp.achievements.map((achievement) => (
                          <li key={achievement} className="flex items-start gap-2">
                            <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-cyan-400" />
                            <span className="flex-1">{achievement}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className={`mt-5 flex flex-wrap gap-2 ${index % 2 === 0 ? 'lg:justify-end' : ''}`}>
                      {exp.stack.map((tech) => (
                        <span
                          key={tech}
                          className="rounded-lg border border-white/10 bg-graphite-950/45 px-2.5 py-1 text-[0.62rem] uppercase tracking-[0.16em] text-text-secondary"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </motion.div>
                </div>

                <div className="hidden lg:block lg:w-[calc(50%-1.75rem)]" />
              </motion.article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

