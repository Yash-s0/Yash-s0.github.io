'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { portfolio } from '../../../data/portfolio';

const sectionReveal = {
  hidden: { opacity: 0, y: 24, filter: 'blur(8px)' },
  visible: { opacity: 1, y: 0, filter: 'blur(0px)' }
};

export default function ProjectPage({ params }: { params: { slug: string } }) {
  const project = portfolio.projectsBySlug[params.slug as keyof typeof portfolio.projectsBySlug];
  const featured = portfolio.featuredProjects.find((item) => item.slug === params.slug);
  const heroVisual = featured?.visuals?.[0] ?? project?.images?.[0];
  const gallery = project?.images ?? [];

  if (!project) {
    return (
      <main className="min-h-screen bg-graphite-950 px-6 py-20 text-text-primary">
        <div className="mx-auto max-w-4xl rounded-2xl border border-white/10 bg-graphite-900/70 p-8 text-center">
          <h1 className="text-3xl font-semibold text-white">Project not found</h1>
          <p className="mt-3 text-text-secondary">The requested case study is not available.</p>
          <Link
            href="/"
            className="mt-6 inline-flex rounded-lg border border-signal-400/70 px-5 py-3 text-sm font-semibold text-signal-300 transition-colors hover:bg-signal-500/10"
          >
            Back to Home
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-graphite-950 pb-20 text-text-primary">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/4 top-24 h-[24rem] w-[24rem] rounded-full bg-signal-500/12 blur-[130px]" />
        <div className="absolute bottom-20 right-1/4 h-[24rem] w-[24rem] rounded-full bg-cyan-400/10 blur-[130px]" />
        <div
          className="absolute inset-0 opacity-25"
          style={{
            backgroundImage:
              'linear-gradient(rgba(96, 165, 250, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(96, 165, 250, 0.05) 1px, transparent 1px)',
            backgroundSize: '88px 88px'
          }}
        />
      </div>

      <section className="relative z-10 flex min-h-[80vh] items-center px-4 pt-28 sm:px-6 lg:px-8">
        <div className="mx-auto w-full max-w-7xl">
          <motion.div initial="hidden" animate="visible" variants={sectionReveal} transition={{ duration: 0.65, ease: 'easeOut' }}>
            <Link href="/" className="text-sm text-cyan-300 transition-colors hover:text-cyan-200">
              ← Back to Home
            </Link>
          </motion.div>

          <div className="mt-8 grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr]">
            {heroVisual ? (
              <motion.div
                initial={{ opacity: 0, x: -24, filter: 'blur(8px)' }}
                animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
                transition={{ duration: 0.75, ease: 'easeOut' }}
                className="relative overflow-hidden rounded-2xl border border-white/10 bg-graphite-900/70 p-4"
              >
                <div className="relative overflow-hidden rounded-xl border border-white/10">
                  <Image
                    src={heroVisual}
                    alt={project.title}
                    width={1200}
                    height={760}
                    className="h-auto w-full object-cover"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-graphite-950/40 via-transparent to-transparent" />
                </div>
              </motion.div>
            ) : null}

            <motion.div
              initial={{ opacity: 0, x: 24, filter: 'blur(8px)' }}
              animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
              transition={{ duration: 0.75, ease: 'easeOut', delay: 0.05 }}
              className="space-y-5"
            >
              <span className="inline-flex rounded-full bg-gradient-to-r from-signal-500 to-cyan-400 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-graphite-975">
                Case Study
              </span>
              <h1 className="text-4xl font-semibold leading-tight text-white sm:text-5xl md:text-6xl">
                {project.title}
              </h1>
              <p className="text-lg leading-relaxed text-text-secondary">{project.overview}</p>

              <div className="flex flex-wrap gap-2">
                {project.stack.map((tech) => (
                  <span
                    key={tech}
                    className="rounded-lg border border-white/10 bg-graphite-900/70 px-3 py-1 text-[0.68rem] uppercase tracking-[0.22em] text-text-secondary"
                  >
                    {tech}
                  </span>
                ))}
              </div>

              <div className="flex flex-wrap gap-3">
                {project.links.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    className="inline-flex rounded-lg border border-white/15 bg-graphite-900/70 px-5 py-3 text-sm font-semibold text-white transition-all hover:border-signal-500/65 hover:text-signal-300"
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="relative z-10 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-6 md:grid-cols-2">
          {[
            { title: 'Problem', body: project.problem },
            { title: 'Approach', body: project.approach },
            { title: 'Architecture', body: project.architecture },
            { title: 'Challenges', body: project.challenges },
            { title: 'Outcomes', body: project.outcomes }
          ].map((section, index) => (
            <motion.article
              key={section.title}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.24 }}
              variants={sectionReveal}
              transition={{ duration: 0.6, delay: index * 0.04, ease: 'easeOut' }}
              className={`rounded-2xl border border-white/10 bg-graphite-900/75 p-7 ${index === 0 ? 'md:col-span-2' : ''}`}
            >
              <h2 className="text-2xl font-semibold text-white">{section.title}</h2>
              <p className="mt-3 leading-relaxed text-text-secondary">{section.body}</p>
            </motion.article>
          ))}
        </div>

        {gallery.length > 1 ? (
          <motion.div
            initial={{ opacity: 0, y: 24, filter: 'blur(8px)' }}
            whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.65, ease: 'easeOut' }}
            className="mx-auto mt-10 grid max-w-7xl gap-4 sm:grid-cols-2 lg:grid-cols-3"
          >
            {gallery.slice(1).map((image) => (
              <div key={image} className="overflow-hidden rounded-xl border border-white/10 bg-graphite-900/70">
                <Image src={image} alt={`${project.title} detail`} width={720} height={440} className="h-auto w-full object-cover" />
              </div>
            ))}
          </motion.div>
        ) : null}
      </section>
    </main>
  );
}

