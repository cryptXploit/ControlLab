import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
}

export function Button({ variant = 'primary', size = 'md', className = '', children, ...props }: ButtonProps) {
  const base = "inline-flex items-center justify-center font-medium transition-colors rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none";
  const variants = {
    primary: "bg-accent-primary text-white hover:bg-blue-600 focus:ring-accent-primary",
    secondary: "bg-bg-surface border border-border-strong text-text-primary hover:bg-gray-50 dark:hover:bg-gray-800",
    ghost: "bg-transparent text-text-secondary hover:text-text-primary hover:bg-gray-100 dark:hover:bg-gray-800",
    danger: "bg-status-error text-white hover:bg-red-600 focus:ring-status-error"
  };
  const sizes = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base"
  };

  return (
    <button className={`${base} ${variants[variant]} ${sizes[size]} ${className}`} {...props}>
      {children}
    </button>
  );
}
