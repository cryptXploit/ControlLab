import React from 'react';

export function Card({ children, className = '', interactive = false, ...props }: { children: React.ReactNode; className?: string; interactive?: boolean; [key: string]: any }) {
  const interactiveClasses = interactive ? 'cursor-pointer hover:shadow-md hover:-translate-y-0.5 active:scale-[0.98] transition-all duration-200' : '';
  return (
    <div className={`bg-bg-surface-elevated border border-border-subtle rounded-xl shadow-sm overflow-hidden ${interactiveClasses} ${className}`} {...props}>
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
