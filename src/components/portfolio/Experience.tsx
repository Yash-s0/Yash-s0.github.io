'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { portfolio } from '../../data/portfolio';
import { SectionHeader } from './SectionHeader';

export function Experience() {
  const reduceMotion = useReducedMotion();
  const companyExperience = portfolio.experience.company;
  const internshipExperience = portfolio.experience.internship;

  return (
    <section id="experience" className="relative overflow-hidden bg-graphite-900/45 py-32">
      <div className="absolute inset-0">
        <div className="absolute right-0 top-1/4 h-96 w-96 rounded-full bg-cyan-400/10 blur-[130px]" />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader
          eyebrow="Career Journey"
          title="Work Experience"
          subtitle={companyExperience.summary}
        />

        <div className="mx-auto mt-16 w-full max-w-5xl space-y-8">
          <motion.article
            initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 24 }}
            whileInView={reduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.18 }}
            transition={{ duration: 0.58, ease: [0.16, 1, 0.3, 1] }}
            className="group relative rounded-2xl border border-white/10 bg-graphite-900/75 p-7 transition-colors hover:border-signal-500/45 sm:p-8"
          >
            <div className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-br from-signal-500/12 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            <div className="relative z-10">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.3em] text-cyan-300">Company</p>
                  <h3 className="mt-3 text-3xl font-semibold text-white sm:text-4xl">{companyExperience.name}</h3>
                  <p className="mt-4 max-w-3xl text-sm leading-relaxed text-text-secondary">{companyExperience.focus}</p>
                </div>
                <span className="rounded-lg border border-white/10 bg-graphite-950/45 px-3 py-1 text-[0.66rem] uppercase tracking-[0.2em] text-text-secondary">
                  {companyExperience.period}
                </span>
              </div>

              <div className="mt-7 rounded-xl border border-white/10 bg-graphite-950/35 p-5">
                <p className="text-xs uppercase tracking-[0.26em] text-text-secondary">Role</p>
                <h4 className="mt-2 text-2xl font-semibold text-white">{companyExperience.role}</h4>
                <p className="mt-2 text-xs uppercase tracking-[0.24em] text-signal-300">
                  Progression: Software Development Intern to Software Engineer I
                </p>
                <p className="mt-3 text-sm leading-relaxed text-text-secondary">{companyExperience.summary}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {companyExperience.stack.map((tech) => (
                    <span
                      key={tech}
                      className="rounded-lg border border-white/10 bg-graphite-950/55 px-2.5 py-1 text-[0.62rem] uppercase tracking-[0.16em] text-text-secondary"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-7">
                <p className="text-xs uppercase tracking-[0.28em] text-cyan-300">Projects Under Stackera</p>
                <div className="mt-4 space-y-4">
                  {companyExperience.projects.map((project) => (
                    <article key={`${project.name}-${project.period}`} className="rounded-xl border border-white/10 bg-graphite-950/35 p-5">
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <h5 className="text-xl font-semibold text-white">{project.name}</h5>
                        <span className="rounded-lg border border-white/10 bg-graphite-950/55 px-3 py-1 text-[0.62rem] uppercase tracking-[0.2em] text-text-secondary">
                          {project.period}
                        </span>
                      </div>

                      <div className="mt-3 flex flex-wrap gap-2">
                        {project.labels.map((label) => (
                          <span
                            key={label}
                            className="rounded-lg border border-signal-400/35 bg-signal-500/8 px-3 py-1 text-[0.62rem] uppercase tracking-[0.2em] text-signal-300"
                          >
                            {label}
                          </span>
                        ))}
                      </div>

                      <p className="mt-3 text-sm leading-relaxed text-text-secondary">{project.description}</p>

                      <div className="mt-4">
                        <p className="text-xs uppercase tracking-[0.25em] text-text-secondary">Systems</p>
                        <div className="mt-2 flex flex-wrap gap-2">
                          {project.systems.map((system) => (
                            <span
                              key={system}
                              className="rounded-lg border border-white/10 bg-graphite-950/55 px-3 py-1 text-[0.62rem] uppercase tracking-[0.2em] text-text-secondary"
                            >
                              {system}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="mt-4">
                        <p className="text-xs uppercase tracking-[0.25em] text-text-secondary">Outcomes</p>
                        <div className="mt-2 flex flex-wrap gap-2">
                          {project.outcomes.map((outcome) => (
                            <span
                              key={outcome}
                              className="rounded-lg border border-white/10 bg-graphite-950/55 px-3 py-1 text-[0.62rem] uppercase tracking-[0.2em] text-text-secondary"
                            >
                              {outcome}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="mt-4">
                        <p className="text-xs uppercase tracking-[0.25em] text-text-secondary">Key Achievements</p>
                        <ul className="mt-2 space-y-2 text-sm text-text-secondary">
                          {project.achievements.map((achievement) => (
                            <li key={achievement} className="flex items-start gap-2">
                              <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-cyan-400" />
                              <span className="flex-1">{achievement}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="mt-4 flex flex-wrap gap-2">
                        {project.stack.map((tech) => (
                          <span
                            key={tech}
                            className="rounded-lg border border-white/10 bg-graphite-950/55 px-2.5 py-1 text-[0.62rem] uppercase tracking-[0.16em] text-text-secondary"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            </div>
          </motion.article>

          <motion.article
            initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 24 }}
            whileInView={reduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1], delay: 0.04 }}
            className="relative rounded-2xl border border-white/10 bg-graphite-900/75 p-7 sm:p-8"
          >
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-cyan-300">Progression</p>
                <h3 className="mt-3 text-2xl font-semibold text-white sm:text-3xl">{internshipExperience.role}</h3>
                <p className="mt-3 text-sm leading-relaxed text-text-secondary">{internshipExperience.summary}</p>
              </div>
              <span className="rounded-lg border border-white/10 bg-graphite-950/45 px-3 py-1 text-[0.66rem] uppercase tracking-[0.2em] text-text-secondary">
                {internshipExperience.period}
              </span>
            </div>

            <div className="mt-4 inline-flex rounded-lg border border-signal-400/35 bg-signal-500/8 px-3 py-1 text-[0.62rem] uppercase tracking-[0.2em] text-signal-300">
              {internshipExperience.label}
            </div>

            <div className="mt-5">
              <p className="text-xs uppercase tracking-[0.25em] text-text-secondary">Systems</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {internshipExperience.systems.map((system) => (
                  <span
                    key={system}
                    className="rounded-lg border border-white/10 bg-graphite-950/55 px-3 py-1 text-[0.62rem] uppercase tracking-[0.2em] text-text-secondary"
                  >
                    {system}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-4">
              <p className="text-xs uppercase tracking-[0.25em] text-text-secondary">Outcomes</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {internshipExperience.outcomes.map((outcome) => (
                  <span
                    key={outcome}
                    className="rounded-lg border border-white/10 bg-graphite-950/55 px-3 py-1 text-[0.62rem] uppercase tracking-[0.2em] text-text-secondary"
                  >
                    {outcome}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-4">
              <p className="text-xs uppercase tracking-[0.25em] text-text-secondary">Key Achievements</p>
              <ul className="mt-2 space-y-2 text-sm text-text-secondary">
                {internshipExperience.achievements.map((achievement) => (
                  <li key={achievement} className="flex items-start gap-2">
                    <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-cyan-400" />
                    <span className="flex-1">{achievement}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              {internshipExperience.stack.map((tech) => (
                <span
                  key={tech}
                  className="rounded-lg border border-white/10 bg-graphite-950/55 px-2.5 py-1 text-[0.62rem] uppercase tracking-[0.16em] text-text-secondary"
                >
                  {tech}
                </span>
              ))}
            </div>
          </motion.article>
        </div>
      </div>
    </section>
  );
}
