'use client';

export function Tooltip({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="tooltip">
      {children}
      <span className="tooltip-bubble">{label}</span>
    </div>
  );
}
