import React from 'react';
import { cn } from '../../lib/utils'; // we'll create this if it doesn't exist

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  hover?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

const paddingMap = {
  none: '',
  sm: 'p-3',
  md: 'p-4',
  lg: 'p-6',
};

const GlassCard: React.FC<GlassCardProps> = ({
  children,
  className,
  hover = true,
  padding = 'md',
  ...props
}) => {
  return (
    <div
      className={cn(
        'glass-card',
        hover && 'hover:translate-y-[-2px]',
        paddingMap[padding],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export default GlassCard;
