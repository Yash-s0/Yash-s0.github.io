'use client';

type ErrorPageProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function ErrorPage({ reset }: ErrorPageProps) {
  return (
    <main className="min-h-screen flex items-center justify-center px-[5%]">
      <div className="glass-panel p-10 text-center">
        <h1 className="text-3xl font-display">Something went wrong</h1>
        <p className="mt-4 text-text-secondary">Try refreshing the page.</p>
        <div className="mt-6 flex items-center justify-center gap-3">
          <button type="button" onClick={reset} className="btn-secondary">
            Try again
          </button>
          <a href="/" className="btn-secondary inline-flex">
            Return home
          </a>
        </div>
      </div>
    </main>
  );
}
