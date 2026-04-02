export default function NotFound() {
  return (
    <main className="min-h-screen flex items-center justify-center px-[5%]">
      <div className="glass-panel p-10 text-center">
        <h1 className="text-3xl font-display">Page not found</h1>
        <p className="mt-4 text-text-secondary">The scene you requested doesn’t exist.</p>
        <a href="/" className="btn-secondary mt-6 inline-flex">Return home</a>
      </div>
    </main>
  );
}
