'use client';

import { useEffect } from 'react';
import { Navbar } from '../components/portfolio/Navbar';
import { Hero } from '../components/portfolio/Hero';
import { About } from '../components/portfolio/About';
import { Skills } from '../components/portfolio/Skills';
import { Projects } from '../components/portfolio/Projects';
import { Experience } from '../components/portfolio/Experience';
import { Services } from '../components/portfolio/Services';
import { Contact } from '../components/portfolio/Contact';
import { Footer } from '../components/portfolio/Footer';
import { ScrollIndicator } from '../components/portfolio/ScrollIndicator';

export default function HomePage() {
  useEffect(() => {
    const root = document.documentElement;
    root.classList.add('scroll-locked');
    return () => {
      root.classList.remove('scroll-locked');
    };
  }, []);

  return (
    <>
      <Navbar />
      <ScrollIndicator />
      <div
        id="scroll-container"
        className="fixed inset-0 w-screen h-screen overflow-hidden bg-graphite-975 text-text-primary"
        style={{
          perspective: '1000px',
          transformStyle: 'preserve-3d'
        }}
      >
        <div
          id="scroll-content"
          className="relative will-change-transform"
          style={{
            transformStyle: 'preserve-3d',
            backfaceVisibility: 'hidden'
          }}
        >
          <main>
            <Hero />
            <About />
            <Skills />
            <Projects />
            <Experience />
            <Services />
            <Contact />
          </main>
          <Footer />
        </div>
      </div>
    </>
  );
}
