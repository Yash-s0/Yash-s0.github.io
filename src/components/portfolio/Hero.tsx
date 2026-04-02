'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { motion, useReducedMotion } from 'framer-motion';
import { portfolio } from '../../data/portfolio';
import { useSmoothScrollContext } from '../smooth-scroll-provider';

const socialLinks = [
  { label: 'GitHub', href: portfolio.contact.github, icon: '/img/icons/github.svg' },
  { label: 'LinkedIn', href: portfolio.contact.linkedin, icon: '/img/icons/linkedin.svg' },
  { label: 'Email', href: `mailto:${portfolio.contact.email}`, icon: '/img/icons/outlook.svg' }
];

function resolveHeroHref(href: string) {
  if (href === '#featured') return '#projects';
  return href;
}

export function Hero() {
  const reduceMotion = useReducedMotion();
  const { scrollTo } = useSmoothScrollContext();
  const sectionRef = useRef<HTMLElement | null>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const scrollContainer = document.getElementById('scroll-container');
    let rafId = 0;

    const sync = () => {
      const scrollData = scrollContainer?.getAttribute('data-scroll');
      const scrollY = scrollData ? Number.parseFloat(scrollData) : 0;
      const section = sectionRef.current;
      if (!section) {
        rafId = requestAnimationFrame(sync);
        return;
      }

      const rect = section.getBoundingClientRect();
      const elementTop = scrollY + rect.top;
      const range = Math.max(rect.height, 1);
      const progress = clamp((scrollY - elementTop) / range, 0, 1);
      setScrollProgress(progress);
      rafId = requestAnimationFrame(sync);
    };

    rafId = requestAnimationFrame(sync);
    return () => cancelAnimationFrame(rafId);
  }, []);

  const contentY = reduceMotion ? 0 : scrollProgress * 28;
  const contentOpacity = reduceMotion ? 1 : 1 - scrollProgress * 0.24;
  const gridShift = reduceMotion ? 0 : scrollProgress * 34;
  const orbScale = reduceMotion ? 1 : 1 + scrollProgress * 0.45;

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="relative flex min-h-screen items-center justify-center overflow-hidden pt-24"
    >
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-signal-500/10 via-transparent to-cyan-400/10" />
        <div
          className="absolute inset-0"
          style={{
            transform: `translateY(${gridShift}px)`,
            backgroundImage:
              'linear-gradient(rgba(96, 165, 250, 0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(96, 165, 250, 0.06) 1px, transparent 1px)',
            backgroundSize: '100px 100px'
          }}
        />
        <motion.div
          style={{ scale: orbScale, y: reduceMotion ? 0 : scrollProgress * 80 }}
          animate={reduceMotion ? undefined : { y: [0, -32, 0], opacity: [0.3, 0.52, 0.3] }}
          transition={reduceMotion ? undefined : { duration: 9, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute left-1/4 top-1/4 h-[24rem] w-[24rem] rounded-full bg-signal-500/30 blur-[120px]"
        />
        <motion.div
          style={{ scale: orbScale, y: reduceMotion ? 0 : scrollProgress * -70 }}
          animate={reduceMotion ? undefined : { y: [0, 28, 0], opacity: [0.2, 0.46, 0.2] }}
          transition={reduceMotion ? undefined : { duration: 10.5, repeat: Infinity, ease: 'easeInOut', delay: 0.8 }}
          className="absolute bottom-1/4 right-1/4 h-[24rem] w-[24rem] rounded-full bg-cyan-400/28 blur-[120px]"
        />
      </div>

      <motion.div
        style={{ y: contentY, opacity: contentOpacity }}
        className="relative z-10 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8"
      >
        <div className="grid items-center gap-12 lg:grid-cols-[1.08fr_0.92fr]">
          <div>
            <motion.p
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.05 }}
              className="mb-4 text-xs uppercase tracking-[0.35em] text-cyan-300 sm:text-sm"
            >
              {portfolio.hero.role}
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="text-5xl font-semibold leading-tight text-white sm:text-6xl md:text-7xl lg:text-8xl"
            >
              <span className="bg-gradient-to-r from-white via-signal-300 to-cyan-300 bg-clip-text text-transparent">
                {portfolio.hero.name}
              </span>
              <span className="mt-2 block text-white/95">Building Reliable Systems</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.18 }}
              className="mt-7 max-w-3xl text-lg leading-relaxed text-text-secondary sm:text-xl"
            >
              {portfolio.hero.statement}
            </motion.p>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, delay: 0.22 }}
              className="mt-3 max-w-3xl text-base leading-relaxed text-text-secondary"
            >
              {portfolio.hero.supporting}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.28 }}
              className="mt-9 flex flex-col gap-4 sm:flex-row sm:flex-wrap"
            >
              {portfolio.hero.ctas.map((cta) => {
                const isPrimary = cta.kind === 'primary';
                const resolvedHref = resolveHeroHref(cta.href);
                return (
                  <a
                    key={cta.label}
                    href={resolvedHref}
                    onClick={(event) => {
                      if (resolvedHref.startsWith('#')) {
                        event.preventDefault();
                        scrollTo(resolvedHref, { offset: -40 });
                      }
                    }}
                    className={
                      isPrimary
                        ? 'inline-flex items-center justify-center rounded-lg bg-gradient-to-r from-signal-500 to-cyan-400 px-8 py-4 text-base font-semibold text-graphite-975 shadow-[0_14px_34px_rgba(96,165,250,0.35)] transition-transform hover:-translate-y-1'
                        : 'inline-flex items-center justify-center rounded-lg border border-white/15 bg-graphite-900/70 px-8 py-4 text-base font-semibold text-white transition-all hover:border-signal-400/70 hover:bg-graphite-900'
                    }
                  >
                    {cta.label}
                  </a>
                );
              })}
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.45, delay: 0.4 }}
              className="mt-8 flex flex-wrap items-center gap-3"
            >
              {socialLinks.map((link, index) => (
                <motion.a
                  key={link.label}
                  href={link.href}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, delay: 0.45 + index * 0.06 }}
                  whileHover={{ y: -4 }}
                  className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-graphite-900/70 px-4 py-2 text-sm text-text-secondary transition-all hover:border-signal-400/60 hover:text-white"
                >
                  <Image src={link.icon} alt={link.label} width={18} height={18} />
                  {link.label}
                </motion.a>
              ))}
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, delay: 0.2 }}
            className="relative mx-auto w-full max-w-md lg:max-w-none"
          >
            <div className="relative overflow-hidden rounded-[30px] border border-white/10 bg-graphite-900/72 p-5 shadow-[0_30px_80px_rgba(2,6,23,0.6)]">
              <div className="absolute inset-0 bg-gradient-to-br from-signal-500/16 via-transparent to-cyan-400/10" />
              <div className="relative overflow-hidden rounded-2xl border border-white/15">
                <Image
                  src="/img/yash.jpg"
                  alt={portfolio.hero.name}
                  width={560}
                  height={700}
                  className="h-auto w-full object-cover"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-graphite-950/45 via-transparent to-transparent" />
              </div>
              <div className="mt-5 grid gap-3 text-sm">
                <div className="flex items-center justify-between rounded-lg border border-white/10 bg-graphite-950/45 px-4 py-3">
                  <span className="uppercase tracking-[0.2em] text-text-secondary">Location</span>
                  <span className="text-white">{portfolio.hero.location}</span>
                </div>
                <div className="flex items-center justify-between rounded-lg border border-white/10 bg-graphite-950/45 px-4 py-3">
                  <span className="uppercase tracking-[0.2em] text-text-secondary">Stack</span>
                  <span className="text-right text-white">{portfolio.hero.stackLine}</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>

      <motion.button
        type="button"
        animate={reduceMotion ? undefined : { y: [0, 8, 0] }}
        transition={reduceMotion ? undefined : { duration: 2.1, repeat: Infinity, ease: 'easeInOut' }}
        onClick={() => scrollTo('#about')}
        className="absolute bottom-8 left-1/2 z-20 -translate-x-1/2 rounded-full border border-white/15 bg-graphite-900/65 px-4 py-2 text-xs uppercase tracking-[0.25em] text-text-secondary transition-colors hover:border-signal-400 hover:text-white"
      >
        Scroll
      </motion.button>
    </section>
  );
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}
