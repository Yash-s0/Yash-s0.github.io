import Link from 'next/link';
import type { NextPageContext } from 'next';

type ErrorPageProps = {
  statusCode?: number;
};

function ErrorPage({ statusCode }: ErrorPageProps) {
  const title = statusCode ? `Error ${statusCode}` : 'Application Error';
  const message = statusCode
    ? 'Something went wrong while rendering this page.'
    : 'An unexpected client-side error occurred.';

  return (
    <main className="flex min-h-screen items-center justify-center bg-graphite-950 px-6 text-text-primary">
      <div className="w-full max-w-lg rounded-2xl border border-white/10 bg-graphite-900/80 p-8 text-center shadow-soft">
        <h1 className="text-3xl font-semibold text-white">{title}</h1>
        <p className="mt-4 text-text-secondary">{message}</p>
        <div className="mt-8">
          <Link
            href="/"
            className="inline-flex rounded-lg border border-signal-400/60 px-5 py-3 text-sm font-semibold text-signal-300 transition-colors hover:bg-signal-500/10"
          >
            Return Home
          </Link>
        </div>
      </div>
    </main>
  );
}

ErrorPage.getInitialProps = ({ res, err }: NextPageContext): ErrorPageProps => {
  const statusCode = res?.statusCode ?? err?.statusCode ?? 500;
  return { statusCode };
};

export default ErrorPage;

