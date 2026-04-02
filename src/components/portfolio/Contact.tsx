'use client';

import { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { portfolio } from '../../data/portfolio';
import { SectionHeader } from './SectionHeader';

const contactCards = [
  {
    title: 'Email',
    value: portfolio.contact.email,
    href: `mailto:${portfolio.contact.email}`,
    glyph: 'E'
  },
  {
    title: 'Phone',
    value: portfolio.contact.phone,
    href: `tel:${portfolio.contact.phone}`,
    glyph: 'P'
  },
  {
    title: 'Location',
    value: portfolio.hero.location,
    href: undefined,
    glyph: 'L'
  },
  {
    title: 'GitHub',
    value: portfolio.contact.github,
    href: portfolio.contact.github,
    glyph: 'G'
  },
  {
    title: 'LinkedIn',
    value: portfolio.contact.linkedin,
    href: portfolio.contact.linkedin,
    glyph: 'I'
  }
];

export function Contact() {
  const reduceMotion = useReducedMotion();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <section id="contact" className="relative overflow-hidden bg-graphite-900/45 py-32">
      <div className="absolute inset-0">
        <div className="absolute bottom-0 left-1/4 h-96 w-96 rounded-full bg-cyan-400/10 blur-[120px]" />
        <div className="absolute right-1/4 top-0 h-96 w-96 rounded-full bg-signal-500/10 blur-[120px]" />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeader
          eyebrow="Get In Touch"
          title="Let's Build Something Together"
          subtitle={portfolio.hero.supporting}
        />

        <div className="mt-16 grid gap-12 lg:grid-cols-2">
          <motion.div
            initial={reduceMotion ? { opacity: 0 } : { opacity: 0, x: -28 }}
            whileInView={reduceMotion ? { opacity: 1 } : { opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.26 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-6"
          >
            <div className="rounded-2xl border border-white/10 bg-graphite-900/75 p-7">
              <h3 className="text-2xl font-semibold text-white">Let's talk about your next system</h3>
              <p className="mt-3 leading-relaxed text-text-secondary">{portfolio.hero.statement}</p>
            </div>

            <div className="space-y-4">
              {contactCards.map((card, index) => (
                <motion.div
                  key={card.title}
                  initial={reduceMotion ? { opacity: 0 } : { opacity: 0, x: -18 }}
                  whileInView={reduceMotion ? { opacity: 1 } : { opacity: 1, x: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.45, delay: index * 0.05 }}
                >
                  {card.href ? (
                    <a
                      href={card.href}
                      className="group flex items-center gap-4 rounded-xl border border-white/10 bg-graphite-900/75 p-5 transition-all hover:border-signal-500/50"
                    >
                      <span className="inline-flex h-11 w-11 items-center justify-center rounded-lg border border-white/15 bg-graphite-950/55 text-sm font-semibold text-signal-300">
                        {card.glyph}
                      </span>
                      <span className="min-w-0">
                        <span className="block text-xs uppercase tracking-[0.26em] text-text-secondary">{card.title}</span>
                        <span className="mt-1 block break-all text-sm font-medium text-white transition-colors group-hover:text-signal-300">
                          {card.value}
                        </span>
                      </span>
                    </a>
                  ) : (
                    <div className="flex items-center gap-4 rounded-xl border border-white/10 bg-graphite-900/75 p-5">
                      <span className="inline-flex h-11 w-11 items-center justify-center rounded-lg border border-white/15 bg-graphite-950/55 text-sm font-semibold text-signal-300">
                        {card.glyph}
                      </span>
                      <span className="min-w-0">
                        <span className="block text-xs uppercase tracking-[0.26em] text-text-secondary">{card.title}</span>
                        <span className="mt-1 block break-all text-sm font-medium text-white">{card.value}</span>
                      </span>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={reduceMotion ? { opacity: 0 } : { opacity: 0, x: 28 }}
            whileInView={reduceMotion ? { opacity: 1 } : { opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.26 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="rounded-2xl border border-white/10 bg-graphite-900/78 p-7"
          >
            <form onSubmit={handleSubmit} className="space-y-5">
              <label className="block">
                <span className="text-xs uppercase tracking-[0.28em] text-text-secondary">Name</span>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="mt-2 w-full rounded-lg border border-white/10 bg-graphite-950/55 px-4 py-3 text-sm text-white placeholder:text-text-secondary focus:border-signal-400 focus:outline-none focus:ring-2 focus:ring-signal-500/20"
                  placeholder="Your name"
                />
              </label>

              <label className="block">
                <span className="text-xs uppercase tracking-[0.28em] text-text-secondary">Email</span>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="mt-2 w-full rounded-lg border border-white/10 bg-graphite-950/55 px-4 py-3 text-sm text-white placeholder:text-text-secondary focus:border-signal-400 focus:outline-none focus:ring-2 focus:ring-signal-500/20"
                  placeholder="you@company.com"
                />
              </label>

              <label className="block">
                <span className="text-xs uppercase tracking-[0.28em] text-text-secondary">Subject</span>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="mt-2 w-full rounded-lg border border-white/10 bg-graphite-950/55 px-4 py-3 text-sm text-white placeholder:text-text-secondary focus:border-signal-400 focus:outline-none focus:ring-2 focus:ring-signal-500/20"
                  placeholder="Project discussion"
                />
              </label>

              <label className="block">
                <span className="text-xs uppercase tracking-[0.28em] text-text-secondary">Message</span>
                <textarea
                  name="message"
                  rows={6}
                  value={formData.message}
                  onChange={handleChange}
                  required
                  className="mt-2 w-full resize-none rounded-lg border border-white/10 bg-graphite-950/55 px-4 py-3 text-sm text-white placeholder:text-text-secondary focus:border-signal-400 focus:outline-none focus:ring-2 focus:ring-signal-500/20"
                  placeholder="Tell me about your project..."
                />
              </label>

              <button
                type="submit"
                className="inline-flex w-full items-center justify-center rounded-lg bg-gradient-to-r from-signal-500 to-cyan-400 px-6 py-3 text-sm font-semibold text-graphite-975 shadow-[0_12px_30px_rgba(96,165,250,0.3)] transition-transform hover:-translate-y-1"
              >
                Send Message
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

