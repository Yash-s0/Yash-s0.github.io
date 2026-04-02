'use client';

import { useState } from 'react';

export function CopyEmail({ email }: { email: string }) {
  const [status, setStatus] = useState('');

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setStatus('Copied');
      setTimeout(() => setStatus(''), 1600);
    } catch {
      setStatus('Copy failed');
      setTimeout(() => setStatus(''), 1600);
    }
  };

  return (
    <div className="flex items-center gap-3">
      <button onClick={handleCopy} className="btn-secondary">Copy Email</button>
      <span className="text-sm text-cyan-300 transition-opacity duration-300">{status}</span>
    </div>
  );
}
