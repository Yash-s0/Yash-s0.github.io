'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { portfolio } from '../../data/portfolio';
import { useSmoothScrollContext } from '../smooth-scroll-provider';

const quickLinks = [
  { name: 'Home', href: '#hero' },
  { name: 'About', href: '#about' },
  { name: 'Skills', href: '#skills' },
  { name: 'Projects', href: '#projects' },
  { name: 'Experience', href: '#experience' },
  { name: 'Impact', href: '#services' },
  { name: 'Contact', href: '#contact' }
];

export function Footer() {
  const { scrollTo, scrollToTop } = useSmoothScrollContext();
  const socialLinks = [
    { label: 'GitHub', href: portfolio.contact.github, icon: '/img/icons/github.svg' },
    { label: 'LinkedIn', href: portfolio.contact.linkedin, icon: '/img/icons/linkedin.svg' },
    { label: 'Email', href: `mailto:${portfolio.contact.email}`, icon: '/img/icons/outlook.svg' }
  ];

  return (
    <footer className="relative border-t border-white/10 bg-graphite-900">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-32 left-1/2 h-96 w-96 rounded-full bg-signal-500/8 blur-[130px]" />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mb-12 grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-white/15 bg-graphite-950/55 text-cyan-300">
                {'<>'}
              </span>
              <span className="bg-gradient-to-r from-signal-400 to-cyan-300 bg-clip-text text-lg font-semibold text-transparent">
                {portfolio.hero.name}
              </span>
            </div>
            <p className="mt-4 max-w-md leading-relaxed text-text-secondary">
              {portfolio.hero.statement}
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              {socialLinks.map((social) => (
                <motion.a
                  key={social.label}
                  href={social.href}
                  whileHover={{ y: -4, scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-graphite-950/55 px-4 py-2 text-sm text-text-secondary transition-all hover:border-signal-400/65 hover:text-white"
                >
                  <Image src={social.icon} alt={social.label} width={16} height={16} />
                  {social.label}
                </motion.a>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-[0.25em] text-white">Explore</h3>
            <ul className="mt-4 space-y-3">
              {quickLinks.slice(0, 4).map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    onClick={(event) => {
                      event.preventDefault();
                      scrollTo(link.href, { offset: -40 });
                    }}
                    className="group inline-flex items-center gap-2 text-sm text-text-secondary transition-colors hover:text-white"
                  >
                    <span className="h-0.5 w-0 bg-signal-400 transition-all duration-300 group-hover:w-4" />
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold uppercase tracking-[0.25em] text-white">More</h3>
            <ul className="mt-4 space-y-3">
              {quickLinks.slice(4).map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    onClick={(event) => {
                      event.preventDefault();
                      scrollTo(link.href, { offset: -40 });
                    }}
                    className="group inline-flex items-center gap-2 text-sm text-text-secondary transition-colors hover:text-white"
                  >
                    <span className="h-0.5 w-0 bg-signal-400 transition-all duration-300 group-hover:w-4" />
                    {link.name}
                  </a>
                </li>
              ))}
              <li>
                <a href={portfolio.contact.cv} className="text-sm text-text-secondary transition-colors hover:text-white">
                  Download CV
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mb-7 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

        <div className="flex flex-col items-center justify-between gap-4 text-sm text-text-secondary md:flex-row">
          <p>{`© ${new Date().getFullYear()} ${portfolio.hero.name}. Built with care.`}</p>
          <button
            type="button"
            onClick={scrollToTop}
            className="rounded-lg border border-white/10 px-4 py-2 text-xs uppercase tracking-[0.22em] transition-all hover:border-signal-400/70 hover:text-white"
          >
            Back To Top
          </button>
        </div>
      </div>
    </footer>
  );
}

