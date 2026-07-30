import React from 'react';
import { cn } from '../../lib/utils';

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  glow?: 'cyan' | 'blue' | 'none';
  hoverEffect?: boolean;
}

export const GlassCard: React.FC<GlassCardProps> = ({
  children,
  className,
  glow = 'none',
  hoverEffect = false,
  ...props
}) => {
  return (
    <div
      className={cn(
        'glass-card rounded-xl p-5 transition-all duration-200 text-slate-100',
        hoverEffect && 'hover:bg-soc-cardHover hover:border-slate-700/80 hover:-translate-y-0.5',
        glow === 'cyan' && 'shadow-glow-cyan border-cyan-500/30',
        glow === 'blue' && 'shadow-glow-blue border-blue-500/30',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};
