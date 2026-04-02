import './globals.css';
import type { Metadata } from 'next';
import { SmoothScrollProvider } from '../components/smooth-scroll-provider';

export const metadata: Metadata = {
  title: 'Yash Sharma — Backend & Platform Engineer',
  description: 'Backend & platform engineer specializing in high-throughput analytics, low-latency APIs, and multi-chain listeners.'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="relative">
        <SmoothScrollProvider>{children}</SmoothScrollProvider>
      </body>
    </html>
  );
}
