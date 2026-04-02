'use client';

import Image from 'next/image';
import { motion, useReducedMotion } from 'framer-motion';
import { portfolio } from '../../data/portfolio';
import { SectionHeader } from './SectionHeader';

export function Projects() {
  const reduceMotion = useReducedMotion();
  const visibleAdditionalProjects = portfolio.additionalProjects.slice(0, 3);

  return (
    <section id="projects" className="relative overflow-hidden py-32">
      <div className="absolute inset-0">
        <div className="absolute left-0 top-1/3 h-96 w-96 rounded-full bg-signal-500/10 blur-[120px]" />
        <div className="absolute bottom-1/4 right-0 h-[26rem] w-[26rem] rounded-full bg-cyan-400/8 blur-[130px]" />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader
          eyebrow="My Work"
          title="Featured Projects"
          subtitle={portfolio.featuredProjects[0]?.impact}
        />

        <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {portfolio.featuredProjects.map((project, index) => (
            <motion.article
              key={project.slug}
              initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 24 }}
              whileInView={reduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.24 }}
              transition={{ duration: 0.58, delay: index * 0.06, ease: [0.16, 1, 0.3, 1] }}
              whileHover={reduceMotion ? undefined : { y: -8 }}
              className="group relative"
            >
              <div className="absolute -right-3 -top-3 z-20 rounded-full bg-gradient-to-r from-signal-500 to-cyan-400 px-3 py-1 text-xs font-semibold text-graphite-975 shadow-lg">
                Featured
              </div>
              <div className="h-full overflow-hidden rounded-2xl border border-white/10 bg-graphite-900/74 transition-all group-hover:border-signal-500/50">
                <div className="relative h-52 overflow-hidden">
                  <Image
                    src={project.visuals[0]}
                    alt={project.name}
                    fill
                    sizes="(min-width: 1024px) 30vw, (min-width: 768px) 46vw, 92vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-graphite-950 via-transparent to-transparent opacity-75" />
                  <div className="absolute inset-0 flex items-center justify-center gap-3 bg-graphite-950/80 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    {project.ctas.map((cta) => (
                      <a
                        key={cta.label}
                        href={cta.href}
                        className="rounded-lg border border-white/20 bg-graphite-900/75 px-3 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-white transition-all hover:border-signal-400 hover:text-signal-300"
                      >
                        {cta.label}
                      </a>
                    ))}
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="text-xl font-semibold text-white transition-colors group-hover:text-signal-300">
                    {project.name}
                  </h3>
                  <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-text-secondary">
                    {project.problem}
                  </p>
                  <p className="mt-3 text-sm leading-relaxed text-text-secondary">{project.solution}</p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {project.stack.map((tech) => (
                      <span
                        key={tech}
                        className="rounded-lg border border-white/10 bg-graphite-950/50 px-3 py-1 text-[0.62rem] uppercase tracking-[0.22em] text-text-secondary"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="h-1 bg-gradient-to-r from-signal-500 to-cyan-400 opacity-0 transition-opacity group-hover:opacity-100" />
              </div>
            </motion.article>
          ))}
        </div>

        <div className="mt-24">
          <SectionHeader
            eyebrow="More"
            title="Additional Builds"
            subtitle={portfolio.additionalProjects[0]?.description}
          />

          <div className="mt-12 grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
            {visibleAdditionalProjects.map((project, index) => (
              <motion.article
                key={project.name}
                initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 24 }}
                whileInView={reduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.24 }}
                transition={{ duration: 0.56, delay: index * 0.05, ease: [0.16, 1, 0.3, 1] }}
                whileHover={reduceMotion ? undefined : { y: -6 }}
                className="overflow-hidden rounded-2xl border border-white/10 bg-graphite-900/72 transition-colors hover:border-signal-500/45"
              >
                <div className="relative h-48">
                  <Image
                    src={project.thumbnail}
                    alt={project.name}
                    fill
                    sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 95vw"
                    className="object-cover"
                  />
                </div>
                <div className="p-5">
                  <h4 className="text-lg font-semibold text-white">{project.name}</h4>
                  <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-text-secondary">
                    {project.description}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {project.stack.map((item) => (
                      <span
                        key={item}
                        className="rounded-lg border border-white/10 bg-graphite-950/45 px-2.5 py-1 text-[0.62rem] uppercase tracking-[0.18em] text-text-secondary"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                  <div className="mt-4 flex flex-wrap gap-3 text-sm">
                    {project.links.github ? (
                      <a href={project.links.github} className="text-cyan-300 transition-colors hover:text-cyan-200">
                        GitHub
                      </a>
                    ) : null}
                    {project.links.demo ? (
                      <a href={project.links.demo} className="text-cyan-300 transition-colors hover:text-cyan-200">
                        Live Demo
                      </a>
                    ) : null}
                  </div>
                </div>
              </motion.article>
            ))}
          </div>

          <div className="mt-14 text-center">
            <a
              href={portfolio.contact.github}
              className="inline-flex items-center gap-2 rounded-lg border border-signal-400/60 px-8 py-4 text-base font-semibold text-signal-300 transition-all hover:bg-signal-500/10"
            >
              View All Projects on GitHub
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
