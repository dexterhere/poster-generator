import React from 'react';
import { cn } from '../../lib/utils';

interface GlassButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'primary' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

const GlassButton: React.FC<GlassButtonProps> = ({
  children,
  className,
  variant = 'default',
  size = 'md',
  ...props
}) => {
  const variantClasses = {
    default: 'glass-button',
    primary: 'glass-button-primary',
    danger:
      'bg-red-500/20 hover:bg-red-500/30 border-red-400/20 hover:border-red-400/30 text-red-200',
    ghost:
      'bg-transparent hover:bg-white/5 border-transparent hover:border-white/10 text-white/70 hover:text-white',
  };

  const sizeClasses = {
    sm: 'px-2.5 py-1 text-[11px] rounded-lg',
    md: 'px-4 py-2 text-xs rounded-xl',
    lg: 'px-6 py-3 text-sm rounded-xl',
  };

  return (
    <button
      className={cn(
        'font-medium transition-all duration-150 flex items-center justify-center gap-1.5 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:transform-none',
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
};

export default GlassButton;
