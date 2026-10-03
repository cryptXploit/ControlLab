import React from 'react';

export function Card({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`bg-bg-surface-elevated border border-border-subtle rounded-xl shadow-sm overflow-hidden ${className}`}>
      {children}
    </div>
  );
}

export function CardHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="px-4 py-3 border-b border-border-subtle bg-bg-surface">
      <h3 className="text-sm font-semibold text-text-primary tracking-wide">{title}</h3>
      {subtitle && <p className="text-xs text-text-secondary mt-0.5">{subtitle}</p>}
    </div>
  );
}
