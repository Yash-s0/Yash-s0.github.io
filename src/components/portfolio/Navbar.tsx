'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useSmoothScrollContext } from '../smooth-scroll-provider';

const navItems = [
  { name: 'Home', href: '#hero' },
  { name: 'About', href: '#about' },
  { name: 'Skills', href: '#skills' },
  { name: 'Projects', href: '#projects' },
  { name: 'Experience', href: '#experience' },
  { name: 'Impact', href: '#services' },
  { name: 'Contact', href: '#contact' }
];

function BrandGlyph() {
  return (
    <span className="relative inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/15 bg-graphite-900/70">
      <svg viewBox="0 0 24 24" className="h-5 w-5 text-cyan-300" aria-hidden>
        <path d="M8 6L3 12L8 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        <path d="M16 6L21 12L16 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      </svg>
      <span className="pointer-events-none absolute inset-0 rounded-xl bg-cyan-400/20 blur-lg" />
    </span>
  );
}

function MenuIcon({ open }: { open: boolean }) {
  return (
    <span className="relative block h-5 w-5">
      <span
        className={`absolute left-0 top-1 h-0.5 w-5 bg-current transition-transform duration-300 ${open ? 'translate-y-2 rotate-45' : ''}`}
      />
      <span
        className={`absolute left-0 top-[9px] h-0.5 w-5 bg-current transition-opacity duration-300 ${open ? 'opacity-0' : 'opacity-100'}`}
      />
      <span
        className={`absolute left-0 top-[17px] h-0.5 w-5 bg-current transition-transform duration-300 ${open ? '-translate-y-2 -rotate-45' : ''}`}
      />
    </span>
  );
}

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { scrollTo } = useSmoothScrollContext();

  useEffect(() => {
    const scrollContainer = document.getElementById('scroll-container');
    let rafId = 0;

    const sync = () => {
      const scrollData = scrollContainer?.getAttribute('data-scroll');
      const scrollY = scrollData ? Number.parseFloat(scrollData) : 0;
      setIsScrolled(scrollY > 48);
      rafId = requestAnimationFrame(sync);
    };

    rafId = requestAnimationFrame(sync);
    return () => cancelAnimationFrame(rafId);
  }, []);

  const handleNavClick = (event: React.MouseEvent, href: string) => {
    event.preventDefault();
    scrollTo(href, { offset: -40 });
    setIsMobileMenuOpen(false);
  };

  return (
    <motion.nav
      initial={{ y: -90 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className={`fixed left-0 right-0 top-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'border-b border-white/10 bg-graphite-900/75 shadow-2xl backdrop-blur-xl'
          : 'bg-transparent'
      }`}
    >
      <div className="mx-auto flex h-20 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <motion.a
          href="#hero"
          onClick={(event) => handleNavClick(event, '#hero')}
          className="group flex items-center gap-3"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
        >
          <BrandGlyph />
          <span className="bg-gradient-to-r from-signal-400 to-cyan-300 bg-clip-text text-lg font-semibold text-transparent">
            Yash Sharma
          </span>
        </motion.a>

        <div className="hidden items-center gap-1 lg:flex">
          {navItems.map((item, index) => (
            <motion.a
              key={item.name}
              href={item.href}
              onClick={(event) => handleNavClick(event, item.href)}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.04 }}
              className="group relative rounded-lg px-4 py-2 text-sm text-text-secondary transition-colors hover:text-white"
            >
              {item.name}
              <span className="absolute bottom-1 left-4 h-0.5 w-0 bg-gradient-to-r from-signal-500 to-cyan-400 transition-all duration-300 group-hover:w-[calc(100%-2rem)]" />
            </motion.a>
          ))}
        </div>

        <button
          type="button"
          onClick={() => setIsMobileMenuOpen((value) => !value)}
          aria-label="Toggle navigation menu"
          className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 text-text-secondary transition-colors hover:border-cyan-400 hover:text-white lg:hidden"
        >
          <MenuIcon open={isMobileMenuOpen} />
        </button>
      </div>

      <motion.div
        initial={false}
        animate={{ opacity: isMobileMenuOpen ? 1 : 0, height: isMobileMenuOpen ? 'auto' : 0 }}
        transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
        className="overflow-hidden border-t border-white/10 bg-graphite-900/95 backdrop-blur-xl lg:hidden"
      >
        <div className="space-y-2 px-4 py-4">
          {navItems.map((item) => (
            <a
              key={item.name}
              href={item.href}
              onClick={(event) => handleNavClick(event, item.href)}
              className="block rounded-lg px-4 py-3 text-sm text-text-secondary transition-all hover:bg-graphite-850 hover:text-white"
            >
              {item.name}
            </a>
          ))}
        </div>
      </motion.div>
    </motion.nav>
  );
}
