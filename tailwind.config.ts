import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{ts,tsx}',
    './src/components/**/*.{ts,tsx}',
    './src/app/**/*.{ts,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        graphite: {
          975: '#090C12',
          950: '#0B0F17',
          900: '#0F172A',
          850: '#111827',
          800: '#0D1625'
        },
        signal: {
          500: '#60A5FA',
          400: '#93C5FD',
          300: '#BFDBFE'
        },
        cyan: {
          500: '#22D3EE',
          400: '#67E8F9',
          300: '#A5F3FC'
        },
        text: {
          primary: '#E5E7EB',
          secondary: '#9CA3AF'
        },
        border: 'rgba(148, 163, 184, 0.18)'
      },
      fontFamily: {
        display: ['var(--font-spacegrotesk)', 'system-ui', 'sans-serif'],
        sans: ['var(--font-ibmplex)', 'system-ui', 'sans-serif']
      },
      boxShadow: {
        glow: '0 25px 80px rgba(96, 165, 250, 0.25)',
        glowCyan: '0 25px 80px rgba(34, 211, 238, 0.2)',
        soft: '0 24px 80px rgba(2, 6, 23, 0.7)',
        edge: '0 0 0 1px rgba(148, 163, 184, 0.18)'
      },
      backgroundImage: {
        graphiteGlow:
          'radial-gradient(circle at 20% 20%, rgba(96, 165, 250, 0.22), transparent 50%), radial-gradient(circle at 80% 15%, rgba(34, 211, 238, 0.18), transparent 45%), radial-gradient(circle at 50% 80%, rgba(96, 165, 250, 0.12), transparent 55%)',
        gridLines:
          'linear-gradient(rgba(148, 163, 184, 0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(148, 163, 184, 0.08) 1px, transparent 1px)'
      },
      keyframes: {
        floatSlow: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-14px)' }
        },
        drift: {
          '0%': { transform: 'translate3d(0px, 0px, 0px)' },
          '50%': { transform: 'translate3d(-18px, 10px, 0px)' },
          '100%': { transform: 'translate3d(0px, 0px, 0px)' }
        },
        revealUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        }
      },
      animation: {
        floatSlow: 'floatSlow 12s ease-in-out infinite',
        drift: 'drift 18s ease-in-out infinite',
        revealUp: 'revealUp 0.8s ease forwards'
      }
    }
  },
  plugins: []
};

export default config;
